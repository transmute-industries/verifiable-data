import * as Factory from "factory.ts";

import { VcPlugin } from "./types";

import { issue } from "./issue";
import { verifyCredential } from "./verifyCredential";
import { createVerifiablePresentation } from "./createVerifiablePresentation";
import { deriveCredential } from "./deriveCredential";
import { verifyPresentation } from "./verifyPresentation";

const factoryDefaults = {
  // issuer
  issue,

  // verifier
  verifyCredential,
  verifyPresentation,

  // holder
  createVerifiablePresentation,
  deriveCredential
};

const pluginFactory = Factory.Sync.makeFactory<VcPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { VcPlugin, pluginFactory, factoryDefaults, plugin };
