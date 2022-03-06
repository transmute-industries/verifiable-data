import axios from 'axios';
export interface IssueCredentialApiOptions {
  endpoint: string;
  credential: any;
  access_token?: string;
  options: any;
}

export const issue = async ({
  endpoint,
  access_token,
  credential,
  options,
}: IssueCredentialApiOptions) => {
  const body = {
    credential,
    options,
  };
  const config: any = {
    headers: {
      Accept: 'application/json',
    },
  };
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  const res = await axios.post(endpoint, body, config);
  return res.data;
};
