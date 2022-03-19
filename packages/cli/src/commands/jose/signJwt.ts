import { jose, Header, Payload, PrivateKeyJwk } from '@transmute/did-jose-cose';
import {
  getPayloadFromFile,
  getKeyFromFile,
  handleCommandResponse,
} from '../../util';

import { deriveKey } from '../key';

export type IssuanceMethod =
  | 'from-path-to-json-web-key'
  | 'from-json-web-key'
  | 'from-vc-api'
  | 'from-mnemonic';

export const argvToIssuanceMethod = (argv: any): IssuanceMethod => {
  if (argv.key) {
    try {
      JSON.parse(argv.key);
      return 'from-json-web-key';
    } catch (e) {
      return 'from-path-to-json-web-key';
    }
  }
  if (argv.endpoint) {
    return 'from-vc-api';
  }
  if (argv.mnemonic) {
    return 'from-mnemonic';
  }
  throw new Error('Cannot determine issuance method');
};

export const sign = (
  header: Header,
  payload: Payload,
  privateKeyJwk: PrivateKeyJwk
) => {
  return jose.jwt.sign(header, payload, privateKeyJwk);
};

export const getKey = async (argv: any) => {
  let key: any = null;
  const issuanceMethod = argvToIssuanceMethod(argv);
  if (issuanceMethod === 'from-json-web-key') {
    key = JSON.parse(argv.key);
  }
  if (issuanceMethod === 'from-path-to-json-web-key') {
    key = getKeyFromFile(argv.key);
  }
  if (issuanceMethod === 'from-mnemonic') {
    const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
    key = keys[0];
  }
  return key;
};

export const signJwt = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let payload = getPayloadFromFile(argv.input);
  let data: any = {};
  const key = await getKey(argv);
  const kid = argv.kid || key.id;
  data.jwt = await sign({ kid }, payload, key.privateKeyJwk);

  handleCommandResponse(argv, data, argv.output);
};
