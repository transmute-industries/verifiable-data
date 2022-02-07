const dilithium = require("../util/api");
import { base64url } from "./encoding";
import { suiteTypes } from "./suites";

export class DilithiumKeyPair {
  public id: string;
  public type: string;
  public controller: string;
  public publicKeyJwk: any;
  public privateKeyJwk: any;

  static async generate() {
    const api = await dilithium.init();
    const privateKeyJwk = await api.generate();

    const { x, d, xs, ds, ...publicKeyJwk } = privateKeyJwk;
    return DilithiumKeyPair.from({
      id: "did:example:123#key-0",
      type: "JsonWebKey2020",
      controller: "did:example:123",
      publicKeyJwk: {
        ...publicKeyJwk,
        // todo: https://github.com/mesur-io/dilithium/issues/5
        // x: base64url.encode(Buffer.from(x, "base64")),
        // xs: base64url.encode(Buffer.from(xs, "base64")),
        x,
        xs,
      },
      privateKeyJwk: {
        ...publicKeyJwk,
        x,
        xs,
        d,
        ds,
        // todo: https://github.com/mesur-io/dilithium/issues/5
        // x: base64url.encode(Buffer.from(x, "base64")),
        // xs: base64url.encode(Buffer.from(xs, "base64")),
        // d: base64url.encode(Buffer.from(d, "base64")),
        // ds: base64url.encode(Buffer.from(ds, "base64")),
      },
    });
  }
  static async from(kp: any) {
    return new DilithiumKeyPair(kp);
  }
  constructor(kp: any) {
    this.id = kp.id;
    this.type = kp.type;
    this.controller = kp.controller;
    this.publicKeyJwk = kp.publicKeyJwk;
    this.privateKeyJwk = kp.privateKeyJwk;
  }

  signer(type: "CRYDI3" = "CRYDI3") {
    if (!this.privateKeyJwk) {
      throw new Error("No private key to sign with.");
    }
    if (suiteTypes[type]) {
      return suiteTypes[type].signer(this.privateKeyJwk);
    }
    throw new Error("Unsupported suite type " + type);
  }
  verifier(type: "CRYDI3" = "CRYDI3") {
    if (!this.publicKeyJwk) {
      throw new Error("No public key to verify with.");
    }
    if (suiteTypes[type]) {
      return suiteTypes[type].verifier(this.publicKeyJwk);
    }
    throw new Error("Unsupported suite type " + type);
  }
}
