import { DidDocumentRepresentation } from '../types';
import fixture from '../__fixtures__';

import { getResolver, getGenerator } from '../';

fixture.forEach((f: any) => {
  describe(f.name, () => {
    Object.keys(f.data).forEach(did => {
      const contentTypes = Object.keys(
        f.data[did]
      ) as DidDocumentRepresentation[];
      contentTypes.forEach(ct => {
        describe(ct, () => {
          it(`can resolve ${did}`, async () => {
            const resolve = getResolver(f.KeyPair);
            const { didDocument } = await resolve(did, {
              accept: ct,
            });
            // console.log(JSON.stringify(didDocument, null, 2));
            expect(didDocument).toEqual(f.data[did][ct]);
          });

          it(`can generate ${f.name}`, async () => {
            const generate = getGenerator(f.KeyPair);
            const { keys, didDocument } = await generate(f.keyGenOptions, {
              accept: ct,
            });
            // console.log(JSON.stringify({ keys, didDocument }, null, 2));
            expect(keys.length).toBe(didDocument.verificationMethod.length);
          });
        });
      });
    });
  });
});
