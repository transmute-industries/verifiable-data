import * as Factory from 'factory.ts';

import { generateContentFromSeed } from './generateContentFromSeed';

interface DidKeyPlugin {
  generateContentFromSeed: (seed: Uint8Array) => Promise<any[]>;
}

const factoryDefaults = {
  generateContentFromSeed,
};

const pluginFactory = Factory.Sync.makeFactory<DidKeyPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { DidKeyPlugin, pluginFactory, factoryDefaults, plugin };
