import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { X25519KeyPair } from '@transmute/did-key-x25519';

import Hmac from './Hmac';
import KeyAgreementKey from './KeyAgreementKey';
import Invoker from './Invoker';

import { EdvClient } from 'edv-client';

import { passwordToKey } from '../functions/passwordToKey';

export interface IEdvVendorConfig {
  account_seed: string;
  vault_endpoint: string;
  hmac_secret: string;
}

export class VaultClient {
  public vault_endpoint: string = '';
  public keys: any;
  public invocationSigner: any;
  public keyResolver: any;
  public vault: any;

  static fromDerivedContents = async (
    vault_endpoint: string,
    ed25519Key: any,
    x25519Key: any,
    hmacSecret: Buffer
  ) => {
    const k0: any = new Ed25519KeyPair(ed25519Key).toKeyPair(true);
    const k1: any = new X25519KeyPair(x25519Key).toKeyPair(true);
    const invocationSigner = new Invoker(k0);
    const keyAgreementKey = new KeyAgreementKey(k1);
    const hmac = await Hmac.create(hmacSecret);
    const client = new VaultClient(
      vault_endpoint,
      invocationSigner,
      keyAgreementKey,
      hmac
    );
    await client.getClient();
    return client;
  };

  static fromPassword = async (vault_endpoint: string, password: string) => {
    const seed = await passwordToKey(password);
    const ed25519KeyPair = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(seed);
      },
    });

    const k0: any = ed25519KeyPair.toKeyPair(true);
    const k1: any = (ed25519KeyPair.toX25519KeyPair(true) as any).toKeyPair(
      true
    );
    k0.id = k0.controller + k0.id;
    k1.id = k1.controller + k1.id;

    const invocationSigner = new Invoker(k0 as any);
    const keyAgreementKey = new KeyAgreementKey(k1 as any);
    const hmac = await Hmac.create(Buffer.from(seed));
    const client = new VaultClient(
      vault_endpoint,
      invocationSigner,
      keyAgreementKey,
      hmac
    );
    await client.getClient();
    return client;
  };

  constructor(
    vault_endpoint: string,
    invocationSigner: Invoker,
    keyAgreementKey: KeyAgreementKey,
    hmac: Hmac
  ) {
    this.vault_endpoint = vault_endpoint;
    this.keys = {};
    this.invocationSigner = invocationSigner;
    this.keys.keyAgreementKey = keyAgreementKey;
    this.keys.hmac = hmac;
    this.keyResolver = ({ id }: any) => {
      if (this.keys.keyAgreementKey.id === id) {
        return this.keys.keyAgreementKey;
      }
      throw new Error(`Key ${id} not found`);
    };
  }

  async createEdv({ controller, referenceId }: any = {}) {
    const { keyAgreementKey, hmac } = this.keys;
    let config: any = {
      sequence: 0,
      controller: controller || this.invocationSigner.id,
      keyAgreementKey: { id: keyAgreementKey.id, type: keyAgreementKey.type },
      hmac: { id: hmac.id, type: hmac.type },
    };
    if (referenceId) {
      config.referenceId = referenceId;
    }
    config = await EdvClient.createEdv({
      url: this.vault_endpoint,
      config,
    });

    return new EdvClient({
      id: this.vault_endpoint + '/' + config.id,
      keyAgreementKey,
      hmac,
    });
  }

  async getClient() {
    const { keyAgreementKey, hmac } = this.keys;
    // console.log(keyAgreementKey, hmac, this.invocationSigner);
    let _config = await EdvClient.findConfig({
      url: this.vault_endpoint,
      controller: this.invocationSigner.controller,
      referenceId: this.invocationSigner.controller + '#primary',
    });

    if (_config) {
      this.vault = new EdvClient({
        id: this.vault_endpoint + '/' + _config.id,
        keyAgreementKey,
        hmac,
      });
      return this.vault;
    }
    this.vault = await this.createEdv({
      controller: this.invocationSigner.controller,
      referenceId: this.invocationSigner.controller + '#primary',
    });
    return this.vault;
  }

  async addWalletContent(doc: any) {
    this.vault.ensureIndex({ attribute: 'content.schema' });
    this.vault.ensureIndex({ attribute: 'content.data.id', unique: true });
    return await this.vault.update({
      keyResolver: this.keyResolver,
      invocationSigner: this.invocationSigner,
      doc,
    });
  }

  async getWalletContents() {
    const { documents } = await this.vault.find({
      invocationSigner: this.invocationSigner,
      equals: { 'content.schema': 'https://schema.org/UniversalWallet' },
    });
    return documents.map((d: any) => {
      return d.content.data;
    });
  }

  async syncContent(wallet: any) {
    let contents = [];

    const isContentPersisted = (localContents: any, id: string) => {
      return (
        localContents.find((c: any) => {
          return c.id === id;
        }) !== undefined
      );
    };

    try {
      contents = await this.getWalletContents();
    } catch (e) {
      if (e.message === 'Request failed with status code 404') {
        // no-op we will add content that does not exist anyway..
      }
    }

    try {
      for (const content of wallet.contents) {
        const isPersisted = isContentPersisted(contents, content.id);
        if (!isPersisted) {
          let data = JSON.parse(JSON.stringify(content));
          delete data.tableData;
          const doc = {
            id: await EdvClient.generateId(),
            content: {
              schema: 'https://schema.org/UniversalWallet',
              data,
            },
          };
          await this.addWalletContent(doc);
        }
      }
      contents = await this.getWalletContents();
    } catch (error) {
      console.error(error);
    }
    return contents;
  }
}
