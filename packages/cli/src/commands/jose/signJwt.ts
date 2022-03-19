import { jose, Header, Payload, PrivateKeyJwk } from '@transmute/did-jose-cose';
import {
  getPayloadFromFile,
  getKeyFromFile,
  handleCommandResponse,
} from '../../util';

import { deriveKey } from '../key';

export const sign = (
  header: Header,
  payload: Payload,
  privateKeyJwk: PrivateKeyJwk
) => {
  return jose.jwt.sign(header, payload, privateKeyJwk);
};

export const signJwt = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let key;
  let payload = getPayloadFromFile(argv.input);
  let data: any = {};
  if (!argv.endpoint) {
    if (argv.key) {
      key = getKeyFromFile(argv.key);
    }
    if (argv.mnemonic) {
      const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
      key = keys[0];
    }
    const kid = argv.kid;
    data.jwt = await sign({ kid }, payload, key.privateKeyJwk);
  }

  handleCommandResponse(argv, data, argv.output);
};
