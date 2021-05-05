import { Wallet } from '@transmute/universal-wallet';
import { preValidationHookHandler } from 'fastify';

export type DocumentLoader = (
  iri: string
) => Promise<{
  documentUrl: string;
  document: any;
}>;

export interface WalletOptions {
  walletId: string;
  origin?: string | undefined;
  discovery?: DiscoveryEnum[] | string[];
  hooks?: WalletOptionHooks;
  apis?: APIEnum[] | string[];
  documentLoader: DocumentLoader;
  get: (walletId: string) => Promise<Wallet> | Wallet;
  set?: (walletId: string, wallet: Wallet) => Promise<void> | void;
}

export interface WalletOptionHooks {
  preValidation: preValidationHookHandler[];
}

export enum APIEnum {
  ISSUER = 'issuer',
  HOLDER = 'holder',
  VERIFIER = 'verifier',
  ADD = 'add',
  REMOVE = 'remove',
  CONTENTS = 'contents',
}

export enum DiscoveryEnum {
  DID_WEB = 'did:web',
}
