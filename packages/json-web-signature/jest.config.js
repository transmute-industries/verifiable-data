module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // We cannot use testEnvironment: 'node' because jest breaks Buffer / byte arrays necessary for crypto operations
  // We cannot use testEnvironment: 'jsdom' because mongoose (see https://mongoosejs.com/docs/jest.html)
  // Therefore we use a custom node environment without the broken Buffer classes
  testEnvironment: './custom-jest-node-environment.js',
};
