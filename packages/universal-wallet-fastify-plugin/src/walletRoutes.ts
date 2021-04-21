import { FastifyInstance } from 'fastify';
import didWeb from './routes/did-web';
import issuer from './routes/issuer';
import holder from './routes/holder';
import exchange from './routes/exchange';
import verifier from './routes/verifier';
import { APIEnum, DiscoveryEnum, WalletOptions } from './types/WalletOptions';

export const walletRoutes = (options: WalletOptions) => (
  fastify: FastifyInstance
) => {
  if (options.discovery && options.discovery.includes(DiscoveryEnum.DID_WEB)) {
    fastify.register(didWeb(options));
  }
  if (options.apis && options.apis.includes(APIEnum.ISSUER)) {
    fastify.register(issuer(options));
  }
  if (options.apis && options.apis.includes(APIEnum.HOLDER)) {
    fastify.register(holder(options));
    fastify.register(exchange(options));
  }
  if (options.apis && options.apis.includes(APIEnum.VERIFIER)) {
    fastify.register(verifier(options));
  }
  return Promise.resolve(true);
};
export default walletRoutes;
