import Fastify from 'fastify';
import { UniversalWalletFastifyInstance } from '../types';

import walletPlugin from '../walletPlugin';
import walletRoutes from '../walletRoutes';

const fastify = Fastify();

export const getFastifyWithWalletOptions = (walletOptions: any) => {
  // service
  fastify.register(walletPlugin(walletOptions));
  // routes that use service
  fastify.register(walletRoutes(walletOptions), { prefix: '/accounts' });

  fastify.setErrorHandler((error: any, _request: any, reply: any) => {
    if (process.env.NODE_ENV !== 'test') {
      // Send error response
      console.error(error);
    }

    reply.send({ message: error.message });
  });

  const universalWallerFastifyInstance: UniversalWalletFastifyInstance = fastify as any;
  return universalWallerFastifyInstance;
};
