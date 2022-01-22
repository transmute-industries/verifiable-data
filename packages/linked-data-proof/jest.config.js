module.exports = {
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
  testEnvironment: "./custom-jest-node-environment.js",
};
