const neo4j = require('neo4j-driver');

export const getDriver = (uri: string, user: string, password: string) => {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  return driver;
};
