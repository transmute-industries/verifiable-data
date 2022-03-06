import axios from "axios";

import { convertDidToEndpoint } from "./convertDidToEndpoint";

export const resolve = async (did: string) => {
  const url = convertDidToEndpoint(did);
  const resp = await axios({
    method: "get",
    url,
    headers: {
      // Authorization: `Bearer ${token}`,
      accept: "application/json"
    }
  });
  return resp.data;
};
