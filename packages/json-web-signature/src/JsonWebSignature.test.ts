import { keys, credentials, documentLoader } from './__fixtures__';
import { JsonWebKey } from './JsonWebKey';
import { JsonWebSignature } from './JsonWebSignature';

let key: any;
let suite: JsonWebSignature;
let proof: any;
it('can parse jwks', async () => {
  key = await JsonWebKey.from(keys.key0 as any);
  expect(key.publicKey).toBeDefined();
  expect(key.privateKey).toBeDefined();
  suite = new JsonWebSignature({
    key: key,
    date: credentials.credential0.issuanceDate,
  });
});

it('can sign', async () => {
  proof = await suite.createProof({
    document: credentials.credential0,
    purpose: {
      update: (proof: any) => {
        proof.proofPurpose = 'assertionMethod';
        return proof;
      },
    },
    documentLoader,
  });
  expect(proof.type).toBe('JsonWebSignature2020');
  expect(proof.created).toBe(credentials.credential0.issuanceDate);
  expect(proof.verificationMethod).toBe(key.id);
  expect(proof.proofPurpose).toBe('assertionMethod');
  expect(proof.jws).toBeDefined();
});

it('can verify', async () => {
  const result = await suite.verifyProof({
    document: credentials.credential0,
    proof: {
      '@context': credentials.credential0['@context'],
      ...proof,
    },
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof: any) => {
        proof.proofPurpose = 'assertionMethod';
        return proof;
      },
    },
    documentLoader,
  });
  expect(result.verified).toBe(true);
});
