import { preValidationHookHandler } from 'fastify';

export interface WalletOptions {
  walletId?: string;
  origin?: string | undefined;
  discovery?: DiscoveryEnum[] | string[];
  hooks?: WalletOptionHooks;
  apis?: APIEnum[] | string[];
  documentLoader?: DocumentLoaderOptions;
  get: (walletId: string) => Promise<any> | any;
  set?: (walletId: string, wallet: any) => Promise<void> | void;
}

export interface DocumentLoaderOptions {
  allowNetwork: boolean;
}

export interface WalletOptionHooks {
  preValidation: preValidationHookHandler[];
}

export enum APIEnum {
  ISSUER = 'issuer',
  HOLDER = 'holder',
  VERIFIER = 'verifier',
}

export enum DiscoveryEnum {
  DID_WEB = 'did:web',
}
