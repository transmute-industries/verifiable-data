import { cases, documentLoader } from '../__fixtures__';

import { encode, decode } from '../index';

cases
  // .filter((c: any) => {
  //   return c.name === 'case-2';
  // })
  .map((c: any) => {
    describe(c.name, () => {
      it('encode', async () => {
        const encoded = await encode(c.jsonld, documentLoader);
        expect(encoded).toEqual(c.cborld);
      });

      it('decode', async () => {
        const decoded = await decode(c.cborld, documentLoader);
        expect(decoded).toEqual(c.jsonld);
      });
    });
  });
