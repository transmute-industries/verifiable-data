import jsonld from "jsonld";

import { Bls12381G2KeyPair } from "@transmute/bls12381-key-pair";

import {
  BbsBlsSignature2020ProofType,
  CreateVerifyDataOptions,
  VerifyProofOptions,
  VerifySignatureOptions
} from "./types";

const suiteContexts = [
  "https://w3id.org/security/suites/jws-2020/v1",
  "https://w3id.org/security/suites/bls12381-2020/v1"
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

export class BbsBlsSignature2020 {
  public static type = "BbsBlsSignature2020";
  public verificationMethod?: string;
  private key?: Bls12381G2KeyPair;
  private date?: string;

  constructor({ key, date }: { key?: Bls12381G2KeyPair; date?: string } = {}) {
    this.key = key;
    this.date = date;
    if (key) {
      this.verificationMethod = key.id;
    }
  }

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

  async matchProof({ proof }: any) {
    return proof.type === BbsBlsSignature2020.type;
  }

  async canonize(
    input: any,
    { documentLoader, expansionMap, skipExpansion }: any
  ) {
    return jsonld.canonize(input, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
      documentLoader,
      expansionMap,
      skipExpansion,
      useNative: false
    });
  }

  async canonizeProof(proof: any, { documentLoader, expansionMap }: any) {
    // `jws`,`signatureValue`,`proofValue` must not be included in the proof
    // options
    proof = { ...proof };
    delete proof.jws;
    return this.canonize(proof, {
      documentLoader,
      expansionMap,
      skipExpansion: false
    });
  }

  async createVerifyProofData(
    proof: any,
    { documentLoader, expansionMap }: any
  ): Promise<string[]> {
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap
    });

    return c14nProofOptions.split("\n").filter((_: string) => _.length > 0);
  }

  async createVerifyDocumentData(
    document: any,
    { documentLoader, expansionMap }: any
  ): Promise<string[]> {
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap
    });

    return c14nDocument.split("\n").filter((_: string) => _.length > 0);
  }

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

  async createProof({
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof
  }: any) {
    const context = document["@context"];

    let proof: BbsBlsSignature2020ProofType = {
      "@context": context
    };

    proof.type = BbsBlsSignature2020.type;

    if (this.date !== undefined) {
      proof.created = this.date;
    }

    if (!proof.created) {
      const date = new Date().toISOString();
      proof.created = date.substr(0, date.length - 5) + "Z";
    }

    if (this.key?.id !== undefined) {
      proof.verificationMethod = this.key.id;
    }

    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
      expansionMap
    });

    const verifyData = (
      await this.createVerifyData({
        document,
        proof,
        documentLoader,
        expansionMap,
        compactProof
      })
    ).map((item: any) => new Uint8Array(Buffer.from(item)));

    const signer: any = await this.key?.signer();
    const proofValue = await signer.sign({ data: verifyData });
    proof.proofValue = Buffer.from(proofValue).toString("base64");
    return proof;
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

  async verifySignature(options: VerifySignatureOptions): Promise<boolean> {
    const { verifyData, proof, verificationMethod } = options;

    const key = await Bls12381G2KeyPair.from(verificationMethod);
    const verifier = key.verifier();

    const signature = new Uint8Array(
      Buffer.from(proof.proofValue as string, "base64")
    );

    return await verifier.verify({
      data: verifyData,
      signature
    });
  }

  async verifyProof(
    options: VerifyProofOptions
  ): Promise<{ verified: boolean; error?: any }> {
    const { proof, document, documentLoader, expansionMap, purpose } = options;
    const { proofValue } = proof;
    delete proof.proofValue;

    try {
      // create data to verify
      const verifyData = (
        await this.createVerifyData({
          document,
          proof,
          documentLoader,
          expansionMap,
          compactProof: false
        })
      ).map(item => new Uint8Array(Buffer.from(item)));

      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap
      });

      // verify signature on data
      const verified = await this.verifySignature({
        verifyData,
        verificationMethod,
        document,
        proof: { ...proof, proofValue },
        documentLoader,
        expansionMap
      });

      if (!verified) {
        throw new Error("Invalid signature.");
      }

      // ensure proof was performed for a valid purpose
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

      return { verified: true };
    } catch (error) {
      return { verified: false, error };
    }
  }
}
