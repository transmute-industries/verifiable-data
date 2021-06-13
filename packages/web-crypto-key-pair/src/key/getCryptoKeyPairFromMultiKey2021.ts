import {
  JsonWebKey2020,
  P256Key2021,
  P384Key2021,
  P521Key2021,
} from '../types';
import { base58, base64url } from '../encoding';
import { getCryptoKeyPairFromJsonWebKey2020 } from './getCryptoKeyPairFromJsonWebKey2020';
import { expand } from '../compression/ec-compression';
const securityVocabTypeToCrv: any = {
  P256Key2021: 'P-256',
  P384Key2021: 'P-384',
  P521Key2021: 'P-521',
};

const convertMultiKey2021ToJsonWebKey2020 = (
  keyPair: P256Key2021 | P384Key2021 | P521Key2021
) => {
  let publicKeyJwk: any = {
    kty: 'EC',
    crv: securityVocabTypeToCrv[keyPair.type],
  };

  if (keyPair.publicKeyBase58) {
    // assume compressed
    const publicKey = base58.decode(keyPair.publicKeyBase58);
    const expanded = expand(Uint8Array.from(publicKey), publicKeyJwk.crv);

    const x = expanded.slice(0, expanded.length / 2);
    const y = expanded.slice(expanded.length / 2);
    publicKeyJwk = {
      ...publicKeyJwk,
      x: base64url.encode(x),
      y: base64url.encode(y),
    };
  }

  const jsonWebKey: JsonWebKey2020 = {
    id: keyPair.id,
    controller: keyPair.controller,
    type: 'JsonWebKey2020',
    publicKeyJwk,
  };

  if (keyPair.privateKeyBase58) {
    const privateKey = base58.decode(keyPair.privateKeyBase58);
    jsonWebKey.privateKeyJwk = {
      ...jsonWebKey.publicKeyJwk,
      d: base64url.encode(privateKey),
    };
  }

  return jsonWebKey;
};

export const getCryptoKeyPairFromMultiKey2021 = async (
  keypair: P256Key2021 | P384Key2021 | P521Key2021,
  derive = false
) => {
  try {
    const jsonWebKey = convertMultiKey2021ToJsonWebKey2020(keypair);
    return getCryptoKeyPairFromJsonWebKey2020(jsonWebKey, derive);
  } catch (e) {
    //errooor will be thrown
    throw new Error(`unsupported key type:  ${e}\n ${JSON.stringify(keypair)}`);
  }
};
