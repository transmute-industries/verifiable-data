import { Crypto } from '@peculiar/webcrypto';

const crypto = new Crypto();

export const subtle: SubtleCrypto =
  typeof window !== 'undefined' && typeof jest === 'undefined'
    ? window.crypto.subtle
    : crypto.subtle;
