import axios from 'axios';
export interface ProvePresentationApiOptions {
  endpoint: string;
  presentation: any;
  access_token?: string;
  options: any;
}

export const prove = async ({
  endpoint,
  access_token,
  presentation,
  options,
}: ProvePresentationApiOptions) => {
  const body = {
    presentation,
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
