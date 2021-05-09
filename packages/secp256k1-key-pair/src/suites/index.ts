import * as Ecdsa from './Ecdsa';

import * as EcRecover from './EcRecover';

import * as Schnorr from './Schnorr';

export { Ecdsa, EcRecover, Schnorr };

export const suiteTypes = {
  Ecdsa: Ecdsa,
  EcRecover: EcRecover,
  Schnorr: Schnorr,
};
