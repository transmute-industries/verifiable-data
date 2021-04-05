import * as Factory from "factory.ts";

import {
  IssueCredential,
  VerifyCredential,
  PresentCredentials,
  VerifyPresentation,
  DeriveCredential
} from "./types";

import { issue } from "./issue";
import { verifyCredential } from "./verifyCredential";
import { createVerifiablePresentation } from "./createVerifiablePresentation";
import { deriveCredential } from "./deriveCredential";

import { verifyPresentation } from "./verifyPresentation";

interface VcPlugin {
  // issuer
  issue: (config: IssueCredential) => Promise<any>;
  // holder
  createVerifiablePresentation: (config: PresentCredentials) => Promise<any>;
  deriveCredential: (config: DeriveCredential) => Promise<any>;
  // verifier
  verifyCredential: (config: VerifyCredential) => Promise<any>;
  verifyPresentation: (config: VerifyPresentation) => Promise<any>;
}

const factoryDefaults = {
  // issuer
  issue,

  // holder
  createVerifiablePresentation,
  deriveCredential,

  // verifier
  verifyCredential,
  verifyPresentation
};

const pluginFactory = Factory.Sync.makeFactory<VcPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { VcPlugin, pluginFactory, factoryDefaults, plugin };
