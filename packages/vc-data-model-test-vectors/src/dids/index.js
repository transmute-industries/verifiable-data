const did0 = require("./did-0.json");

const dids = {
  [did0.id]: did0,
  [did0.verificationMethod[0].id]: {
    ...did0.verificationMethod[0],
    "@context": did0["@context"],
  },
};

module.exports = dids;
