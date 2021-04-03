// map of future CBOR-LD registry of known JSON-LD Contexts
export const cborldContextEncodeMap = new Map();
export const cborldContextDecodeMap = new Map();

const registry = [
  [0x10, 'https://www.w3.org/ns/activitystreams'],
  [0x11, 'https://www.w3.org/2018/credentials/v1'],
  [0x12, 'https://www.w3.org/ns/did/v1'],
  [0x13, 'https://w3id.org/security/ed25519-signature-2018/v1'],
  [0x14, 'https://w3id.org/security/ed25519-signature-2020/v1'],
  [0x15, 'https://w3id.org/cit/v1'],
  [0x16, 'https://w3id.org/age/v1'],
  [0x17, 'https://w3id.org/security/suites/x25519-2020/v1'],
];

for (const [id, url] of registry) {
  cborldContextEncodeMap.set(url, id);
  cborldContextDecodeMap.set(id, url);
}
