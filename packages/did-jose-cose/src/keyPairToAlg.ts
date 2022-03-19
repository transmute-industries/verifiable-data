export const keyPairToAlg = (publicKeyJwk: any) => {
  if (publicKeyJwk.kty === "EC" && publicKeyJwk.crv === "P-256") {
    return "ES256";
  }
  if (publicKeyJwk.kty === "EC" && publicKeyJwk.crv === "P-384") {
    return "ES384";
  }
  if (publicKeyJwk.kty === "EC" && publicKeyJwk.crv === "P-521") {
    return "ES512";
  }
  if (publicKeyJwk.kty === "EC" && publicKeyJwk.crv === "secp256k1") {
    return "ES256K";
  }
  if (publicKeyJwk.kty === "OKP" && publicKeyJwk.crv === "Ed25519") {
    return "EdDSA";
  }
  throw new Error(
    "Unsupported key type" + JSON.stringify(publicKeyJwk, null, 2)
  );
};
