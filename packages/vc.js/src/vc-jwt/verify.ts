export const verify = (jws: string, verifier: any) => {
  return verifier.verify(jws);
};
