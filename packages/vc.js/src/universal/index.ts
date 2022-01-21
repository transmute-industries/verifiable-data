import { credential } from "./credential";
import { presentation } from "./presentation";

import { decodeJwt } from "../vc-jwt/decodeJwt";

const jwt = {
  decode: decodeJwt
};

export const verifiable = { credential, presentation, jwt };
