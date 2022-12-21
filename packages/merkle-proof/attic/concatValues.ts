export const concatValues = (values: Buffer[]): Buffer => {
  return values.slice(1).reduce((pv: any, cv: any) => {
    return Buffer.concat([pv, cv]);
  }, values[0]);
};