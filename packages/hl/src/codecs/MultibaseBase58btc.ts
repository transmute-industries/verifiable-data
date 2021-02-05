import bs58 from 'bs58';

import { TextDecoder, stringToUint8Array } from '../util';

export class MultibaseBase58btc {
  public identifier: Uint8Array;
  public algorithm: string;

  constructor() {
    this.identifier = new Uint8Array([0x7a]);
    this.algorithm = 'mb-base58-btc';
  }

  encode(input: Uint8Array) {
    return new Uint8Array(stringToUint8Array('z' + bs58.encode(input)));
  }

  decode(input: Uint8Array) {
    return bs58.decode(new TextDecoder('utf-8').decode(input.slice(1)));
  }
}
