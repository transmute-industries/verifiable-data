const { contexts } = require("./contexts");

const documentLoader = (iri) => {
  // console.log(iri);
  if (contexts[iri]) {
    return {
      document: contexts[iri],
    };
  }

  if (iri === require("./key-ld.json").id) {
    return {
      document: {
        "@context": ["https://w3id.org/security/suites/ed25519-2018/v1"],
        ...require("./key-ld.json"),
      },
    };
  }

  if (iri === require("./key-ld.json").controller) {
    return {
      document: {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/ed25519-2018/v1",
        ],
        id: require("./key-ld.json").controller,
        verificationMethod: [require("./key-ld.json")],
        assertionMethod: [require("./key-ld.json").id],
      },
    };
  }
};

module.exports = { documentLoader };
