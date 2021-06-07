import bigInt from 'big-integer';
import { getConstantsForCurve } from './constants';
// see https://stackoverflow.com/questions/17171542/algorithm-for-elliptic-curve-point-compression
// https://github.com/w3c-ccg/did-method-key/pull/36
/**
 * Point compress elliptic curve key
 * @param {Uint8Array} x component
 * @param {Uint8Array} y component
 * @return {Uint8Array} Compressed representation
 */
function compressECPoint(x: any, y: any) {
  const out = new Uint8Array(x.length + 1);
  out[0] = 2 + (y[y.length - 1] & 1);
  out.set(x, 1);
  return out;
}

function pad_with_zeroes(number: any, length: any) {
  var retval = '' + number;
  while (retval.length < length) {
    retval = '0' + retval;
  }
  return retval;
}

export const compress = (publicKey: Uint8Array): Uint8Array => {
  const publicKeyHex = Buffer.from(publicKey).toString('hex');
  const xHex = publicKeyHex.slice(0, publicKeyHex.length / 2);
  const yHex = publicKeyHex.slice(publicKeyHex.length / 2, publicKeyHex.length);
  const xOctet = Uint8Array.from(Buffer.from(xHex, 'hex'));
  const yOctet = Uint8Array.from(Buffer.from(yHex, 'hex'));
  return compressECPoint(xOctet, yOctet);
};

const curveToPointLength: any = {
  'P-256': 64,
  'P-384': 96,
  'P-521': 132,
};

export const expand = (publicKey: Uint8Array, curve: string): Uint8Array => {
  const publicKeyComponent = Buffer.from(publicKey).toString('hex');
  const { prime, b, pIdent } = getConstantsForCurve(curve);
  // eslint-disable-next-line
  var signY: any = (new Number(publicKeyComponent[1]) as any) - 2;
  var x = new bigInt(publicKeyComponent.substring(2), 16);
  // y^2 = x^3 - 3x + b
  let y;

  y = x
    .pow(3)
    .subtract(x.multiply(3))
    .add(b)
    .modPow(pIdent, prime);

  // If the parity doesn't match it's the *other* root
  if (y.mod(2).toJSNumber() !== signY) {
    // y = prime - y
    y = prime.subtract(y);
  }

  return Buffer.from(
    pad_with_zeroes(x.toString(16), curveToPointLength[curve]) +
      pad_with_zeroes(y.toString(16), curveToPointLength[curve]),
    'hex'
  );
};
