import { jose, CompactCwt, DocumentLoader } from '@transmute/did-jose-cose';
import {
  handleCommandResponse,
  getPayloadFromFile,
  documentLoader,
} from '../../util';

export const verify = (
  jwt: CompactCwt,
  kid: string,
  documentLoader: DocumentLoader
) => {
  return jose.jwt.verify(jwt, kid, documentLoader);
};

export const verifyJwt = async (argv: any) => {
  let data: any = {};
  if (argv.debug) {
    console.log(argv);
  }
  let payload = getPayloadFromFile(argv.input);
  const jwt = payload.jwt;
  data.verification = await verify(jwt, argv.kid, documentLoader);
  handleCommandResponse(argv, data, argv.output);
};
