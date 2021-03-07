export const subtle: SubtleCrypto =
  typeof window !== 'undefined' && typeof jest === 'undefined'
    ? window.crypto.subtle
    : require('crypto').webcrypto.subtle;
