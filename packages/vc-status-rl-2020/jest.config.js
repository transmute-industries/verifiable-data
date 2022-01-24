module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.(int.test|test).(ts)'],
  testEnvironment: './custom-jest-node-environment.js',
};
