export const decodeJwt = (jwt: string) => {
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split(".");
  const [header, payload] = [encodedHeader, encodedPayload].map(
    (item: string) => {
      return JSON.parse(Buffer.from(item, "base64").toString());
    }
  );
  return {
    header,
    payload,
    signature: encodedSignature
  };
};
