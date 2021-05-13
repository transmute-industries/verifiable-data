import { onlyPlaintextExportable } from '../../onlyPlaintextExportable';

export default (options: any) => {
  return (fastify: any) => {
    fastify.get(
      `/:${options.walletId}/wallet/contents/query`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        const contents = JSON.parse(JSON.stringify(wallet.contents));
        const filtered = contents
          .filter((item: any) => {
            if (request.query.type) {
              return Array.isArray(item.type)
                ? item.type.includes(request.query.type)
                : item.type === request.query.type;
            }
          })
          .filter((item: any) =>
            request.query.id ? item.id === request.query.id : item
          )
          .map(onlyPlaintextExportable);

        reply.status(200).send({
          contents: filtered,
        });
      }
    );
    return Promise.resolve(true);
  };
};
