#!/usr/bin/env node
const yargs = require('yargs');

const { commands } = require('./dist/index');

const options = yargs.options({
  resource: {
    type: 'string',
    demandOption: true,
    alias: 'r',
    describe:
      'Which resource type are you interested in? e.g. wallet, key, credential...',
    default: 'w',
    choices: ['wallet', 'w'],
  },
  // method: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 'm',
  //   describe:
  //     'What method would you like to invoke, e.g. generate a key, issue a credential, etc.',
  //   default: 'k',
  //   choices: ['key', 'k', 'i', 'issue', 'v', 'verify', 'p', 'present'],
  // },
  // keyType: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 't',
  //   describe: 'Desired key type',
  //   default: 'ed25519',
  //   choices: ['ed25519', 'x25519', 'bls12381', 'p-256', 'secp256k1'],
  // },
  // input: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 'i',
  //   describe:
  //     'Specify an input file to issue a credential on, etc.  In most cases this will be in json-ld or json format',
  //   default: './test.json',
  // },
  // output: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 'o',
  //   describe: 'Specify an output file to write to.',
  //   default: './test.json',
  // },
  // inKey: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 'k',
  //   describe:
  //     'Specify an file to use as the key for operations that require it',
  //   default: './test.json',
  // },
  // didType: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 'p',
  //   describe: 'Specify a did type',
  //   default: 'key',
  //   choices: ['key', 'web', 'elem', 'v1'],
  // },
  // domain: {
  //   type: 'string',
  //   demandOption: true,
  //   alias: 'd',
  //   describe: 'Specify a domain where required',
  //   default: 'example.org',
  // },
  // multiKey: {
  //   type: 'boolean',
  //   demandOption: false,
  //   describe: 'enable multi key returns',
  // },
  // debug: {
  //   type: 'boolean',
  //   demandOption: false,
  //   describe: 'Turn on some additional debugging output',
  // },
});

void (async function main() {
  try {
    const args = options.argv;
    if (args['debug']) {
      console.log('Got arguments:\n', args, '\n\n');
    }
    process.exitCode = 0;
    // handle here.
    const { r, action } = args;
    if (commands[r]) {
      if (commands[r][action]) {
        commands[r][action](args);
      }
    }
  } catch (cliError) {
    process.exitCode = -1;
    console.log('Error with selected method:', cliError);
  }
})();
