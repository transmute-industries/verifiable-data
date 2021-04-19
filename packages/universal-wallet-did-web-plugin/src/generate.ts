import { convertEndpointToDid } from "./convertEndpointToDid";
import { generateKeys } from "./generateKeys";
import { keysToDidDocument } from "./keysToDidDocument";

const getKeys = async (did: string) =>
  Promise.all(
    [
      ...(await generateKeys("ed25519")),
      ...(await generateKeys("x25519")),
      ...(await generateKeys("bls12381")),
      ...(await generateKeys("p-256")),
      ...(await generateKeys("secp256k1")),
    ].map(async (k: any, i: number) => {
      let k1 = await k.toJsonWebKeyPair(true);
      k1.id = `${did}#key-${i}`;
      k1.controller = did;
      return k1;
    })
  );

export const generate = async (endpoint: string) => {
  const did = convertEndpointToDid(endpoint);
  const keys = await getKeys(did);
  const didDocument = await keysToDidDocument(did, keys);
  return { keys, didDocument };
};
