const { contexts } = require('./contexts');

const documentLoader = iri => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  const message = 'Unsupported iri ' + iri;
  console.error(message);
  throw new Error(message);
};

module.exports = { documentLoader };
