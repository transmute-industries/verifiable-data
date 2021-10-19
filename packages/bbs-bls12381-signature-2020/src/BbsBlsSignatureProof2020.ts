import jsonld from "jsonld";
import { randomBytes } from "@stablelib/random";
import {
  DeriveProofOptions,
  VerifyProofOptions,
  CreateVerifyDataOptions,
  CanonizeOptions,
  VerifyProofResult
} from "./types";
import { BbsBlsSignature2020 } from "./BbsBlsSignature2020";

import { BbsBlsSignatureProof2020ProofType } from "./types";
import { Bls12381G2KeyPair } from "@transmute/bls12381-key-pair";

import { blsCreateProof, blsVerifyProof } from "@mattrglobal/bbs-signatures";

const suiteContexts = [
  "https://w3id.org/security/suites/jws-2020/v1",
  "https://w3id.org/security/suites/bls12381-2020/v1"
];

export class BbsBlsSignatureProof2020 {
  public static type = "BbsBlsSignatureProof2020";

  ensureSuiteContext({ document }: any) {
    const contextUrl = "https://w3id.org/security/suites/bls12381-2020/v1";
    if (
      document["@context"] === contextUrl ||
      (Array.isArray(document["@context"]) &&
        document["@context"].includes(contextUrl))
    ) {
      // document already includes the required context
      return;
    }
    throw new TypeError(
      `The document to be signed must contain this suite's @context, ` +
        `"${contextUrl}".`
    );
  }

  async getVerificationMethod({ proof, documentLoader }: any): Promise<any> {
    let { verificationMethod } = proof;

    if (typeof verificationMethod === "object") {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" found in proof.');
    }

    // Note: `expansionMap` is intentionally not passed; we can safely drop
    // properties here and must allow for it
    const result = await jsonld.frame(
      verificationMethod,
      {
        "@context": suiteContexts,
        "@embed": "@always",
        id: verificationMethod
      },
      {
        documentLoader,
        compactToRelative: false,
        expandContext: suiteContexts
      }
    );
    if (!result) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    // ensure verification method has not been revoked
    if (result.revoked !== undefined) {
      throw new Error("The verification method has been revoked.");
    }

    return result;
  }

  async deriveProof(
    options: DeriveProofOptions
  ): Promise<{ document: any; proof: any }> {
    const {
      document,
      proof,
      revealDocument,
      documentLoader,
      expansionMap
    } = options;
    let { nonce } = options;

    if (proof.type !== "BbsBlsSignature2020") {
      throw new TypeError(
        `proof type unacceptable, 
        expected "BbsBlsSignature2020",
        received ${proof.type}`
      );
    }

    const signature = Uint8Array.from(Buffer.from(proof.proofValue, "base64"));
    delete proof.proofValue;
    const suite = new BbsBlsSignature2020();

    const derivedProof: BbsBlsSignatureProof2020ProofType = {
      "@context": document["@context"],
      type: BbsBlsSignatureProof2020.type
    };

    const documentStatements = await suite.createVerifyDocumentData(document, {
      documentLoader,
      expansionMap,
      compactProof: true
    });

    const proofStatements = await suite.createVerifyProofData(proof, {
      documentLoader,
      expansionMap,
      compactProof: true
    });

    const transformedInputDocumentStatements = documentStatements.map(element =>
      element.replace(/(_:c14n[0-9]+)/g, "<urn:bnid:$1>")
    );

    const compactInputProofDocument = await jsonld.fromRDF(
      transformedInputDocumentStatements.join("\n")
    );

    const revealDocumentResult = await jsonld.frame(
      compactInputProofDocument,
      revealDocument,
      { documentLoader }
    );

    const revealDocumentStatements = await suite.createVerifyDocumentData(
      revealDocumentResult,
      {
        documentLoader,
        expansionMap
      }
    );

    const numberOfProofStatements = proofStatements.length;

    const proofRevealIndicies = Array.from(
      Array(numberOfProofStatements).keys()
    );

    const documentRevealIndicies = revealDocumentStatements.map(
      key =>
        transformedInputDocumentStatements.indexOf(key) +
        numberOfProofStatements
    );

    if (documentRevealIndicies.length !== revealDocumentStatements.length) {
      throw new Error(
        "Some statements in the reveal document not found in original proof"
      );
    }

    const revealIndicies = proofRevealIndicies.concat(documentRevealIndicies);

    // Create a nonce if one is not supplied
    if (!nonce) {
      nonce = await randomBytes(50);
    }

    derivedProof.nonce = Buffer.from(nonce).toString("base64");

    const allInputStatements: Uint8Array[] = proofStatements
      .concat(documentStatements)
      .map(item => new Uint8Array(Buffer.from(item)));

    // Fetch the verification method
    const verificationMethod = await this.getVerificationMethod({
      proof,
      document,
      documentLoader,
      expansionMap
    });

    const key = await Bls12381G2KeyPair.from(verificationMethod);

    const outputProof = await blsCreateProof({
      messages: allInputStatements,
      revealed: revealIndicies,
      signature: new Uint8Array(signature),
      nonce: nonce,
      publicKey: new Uint8Array(key.publicKey)
    });

    // Set the proof value on the derived proof
    derivedProof.proofValue = Buffer.from(outputProof).toString("base64");

    // Set the relevant proof elements on the derived proof from the input proof
    derivedProof.verificationMethod = proof.verificationMethod;
    derivedProof.proofPurpose = proof.proofPurpose;
    derivedProof.created = proof.created;

    const compactedRevealedDocument = await jsonld.compact(
      { ...revealDocumentResult },
      document["@context"],
      { documentLoader }
    );

    return {
      document: { ...compactedRevealedDocument },
      proof: derivedProof
    };
  }

