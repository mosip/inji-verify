const path = require("path");

module.exports = {
    // ... other Jest config options

    // Test environment (set to jsdom for React Testing Library)
    testEnvironment: 'jest-environment-jsdom',

    // Setup files (add RTL setup file)
    setupFilesAfterEnv: [path.resolve(__dirname, 'setupTests.js')], // Replace with your setup file path

    // Configure module file extensions for Jest to understand JSX
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

    // Transform files with Babel (assuming you're using Babel)
    transform: {
        '^.+\\.(js|jsx)$': path.resolve(__dirname, 'node_modules/babel-jest'),
    },

    // Additional transformer for stylesheets if needed (adjust based on your setup)
    // transformIgnorePatterns: [
    //   '/node_modules/(?!(react-icons|antd|.*\\.less$))/'
    // ]
};
