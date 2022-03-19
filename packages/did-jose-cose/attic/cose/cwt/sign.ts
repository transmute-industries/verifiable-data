import { keyPairToAlg } from "../../keyPairToAlg";
import { CompactCwt, PrivateKeyJwk, Header, Payload } from "types";

const CWT = require("cwt-js");

export const sign = async (
  header: Header,
  payload: Payload,
  privateKeyJwk: PrivateKeyJwk
): Promise<CompactCwt> => {
  const cwt = new CWT(payload);
  const { data } = await cwt.sign(
    {
      kid: header.kid,
      d: Buffer.from(privateKeyJwk.d, "base64"),
    },
    header.alg || keyPairToAlg(privateKeyJwk)
  );
  return data;
};
