export type Signer = {
  sign: ({ data }: { data: Uint8Array }) => Promise<Uint8Array>;
};
