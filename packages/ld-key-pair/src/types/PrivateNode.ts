import { KeyNode } from "./KeyNode";
/**
 * private key side of a key pair
 */
export interface PrivateNode extends KeyNode {
  privateKey: any;
}
