import * as panva from './__fixtures__/panva-helper';
import * as transmute from './__fixtures__/transmute-helper';

const header = {};
const payload = { hello: 'world' };

it('secp256k1', async () => {
  const privateKeyJwk = {
    kty: 'EC',
    crv: 'secp256k1',
    x: '1F1NpCD4LpLFLyB331QEXRLetsYOaHN7UcVvoiFDIWE',
    y: 'qZbAP6LVUozDLE_-imodZtu780YYfJ4bX1w-mLGHLvo',
    d: 'Vh-iRjTZp4olbXxYibXNUq7ozeEhMQeF04HeFCKaKS0',
  };
  const jws = await panva.sign(header, payload, privateKeyJwk);
  const verified = await panva.verify(jws, privateKeyJwk);
  expect(verified).toBe(true);
  const jws2 = await transmute.sign(header, payload, privateKeyJwk);

  expect(jws.length).toBe(jws2.length);

  // console.log(jws);
  // console.log(jws2);

  const verified2 = await transmute.verify(jws2, privateKeyJwk);
  expect(verified2).toBe(true);

  // remember 1/2 of openssl ES26K signatures will be in wrong S format,
  // and require normalization to lower S....
  const verified3 = await panva.verify(jws2, privateKeyJwk);
  expect(verified3).toBe(true);
});
