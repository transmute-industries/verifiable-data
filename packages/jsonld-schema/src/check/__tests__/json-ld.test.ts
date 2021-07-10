import * as fixtures from '../__fixtures__';

import { check } from '../index';

describe('good', () => {
  Object.keys(fixtures.good).forEach(value => {
    it(`${value}`, async () => {
      const input = (fixtures.good as any)[value];
      const res = await check({
        input,
        documentLoader: fixtures.documentLoader,
      });
      expect(res).toEqual({
        ok: true,
      });
    });
  });
});

describe('bad', () => {
  Object.keys(fixtures.bad).forEach(value => {
    it(`${value}`, async () => {
      const { input, output } = (fixtures.bad as any)[value];
      const res = await check({
        input,
        documentLoader: fixtures.documentLoader,
      });
      expect(res).toEqual(output['json-ld']);
    });
  });
});
