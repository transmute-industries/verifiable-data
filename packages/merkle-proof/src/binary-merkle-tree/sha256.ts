import crypto from "crypto";

export const sha256 = (data: Buffer) => {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest();
};
