export const getDriver = () => {
  const neo4j = require('neo4j-driver');
  const uri = 'neo4j://localhost';
  const user = 'neo4j';
  const password = 'test';
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  return driver;
};
