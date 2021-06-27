import { Bls12381G2KeyPair } from './Bls12381G2KeyPair';

it('generate', async () => {
  const kn = await Bls12381G2KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
          'hex'
        )
      );
    },
  });
  expect(kn.id).toBe(
    'did:key:zUC7DS4KhgobfZMRQNxGWnzutbeDhPitk9ykTAG7PxA1E3oD6UTGZRsdpVW729ViC1ddSNnqJJDm1QAQThYQ94F75cb8NstpHqAQLE175ZymdsWGfNT7H4pdhPhbziV6Vh98izV#zUC7DS4KhgobfZMRQNxGWnzutbeDhPitk9ykTAG7PxA1E3oD6UTGZRsdpVW729ViC1ddSNnqJJDm1QAQThYQ94F75cb8NstpHqAQLE175ZymdsWGfNT7H4pdhPhbziV6Vh98izV'
  );
});

it('JWK: from / export', async () => {
  const kn = await Bls12381G2KeyPair.from({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
      d: 'P9zRDsbJf-VlNMt9FO6_zU-qPDDwI41i7Df0QaadHEI',
    },
  });
  const kx = await kn.export({ type: 'JsonWebKey2020', privateKey: true });
  expect(kx).toEqual({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
      d: 'P9zRDsbJf-VlNMt9FO6_zU-qPDDwI41i7Df0QaadHEI',
    },
  });
});

it('Base58: from / export', async () => {
  const kn = await Bls12381G2KeyPair.from({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'Bls12381G2Key2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyBase58:
      'mxE4sHTpbPcmxNviRVR9r7D2taXcNyVJmf9TBUFS1gRt3j3Ej9Seo59GQeCzYwbQgDrfWCwEJvmBwjLvheAky5N2NqFVzk4kuq3S8g4Fmekai4P622vHqWjFrsioYYDqhf9',
    privateKeyBase58: '5JHydJJRqtYRgsCUi4G5vB8qTifLmCF4GAcv1E8UxyRB',
  });
  const kx = await kn.export({ type: 'Bls12381G2Key2020', privateKey: true });
  expect(kx).toEqual({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'Bls12381G2Key2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyBase58:
      'mxE4sHTpbPcmxNviRVR9r7D2taXcNyVJmf9TBUFS1gRt3j3Ej9Seo59GQeCzYwbQgDrfWCwEJvmBwjLvheAky5N2NqFVzk4kuq3S8g4Fmekai4P622vHqWjFrsioYYDqhf9',
    privateKeyBase58: '5JHydJJRqtYRgsCUi4G5vB8qTifLmCF4GAcv1E8UxyRB',
  });
});

it('fingerprintFromPublicKey', async () => {
  const f = await Bls12381G2KeyPair.fingerprintFromPublicKey({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'Bls12381G2Key2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyBase58:
      'mxE4sHTpbPcmxNviRVR9r7D2taXcNyVJmf9TBUFS1gRt3j3Ej9Seo59GQeCzYwbQgDrfWCwEJvmBwjLvheAky5N2NqFVzk4kuq3S8g4Fmekai4P622vHqWjFrsioYYDqhf9',
  });

  expect(f).toBe(
    'zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT'
  );
});

it('signer / verifier', async () => {
  const kn = await Bls12381G2KeyPair.from({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
      d: 'P9zRDsbJf-VlNMt9FO6_zU-qPDDwI41i7Df0QaadHEI',
    },
  });
  const message = Uint8Array.from(Buffer.from('hello'));
  const signer = kn.signer();
  const verifier = kn.verifier();
  const s1 = await signer.sign({
    data: message,
  });
  const v1 = await verifier.verify({ data: message, signature: s1 });
  expect(v1).toBe(true);
});

it('fromFingerprint', async () => {
  const kn = await Bls12381G2KeyPair.fromFingerprint({
    fingerprint:
      'zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
  });

  const kx = await kn.export({ type: 'JsonWebKey2020' });
  expect(kx).toEqual({
    id:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT#zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zUC71nmwvy83x1UzNKbZbS7N9QZx8rqpQx3Ee3jGfKiEkZngTKzsRoqobX6wZdZF5F93pSGYYco3gpK9tc53ruWUo2tkBB9bxPCFBUjq2th8FbtT4xih6y6Q1K9EL4Th86NiCGT',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G2',
      x:
        'gn6no-fdvchOjSf1XQvnPduLowppHLq5NCswBjRSKPl597BuGZeHs6QENSki29YvBNbvPruDOyjzS2wcAGvEcOATFYGwlpHB1fy9exY4CmM3Cl_hXbMOWQ2EzUunHs6k',
    },
  });
});
