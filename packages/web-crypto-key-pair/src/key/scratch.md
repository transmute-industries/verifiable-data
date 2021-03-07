// import {
// // getKid,
// getMulticodec,
// } from './identifiers';

// // // https://tools.ietf.org/html/rfc7638
// // it('kid as defined by rfc7638', async () => {
// // const kid = await getKid({
// // kty: 'EC',
// // crv: 'P-256',
// // x: 'T1YJoNMk2RaSoE2Lm9avMqpGUELNxhwxtCJuG-FlVTo',
// // y: 'MZ8SAqEUGZt8SCLwQ2Di-\_AG7NNZ\_\_siFthUWDK9_Tk',
// // d: 'hvWs1RccvOkz5HSOTgp0B4mawfJpnS61yMHkecglHU8',
// // });
// // expect(kid).toBe('dsD68_X0ohMQNB0uf8nT7IwXg2QhMy71FLZPGmiaY5Q');
// // });

// it('multicodec as defined by did-key', async () => {
// const id = await getMulticodec({
// kty: 'EC',
// crv: 'P-384',
// x: 'lInTxl8fjLKp_UCrxI0WDklahi-7-\_6JbtiHjiRvMvhedhKVdHBfi2HCY8t_QJyc',
// y: 'y6N1IC-2mXxHreETBW7K3mBcw0qGr3CWHCs-yl09yCQRLcyfGv7XhqAngHOu51Zv',
// });
// expect(id).toBe(
// 'zFwfeyrSyWdksRYykTGGtagWazFB5zS4CjQcxDMQSNmCTQB5QMqokx2VJz4vBB2hN1nUrYDTuYq3kd1BM5cUCfFD4awiNuzEBuoy6rZZTMCsZsdvWkDXY6832qcAnzE7YGw43KU'
// );
// });

import bs58 from 'bs58';

it('test', () => {
const pubKeyBase58P384 =
'tAjHMcvoBXs3BSihDV85trHmstc3V3vTP7o2Si72eCWdVzeGgGvRd8h5neHEbqSL989h53yNj7M7wHckB2bKpGKQjnPDD7NphDa9nUUBggCB6aCWterfdXbH5DfWPZx5oXU';

const ecP384ExpectedDIDKey =
'did:key:zFwfeyrSyWdksRYykTGGtagWazFB5zS4CjQcxDMQSNmCTQB5QMqokx2VJz4vBB2hN1nUrYDTuYq3kd1BM5cUCfFD4awiNuzEBuoy6rZZTMCsZsdvWkDXY6832qcAnzE7YGw43KU';

const constructed =
'did:key:z' +
bs58.encode(
Buffer.concat([new Uint8Array([80, 24]), bs58.decode(pubKeyBase58P384)])
);
expect(constructed).toBe(ecP384ExpectedDIDKey);
});
