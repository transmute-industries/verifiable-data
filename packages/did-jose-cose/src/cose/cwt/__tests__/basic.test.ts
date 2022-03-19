import { cose } from '../../../index';
import { jsonWebKey, documentLoader } from '../../../__fixtures__';

it('CWT sign and verify', async () => {
  const { id, privateKeyJwk } = jsonWebKey;
  const header = { kid: id };
  const payload = {
    iss: 'coap://as.example.com',
    sub: 'erikw',
    aud: 'coap://light.example.com',
    exp: 1444064944,
    nbf: 1443944944,
    iat: 1443944944,
    cti: '0b71',
  };
  const cwt = await cose.cwt.sign(header, payload, privateKeyJwk);
  const v = await cose.cwt.verify(cwt.data, id, documentLoader);
  expect(v.done).toBe(true);
});
