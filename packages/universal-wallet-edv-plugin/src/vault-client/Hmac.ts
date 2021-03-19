import crypto from 'isomorphic-webcrypto';
import base64url from 'base64url-universal';

const seedToId = async (seed: Uint8Array) => {
  const buffer = await crypto.subtle.digest('SHA-256', seed);
  return `urn:digest:${Buffer.from(new Int8Array(buffer)).toString('hex')}`;
};

export default class Hmac {
  public id: string;
  public type: string;
  public algorithm: string;
  public key: any;

  constructor({ id, type, algorithm, key }: any) {
    this.id = id;
    this.type = type;
    this.algorithm = algorithm;
    this.key = key;
  }

  static async create(data: Buffer) {
    const id = await seedToId(new Uint8Array(data));
    const type = 'Sha256HmacKey2019';
    const algorithm = 'HS256';
    const extractable = true;
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      extractable,
      ['sign', 'verify']
    );
    const hmac = new Hmac({ id, type, algorithm, key });
    return hmac;
  }

  async sign({ data }: any) {
    const key = this.key;
    const signature = new Uint8Array(
      await crypto.subtle.sign(key.algorithm, key, data)
    );
    return base64url.encode(signature);
  }

  async verify({ data, signature }: any) {
    const key = this.key;
    signature = base64url.decode(signature);
    return crypto.subtle.verify(key.algorithm, key, signature, data);
  }
}
