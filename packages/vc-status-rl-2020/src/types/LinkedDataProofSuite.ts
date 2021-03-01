export interface ILinkedDataProofSuite {
  type: string;
}

export type LinkedDataProofSuite =
  | ILinkedDataProofSuite
  | ILinkedDataProofSuite[];
