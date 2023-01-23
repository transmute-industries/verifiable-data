import { ProofPurpose } from "./ProofPurpose";
import { IPurposeValidateOptions } from "../types";
import jsonld from "@transmute/jsonld";

export class ControllerProofPurpose extends ProofPurpose {
  public controller: any;
  constructor({ term, date, maxTimestampDelta = Infinity }: any = {}) {
    super({ term, date, maxTimestampDelta });
  }

  async validate(proof: any, _options: IPurposeValidateOptions) {
    try {
      const result: any = await super.validate(proof, _options);
      if (!result.valid) {
        throw result.error;
      }

      const { verificationMethod, documentLoader } = _options;
      const { id: verificationId } = verificationMethod;

      const { controller } = verificationMethod;
      const { id: controllerId } = controller;

      const { document } = await documentLoader(controllerId);
      result.controller = document;
      const verificationMethods = jsonld.getValues(
        result.controller,
        this.term
      );

      result.valid = verificationMethods.some(
        (vm: any) =>
          vm === verificationId ||
          vm === "#" + verificationId.split("#").pop() ||
          (typeof vm === "object" && vm.id === verificationId)
      );

      if (!result.valid) {
        throw new Error(
          `Verification method "${verificationMethod.id}" not authorized ` +
            `by controller for proof purpose "${this.term}".`
        );
      }
      return result;
    } catch (error) {
      return { valid: false, error };
    }
  }
}
