const contexts = require("../contexts");

const dids = require("../dids");

const documentLoader = (iri) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }

  if (dids[iri]) {
    return { document: dids[iri] };
  }
  const message = "Unsupported " + iri;
  console.warn(message);
  throw new Error(message);
};

module.exports = documentLoader;
