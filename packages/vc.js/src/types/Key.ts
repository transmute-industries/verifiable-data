export interface Key {
  id: string;
  type: string;
  controller: string;
  signer?: () => any;
  verifier?: () => any;
  useJwa?: (options: any) => any;
}
