import { KeyManagementServiceClient } from '@google-cloud/kms';

import jose from 'jose';

import { WebCryptoKey } from '@transmute/web-crypto-key-pair';

import { getLatestPublicKey } from './getLatestPublicKey';

const getJWSAlgFromGoogleAlgorithm = (alg: string) => {
  const parts = alg.split('_');
  const crvIsh = parts[2];
  switch (crvIsh) {
    case 'P384': {
      return 'ES384';
    }
    default: {
      throw new Error('Unsupported key type' + alg);
    }
  }
};

export const getVerificationMethodsFromKeys = async (
  did: string,
  client: KeyManagementServiceClient,
  keys: any[]
) => {
  const vms = [];
  for (let k of keys) {
    const publicKey = await getLatestPublicKey(client, k.name);
    const alg = getJWSAlgFromGoogleAlgorithm(publicKey.algorithm);
    const importedPublicKey = await jose.importSPKI(publicKey.pem, alg); // todo handle others.
    const publicKeyJwk = await jose.exportJWK(importedPublicKey);
    const k2 = await WebCryptoKey.from({
      id: '',
      controller: did,
      type: 'JsonWebKey2020',
      publicKeyJwk,
    });
    const f = await k2.fingerprint();
    k2.id = k2.controller + '#' + f;
    vms.push(await k2.export({ type: 'JsonWebKey2020' }));
  }
  return vms;
};
