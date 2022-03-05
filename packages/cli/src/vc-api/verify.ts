import axios from 'axios';

export interface VerifyCredentialApiOptions {
  endpoint: string;
  verifiableCredential: any;

  access_token?: string;
}

export interface VerifyPresentationApiOptions {
  endpoint: string;
  verifiablePresentation: any;
  options: any;
  access_token?: string;
}

export const verify = async (
  args: VerifyCredentialApiOptions | VerifyPresentationApiOptions
) => {
  let body: any = {};

  if ((args as any).verifiableCredential) {
    body.verifiableCredential = (args as VerifyCredentialApiOptions).verifiableCredential;
  }

  if ((args as any).verifiablePresentation) {
    body.verifiablePresentation = (args as VerifyPresentationApiOptions).verifiablePresentation;
    body.options = (args as VerifyPresentationApiOptions).options;
  }

  const config: any = {
    headers: {
      Accept: 'application/json',
    },
  };
  if (args.access_token) {
    config.headers.Authorization = `Bearer ${args.access_token}`;
  }
  const res = await axios.post(args.endpoint, body, config);
  return res.data;
};
