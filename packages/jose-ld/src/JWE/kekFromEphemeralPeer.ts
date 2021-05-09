import { KeyEncryptionKey } from './KeyEncryptionKey';

import { deriveKey } from './ecdhkdf';

export const kekFromEphemeralPeer = (KeyPairClass: any) => {
  return async ({ keyAgreementKey, epk }: any) => {
    if (!(epk && typeof epk === 'object')) {
      throw new TypeError('"epk" must be an object.');
    }

    // convert to LD key for Web KMS
    const ephemeralPublicKey = {
      type: 'JsonWebKey2020',
      publicKeyJwk: epk,
    };

    const { publicKey } = await KeyPairClass.from(ephemeralPublicKey);

    // safe to use IDs like in rfc7518 or does
    // https://tools.ietf.org/html/rfc7748#section-7 pose any issues?

    // "Party U Info"
    const producerInfo = publicKey;
    // "Party V Info"
    const consumerInfo = Buffer.from(keyAgreementKey.id);
    // converts keys again....
    // base58 encoding should only be used at the network / serialization boundary.
    const secret = await keyAgreementKey.deriveSecret({
      publicKey: ephemeralPublicKey,
    } as any);
    const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
    return {
      kek: await KeyEncryptionKey.createKek({ keyData }),
    };
  };
};
