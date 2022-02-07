const dilithium = require("./dilithium.js");

const CRYPTO_BYTES = 2420;
const CRYPTO_BYTES_B64 = 3229;
const CRYPTO_PUBLICKEYBYTES_B64 = 1753;
const CRYPTO_SECRETKEYBYTES_B64 = 3373;
const KEYPAIR_BYTES_B64 =
  CRYPTO_SECRETKEYBYTES_B64 +
  CRYPTO_PUBLICKEYBYTES_B64 +
  CRYPTO_BYTES_B64 * 2 +
  64;

class DilithiumApi {
  toUint8Array(str) {
    var result = [];
    for (var i = 0; i < str.length; i += 2) {
      result.push(parseInt(str.substring(i, i + 2), 16));
    }
    return result;
  }
  toCString(str, nBytes = 1, heap = this.instance.HEAPU8) {
    const encoder = new TextEncoder();
    str = encoder.encode(str);
    var ptr = this.instance._malloc(str.length * nBytes);
    heap.set(str, ptr / nBytes);
    return ptr;
  }
  getCString(
    strPtr,
    size = 1024,
    nullTerm = false,
    heap = this.instance.HEAPU8
  ) {
    var output_array = new Uint8Array(heap.buffer, strPtr, size);
    var endIdx = size;
    if (nullTerm) {
      endIdx = output_array.indexOf(0); // assumes null termination
    }
    output_array = output_array.slice(0, endIdx);
    var stringValue = new TextDecoder().decode(output_array);
    return stringValue; //.trim();
  }

  async init() {
    const instance = await dilithium();
    this.instance = instance;
    return this;
  }

  async version() {
    return this.instance._dilithiumVersion();
  }

  async generate() {
    const keyPtr = this.instance._dilithiumGenerate();
    const keyPair = this.getCString(keyPtr, KEYPAIR_BYTES_B64 * 2, true);
    return JSON.parse(keyPair);
  }

  async sign(message, privateKeyJwk) {
    const m = this.toCString(message);
    const sigPtr = this.instance._dilithiumSign(
      m,
      this.toCString(privateKeyJwk.d)
    );
    const sig = this.getCString(sigPtr, CRYPTO_BYTES_B64 * 2, true);
    return sig;
  }

  async verify(message, signature, publicKeyJwk) {
    const m = this.toCString(message);
    const s = this.toCString(signature);
    const sk = this.toCString(publicKeyJwk.x);
    const verified = this.instance._dilithiumVerify(s, m, sk) === 0;
    return verified;
  }
}

module.exports = new DilithiumApi();
