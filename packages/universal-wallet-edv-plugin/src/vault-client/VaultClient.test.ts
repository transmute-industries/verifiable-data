import { VaultClient } from './VaultClient';
import { EdvClient } from 'edv-client';

import * as fixtures from '@transmute/universal-wallet-test-vectors';

describe.skip('vault-client', () => {
  it('fromDerivedContents', async () => {
    const entropy = fixtures.content[0];
    const ed25519Key = fixtures.content[1];
    ed25519Key.controller = ed25519Key.id.split('#')[0];

    const x25519Key = fixtures.content[2];
    x25519Key.controller = x25519Key.id.split('#')[0];

    let client = await VaultClient.fromDerivedContents(
      'https://localhost:8080/edvs',
      ed25519Key,
      x25519Key,
      Buffer.from(entropy.value, 'hex')
    );

    const doc1 = {
      // id: 'z1A6LudYMzfM1CGFrNXgjh2sN',
      id: await EdvClient.generateId(),
      content: {
        schema: 'https://schema.org/UniversalWallet',
        data: fixtures.credentials.ldp_vc,
      },
    };

    await client.addWalletContent(doc1);
    const contents = await client.getWalletContents();
    expect(contents.length).toBe(1);
  });
});
