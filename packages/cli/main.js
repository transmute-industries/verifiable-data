#!/usr/bin/env node

const { commands } = require('./dist/index');

require('yargs')
  .scriptName('transmute')
  .usage('$0 <cmd> [args]')
  .command(...commands.key.generate.generateKeyCommand)
  .command(...commands.key.derive.deriveKeyFromMnemonicCommand)
  .command(...commands.data.generate.generateOrganizationCommand)
  .command(...commands.data.generate.generateProductCommand)
  .command(...commands.data.generate.generateDeviceCommand)
  //
  .command(
    ...commands.data.generate.generateCertifiedSubjectTypeCredentialCommand
  )

  .command(...commands.data.generate.generatePresentationCommand)

  .help().argv;
