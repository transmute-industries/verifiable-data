module.exports = {
  // https://github.com/panva/jose/discussions/105
  // https://github.com/facebook/jest/issues/2549
  // Fixes jest bugs created by modifying globals...
  // ReferenceError: TextDecoder is not defined
  testEnvironment: "./custom-jest-node-environment.js",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "./node_modules/ts-jest",
  },
  testMatch: ["**/*.(int.test|test).(ts)"],
  moduleNameMapper: {
    "^jose/(.*)$": "<rootDir>/node_modules/jose/dist/node/cjs/$1",
  },
};
