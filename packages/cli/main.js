#!/usr/bin/env node

const { commands } = require('./dist/index');

const issuerTypeGenerators = commands.data.typeGenerators;

const options = {
  input: {
    alias: 'i',
    description: 'Path to input document',
  },
  output: {
    alias: 'o',
    description: 'Path to output document',
  },
  key: {
    alias: 'k',
    description: 'Path to key',
  },
  mnemonic: {
    alias: 'm',
    description: 'Mnemonic to derive key',
  },
  hdpath: {
    alias: 'hd',
    description: 'HD Path to derive key',
  },
  seed: {
    alias: 's',
    description: 'Seed to generate key from',
  },
  type: {
    alias: 't',
    description: 'Type of key to derive',
  },
  format: {
    alias: 'f',
    choices: ['vc', 'vc-jwt', 'vp', 'vp-jwt'],
    description: 'Output format',
    default: 'vc',
  },
  domain: {
    alias: 'd',
    type: 'string',
    description: 'Domain of the verifier',
  },
  challenge: {
    alias: 'c',
    type: 'string',
    description: 'Challenge from the verifier',
  },
  endpoint: {
    alias: 'e',
    stype: 'string',
    description: 'Endpoint to use to issue',
  },
  access_token: {
    alias: 'a',
    stype: 'string',
    description: 'Authorization token to use',
  },
  // These options to be used for "Certified" type generators
  issuerType: {
    alias: 'it',
    choices: Object.keys(issuerTypeGenerators),
    description: 'Type of issuer to create from',
  },
  issuerSeed: {
    alias: 'is',
    type: 'number',
    description:
      'Seed for deriving random values. This value is low entropy and for testing purposes only.',
  },
  subjectSeed: {
    alias: 'ss',
    type: 'number',
    description:
      'Seed for deriving random values. This value is low entropy and for testing purposes only.',
  },
  // These options to be used for Presentations
  holderType: {
    alias: 'ht',
    choices: Object.keys(issuerTypeGenerators),
    description: 'Type of holder to present from',
  },
  holderSeed: {
    alias: 'hs',
    type: 'number',
    description:
      'Seed for deriving random values. This value is low entropy and for testing purposes only.',
  },
  credentialsDirectory: {
    alias: 'vcd',
    type: 'string',
    description: 'The directory containing credentials to present.',
  },
};

const cli = require('yargs')
  .scriptName('transmute')
  .usage('$0 <cmd> [args]');

commands.key.registerCommands(cli);
commands.credential.registerCommands(cli);
commands.presentation.registerCommands(cli);
commands.data.registerCommands(cli);
commands.neo.registerCommands(cli);
commands.google.registerCommands(cli);

cli.help().argv;
