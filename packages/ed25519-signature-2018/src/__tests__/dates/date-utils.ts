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
  id: "http://example.edu/credentials/1872",
  type: ["VerifiableCredential", "AlumniCredential"],
  issuer: "https://example.edu/issuers/565049",
  credentialSubject: {
    id: "https://example.edu/students/alice",
    alumniOf: "Example University"
  }
};

export const isDateValidXmlSchema = (date: Condition) => {
  const xmlDateSchemaRegex = /-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?/;
  return xmlDateSchemaRegex.test(date as string);
};

export const cloneCredential = (credential: CredentialType) => {
  return JSON.parse(JSON.stringify(credential));
};

export const createCredential = (issuanceDate: Condition): CredentialType => {
  const credential = cloneCredential(exampleCredential);
  credential.issuanceDate = issuanceDate;
  return credential;
};

export const createSuite = async (suiteDate: Condition) => {
  const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

  let suite: Ed25519Signature2018 | undefined;
  let suiteError: DateErrorType | undefined;

  try {
    suite = new Ed25519Signature2018({
      key: keyPair,
      date: suiteDate
    });
  } catch (err) {
    suiteError = {
      type: "error",
      thrownOn: "suite",
      reason: (err as Error).toString()
    };
  }

  return { suite, suiteError };
};

export const signCredential = async (
  suite: Ed25519Signature2018,
  unsignedCredential: CredentialType
) => {
  let proof: CredentialProofType | undefined;
  let signError: DateErrorType | undefined;

  try {
    proof = await suite.createProof({
      document: unsignedCredential,
      purpose: {
        // ignore validation of dates and such...
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
  } catch (err) {
    signError = {
      type: "error",
      thrownOn: "sign",
      reason: (err as Error).toString()
    };
  }

  return { proof, signError };
};

export const verifyProof = async (
  credential: CredentialType
): Promise<CredentialVerificationType> => {
  const { proof, ...document } = cloneCredential(credential);
  const suite = new Ed25519Signature2018();

  return await suite.verifyProof({
    proof,
    document,
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
};
