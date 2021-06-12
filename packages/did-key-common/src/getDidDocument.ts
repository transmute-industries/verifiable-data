import { DidDocument, DidDocumentRepresentation } from './types';
import { getRelationships } from './getRelationships';
import { publicKeyJwkToSecurityVocabType } from './publicKeyJwkToSecurityVocabType';
import {
  LdKeyPairStatic,
  LdKeyPairInstance,
  LdVerificationMethod,
  PublicNodeWithPublicKeyJwk,
} from '@transmute/ld-key-pair';
const publicKeyJwkToLatestSecurityVocabType = (jwk: any) => {
  const type = publicKeyJwkToSecurityVocabType[`${jwk.kty} ${jwk.crv}`];
  if (!type) {
    throw new Error(
      'Could not map publicKeyJwk to latest security vocab type: ' +
        `${jwk.kty} ${jwk.crv}`
    );
  }
  return type;
};

const handleSnowFlakes = async (
  vms: LdVerificationMethod[],
  KeyPair: LdKeyPairStatic
) => {
  let all = [...vms];
  for (const vm of vms) {
    if (
      vm.type === 'Ed25519VerificationKey2018' ||
      ((vm as PublicNodeWithPublicKeyJwk).publicKeyJwk &&
        (vm as PublicNodeWithPublicKeyJwk).publicKeyJwk.crv === 'Ed25519')
    ) {
      const k0 = await KeyPair.from(vm);
      const k1 = await (KeyPair as any).toX25519KeyPair(k0);
      const k2 = await k1.export({
        type:
          vm.type === 'Ed25519VerificationKey2018'
            ? 'X25519KeyAgreementKey2019'
            : 'JsonWebKey2020',
      });
      all.push(k2);
    }
  }
  return Promise.all(all);
};

const getDidDocumentVerificationMethods = async (
  keys: LdKeyPairInstance[],
  representation: DidDocumentRepresentation,
  KeyPair: LdKeyPairStatic
) => {
  const basic = await Promise.all(
    keys.map(async key => {
      const jsonWebKey = await key.export({ type: 'JsonWebKey2020' });
      if (representation === 'application/did+json') {
        return jsonWebKey;
      }
      const type = publicKeyJwkToLatestSecurityVocabType(
        jsonWebKey.publicKeyJwk
      );
      return await key.export({ type });
    })
  );

  return handleSnowFlakes(basic, KeyPair);
};

// need to account for multiple key fingerprints
const fingerprintToKeys = async (
  KeyPair: LdKeyPairStatic,
  fingerprint: string
) => {
  const key = await KeyPair.fromFingerprint({
    fingerprint,
  });
  return Array.isArray(key) ? key : [key];
};

const inferRelationships = (verificationMethod: LdVerificationMethod[]) => {
  const relationships: any = {};
  verificationMethod.forEach(vm => {
    const types = getRelationships(vm);
    types.forEach(t => {
      relationships[t] = relationships[t]
        ? [...relationships[t], vm.id]
        : [vm.id];
    });
  });
  return relationships;
};

export const getDidDocument = async (
  did: string,
  KeyPair: LdKeyPairStatic,
  representation: DidDocumentRepresentation
): Promise<DidDocument> => {
  const fingerprint = did.split(':')[2].split('#')[0];
  const keys = await fingerprintToKeys(KeyPair, fingerprint);
  const verificationMethod = await getDidDocumentVerificationMethods(
    keys,
    representation,
    KeyPair
  );
  const relationships = inferRelationships(verificationMethod);
  return { id: did, verificationMethod, ...relationships };
};
