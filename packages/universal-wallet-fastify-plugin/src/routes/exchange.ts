// import { getSuiteForKey } from '../getSuiteForKey';
// import customDocumentLoader from '../customDocumentLoader';

export default (options: any) => {
  return (fastify: any) => {
    // const documentLoader = customDocumentLoader(options);
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
      async (_request: any, reply: any) => {
        // console.log(request);
        reply.status(200).send({});
      }
    );

    return Promise.resolve(true);
  };
};
