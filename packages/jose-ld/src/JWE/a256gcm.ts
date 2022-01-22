/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
// see https://github.com/digitalbazaar/minimal-cipher
import { crypto } from '../crypto';

export const JWE_ENC = 'A256GCM';

/**
 * Generates a content encryption key (CEK). The 256-bit key is intended to be
 * used as an AES-GCM key.
 *
 * @returns {Promise<Uint8Array>} - Resolves to the generated key.
 */
export async function generateKey() {
  // generate content encryption key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    // key must be extractable in order to be wrapped
    true,
    ['encrypt']
  );
  return new Uint8Array(await crypto.subtle.exportKey('raw', key));
}

/**
 * Encrypts some data. The data will be encrypted using the given 256-bit
 * AES-GCM content encryption key (CEK).
 *
 * @param {object} options - The options to use.
 * @param {Uint8Array} options.data - The data to encrypt.
 * @param {Uint8Array} options.additionalData - Optional additional
 *   authentication data.
 * @param {Uint8Array} options.cek - The content encryption key to use.
 *
 * @returns {Promise<object>} - A Promise that resolves to
 *   `{ciphertext, iv, tag}`.
 */
export async function encrypt({ data, additionalData, cek }: any) {
  cek = await _importCek({ cek, usages: ['encrypt'] });

  // NIST Special Publication 800-38D 8.2.2 RGB Construction of IV allows for
  // 96-bit IVs to be randomly generated; should this recommendation change
  // we can pass in a sequence number that can be used in a fixed subfield
  // along with random bytes in another subfield
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // encrypt data
  const tagBytes = 16;
  const tagLength = tagBytes * 8;
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength, additionalData },
      cek,
      data
    )
  );
  // split ciphertext and tag
  const ciphertext = encrypted.subarray(0, encrypted.length - tagBytes);
  const tag = encrypted.subarray(encrypted.length - tagBytes);

  return {
    ciphertext,
    iv,
    tag,
  };
}

/**
 * Decrypts some encrypted data. The data must have been encrypted using
 * the given 256-bit AES-GCM content encryption key.
 *
 * @param {object} options - The options to use.
 * @param {Uint8Array} options.ciphertext - The data to decrypt.
 * @param {Uint8Array} options.iv - The initialization vector.
 * @param {Uint8Array} options.tag - The authentication tag.
 * @param {Uint8Array} options.additionalData - Optional additional
 *   authentication data.
 * @param {Uint8Array} options.cek - The content encryption key to use.
 *
 * @returns {Promise<Uint8Array>} - The decrypted data.
 */
export async function decrypt({
  ciphertext,
  iv,
  tag,
  additionalData,
  cek,
}: any) {
  if (!(iv instanceof Uint8Array)) {
    throw new Error('Invalid or missing "iv".');
  }
  if (!(ciphertext instanceof Uint8Array)) {
    throw new Error('Invalid or missing "ciphertext".');
  }
  if (!(tag instanceof Uint8Array)) {
    throw new Error('Invalid or missing "tag".');
  }

  cek = await _importCek({ cek, usages: ['decrypt'] });

  // decrypt `ciphertext`
  const encrypted = new Uint8Array(ciphertext.length + tag.length);
  encrypted.set(ciphertext);
  encrypted.set(tag, ciphertext.length);
  const tagLength = tag.length * 8;
  const decrypted = new Uint8Array(
    await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength, additionalData },
      cek,
      encrypted
    )
  );
  return decrypted;
}

async function _importCek({ cek, usages }: any) {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError('"cek" must be a Uint8Array.');
  }
  return crypto.subtle.importKey(
    'raw',
    cek,
    { name: 'AES-GCM', length: 256 },
    false,
    usages
  );
}
