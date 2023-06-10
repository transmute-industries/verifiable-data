declare module "@transmute/jsonld";
declare module "vc-js";
declare module "canonicalize";
declare module "json-pointer";

type XMLDateTime = string;
type IRI = string;

// https://w3c-ccg.github.io/traceability-vocab/#LinkRole
type LinkRole = {
  type: string | string[];
  target: IRI;
  linkRelationship: string;
  name?: string;
};

type IssuerObject = {
  id: IRI;
  [key: string]: any;
};

type CredentialStatus = {
  id: IRI;
  type: string;
};

type VerifiableCredential = {
  "@context": string | string[];
  id?: IRI;
  issuer: IRI | IssuerObject;
  issuanceDate: XMLDateTime;
  expirationDate?: XMLDateTime;
  name?: string;
  type: string | string[];
  relatedLink?: LinkRole[] | LinkRole;
  credentialSubject: any;
  credentialStatus?: CredentialStatus;
  [key: string]: any;
};
