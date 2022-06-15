#!/usr/bin/env node

const { commands } = require('./dist/index');

const cli = require('yargs')
  .scriptName('transmute')
  .usage('$0 <cmd> [args]');

commands.did.registerCommands(cli);
commands.key.registerCommands(cli);
commands.credential.registerCommands(cli);
commands.presentation.registerCommands(cli);
commands.data.registerCommands(cli);
commands.neo4j.registerCommands(cli);
commands.google.registerCommands(cli);
commands.jose.registerCommands(cli);

cli.option('challenge', {
  string: true,
});

cli.help().argv;
