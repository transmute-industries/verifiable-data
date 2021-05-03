import { getSuiteForKey } from '../getSuiteForKey';

import {
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';

export default (options: any) => {
  return (fastify: any) => {
    fastify.post(
      `/:${options.walletId}/presentations/prove`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        // schema: {
        //   tags: ['Holder'],
        //   summary: 'provePresentation',
        //   description: 'Prove a Verifiable Presentation',
        //   response: {
        //     201: VerifiablePresentation,
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
        const suite = await getSuiteForKey(k);
        const vp = await wallet.createVerifiablePresentation({
          verifiableCredential: request.body.presentation.verifiableCredential,
          options: {
            holder: request.body.presentation.holder,
            domain: request.body.options.domain,
            challenge: request.body.options.challenge,
            suite,
            documentLoader: fastify.wallet.documentLoader,
          },
        });

        reply.status(201).send(vp);
      }
    );

    fastify.post(
      `/:${options.walletId}/credentials/derive`,
      {
        preValidation: options.hooks ? options.hooks.preValidation : [],
        // schema: {
        //   tags: ['Holder'],
        //   summary: 'deriveCredential',
        //   description: 'Derive a Verifiable Credential',
        //   response: {
        //     201: VerifiableCredential,
        //   },
        // },
      },
      async (request: any, reply: any) => {
        const wallet = await fastify.wallet.get(
          request.params[options.walletId]
        );
        let deriveProofSuiteMap: any = {
          BbsBlsSignature2020: new BbsBlsSignatureProof2020(),
        };
        const suite =
          deriveProofSuiteMap[request.body.verifiableCredential.proof.type];
        const vc = await wallet.deriveCredential({
          verifiableCredential: request.body.verifiableCredential,
          frame: request.body.frame,
          options: {
            suite,
            deriveProof,
            documentLoader: fastify.wallet.documentLoader,
          },
        });
        reply.status(201).send(vc);
      }
    );
    return Promise.resolve(true);
  };
};
