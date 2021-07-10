import { documentLoader } from './__fixtures__/documentLoader';
import { ld as vc } from '../index';
import moment from 'moment';
import jsigs from 'jsonld-signatures';
import { Ed25519KeyPair } from 'crypto-ld';

const { Ed25519Signature2018 } = jsigs.suites;

jest.setTimeout(10 * 1000);

let key: any;
let suite: any;
let credentialTemplate: any;

beforeAll(async () => {
  key = await Ed25519KeyPair.from(require('./__fixtures__/key.json'));
  suite = new Ed25519Signature2018({
    key,
  });
});

beforeEach(() => {
  credentialTemplate = require('./__fixtures__/credentialTemplate.json');
});

const expectValidationToBe = (
  validations: any,
  title: string,
  valid: boolean
) => {
  const verification = validations.find((v: any) => v.title === title);
  expect(verification.valid).toBe(valid);
};

it('signature is valid when not tampered', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });
  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  expect(validationResult.valid).toEqual(true);
  expectValidationToBe(validationResult.validations, 'Signature', true);
});

it('signature is invalid when tampered', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });
  credentialIssued.id = 'bad example';
  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  expect(validationResult.valid).toEqual(false);
  expectValidationToBe(validationResult.validations, 'Signature', false);
});

it('issuanceDate is in the past', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  credentialTemplate.issuanceDate = moment()
    .subtract(1, 'days')
    .format();
  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });

  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  expect(validationResult.valid).toEqual(true);
  expectValidationToBe(validationResult.validations, 'Activation', true);
});

it('issuanceDate is in the future', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  credentialTemplate.issuanceDate = moment()
    .add(1, 'days')
    .format();
  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });

  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  expect(validationResult.valid).toEqual(false);
  expectValidationToBe(validationResult.validations, 'Activation', false);
});

it('expirationDate is in the future', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  credentialTemplate.expirationDate = moment()
    .add(1, 'days')
    .format();
  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });

  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  expect(validationResult.valid).toEqual(true);
  expectValidationToBe(validationResult.validations, 'Expiration', true);
});

it('expirationDate is in the past', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  credentialTemplate.expirationDate = moment()
    .subtract(1, 'days')
    .format();
  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });

  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  expect(validationResult.valid).toEqual(false);
  expectValidationToBe(validationResult.validations, 'Expiration', false);
});

it('generate fixture', async () => {
  credentialTemplate = {
    ...credentialTemplate,
    issuer: key.controller,
  };
  credentialTemplate.expirationDate = moment()
    .add(1, 'days')
    .format();

  const credentialIssued = await vc.issue({
    credential: { ...credentialTemplate },
    suite: suite,
    documentLoader,
  });

  const validationResult = await vc.validateCredential({
    credential: { ...credentialIssued },
    suite: new Ed25519Signature2018({}),
    documentLoader,
  });
  // console.log(JSON.stringify(validationResult, null, 2));
  expect(validationResult).toEqual({
    valid: true,
    validations: [
      {
        valid: true,
        title: 'Signature',
        description: 'did:example:def#123',
      },
      {
        valid: true,
        title: 'Activation',
        description: 'This credential activated a year ago',
      },
      {
        valid: true,
        title: 'Expiration',
        description: 'This credential expires in a day',
      },
    ],
  });
});
