import { getSuiteMap } from '../getSuite';

import customDocumentLoader from '../customDocumentLoader';

export default (options: any) => {
  return (fastify: any) => {
    const documentLoader = customDocumentLoader(options);
    fastify.post(
      `/:${options.walletId}/credentials/verify`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        // schema: {
        //   tags: ['Verifier'],
        //   summary: 'verifyCredential',
        //   description: 'Verify a Verifiable Credential',
        //   response: {
        //     200: VerificationChecks,
        //   },
        // },
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );

        const wrapInVp = (credential: any) => {
          return {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiablePresentation'],
            verifiableCredential: [credential],
          };
        };

        try {
          const suiteMap = await getSuiteMap();

          const verification = await wallet.verifyPresentation({
            presentation: wrapInVp(request.body.verifiableCredential),
            options: {
              suiteMap,
              documentLoader,
            },
          });

          // console.warn(JSON.stringify(verification, null, 2));

          const res: any = {
            checks: ['proof'],
            warnings: [],
            errors: [],
          };

          if (!verification.verified) {
            res.errors.push('proof');
            reply.status(400);
          }

          reply.status(200).send(res);
        } catch (e) {
          console.error(e);
          throw e;
        }
      }
    );
    return Promise.resolve(true);
  };
};
