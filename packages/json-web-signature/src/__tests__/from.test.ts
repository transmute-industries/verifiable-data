import { JsonWebKey } from '..';

const options: any = [
  {
    id:
      'did:key:z6MkkKuSmBqWyxKbFTgsA9gab81xQkYTxh7GuSXkWFZGcUmF#z6MkkKuSmBqWyxKbFTgsA9gab81xQkYTxh7GuSXkWFZGcUmF',
    type: 'Ed25519VerificationKey2018',
    controller: 'did:key:z6MkkKuSmBqWyxKbFTgsA9gab81xQkYTxh7GuSXkWFZGcUmF',
    publicKeyBase58: '6seQAwb5eQq88xrAUaijk2TxbBGcYorvDRcpfybFhFys',
    privateKeyBase58:
      '3DN8FPBdSXPfDCN7rE3fzweNYkUCnDhBu8a4rGoS5GA3S9Afa5o5o4mxdtyCJbYbNeRde7LnpZJLS97M8LBFBz6d',
  },
  {
    id:
      'did:key:zQ3shZuRDgT6poC3n3FQ9dZRqe4MkMXa8sqQcTLoPiUNQvnji#zQ3shZuRDgT6poC3n3FQ9dZRqe4MkMXa8sqQcTLoPiUNQvnji',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shZuRDgT6poC3n3FQ9dZRqe4MkMXa8sqQcTLoPiUNQvnji',
    publicKeyBase58: 'oxGCqJdMUYpto9ijFUYnpTzJhmPAbHN5XR3bR8hHiJsz',
    privateKeyBase58: 'Axqugik6g66ZcoTuhDF1ytnmirmEdmnVcad23vvzQ2ph',
  },
  {
    id:
      'did:key:zDnaeu39P4rdbonDJah4fdj5ggjn8dpood7L7Hk2vhjPAVph9#zDnaeu39P4rdbonDJah4fdj5ggjn8dpood7L7Hk2vhjPAVph9',
    type: 'P256Key2021',
    controller: 'did:key:zDnaeu39P4rdbonDJah4fdj5ggjn8dpood7L7Hk2vhjPAVph9',
    publicKeyBase58: '264p5Rpow5JfqxXk1mCyK2RMtb1gfrjoyLtjV8uoF83e3',
    privateKeyBase58: 'HLoJXbejjNqwkDP5x1SvZGgCqChakwyEi5Hbj7nyhRGx',
  },
  {
    id:
      'did:key:z82Lkq5CcYttpvy1k9Xq6qdpqf1vXgBGqy2vu6rTGBttkheq59n7dic3CLMFq94a6Zp42yJ#z82Lkq5CcYttpvy1k9Xq6qdpqf1vXgBGqy2vu6rTGBttkheq59n7dic3CLMFq94a6Zp42yJ',
    type: 'P384Key2021',
    controller:
      'did:key:z82Lkq5CcYttpvy1k9Xq6qdpqf1vXgBGqy2vu6rTGBttkheq59n7dic3CLMFq94a6Zp42yJ',
    publicKeyBase58:
      'QLQBYCbuds7BNavFktHHeKYuLC1wry16q3uEKoiVUxAnnpKZm4VdPA6KP3SwSm2a9J',
    privateKeyBase58:
      '6KHn6N73yrTyAEYjGnxigfs1ay7re7rnGY4xnDdDQb1BqmMdxy7poZaFzv4pFK24Md',
  },
  {
    id:
      'did:key:z2J9gaZ6d5QUMzbrmKxpc5jC9aonnGUw2U8CJsuZFgar8EhFq2v2482EtoX48UQzYsWtPuUKaadrM2SoXpavct3QuEqP3ttT#z2J9gaZ6d5QUMzbrmKxpc5jC9aonnGUw2U8CJsuZFgar8EhFq2v2482EtoX48UQzYsWtPuUKaadrM2SoXpavct3QuEqP3ttT',
    type: 'P521Key2021',
    controller:
      'did:key:z2J9gaZ6d5QUMzbrmKxpc5jC9aonnGUw2U8CJsuZFgar8EhFq2v2482EtoX48UQzYsWtPuUKaadrM2SoXpavct3QuEqP3ttT',
    publicKeyBase58:
      '4T1C821twNiiLcFbhPpWTiHsPxQ9uVx9REz1NnqC6jVfuHA69BupKXQRZn8xmoxSgFPwNepEKe1JZd3Jz3ni7vAZPXq',
    privateKeyBase58:
      'a1YP5RVemR8aqFwz9CJyParE4kMCBXD3ykbcNWDPbpRUA2rnTH6XeB6HZMEWaEsfbZMkUBDthXEbfGKsAqkYNNDjv',
  },
];

options.forEach((opt: any) => {
  describe(`${opt.type} `, () => {
    it('from / sign / verify', async () => {
      try {
        const k = await JsonWebKey.from(opt);
        const kx = (await k.export({
          type: k.type,
          privateKey: true,
        })) as any;
        expect(kx).toEqual(opt);
        const message = Uint8Array.from(Buffer.from('hello'));
        const signature = await k.signer().sign({ data: message });
        const verified = await k.verifier().verify({
          data: message,
          signature,
        });
        expect(verified).toBe(true);
      } catch (e) {
        //
      }
    });
  });
});
