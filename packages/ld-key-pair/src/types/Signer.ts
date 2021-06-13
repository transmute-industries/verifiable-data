export type Signer = (
  suite?: any
) => {
  sign: ({ data }: { data: Uint8Array }) => Promise<Uint8Array>;
};
