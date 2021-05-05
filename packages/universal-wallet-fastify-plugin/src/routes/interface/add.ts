export default (options: any) => {
  return (fastify: any) => {
    fastify.post(
      `/:${options.walletId}/wallet/contents`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        const content = request.body.content;
        wallet.add(content);
        await fastify.wallet.set(request.params[options.walletId], wallet);
        reply.status(200).send({});
      }
    );

    return Promise.resolve(true);
  };
};
