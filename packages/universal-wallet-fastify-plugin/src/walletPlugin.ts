const fastifyPlugin = require('fastify-plugin');

export default (options: any) => {
  async function walletPlugin(fastify: any) {
    fastify.decorate('wallet', options);
  }
  return fastifyPlugin(walletPlugin);
};
