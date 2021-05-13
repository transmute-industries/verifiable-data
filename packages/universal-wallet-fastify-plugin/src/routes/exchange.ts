import { getSuiteMap } from '../getSuiteMap';

export default (options: any) => {
  return (fastify: any) => {
    fastify.post(
      `/:${options.walletId}/presentations/available`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        // schema: {
        //   tags: ['Presentations'],
        //   summary: 'notifyPresentation',
        //   description: 'Notify of a Verifiable Presentation',
        //   response: {
        //     200: ,
        //   },
        // },
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        const res = wallet.createNotificationQueryResponse(
          request.params[options.walletId],
          request.body
        );
        await fastify.wallet.set(request.params[options.walletId], wallet);
        reply.status(200).send(res);
      }
    );

    fastify.post(
      `/:${options.walletId}/presentations/submissions`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        // schema: {
        //   tags: ['Presentations'],
        //   summary: 'submitPresentation',
        //   description: 'Submit a Verifiable Presentation',
        //   response: {
        //     200: ,
        //   },
        // },
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        const suiteMap = getSuiteMap();
        const presentationSubmission = request.body;
        // will throw if verification fails
        // need to catch and handle negative cases.
        // console.log(JSON.stringify(presentation, null, 2));
        await wallet.verifyAndAddPresentation(presentationSubmission, {
          suiteMap,
          documentLoader: fastify.wallet.documentLoader,
        });
        await fastify.wallet.set(request.params[options.walletId], wallet);
        reply.status(200).send({ verified: true });
      }
    );

    return Promise.resolve(true);
  };
};
