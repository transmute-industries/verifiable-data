import base64url from "base64url";

import {concatValues} from './concatValues';
import { sha256 } from "./sha256";

export const getEncodedLeaf = (member: string, salt: string): string => {
  return base64url.encode(sha256(concatValues([base64url.toBuffer(member), base64url.toBuffer(salt)])))
};