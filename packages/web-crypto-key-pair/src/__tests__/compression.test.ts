import { base58 } from '../encoding';
import { compress, expand } from '../compression/ec-compression';

it('P-384 compress / expand public key', () => {
  const oldForm = {
    id:
      '#zFwfeyrSyWdksRYykTGGtagWazFB5zS4CjQcxDMQSNmCTQB5QMqokx2VJz4vBB2hN1nUrYDTuYq3kd1BM5cUCfFD4awiNuzEBuoy6rZZTMCsZsdvWkDXY6832qcAnzE7YGw43KU',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zFwfeyrSyWdksRYykTGGtagWazFB5zS4CjQcxDMQSNmCTQB5QMqokx2VJz4vBB2hN1nUrYDTuYq3kd1BM5cUCfFD4awiNuzEBuoy6rZZTMCsZsdvWkDXY6832qcAnzE7YGw43KU',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'lInTxl8fjLKp_UCrxI0WDklahi-7-_6JbtiHjiRvMvhedhKVdHBfi2HCY8t_QJyc',
      y: 'y6N1IC-2mXxHreETBW7K3mBcw0qGr3CWHCs-yl09yCQRLcyfGv7XhqAngHOu51Zv',
    },
  };

  const newForm = {
    id:
      '#z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
    type: 'JsonWebKey2020',
    controller:
      'did:key:did:key:z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'lInTxl8fjLKp_UCrxI0WDklahi-7-_6JbtiHjiRvMvhedhKVdHBfi2HCY8t_QJyc',
      y: 'y6N1IC-2mXxHreETBW7K3mBcw0qGr3CWHCs-yl09yCQRLcyfGv7XhqAngHOu51Zv',
    },
  };
  const publicKey = Buffer.concat([
    Buffer.from(oldForm.publicKeyJwk.x, 'base64'),
    Buffer.from(oldForm.publicKeyJwk.y, 'base64'),
  ]);
  const compressed = compress(publicKey);
  const compressedFingerprint = base58.encode(
    Buffer.concat([Buffer.from('8124', 'hex'), compressed])
  );
  expect('#z' + compressedFingerprint).toBe(newForm.id);
  const decompressed = expand(compressed, oldForm.publicKeyJwk.crv);
  const uncompressedFingerprint = base58.encode(
    Buffer.concat([Buffer.from('8124', 'hex'), decompressed])
  );
  expect('#z' + uncompressedFingerprint).toBe(oldForm.id);
});

it('P-256 compress / expand public key', () => {
  const oldForm = {
    id:
      '#zrusAFgBbf84b8mBz8Cmy8UoFWKV52EaeRnK86vnLo4Z5QoRypE6hXVPN2urevZMAMtcTaCDFLWBaE1Q3jmdb1FHgve',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zrusAFgBbf84b8mBz8Cmy8UoFWKV52EaeRnK86vnLo4Z5QoRypE6hXVPN2urevZMAMtcTaCDFLWBaE1Q3jmdb1FHgve',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'igrFmi0whuihKnj9R3Om1SoMph72wUGeFaBbzG2vzns',
      y: 'efsX5b10x8yjyrj4ny3pGfLcY7Xby1KzgqOdqnsrJIM',
    },
  };

  const newForm = {
    id: '#zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
    type: 'JsonWebKey2020',
    controller: 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'igrFmi0whuihKnj9R3Om1SoMph72wUGeFaBbzG2vzns',
      y: 'efsX5b10x8yjyrj4ny3pGfLcY7Xby1KzgqOdqnsrJIM',
    },
  };
  const publicKey = Buffer.concat([
    Buffer.from(oldForm.publicKeyJwk.x, 'base64'),
    Buffer.from(oldForm.publicKeyJwk.y, 'base64'),
  ]);
  const compressed = compress(publicKey);
  const compressedFingerprint = base58.encode(
    Buffer.concat([Buffer.from('8024', 'hex'), compressed])
  );
  expect('#z' + compressedFingerprint).toBe(newForm.id);
  const decompressed = expand(compressed, oldForm.publicKeyJwk.crv);
  const uncompressedFingerprint = base58.encode(
    Buffer.concat([Buffer.from('8024', 'hex'), decompressed])
  );
  expect('#z' + uncompressedFingerprint).toBe(oldForm.id);
});
