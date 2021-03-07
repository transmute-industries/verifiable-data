import { subtle } from '../crypto';
import { base64url, base58 } from '../encoding';

const canonicalize = JSON.stringify;

const crvToUvarint: any = {
  'P-256': '8024',
  'P-384': '8124',
  'P-521': '8224',
};

export const getKid = async (jwk: any) => {
  const copy = { ...jwk } as any;
  delete copy.d;
  delete copy.kid;
  delete copy.alg;
  const digest = await subtle.digest(
    'SHA-256',
    Buffer.from(canonicalize(copy))
  );
  return base64url.encode(digest);
};

export const getMulticodec = async (jwk: any) => {
  const list = [Buffer.from(crvToUvarint[jwk.crv], 'hex')];
  if (jwk.x) {
    list.push(Buffer.from(jwk.x, 'base64'));
  }
  if (jwk.y) {
    list.push(Buffer.from(jwk.y, 'base64'));
  }
  const buffer = Buffer.concat(list);
  return 'z' + base58.encode(buffer);
};
