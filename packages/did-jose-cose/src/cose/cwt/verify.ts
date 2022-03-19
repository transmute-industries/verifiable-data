const CWT = require('cwt-js');

export const verify = async (
  token: Buffer,
  kid: string,
  documentLoader: any
) => {
  const { document } = await documentLoader(kid);

  return CWT.parse(token, {
    kid,
    x: Buffer.from(document.publicKeyJwk.x, 'base64'),
    y: Buffer.from(document.publicKeyJwk.y, 'base64'),
  });
};
