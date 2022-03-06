import { deriveKey } from '../key';
import { handleCommandResponse } from '../../util';

import { convertEndpointToDid } from '@transmute/did-web';

export interface GitHubDidWebConfig {
  username: string;
  repository: string;
  mnemonic: string;
  hdpath: string;
  type: string;
}

export const createDocument = async (github: GitHubDidWebConfig) => {
  const keys = await deriveKey(github.type, github.mnemonic, github.hdpath);
  const [firstKey] = keys;
  const issuerId = firstKey.controller.split(':').pop();
  const endpoint = `https://${github.username}.github.io/${github.repository}/issuers/${issuerId}/did.json`;
  const issuerDid = convertEndpointToDid(endpoint);
  const vms = keys.map((k: any) => {
    const { privateKeyJwk, ...vm } = k;
    vm.id = issuerDid + '#' + vm.id.split('#').pop();
    vm.controller = issuerDid;
    return vm;
  });
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    id: vms[0].controller,
    verificationMethod: vms,
    assertionMethod: vms.map(vm => {
      return vm.id;
    }),
    authentication: vms.map(vm => {
      return vm.id;
    }),
  };
};

export const createDocumentHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  const githubConfig: GitHubDidWebConfig = {
    username: argv.username,
    repository: argv.repository,
    mnemonic: argv.mnemonic,
    hdpath: argv.hdpath,
    type: argv.type,
  };
  const data = await createDocument(githubConfig);
  handleCommandResponse(argv, data, argv.output);
};
