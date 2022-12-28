import { concatValues } from "./concatValues";
import { sha256 } from "./sha256";
import { HashFunction } from "./types";

type GetTargetHash = {
  value: Buffer;
  salt?: Buffer;
  hash?: HashFunction;
};

export const getTargetHash = ({ value, salt, hash }: GetTargetHash): Buffer => {
  if (!hash) {
    hash = sha256;
  }
  if (salt) {
    return hash(concatValues([value, salt]));
  } else {
    return hash(value);
  }
};
