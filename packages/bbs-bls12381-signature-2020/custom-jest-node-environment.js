const NodeEnvironment = require("jest-environment-node");

const { TextEncoder, TextDecoder } = require("util");

class MyEnvironment extends NodeEnvironment {
  constructor(config) {
    super(
      Object.assign({}, config, {
        globals: Object.assign({}, config.globals, {
          Uint32Array: Uint32Array,
          Uint8Array: Uint8Array,
          ArrayBuffer: ArrayBuffer,
          TextEncoder: TextEncoder,
          TextDecoder: TextDecoder,
        }),
      })
    );
  }

  async setup() {}

  async teardown() {}
}

module.exports = MyEnvironment;
