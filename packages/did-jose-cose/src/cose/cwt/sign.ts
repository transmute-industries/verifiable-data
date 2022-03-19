import { keyPairToAlg } from '../../keyPairToAlg';

const CWT = require('cwt-js');

export const sign = async (header: any, payload: any, privateKeyJwk: any) => {
  const cwt = new CWT(payload);
  return cwt.sign(
    {
      kid: header.kid,
      d: Buffer.from(privateKeyJwk.d, 'base64'),
    },
    header.alg || keyPairToAlg(privateKeyJwk)
  );
};
