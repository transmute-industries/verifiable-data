import * as ld from "../../vc-ld";
import * as jwt from "../../vc-jwt";

import { CreateCredentialOptions, CreateCredentialResult } from "../../types";
import { JsonWebKey } from "@transmute/json-web-signature";
export const create = async (
  options: CreateCredentialOptions
): Promise<CreateCredentialResult> => {
  const result: CreateCredentialResult = {
    items: []
  };

  if (!options.format) {
    options.format = ["vc"];
  }

  if (options.format.includes("vc")) {
    result.items.push(
      await ld.createVerifiableCredential({
        credential: options.credential,
        suite: options.suite,
        documentLoader: options.documentLoader
      })
    );
  }
  if (options.format.includes("vc-jwt")) {
    const suite = Array.isArray(options.suite)
      ? options.suite[0]
      : options.suite;
    const { key } = suite;
    if (!key || !key.useJwa) {
      throw new Error(
        "Cannot create credential when suite does not contain a key that supports useJwa."
      );
    }
    const k2 = await JsonWebKey.from(
      await (key as any).export({ type: "JsonWebKey2020", privateKey: true }),
      {
        detached: false,
        header: {
          kid: key.id
        }
      }
    );
    const signer = k2.signer();
    const payload: any = await jwt.createVcPayload(options.credential, options);
    result.items.push(await signer.sign({ data: payload }));
  }
  return result;
};
