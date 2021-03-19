import * as Factory from "factory.ts";

import {
  IssueCredential,
  VerifyCredential,
  PresentCredentials,
  VerifyPresentation,
} from "./types";

import { issue } from "./issue";
import { verifyCredential } from "./verifyCredential";
import { createVerifiablePresentation } from "./createVerifiablePresentation";
import { verifyPresentation } from "./verifyPresentation";

interface VcPlugin {
  issue: (config: IssueCredential) => Promise<any>;
  verifyCredential: (config: VerifyCredential) => Promise<any>;
  createVerifiablePresentation: (config: PresentCredentials) => Promise<any>;
  verifyPresentation: (config: VerifyPresentation) => Promise<any>;
}

const factoryDefaults = {
  issue,
  verifyCredential,
  createVerifiablePresentation,
  verifyPresentation,
};

const pluginFactory = Factory.Sync.makeFactory<VcPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { VcPlugin, pluginFactory, factoryDefaults, plugin };
