import * as Factory from 'factory.ts';

import { WalletStatus } from './types';

import {
  lockContents,
  unlockContents,
  exportContentsAsCredential,
  contentsFromEncryptedWalletCredential,
} from './functions';

interface Wallet {
  status: WalletStatus;
  contents: any[];
  add: (content: any) => Wallet;
  remove: (contentId: string) => Wallet;
  lock: (password: string) => Promise<Wallet>;
  unlock: (password: string) => Promise<Wallet>;
  export: (password: string) => Promise<any>;
  import: (encryptedWalletCredential: any, password: string) => Promise<Wallet>;
}

const walletDefaults = {
  status: WalletStatus.Unlocked,
  contents: [],
  add: function(content: any): Wallet {
    (this as Wallet).contents.push(content);
    return this;
  },
  remove: function(contentId: string): any {
    let contents = JSON.parse(JSON.stringify(this.contents));
    let index = contents.findIndex((c: any) => {
      return c.id === contentId;
    });
    let content = contents[index];
    this.contents = contents.filter((i: any) => {
      return i.id !== content.id;
    });

    return content;
  },
  lock: async function(password: string): Promise<Wallet> {
    (this as Wallet).contents = await lockContents(
      password,
      (this as Wallet).contents
    );
    (this as Wallet).status = WalletStatus.Locked;
    return this;
  },
  unlock: async function(password: string): Promise<Wallet> {
    (this as Wallet).contents = await unlockContents(
      password,
      (this as Wallet).contents
    );
    (this as Wallet).status = WalletStatus.Unlocked;
    return this;
  },
  export: async function(password: string): Promise<any> {
    return exportContentsAsCredential(password, this.contents);
  },
  import: async function(
    encryptedWalletCredential: any,
    password: string
  ): Promise<any> {
    if (this.contents.length) {
      throw new Error('Cannot import over existing wallet content.');
    }
    this.contents = await contentsFromEncryptedWalletCredential(
      password,
      encryptedWalletCredential
    );
    this.status = WalletStatus.Unlocked;
    return this;
  },
};

const walletFactory = Factory.Sync.makeFactory<Wallet>(walletDefaults);

const wallet = walletFactory.build();

export { Wallet, walletFactory, walletDefaults, wallet };
