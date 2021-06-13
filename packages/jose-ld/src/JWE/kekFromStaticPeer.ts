import { KeyEncryptionKey } from './KeyEncryptionKey';
import { base64url } from '../encoding';
import { deriveKey } from './ecdhkdf';

export const kekFromStaticPeer = (KeyPair: any) => {
  return async ({ ephemeralKeyPair, staticPublicKey }: any) => {
    // TODO: consider accepting JWK format for `staticPublicKey` not just LD key
    if (
      !(
        staticPublicKey.type === 'X25519KeyAgreementKey2019' ||
        staticPublicKey.type === 'JsonWebKey2020'
      )
    ) {
      throw new Error(
        `"staticPublicKey.type" must be "X25519KeyAgreementKey2019" or "JsonWebKey2020".`
      );
    }

    const epkPair = await KeyPair.from(ephemeralKeyPair.keypair);

    // "Party U Info"
    let producerInfo: Uint8Array = epkPair.publicKey;

    if (epkPair.publicKey.extractable) {
      const temp = await epkPair.export({ type: 'JsonWebKey2020' });
      producerInfo = Uint8Array.from(
        Buffer.concat([
          Buffer.from(temp.publicKeyJwk.x, 'base64'),
          Buffer.from(temp.publicKeyJwk.y, 'base64'),
        ])
      );
    }

    // "Party V Info"
    const consumerInfo = Buffer.from(staticPublicKey.id);
    const secret = await epkPair.deriveSecret({
      publicKey: staticPublicKey,
    } as any);
    const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
    return {
      kek: await KeyEncryptionKey.createKek({ keyData }),
      epk: ephemeralKeyPair.epk,
      apu: base64url.encode(producerInfo),
      apv: base64url.encode(consumerInfo as any),
    };
  };
};
