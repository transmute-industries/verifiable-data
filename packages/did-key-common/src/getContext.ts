import { DidDocument } from './types';

import * as dc from '@transmute/did-context';
import * as sc from '@transmute/security-context';

const vmTypeToContext: any = {
  JsonWebKey2020: sc.constants.JSON_WEB_SIGNATURE_2020_V1_URL,
  Ed25519VerificationKey2018: sc.constants.ED25519_2018_v1_URL,
  X25519KeyAgreementKey2019: sc.constants.X25519_2019_v1_URL,
  Bls12381G1Key2020: sc.constants.BLS12381_2020_V1_URL,
  Bls12381G2Key2020: sc.constants.BLS12381_2020_V1_URL,
};

export const getContext = (didDocument: DidDocument) => {
  const context: string[] = [dc.constants.DID_CONTEXT_V1_URL];
  didDocument.verificationMethod?.forEach(vm => {
    if (!vmTypeToContext[vm.type]) {
      throw new Error(
        'Cannot generate context for unregistered verification method type: ' +
          vm.type
      );
    }
    const typeContext = vmTypeToContext[vm.type];
    if (!context.includes(typeContext)) {
      context.push(typeContext);
    }
  });

  return context;
};
