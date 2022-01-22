import { default as bs64 } from 'base64url';
import { AESKW } from '@stablelib/aes-kw';

export interface CreateKekOptions {
  keyData: Uint8Array;
}

export interface WrapKeyOptions {
  unwrappedKey: Uint8Array;
}

export interface UnwrapKeyOptions {
  wrappedKey: string; //base64url
}

export class KeyEncryptionKey {
  public aeskw: AESKW;
  public algorithm: any;

  static createKek = async ({ keyData }: CreateKekOptions) => {
    return new KeyEncryptionKey(keyData);
  };

  constructor(key: Uint8Array) {
    if (key.length !== 32) {
      throw new Error('key must be 32 bytes');
    }
    this.aeskw = new AESKW(key);
    this.algorithm = { name: 'A256KW' };
  }

  /**
   * Wraps a cryptographic key.
   *
   * @param {object} options - The options to use.
   * @param {Uint8Array} options.unwrappedKey - The key material as a
   *   `Uint8Array`.
   *
   * @returns {string} - The base64url-encoded wrapped key bytes.
   */
  async wrapKey({ unwrappedKey }: WrapKeyOptions): Promise<string> {
    // console.log('before wrapping: ', this.aeskw);
    const wrappedKey = this.aeskw.wrapKey(unwrappedKey);
    this.aeskw.clean();
    return bs64.encode(Buffer.from(wrappedKey));
  }

  /**
   * Unwraps a cryptographic key.
   *
   * @param {object} options - The options to use.
   * @param {string} options.wrappedKey - The wrapped key material as a
   *   base64url-encoded string.
   *
   * @returns {Uint8Array} - Resolves to the key bytes or null if
   *   the unwrapping fails because the key does not match.
   */
  async unwrapKey({
    wrappedKey,
  }: UnwrapKeyOptions): Promise<Uint8Array | null> {
    // console.log('wrappedKey: ', wrappedKey);
    const _wrappedKey = Uint8Array.from(bs64.toBuffer(wrappedKey));

    try {
      const unwrappedKey = this.aeskw.unwrapKey(_wrappedKey);
      this.aeskw.clean();
      return unwrappedKey;
    } catch (e) {
      // decryption failed
      console.error(e);
      return null;
    }
  }
}
