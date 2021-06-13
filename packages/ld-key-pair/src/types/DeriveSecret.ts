export type DeriveSecret = ({
  publicKey
}: {
  publicKey: any;
}) => Promise<Uint8Array>;
