import { IVcJwtPressentationPayload, IVpOptions } from '../types';

import { createPresentation as createVerifiablePresentation } from '../vc-ld/prove';

export const createPresentation = async (
  credentials: any[],
  holder: string,
  id?: string
) => {
  const vp = await createVerifiablePresentation({
    verifiableCredential: credentials, //array of <object|string> | object | string.... thanks for that...
    holder,
    id,
  });

  const payload: IVcJwtPressentationPayload = {
    iss: holder,
    sub: holder,
    vp: vp,
  };

  if (vp.id) {
    payload.jti = vp.id;
  }
  return payload;
};

export const provePresentation = (
  vp: any,
  options: IVpOptions,
  signer: any
) => {
  if (options.challenge) {
    vp.nonce = options.challenge;
  }
  if (options.domain) {
    vp.aud = options.domain;
  }
  const header = {};
  return signer.sign(vp, header);
};
