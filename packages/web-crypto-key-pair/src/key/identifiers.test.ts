import { getMulticodec } from './identifiers';

it('p-256', async () => {
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: 'igrFmi0whuihKnj9R3Om1SoMph72wUGeFaBbzG2vzns',
    y: 'efsX5b10x8yjyrj4ny3pGfLcY7Xby1KzgqOdqnsrJIM',
  };
  const calc = await getMulticodec(jwk);
  const id = 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
  expect(calc).toBe(id);
});

it('p-256 2', async () => {
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: 'fyNYMN0976ci7xqiSdag3buk-ZCwgXU4kz9XNkBlNUI',
    y: 'hW2ojTNfH7Jbi8--CJUo3OCbH3y5n91g-IMA9MLMbTU',
  };
  const calc = await getMulticodec(jwk);
  const id = 'zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169';
  expect(calc).toBe(id);
});

it('p-384', async () => {
  const jwk = {
    kty: 'EC',
    crv: 'P-384',
    x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
    y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
  };
  const calc = await getMulticodec(jwk);
  const id =
    'z82LkvCwHNreneWpsgPEbV3gu1C6NFJEBg4srfJ5gdxEsMGRJUz2sG9FE42shbn2xkZJh54';
  expect(calc).toBe(id);
});

it('p-521', async () => {
  const jwk = {
    kty: 'EC',
    crv: 'P-521',
    x:
      'ASUHPMyichQ0QbHZ9ofNx_l4y7luncn5feKLo3OpJ2nSbZoC7mffolj5uy7s6KSKXFmnNWxGJ42IOrjZ47qqwqyS',
    y:
      'AW9ziIC4ZQQVSNmLlp59yYKrjRY0_VqO-GOIYQ9tYpPraBKUloEId6cI_vynCzlZWZtWpgOM3HPhYEgawQ703RjC',
  };
  const calc = await getMulticodec(jwk);
  const id =
    'z2J9gaYxrKVpdoG9A4gRnmpnRCcxU6agDtFVVBVdn1JedouoZN7SzcyREXXzWgt3gGiwpoHq7K68X4m32D8HgzG8wv3sY5j7';
  expect(calc).toBe(id);
});
