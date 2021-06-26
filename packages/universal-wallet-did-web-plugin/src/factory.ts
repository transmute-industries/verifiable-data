import * as Factory from "factory.ts";

import { generate } from "./generate";

import { convertEndpointToDid } from "./convertEndpointToDid";
import { convertDidToEndpoint } from "./convertDidToEndpoint";
import { keysToDidDocument } from "./keysToDidDocument";

export interface DidWebPlugin {
  convertEndpointToDid: (endpoint: string) => string;
  convertDidToEndpoint: (did: string) => string;
  keysToDidDocument: (did: string, keys: any[]) => any; // really json did document.
  generate: (endpoint: string) => Promise<any>;
}

export const factoryDefaults: DidWebPlugin = {
  convertEndpointToDid,
  convertDidToEndpoint,
  keysToDidDocument,
  generate: async function(endpoint: string): Promise<any> {
    return generate(endpoint);
  }
};

export const pluginFactory = Factory.Sync.makeFactory<DidWebPlugin>(
  factoryDefaults
);
