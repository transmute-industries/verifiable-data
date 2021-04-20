import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { WalletOptions } from './types';

export const walletPlugin = (options: WalletOptions): FastifyPluginAsync => {
  async function walletPlugin(fastify: FastifyInstance) {
    fastify.decorate('wallet', options);
  }
  return fastifyPlugin(walletPlugin);
};

export default walletPlugin;
