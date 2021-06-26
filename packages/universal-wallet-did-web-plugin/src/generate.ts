import { convertEndpointToDid } from "./convertEndpointToDid";
import crypto from "crypto";
import { keysToDidDocument } from "./keysToDidDocument";

import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { Bls12381KeyPairs } from "@transmute/bls12381-key-pair";

const getKeys = async (did: string) => {
  const options = {
    secureRandom: () => {
      return crypto.randomBytes(32);
    }
  };
  const k0 = await Ed25519KeyPair.generate(options);
  const k1 = await Bls12381KeyPairs.generate(options);
  const keys = await Promise.all(
    [...(await k0.getDerivedKeyPairs()), ...(await k1.getPairedKeyPairs())].map(
      async (k: any, i: number) => {
        let k1 = await k.export({ type: "JsonWebKey2020", privateKey: true });
        k1.id = `${did}#key-${i}`;
        k1.controller = did;
        return k1;
      }
    )
  );
  return keys;
};

export const generate = async (endpoint: string) => {
  const did = convertEndpointToDid(endpoint);
  const keys = await getKeys(did);
  const didDocument = await keysToDidDocument(did, keys);
  return { keys, didDocument };
};
