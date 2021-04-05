import { KeyPair } from "./KeyPair";
import { KeyPairDouble } from "./KeyPairDouble";
/**
 * allows for the general grouping of a list of key pairs that are
 * related in some fashion
 */
export interface KeyPairs {
  id: string;
  type: any;
  controller?: any;
  pairs: KeyPair[];

  /**
   * should call generate for each key pair based on type and len of pairs[]
   * @param options
   */
  generate(options: any): KeyPairDouble;
  export(options: { exportPrivate: boolean; encoding?: string }): any;
}
