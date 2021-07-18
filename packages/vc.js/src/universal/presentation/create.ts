import * as ld from "../../vc-ld";
import * as jwt from "../../vc-jwt";

export const create = async (options: any) => {
  const result: any = {
    items: [],
  };
  if (options.format.includes("vp")) {
    result.items.push(
      await ld.createVerifiablePresentation({
        presentation: options.presentation,
        suite: options.suite,
        domain: options.domain,
        challenge: options.challenge,
        documentLoader: options.documentLoader,
      })
    );
  }
  if (options.format.includes("vp-jwt")) {
    const k = await options.suite.key.useJwa({
      detached: false,
      header: {
        kid: options.suite.key.id,
      },
    });
    const signer = k.signer();
    const payload: any = await jwt.createVpPayload(
      options.presentation,
      options
    );
    result.items.push(await signer.sign({ data: payload }));
  }

  return result;
};
