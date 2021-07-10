import { ProofPurpose } from "./ProofPurpose";
import { IPurposeValidateOptions } from "../types";

const jsonld = require("jsonld");

export class ControllerProofPurpose extends ProofPurpose {
  public controller: any;
  constructor({
    term,
    controller,
    date,
    maxTimestampDelta = Infinity,
  }: any = {}) {
    super({ term, date, maxTimestampDelta });
    if (controller !== undefined) {
      if (typeof controller !== "object") {
        throw new TypeError('"controller" must be an object.');
      }
      this.controller = controller;
    }
  }

  async validate(proof: any, _options: IPurposeValidateOptions) {
    try {
      const result: any = await super.validate(proof, _options);
      if (!result.valid) {
        throw result.error;
      }

      const { verificationMethod, documentLoader } = _options;

      const { id: verificationId } = verificationMethod;

      // if no `controller` specified, use verification method's
      if (this.controller) {
        result.controller = this.controller;
      } else {
        // support legacy `owner` property
        const { controller, owner } = verificationMethod;
        let controllerId;
        if (controller) {
          if (typeof controller === "object") {
            controllerId = controller.id;
          } else if (typeof controller !== "string") {
            throw new TypeError(
              '"controller" must be a string representing a URL.'
            );
          } else {
            controllerId = controller;
          }
        } else if (owner) {
          if (typeof owner === "object") {
            controllerId = owner.id;
          } else if (typeof owner !== "string") {
            throw new TypeError('"owner" must be a string representing a URL.');
          } else {
            controllerId = owner;
          }
        }

        const { document } = await documentLoader(controllerId);
        result.controller = document;
      }
      const verificationMethods = jsonld.getValues(
        result.controller,
        this.term
      );
      result.valid = verificationMethods.some(
        (vm: any) =>
          vm === verificationId ||
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
