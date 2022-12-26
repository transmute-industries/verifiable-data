import crypto from "crypto";
import { sha256 } from "./sha256";
import { concatValues } from "./concatValues";

type SaltOptions = {
  seed: Buffer;
  index: number;
};
export const generateSalt = (options?: SaltOptions) => {
  if (options) {
    const { seed, index } = options;
    return sha256(concatValues([seed, Buffer.from(`${index}`)]));
  } else {
    return crypto.randomBytes(32);
  }
};
