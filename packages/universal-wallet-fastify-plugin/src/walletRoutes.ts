import didWeb from './routes/did-web';
import issuer from './routes/issuer';
import holder from './routes/holder';
import verifier from './routes/verifier';
export default (options: any) => {
  return (fastify: any) => {
    if (options.discovery && options.discovery.includes('did:web')) {
      fastify.register(didWeb(options));
    }
    if (options.apis && options.apis.includes('issuer')) {
      fastify.register(issuer(options));
    }
    if (options.apis && options.apis.includes('holder')) {
      fastify.register(holder(options));
    }
    if (options.apis && options.apis.includes('verifier')) {
      fastify.register(verifier(options));
    }
    return Promise.resolve(true);
  };
};
