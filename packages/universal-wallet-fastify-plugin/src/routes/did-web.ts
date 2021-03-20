export default (options: any) => {
  return (fastify: any) => {
    fastify.get(
      `/:${options.walletId}/did.json`,
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        const endpoint = `${options.origin}${request.url}`;
        let did = wallet.convertEndpointToDid(endpoint);
        // TODO: consider collection / profile level filter here.
        // https://github.com/w3c-ccg/universal-wallet-interop-spec/issues/47
        const keys = wallet.contents.filter((k: any) => {
          return k.type === 'JsonWebKey2020' && k.controller === did;
        });
        const didWebDoc = await wallet.keysToDidDocument(did, keys);
        reply.send(didWebDoc);
      }
    );
    return Promise.resolve(true);
  };
};
