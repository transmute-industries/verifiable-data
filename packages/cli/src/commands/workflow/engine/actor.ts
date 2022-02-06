import { simpleTypeGenerators } from '../../data/generate/simpleTypeGenerators';
import {
  makeCredential,
  makeSignedCredential,
} from '../../data/generate/generateCredential';
import {
  makePresentation,
  makeSignedPresentationFromSeed,
} from '../../data/generate/generatePresentation';

export interface Actor {
  id: string;
  credential: {
    generate: (opts: {
      type: string;
      subject: any;
      workflow?: any;
    }) => Promise<any>;
  };
  present: (opts: {
    workflow?: any;
    credentials: any[];
    domain?: string;
    challenge?: string;
  }) => Promise<any>;
}

export interface ActorFactory {
  generate: (opts: { type: string; seed: number }) => Promise<Actor>;
}

export const actor = {
  generate: async (opts: { type: string; seed: number }) => {
    const { type, seed } = opts;
    if (simpleTypeGenerators[type]) {
      const data = await simpleTypeGenerators[type](opts);
      const issuerType = type;
      const issuerSeed = seed;
      const issuer = await simpleTypeGenerators[issuerType](
        { type: issuerType, seed: issuerSeed }, // make sure issuer generator uses issuer seed
        simpleTypeGenerators
      );
      const capabilities = {
        credential: {
          generate: async ({
            workflow,
            type,
            subject,
          }: {
            type: string;
            subject: any;
            workflow?: any;
          }) => {
            const credential = makeCredential(type, issuer, subject, workflow);
            return makeSignedCredential(credential, issuerSeed);
          },
        },
        present: async ({
          workflow,
          credentials,
          domain,
          challenge,
        }: {
          workflow?: any;
          credentials: any[];
          domain?: string;
          challenge?: string;
        }) => {
          const p = makePresentation(issuer, credentials, workflow);
          const vp = await makeSignedPresentationFromSeed(
            p,
            issuerSeed,
            domain || 'actor.examples',
            challenge || '123'
          );
          return vp;
        },
      };
      return { ...data, ...capabilities };
    }
    throw new Error('Unsupported actor type.');
  },
};
