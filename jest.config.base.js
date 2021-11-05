module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>"],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig-tests.json'
    },
  },
};
