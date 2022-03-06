import * as vcStatusList from '@transmute/vc-status-rl-2020';
import { createCredential } from './createCredential';
import {
  getCredentialFromFile,
  getKeyFromFile,
  handleCommandResponse,
} from '../../util';

import { deriveKey } from '../key';

// import * as api from '../../vc-api';

export const setStatusListIndex = async (
  key: any,
  oldListVc: any,
  credentialIndex: number,
  revoked: boolean
) => {
  delete oldListVc.proof;
  const list = await vcStatusList.decodeList(oldListVc.credentialSubject);
  list.setRevoked(credentialIndex, revoked); // set the status of an exiting credential to revoked.
  const updatedRevocationListVerifiableCredential: any = {
    ...(await vcStatusList.createCredential({
      id: oldListVc.id,
      list,
    })),
  };
  updatedRevocationListVerifiableCredential['@context'] = [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/suites/jws-2020/v1',
    'https://w3id.org/vc-revocation-list-2020/v1',
  ];
  updatedRevocationListVerifiableCredential.issuer = key.controller;
  updatedRevocationListVerifiableCredential.issuanceDate = new Date().toISOString();

  return createCredential(updatedRevocationListVerifiableCredential, key);
};

export const setStatusListIndexHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let key;
  let credential = getCredentialFromFile(argv.input);
  let data: any = {};
  if (!argv.endpoint) {
    if (argv.key) {
      key = getKeyFromFile(argv.key);
    }
    if (argv.mnemonic) {
      const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
      key = keys[0];
    }
    if (credential.issuer.id) {
      credential.issuer.id = key.controller;
    } else {
      credential.issuer = key.controller;
    }
    data = await setStatusListIndex(
      key,
      credential,
      argv.credentialIndex,
      argv.status === 'true'
    );
  } else {
    // todo: add remove signer support.
  }

  handleCommandResponse(argv, data, argv.output);
};

export const isStatusListIndexSet = async (
  oldListVc: any,
  credentialIndex: number
) => {
  const list = await vcStatusList.decodeList(oldListVc.credentialSubject);
  return list.isRevoked(credentialIndex);
};

export const isStatusListIndexSetHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let credential = getCredentialFromFile(argv.input);
  let data: any = {};
  if (!argv.endpoint) {
    data = await isStatusListIndexSet(credential, argv.credentialIndex);
  } else {
    // disabled for now.
  }
  handleCommandResponse(argv, data, argv.output);
};
