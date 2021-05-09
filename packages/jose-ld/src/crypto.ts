import { Crypto } from '@peculiar/webcrypto';

export const crypto = new Crypto();

export const subtle: SubtleCrypto =
  typeof window !== 'undefined' && typeof jest === 'undefined'
    ? window.crypto.subtle
    : crypto.subtle;
