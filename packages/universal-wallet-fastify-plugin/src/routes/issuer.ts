import customDocumentLoader from '../customDocumentLoader';
import { getSuiteForKey } from '../getSuiteForKey';

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
        // console.log(JSON.stringify(wallet.contents, null, 2));
        const k = wallet.contents.find((k: any) => {
          return k.id === request.body.options.verificationMethod;
        });
        if (!k) {
          throw new Error('verificationMethod not found.');
        }

        const suite = await getSuiteForKey(k);

        const vc = await wallet.issue({
          credential: {
            ...request.body.credential,
          },
          options: {
            suite: suite,
            documentLoader,
          },
        });

        reply.status(201).send(vc);
      }
    );
    return Promise.resolve(true);
  };
};
