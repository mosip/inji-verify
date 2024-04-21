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
    "\\.svg$": "<rootDir>/__mocks__/svgFileTransformer.js",
    '.+\\.(png|jpg|jpeg)$': "<rootDir>/__mocks__/svgFileTransformer.js"
  },
  moduleNameMapper: {
    "@mosip/pixelpass": "<rootDir>/__mocks__/@mosip/pixelpass/src/index.js"
  }
};
