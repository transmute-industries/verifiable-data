import didWeb from './routes/did-web';
import issuer from './routes/issuer';
import holder from './routes/holder';
import exchange from './routes/exchange';
import verifier from './routes/verifier';
export const walletRoutes = (options: any) => {
  return (fastify: any) => {
    if (options.discovery && options.discovery.includes('did:web')) {
      fastify.register(didWeb(options));
    }
    if (options.apis && options.apis.includes('issuer')) {
      fastify.register(issuer(options));
    }
    if (options.apis && options.apis.includes('holder')) {
      fastify.register(holder(options));
      fastify.register(exchange(options));
    }
    if (options.apis && options.apis.includes('verifier')) {
      fastify.register(verifier(options));
    }
    return Promise.resolve(true);
  };
};

export default walletRoutes;
