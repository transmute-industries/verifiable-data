#!/usr/bin/env node

const { commands } = require('./dist/index');

require('yargs')
  .scriptName('transmute')
  .usage('$0 <cmd> [args]')
  // key
  .command(...commands.key.generate.generateKeyCommand)

  // vc
  .command(...commands.credential.createCredentialCommand)
  .command(...commands.presentation.createPresentationCommand)

  // data
  .command(...commands.data.createDataCommand)

  .help().argv;
