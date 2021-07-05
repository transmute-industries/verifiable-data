import { subtle } from '../crypto';
import { base64url, base58 } from '../encoding';
import { compress, expand } from '../compression/ec-compression';

const canonicalize = JSON.stringify;

const crvToUvarint: any = {
  'P-256': '8024',
  'P-384': '8124',
  'P-521': '8224',
};

const uvarintToCrv: any = {
  '8024': 'P-256',
  '8124': 'P-384',
  '8224': 'P-521',
};

export const getJwkFromMulticodec = (fingerprint: string) => {
  const decoders: any = {
    z: base58,
    u: base64url,
  };
  const encoding = fingerprint[0];
  const decoded = decoders[encoding].decode(fingerprint.substring(1));
  const prefix = decoded.slice(0, 2);
  const publicKey = decoded.slice(2);
  const crv = uvarintToCrv[prefix.toString('hex')];
  const expanded = expand(publicKey, crv);
  const x = expanded.slice(0, expanded.length / 2);
  const y = expanded.slice(expanded.length / 2);
  return {
    kty: 'EC',
    crv,
    x: base64url.encode(x),
    y: base64url.encode(y),
  };
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
  const publicKey = [];
  if (jwk.x) {
    publicKey.push(Buffer.from(jwk.x, 'base64'));
  }
  if (jwk.y) {
    publicKey.push(Buffer.from(jwk.y, 'base64'));
  }

  const publicKeyBuffer = Buffer.concat(publicKey);
  const compressed = Buffer.from(compress(Uint8Array.from(publicKeyBuffer)));
  return (
    'z' +
    base58.encode(
      Buffer.concat([Buffer.from(crvToUvarint[jwk.crv], 'hex'), compressed])
    )
  );
};
