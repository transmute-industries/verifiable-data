import { getSuite } from '../getSuite';

import customDocumentLoader from '../customDocumentLoader';

export default (options: any) => {
  return (fastify: any) => {
    const documentLoader = customDocumentLoader(options);
    fastify.post(
      `/:${options.walletId}/credentials/issue`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        // schema: {
        //   tags: ['Issuer'],
        //   summary: 'issueCredential',
        //   description: 'Issue a Verifiable Credential',
        //   response: {
        //     202: VerifiableCredential,
        //   },
        // },
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        const k = wallet.contents.find((k: any) => {
          return k.id === request.body.options.verificationMethod;
        });
        if (!k) {
          throw new Error('verificationMethod not found.');
        }
        const suite = await getSuite(k);
        const vc = await wallet.issue({
          credential: request.body.credential,
          options: {
            suite,
            documentLoader,
          },
        });

        reply.status(201).send(vc);
      }
    );
    return Promise.resolve(true);
  };
};
