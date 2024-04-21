/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  testMatch: ["<rootDir>/src/__tests__/**/*.spec.tsx", "<rootDir>/src/__tests__/**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  }
};
