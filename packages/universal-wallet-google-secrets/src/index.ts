import * as Factory from "factory.ts";

import { readSecret } from "./readSecret";
import { writeSecret } from "./writeSecret";

interface GoogleSecretPlugin {
  readSecret: (
    projectId: string,
    secretId: string,
    version?: string
  ) => Promise<any>;
  writeSecret: (
    projectId: string,
    secretId: string,
    value: string
  ) => Promise<any>;
}

const factoryDefaults = {
  readSecret,
  writeSecret
};

const pluginFactory = Factory.Sync.makeFactory<GoogleSecretPlugin>(
  factoryDefaults
);

const plugin = pluginFactory.build();

export { GoogleSecretPlugin, pluginFactory, factoryDefaults, plugin };
