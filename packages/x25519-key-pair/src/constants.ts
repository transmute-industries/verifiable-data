/**
 * z represents the multibase encoding scheme of base58 encoding
 * @see https://github.com/multiformats/multibase/blob/master/multibase.csv#L18
 * @ignore
 */
const MULTIBASE_ENCODED_BASE58_IDENTIFIER = 'z';

/**
 * 0x01 indicates the end of the leading bytes according to variable integer spec
 * @see https://github.com/multiformats/multicodec
 * @ignore
 */
const VARIABLE_INTEGER_TRAILING_BYTE = 0x01;

/**
 * 0xec indicates a X25519 public key
 *
 */
const X25519_MULTICODEC_IDENTIFIER = 0xec;

export {
  MULTIBASE_ENCODED_BASE58_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
  X25519_MULTICODEC_IDENTIFIER,
};