  async canonize(input: any, options: CanonizeOptions): Promise<string> {
    const { documentLoader, expansionMap, skipExpansion } = options;
    return jsonld.canonize(input, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
      documentLoader,
      expansionMap,
      skipExpansion,
      useNative: false
    });
  }

  async canonizeProof(proof: any, options: CanonizeOptions): Promise<string> {
    const { documentLoader, expansionMap } = options;
    proof = { ...proof };

    delete proof.nonce;
    delete proof.proofValue;

    return this.canonize(proof, {
      documentLoader,
      expansionMap,
      skipExpansion: false
    });
  }

  /**
   * @param document {CreateVerifyDataOptions} options to create verify data
   *
   * @returns {Promise<{string[]>}.
   */
  async createVerifyData(options: CreateVerifyDataOptions): Promise<string[]> {
    const { proof, document, documentLoader, expansionMap } = options;

    const proofStatements = await this.createVerifyProofData(proof, {
      documentLoader,
      expansionMap
    });
    const documentStatements = await this.createVerifyDocumentData(document, {
      documentLoader,
      expansionMap
    });

    // concatenate c14n proof options and c14n document
    return proofStatements.concat(documentStatements);
  }

  /**
   * @param proof to canonicalize
   * @param options to create verify data
   *
   * @returns {Promise<{string[]>}.
   */
  async createVerifyProofData(
    proof: any,
    { documentLoader, expansionMap }: any
  ): Promise<string[]> {
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap
    });

    return c14nProofOptions.split("\n").filter(_ => _.length > 0);
  }

  /**
   * @param document to canonicalize
   * @param options to create verify data
   *
   * @returns {Promise<{string[]>}.
   */
  async createVerifyDocumentData(
    document: any,
    { documentLoader, expansionMap }: any
  ): Promise<string[]> {
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap
    });

    return c14nDocument.split("\n").filter(_ => _.length > 0);
  }

  async verifyProof(options: VerifyProofOptions): Promise<VerifyProofResult> {
    const { document, documentLoader, expansionMap, purpose } = options;
    const { proof } = options;

    try {
      proof.type = "BbsBlsSignature2020";

      // Get the proof statements
      const proofStatements = await this.createVerifyProofData(proof, {
        documentLoader,
        expansionMap
      });

      // Get the document statements
      const documentStatements = await this.createVerifyProofData(document, {
        documentLoader,
        expansionMap
      });

      // Transform the blank node identifier placeholders for the document statements
      // back into actual blank node identifiers
      const transformedDocumentStatements = documentStatements.map(
        (element: any) => element.replace(/<urn:bnid:(_:c14n[0-9]+)>/g, "$1")
      );

      // Combine all the statements to be verified
      const statementsToVerify: Uint8Array[] = proofStatements
        .concat(transformedDocumentStatements)
        .map((item: any) => new Uint8Array(Buffer.from(item)));

      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap
      });

      const key = await Bls12381G2KeyPair.from(verificationMethod);

      // Verify the proof
      const verified = await blsVerifyProof({
        proof: new Uint8Array(Buffer.from(proof.proofValue, "base64")),
        publicKey: new Uint8Array(key.publicKey),
        messages: statementsToVerify,
        nonce: new Uint8Array(Buffer.from(proof.nonce as string, "base64"))
      });

      // Ensure proof was performed for a valid purpose
      const { valid, error } = await purpose.validate(proof, {
        document,
        suite: this,
        verificationMethod,
        documentLoader,
        expansionMap
      });
      if (!valid) {
        throw error;
      }

      return verified;
    } catch (error) {
      return { verified: false, error };
    }
  }
}
