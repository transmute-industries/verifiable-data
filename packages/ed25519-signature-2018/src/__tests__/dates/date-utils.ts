import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "../..";
import rawKeyJson from "../../__fixtures__/keys/key.json";
import documentLoader from "../../__fixtures__/documentLoader";

export const issuedOn = new Date("1991-08-25T12:33:56.789Z").getTime();
export const createdOn = new Date("2021-10-15T12:33:56.789Z").getTime();

export const exampleCredential = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "id": "http://example.edu/credentials/1872",
    "type": ["VerifiableCredential", "AlumniCredential"],
    "issuer": "https://example.edu/issuers/565049",
    "credentialSubject": {
        "id": "https://example.edu/students/alice",
        "alumniOf": "Example University"
    }
}

export const createSuite = async (suiteDate: undefined|null|number|string) => {
    
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    let suite, suiteError;
    try {
      suite = new Ed25519Signature2018({
        key: keyPair,
        date: suiteDate
      });
    } catch (err) {
      const error = err as Error;
      suiteError = {
        type: "error",
        thrownOn: "suite",
        reason: error.toString()
      };
      return { suite, suiteError };
    }
  
    if (typeof suite.date === "undefined") {
      suite.date = new Date(createdOn);
    }
  
    return { suite, suiteError };
  };
}

export const verifyProof = async (document: any, proof: any) => {
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    const suite = new Ed25519Signature2018({
      key: keyPair
    });
  
    const result = await suite.verifyProof({
      proof: proof,
      document: document,
      purpose: {
        validate: () => {
          return { valid: true };
        },
        update: (proof: any) => {
          proof.proofPurpose = "assertionMethod";
          return proof;
        }
      },
      documentLoader,
      compactProof: false
    });
  
    return result;
  };