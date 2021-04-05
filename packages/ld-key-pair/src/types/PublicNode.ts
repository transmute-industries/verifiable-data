import { KeyNode } from "./KeyNode";
/**
 * public key side of a key pair
 */
export interface PublicNode extends KeyNode {
  publicKey: any;
}
