const fastifyPlugin = require('fastify-plugin');

export const walletPlugin = (options: any) => {
  async function walletPlugin(fastify: any) {
    fastify.decorate('wallet', options);
  }
  return fastifyPlugin(walletPlugin);
};

export default walletPlugin;