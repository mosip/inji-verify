module.exports = {
  rootDir: ".",
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
  ],
  coverageReporters: ["Html"],
};
