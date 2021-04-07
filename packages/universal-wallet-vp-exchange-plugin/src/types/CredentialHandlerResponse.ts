export interface CredentialHandlerTypedQuery {
  type: string;
  credentialQuery: {
    reason: string;
    example?: any;
  };
}

export interface CredentialHandlerResponse {
  query: CredentialHandlerTypedQuery[];
  domain: string;
  challenge: string;
}
