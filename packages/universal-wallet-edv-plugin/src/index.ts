import * as Factory from 'factory.ts';

import { VaultClientConfig } from './types';
import { VaultClient } from './vault-client';

interface EdvPlugin {
  vaultClientFromDerivedContents: (
    config: VaultClientConfig
  ) => Promise<VaultClient>;
  vaultClientFromPassord: (
    edvEndpoint: string,
    password: string
  ) => Promise<VaultClient>;
}

const factoryDefaults = {
  vaultClientFromDerivedContents: (
    config: VaultClientConfig
  ): Promise<VaultClient> => {
    return VaultClient.fromDerivedContents(
      config.vault_endpoint,
      config.ed25519Key,
      config.x25519Key,
      config.hmacSecret
    );
  },

  vaultClientFromPassord: (
    edvEndpoint: string,
    password: string
  ): Promise<VaultClient> => {
    const client = VaultClient.fromPassword(edvEndpoint, password);
    return client;
  },
};

const pluginFactory = Factory.Sync.makeFactory<EdvPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { EdvPlugin, pluginFactory, factoryDefaults, plugin };
