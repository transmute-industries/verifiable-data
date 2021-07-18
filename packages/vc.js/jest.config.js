module.exports = {
  // https://github.com/panva/jose/discussions/105
  // https://github.com/facebook/jest/issues/2549
  // Fixes jest bugs created by modifying globals...
  // ReferenceError: TextDecoder is not defined
  testEnvironment: "./custom-jest-node-environment.js",
};
