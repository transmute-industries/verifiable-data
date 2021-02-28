/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */

import { Bitstring } from './Bitstring';
import * as assertions from './assertions';

describe('Bitstring', () => {
  it('should create an instance.', async () => {
    const bitstring = new Bitstring({ length: 8 });

    expect(JSON.stringify(bitstring, null, 2)).toEqual(`{
  "bits": {
    "0": 0
  },
  "length": 8
}`);

    assertions.isUint8Array(bitstring.bits, 'buffer');
  });

  it('should fail to create an instance if no "length".', async () => {
    try {
      new Bitstring();
    } catch (e) {
      expect(e.name).toBe('TypeError');
      expect(e.message).toBe('"buffer" must be a Uint8Array.');
    }
  });

  it('should throw error if "length" and "buffer" are passed.', async () => {
    const buffer = new Uint8Array(1);
    try {
      new Bitstring({ length: 4, buffer } as any);
    } catch (e) {
      expect(e.name).toBe('Error');
      expect(e.message).toBe('Only one of "length" or "buffer" must be given.');
    }
  });

  it('should throw error if "length" is not a positive integer.', async () => {
    const lengths = [0, -2];
    for (const length of lengths) {
      try {
        new Bitstring({ length });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"length" must be a positive integer.');
      }
    }
  });

  it('should set a bit to true.', async () => {
    const bitstring = new Bitstring({ length: 8 });

    for (let i = 0; i < bitstring.length; i++) {
      expect(bitstring.get(i)).toBe(false);
    }

    // set the value at the fourth index of bitstring to true
    bitstring.set(4, true);

    for (let i = 0; i < bitstring.length; i++) {
      if (i !== 4) {
        expect(bitstring.get(i)).toBe(false);
      } else {
        expect(bitstring.get(i)).toBe(true);
      }
    }
  });

  it('should set a bit to false.', async () => {
    const buffer = Uint8Array.from([255]);
    const bitstring = new Bitstring({ buffer });
    expect(bitstring.length).toBe(8);
    expect(bitstring.bits.length).toBe(1);
    expect(bitstring.bits[0]).toBe(255);

    for (let i = 0; i < bitstring.length; i++) {
      expect(bitstring.get(i)).toBe(true);
    }

    // set the value at the fourth index of bitstring to false
    bitstring.set(4, false);

    expect(bitstring.bits[0]).toBe(239);

    for (let i = 0; i < bitstring.length; i++) {
      if (i !== 4) {
        expect(bitstring.get(i)).toBe(true);
      } else {
        expect(bitstring.get(i)).toBe(false);
      }
    }
  });

  it('should throw an error if "on" is not a boolean.', async () => {
    const list = new Bitstring({ length: 8 });
    const onTypes = [1, undefined, 'string', {}, []];
    for (const on of onTypes) {
      try {
        list.set(4, on as any);
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"on" must be a boolean.');
      }
    }
  });

  it('should throw an error if "position" is not a number.', async () => {
    const list = new Bitstring({ length: 8 });
    const positionTypes = [undefined, 'string', {}, [], false];

    for (const position of positionTypes) {
      try {
        list.get(position as any);
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"position" must be number.');
      }
    }
  });

  it('should fail to get a bit when "position" is out of range.', async () => {
    const list = new Bitstring({ length: 8 });
    try {
      list.get(8);
    } catch (e) {
      expect(e.name).toBe('Error');
      expect(e.message).toBe('Position "8" is out of range "0-7".');
    }
  });

  it('should throw error if "position" is non-negative integer.', async () => {
    const list = new Bitstring({ length: 8 });
    try {
      list.get(-1);
    } catch (e) {
      expect(e.name).toBe('TypeError');
      expect(e.message).toBe('"position" must be a non-negative integer.');
    }
  });

  it('should encode a bitstring', async () => {
    const bitstring = new Bitstring({ length: 8 });

    expect(bitstring.length).toBe(8);
    expect(bitstring.bits.length).toBe(1);
    assertions.isUint8Array(bitstring.bits, 'buffer');

    bitstring.set(1, true);
    bitstring.set(4, true);

    const encoded = await bitstring.encodeBits();
    expect(encoded).toBe('H4sIAAAAAAAAAxMCAMWeuyEBAAAA');

    expect(bitstring.length).toBe(8);
    expect(bitstring.bits.length).toBe(1);
    assertions.isUint8Array(bitstring.bits, 'buffer');
  });

  it('should throw an error if "encoded" is not a string.', async () => {
    const badTypes = [1, undefined, {}, [], false];

    for (const encoded of badTypes) {
      try {
        await Bitstring.decodeBits({ encoded } as any);
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"encoded" must be a string.');
      }
    }
  });

  it('should decode encoded bits', async () => {
    const bitstring = new Bitstring({ length: 8 });
    bitstring.set(1, true);
    bitstring.set(4, true);

    const encoded = await bitstring.encodeBits();
    const decoded = await Bitstring.decodeBits({ encoded });

    expect(bitstring.length).toBe(8);
    expect(bitstring.bits.length).toBe(1);
    assertions.isUint8Array(bitstring.bits, 'buffer');
    expect(decoded).toEqual(bitstring.bits);
  });

  it('should compress a bitstring', async () => {
    const bitstring = new Bitstring({ length: 8 });
    bitstring.set(1, true);
    bitstring.set(4, true);
    const compressed = await bitstring.compressBits();
    expect(bitstring.length).toBe(8);
    expect(bitstring.bits.length).toBe(1);
    assertions.isUint8Array(bitstring.bits, 'buffer');
    const expected = new Uint8Array([
      31,
      139,
      8,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      19,
      2,
      0,
      197,
      158,
      187,
      33,
      1,
      0,
      0,
      0,
    ]);
    expect(compressed).toEqual(expected);
  });

  it('should throw an error if "compressed" is not a Uint8Array.', async () => {
    const badTypes = [1, undefined, {}, [], false];
    for (const compressed of badTypes) {
      try {
        await Bitstring.uncompressBits({ compressed } as any);
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"compressed" must be a Uint8Array.');
      }
    }
  });

  it('should uncompress compressed bits', async () => {
    const bitstring = new Bitstring({ length: 8 });
    bitstring.set(1, true);
    bitstring.set(4, true);

    const compressed = await bitstring.compressBits();
    const uncompressed = await Bitstring.uncompressBits({ compressed });

    expect(bitstring.length).toBe(8);
    expect(bitstring.bits.length).toBe(1);
    assertions.isUint8Array(bitstring.bits, 'buffer');

    expect(uncompressed).toEqual(bitstring.bits);
  });
});
