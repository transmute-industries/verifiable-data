import jsonld from "jsonld";
import crypto from "crypto";
import * as sec from "@transmute/security-context";
import { Ed25519VerificationKey2018 } from "./Ed25519VerificationKey2018";

const sha256 = (data: any) => {
  const h = crypto.createHash("sha256");
  h.update(data);
  return h.digest();
};

export interface IEd25519Signature2018Options {
  key?: any;
  date?: any;
  signer?: any;
}

export class Ed25519Signature2018 {
  public useNativeCanonize: boolean = false;
  public key: any;
  public proof: any;
  public date: any;
  public creator: any;
  public type: string = "Ed25519Signature2018";
  public signer: any;
  public verifier: any;
  public verificationMethod?: string;
  constructor(options: IEd25519Signature2018Options = {}) {
    this.signer = options.signer;
    this.date = options.date;
    if (options.key) {
      this.key = options.key;
      this.verificationMethod = this.key.id;

      this.signer = this.key.signer();
      this.verifier = this.key.verifier();
    }
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
      useNative: this.useNativeCanonize,
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
      skipExpansion: false,
    });
  }

  async createVerifyData({
    document,
    proof,
    documentLoader,
    expansionMap,
  }: any) {
    // concatenate hash of c14n proof options and hash of c14n document
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap,
    });
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap,
    });
    return Buffer.concat([sha256(c14nProofOptions), sha256(c14nDocument)]);
  }

  async matchProof({ proof }: any) {
    return proof.type === this.type;
  }

  async sign({ verifyData, proof }: any) {
    if (!(this.signer && typeof this.signer.sign === "function")) {
      throw new Error("A signer API has not been specified.");
    }

    const detachedJws = await this.signer.sign({ data: verifyData });
    proof.jws = detachedJws;
    return proof;
  }

  async createProof({
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: any) {
    let proof;
    if (this.proof) {
      // use proof JSON-LD document passed to API
      proof = await jsonld.compact(
        this.proof,
        sec.constants.ED25519_2018_v1_URL,
        {
          documentLoader,
          expansionMap,
          compactToRelative: false,
        }
      );
    } else {
      // create proof JSON-LD document
      proof = { "@context": sec.constants.ED25519_2018_v1_URL };
    }

    // ensure proof type is set
    proof.type = this.type;

    // set default `now` date if not given in `proof` or `options`
    let date = this.date;
    if (proof.created === undefined && date === undefined) {
      date = new Date();
    }

    // ensure date is in string format
    if (date !== undefined && typeof date !== "string") {
      date = new Date(date).toISOString();
      date = date.substr(0, date.length - 5) + "Z";
    }

    // add API overrides
    if (date !== undefined) {
      proof.created = date;
    }
    // `verificationMethod` is for newer suites, `creator` for legacy
    if (this.verificationMethod !== undefined) {
      proof.verificationMethod = this.verificationMethod;
    }

    // allow purpose to update the proof; the `proof` is in the
    // SECURITY_CONTEXT_URL `@context` -- therefore the `purpose` must
    // ensure any added fields are also represented in that same `@context`
    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
      expansionMap,
    });

    // create data to sign
    const verifyData = await this.createVerifyData({
      document,
      proof,
      documentLoader,
      expansionMap,
      compactProof,
    });

    // sign data
    proof = await this.sign({
      verifyData,
      document,
      proof,
      documentLoader,
      expansionMap,
    });

    return proof;
  }

  async getVerificationMethod({ proof, documentLoader }: any) {
    let { verificationMethod } = proof;

    if (typeof verificationMethod === "object") {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" or "creator" found in proof.');
    }
    const { document } = await documentLoader(verificationMethod);
    const framed = await jsonld.frame(
      verificationMethod,
      {
        "@context": document["@context"],
        "@embed": "@always",
        id: verificationMethod,
      },
      {
        // use the cache of the document we just resolved when framing
        documentLoader: (iri: string) => {
          if (iri.startsWith(document.id)) {
            return {
              documentUrl: iri,
              document,
            };
          }
          return documentLoader(iri);
        },
      }
    );

    if (!framed) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    // ensure verification method has not been revoked
    if (framed.revoked !== undefined) {
      throw new Error("The verification method has been revoked.");
    }

    return framed;
  }

  async verifySignature({ verifyData, verificationMethod, proof }: any) {
    const key = await Ed25519VerificationKey2018.from(verificationMethod);
    const verifier = key.verifier();
    return verifier.verify({ data: verifyData, signature: proof.jws });
  }

  async verifyProof({
    proof,
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: any) {
    try {
      // create data to verify
      const verifyData = await this.createVerifyData({
        document,
        proof,
        documentLoader,
        expansionMap,
        compactProof,
      });

      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap,
      });

      // verify signature on data
      const verified = await this.verifySignature({
        verifyData,
        verificationMethod,
        document,
        proof,
        documentLoader,
        expansionMap,
      });
      if (!verified) {
        throw new Error("Invalid signature.");
      }

      // ensure proof was performed for a valid purpose
      const purposeResult = await purpose.validate(proof, {
        document,
        suite: this,
        verificationMethod,
        documentLoader,
        expansionMap,
      });

      if (!purposeResult.valid) {
        throw purposeResult.error;
      }

      return { verified: true, purposeResult };
    } catch (error) {
      return { verified: false, error };
    }
  }
}
