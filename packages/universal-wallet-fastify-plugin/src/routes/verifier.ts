import { getSuiteMap } from '../getSuiteMap';
import vcSchema from '../schemas/verifiable-credential.json';
import vpSchema from '../schemas/verifiable-presentation.json';
import verificationChecksSchema from '../schemas/verification-checks.json';

export default (options: any) => {
  return (fastify: any) => {
    fastify.post(
      `/:${options.walletId}/credentials/verify`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        schema: {
          tags: ['Verifier'],
          summary: 'verifyCredential',
          description: 'Verify a Verifiable Credential',
          body: {
            title: 'Verifiable Credential Request',
            description: 'A request to verify a Verifiable Credential',
            type: 'object',
            properties: {
              verifiableCredential: vcSchema,
            },
          },
          response: {
            200: verificationChecksSchema,
          },
        },
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
              documentLoader: fastify.wallet.documentLoader,
            },
          });

          const res: any = {
            checks: ['proof'],
            warnings: [],
            errors: [],
          };

          if (!verification.verified) {
            res.errors.push('proof');
            reply.status(400).send(res);
          }

          reply.status(200).send(res);
        } catch (e) {
          console.error(e);
          if (
            e.message.startsWith('credential is not valid JSON-LD') ||
            e.message.startsWith('"issuer" id must be a URL')
          ) {
            const res: any = {
              checks: [],
              warnings: [],
              errors: [],
            };
            reply.status(400).send(res);
          }
          throw e;
        }
      }
    );

    fastify.post(
      `/:${options.walletId}/presentations/verify`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        schema: {
          tags: ['Verifier'],
          summary: 'verifyPresentation',
          description: 'Verify a Verifiable Presentation',
          body: {
            title: 'Verify Presentation Request',
            description: 'A request to verify a Verifiable Presentation',
            type: 'object',
            properties: {
              verifiablePresentation: vpSchema,
            },
            required: ['verifiablePresentation'],
          },
          response: {
            200: verificationChecksSchema,
          },
        },
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );

        try {
          const suiteMap = await getSuiteMap();

          const verification = await wallet.verifyPresentation({
            presentation: request.body.verifiablePresentation,
            options: {
              domain: request.body.options.domain,
              challenge: request.body.options.challenge,
              suiteMap,
              documentLoader: fastify.wallet.documentLoader,
            },
          });

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
