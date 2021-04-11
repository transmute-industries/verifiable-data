import walletPlugin from '../walletPlugin';
import walletRoutes from '../walletRoutes';

const Fastify = require('fastify');
const fastify = Fastify();

export const getFastifyWithWalletOptions = (walletOptions: any) => {
  // service
  fastify.register(walletPlugin(walletOptions));
  // routes that use service
  fastify.register(walletRoutes(walletOptions), { prefix: '/accounts' });

  fastify.setErrorHandler((error: any, _request: any, reply: any) => {
    // Send error response
    console.error(error);

    reply.send({ message: error.message });
  });

  return fastify;
};
