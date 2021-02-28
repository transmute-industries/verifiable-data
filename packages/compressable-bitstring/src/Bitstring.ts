/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import base64url from 'base64url';
import { gzip, ungzip } from 'pako';
import * as assert from './assertions';

export class Bitstring {
  bits: Uint8Array = new Uint8Array();
  length: number = 0;

  constructor({
    length,
    buffer,
  }: { length?: number; buffer?: Uint8Array } = {}) {
    if (length && buffer) {
      throw new Error('Only one of "length" or "buffer" must be given.');
    }
    if (length !== undefined) {
      assert.isPositiveInteger(length, 'length');
    } else {
      assert.isUint8Array(buffer, 'buffer');
    }
    if (length) {
      this.bits = new Uint8Array(Math.ceil(length / 8));
      this.length = length;
    }
    if (buffer) {
      this.bits = new Uint8Array(buffer.buffer);
      this.length = buffer.length * 8;
    }
  }

  set(position: number, on: boolean) {
    assert.isNumber(position, 'position');
    assert.isBoolean(on, 'on');
    const { index, bit } = _parsePosition(position, this.length);
    if (on) {
      this.bits[index] |= bit;
    } else {
      this.bits[index] &= 0xff ^ bit;
    }
  }

  get(position: number) {
    assert.isNumber(position, 'position');
    const { index, bit } = _parsePosition(position, this.length);
    return !!(this.bits[index] & bit);
  }

  async encodeBits() {
    return base64url.encode(gzip(this.bits));
  }

  static async decodeBits({ encoded }: { encoded: string }) {
    assert.isString(encoded, 'encoded');
    return ungzip(base64url.toBuffer(encoded));
  }

  async compressBits() {
    return gzip(this.bits);
  }

  static async uncompressBits({ compressed }: { compressed: string }) {
    assert.isUint8Array(compressed, 'compressed');
    return ungzip(compressed);
  }
}

function _parsePosition(position: number, length: number) {
  assert.isNonNegativeInteger(position, 'position');
  assert.isPositiveInteger(length, 'length');

  if (position >= length) {
    throw new Error(
      `Position "${position}" is out of range "0-${length - 1}".`
    );
  }
  const index = Math.floor(position / 8);
  const bit = 1 << position % 8;
  return { index, bit };
}
