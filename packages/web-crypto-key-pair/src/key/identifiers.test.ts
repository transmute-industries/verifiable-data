import { getMulticodec } from './identifiers';

it('p-256', async () => {
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: 'igrFmi0whuihKnj9R3Om1SoMph72wUGeFaBbzG2vzns',
    y: 'efsX5b10x8yjyrj4ny3pGfLcY7Xby1KzgqOdqnsrJIM',
  };
  const calc = await getMulticodec(jwk);
  const id = 'z5bDBRqwwHdvUZ7bd8v8NVbj9VzSitbaS2EePrn3PwBr8nR';
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
  const id = 'z5bDBGCcz7d4ueXQqjNauwY8VjE3mkGaEfvTVxRXgQsChxg';
  expect(calc).toBe(id);
});

it('p-384', async () => {
  const jwk = {
    kty: 'EC',
    crv: 'P-384',
    x: 'lInTxl8fjLKp_UCrxI0WDklahi-7-_6JbtiHjiRvMvhedhKVdHBfi2HCY8t_QJyc',
    y: 'y6N1IC-2mXxHreETBW7K3mBcw0qGr3CWHCs-yl09yCQRLcyfGv7XhqAngHOu51Zv',
  };
  const calc = await getMulticodec(jwk);
  const id =
    'z3WFpGi5KxG376emVsW1yELgwp7zAYHNJUnr9qL13fE4xiwvTSqfKPP3KiMh6boCyf3j1';
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
    'zL2wxdRRkLgCFfATzuBHzzxkRuHZFKhsSEWHfVWkftHunRdDURFVBGKacPiXykrgmNKSfKo4ynjG3Sr7PRUGfCLaVgu8F';
  expect(calc).toBe(id);
});
