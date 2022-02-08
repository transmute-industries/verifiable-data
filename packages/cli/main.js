#!/usr/bin/env node

const { commands } = require('./dist/index');

require('yargs')
  .scriptName('transmute')
  .usage('$0 <cmd> [args]')
  // key
  .command(...commands.key.generate.generateKeyCommand)

  // vc
  .command(...commands.credential.createCredentialCommand)
  .command(...commands.credential.verifyCredentialCommand)
  // vp
  .command(...commands.presentation.createPresentationCommand)
  .command(...commands.presentation.verifyPresentationCommand)

  // data
  .command(...commands.data.createDataCommand)

  // neo
  .command(...commands.neo.importWorkflowInstanceComand)

  .help().argv;
