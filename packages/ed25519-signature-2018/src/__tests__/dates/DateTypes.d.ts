type Condition =
  | string
  | number
  | undefined
  | null
  | Date
  | DateArray
  | DateObject;

type DateErrorType = {
  type: string;
  thrownOn: string;
  reason: string;
};

type CredentialProofType = {
  type: string;
  created?: Condition;
  verificationMethod: string;
  proofPurpose: string;
  jws: string;
};

type CredentialType = {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  credentialSubject: any;
  issuanceDate?: Condition;
  proof?: CredentialProofType;
};

type CredentialVerificationType = {
  verified: boolean;
  purposeResult?: any;
  error?: unknown;
};

type DateArray = number[];
type DateObject = {
  years: number;
  months: number;
  date: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  seconds: number;
};
