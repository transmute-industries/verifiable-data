import * as ld from "../../vc-ld";
import * as jwt from "../../vc-jwt";

export const create = async (options: any) => {
  const result: any = {
    items: [],
  };
  if (options.format.includes("vc")) {
    result.items.push(
      await ld.createVerifiableCredential({
        credential: options.credential,
        suite: options.suite,
        documentLoader: options.documentLoader,
      })
    );
  }
  if (options.format.includes("vc-jwt")) {
    const k = await options.suite.key.useJwa({
      detached: false,
      header: {
        kid: options.suite.key.id,
      },
    });
    const signer = k.signer();
    const payload: any = await jwt.createVcPayload(options.credential, options);
    result.items.push(await signer.sign({ data: payload }));
  }
  return result;
};
