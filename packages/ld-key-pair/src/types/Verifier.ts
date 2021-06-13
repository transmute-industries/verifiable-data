export type Verifier = (
  suite?: any
) => {
  verify: ({
    data,
    signature
  }: {
    data: Uint8Array;
    signature: Uint8Array;
  }) => Promise<boolean>;
};
