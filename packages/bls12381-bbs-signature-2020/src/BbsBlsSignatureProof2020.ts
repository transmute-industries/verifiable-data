import jsonld from "jsonld";
import { randomBytes } from "@stablelib/random";
import { DeriveProofOptions } from "./types";
import { BbsBlsSignature2020 } from "./BbsBlsSignature2020";

import { BbsBlsSignatureProof2020ProofType } from "./types";
import { Bls12381G2KeyPair } from "@transmute/bls12381-key-pair";

import { blsCreateProof } from "@mattrglobal/bbs-signatures";

const suiteContexts = [
  "https://w3id.org/security/suites/jws-2020/v1",
  "https://w3id.org/security/suites/bls12381-2020/v1",
];

// const debugMessages = (data: any) => {
//   console.log(
//     "messages:\n" +
//       JSON.stringify(
//         data.map((i: any) => {
//           return (
//             Buffer.from(i)
//               .toString()
//               .substring(0, 128) + "..."
//           );
//         }),
//         null,
//         2
//       )
//   );
// };

export class BbsBlsSignatureProof2020 {
  public static type = "BbsBlsSignatureProof2020";

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
        id: verificationMethod,
      },
      {
        documentLoader,
        compactToRelative: false,
        expandContext: suiteContexts,
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
      expansionMap,
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
    const suite = new BbsBlsSignature2020();

    const derivedProof: BbsBlsSignatureProof2020ProofType = {
      "@context": document["@context"],
      type: BbsBlsSignatureProof2020.type,
    };

    const documentStatements = await suite.createVerifyDocumentData(document, {
      documentLoader,
      expansionMap,
      compactProof: true,
    });

    const proofStatements = await suite.createVerifyProofData(proof, {
      documentLoader,
      expansionMap,
      compactProof: true,
    });

    const transformedInputDocumentStatements = documentStatements.map(
      (element) => element.replace(/(_:c14n[0-9]+)/g, "<urn:bnid:$1>")
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
        expansionMap,
      }
    );

    const numberOfProofStatements = proofStatements.length;

    const proofRevealIndicies = Array.from(
      Array(numberOfProofStatements).keys()
    );

    const documentRevealIndicies = revealDocumentStatements.map(
      (key) =>
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
      .map((item) => new Uint8Array(Buffer.from(item)));

    // debugMessages(allInputStatements);
    // Fetch the verification method
    const verificationMethod = await this.getVerificationMethod({
      proof,
      document,
      documentLoader,
      expansionMap,
    });

    const key = await Bls12381G2KeyPair.from(verificationMethod);

    const outputProof = await blsCreateProof({
      messages: allInputStatements,
      revealed: revealIndicies,
      signature,
      nonce: nonce,
      publicKey: key.publicKey,
    });

    // Set the proof value on the derived proof
    derivedProof.proofValue = Buffer.from(outputProof).toString("base64");

    // Set the relevant proof elements on the derived proof from the input proof
    derivedProof.verificationMethod = proof.verificationMethod;
    derivedProof.proofPurpose = proof.proofPurpose;
    derivedProof.created = proof.created;

    return {
      document: { ...revealDocumentResult },
      proof: derivedProof,
    };
  }
}
