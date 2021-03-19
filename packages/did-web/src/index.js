const didToUrl = (did) => {
  const regex = new RegExp(
    `did:web:(?<origin>[a-zA-Z0-9/.\\-_]+)(?<path>[a-zA-Z0-9/.:\\-_]*)`
  );
  const match = did.match(regex);
  if (match.groups.path) {
    return `https://${match.groups.origin}${match.groups.path.replace(
      /:/g,
      "/"
    )}/did.json`;
  }
  return `https://${match.groups.origin}/.well-known/did.json`;
};

module.exports = { didToUrl };
