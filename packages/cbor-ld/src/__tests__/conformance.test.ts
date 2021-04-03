import { cases, documentLoader } from '../__fixtures__';

import { encode, decode } from '../index';

cases.forEach((c: any) => {
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
