const contexts = {
  'https://www.w3.org/2018/credentials/v1': require('../src/__fixtures__/contexts/cred-v1.json'),
  'https://www.w3.org/ns/activitystreams': require('../src/__fixtures__/contexts/act-v1.json'),
  'https://w3id.org/security/ed25519-signature-2020/v1': require('../src/__fixtures__/contexts//ed25519-2020-v1.json'),
  'https://w3id.org/vaccination/v1': require('../src/__fixtures__/contexts/vax-v1.json'),
};

module.exports = { contexts };
