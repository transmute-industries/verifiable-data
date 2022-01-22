import { passwordToKey } from "./passwordToKey";

import { X25519KeyPair } from "@transmute/x25519-key-pair";
import { JWE } from "@transmute/jose-ld";

export const lockContents = async (
  password: string,
  contents: any[]
): Promise<any[]> => {
  const derivedKey = await passwordToKey(password);

  const kp = await X25519KeyPair.generate({
    secureRandom: () => {
      return derivedKey;
    }
  });
  kp.id = kp.controller + kp.id;
  const recipient = {
    header: {
      kid: kp.id,
      alg: "ECDH-ES+A256KW"
    }
  };
  const recipients = [recipient];

  const keyResolver = (id: string) => {
    if (kp.id === id) {
      return kp.export({
        type: "JsonWebKey2020",
        privateKey: false
      });
    }
    throw new Error(`Key ${id} not found`);
  };

  const cipher = new JWE.Cipher();

  const encryptedContents = await Promise.all(
    contents.map(async content => {
      // spreading to avoid mutation of function args.
      const jwe = await cipher.encryptObject({
        obj: { ...content },
        recipients: [...recipients],
        publicKeyResolver: keyResolver
      });
      return jwe;
    })
  );

  return encryptedContents;
};
