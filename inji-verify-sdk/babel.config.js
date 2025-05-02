module.exports = {
  presets: [
    // Target modern browsers, not just Node.js
    ["@babel/preset-env", {
      targets: "> 0.25%, not dead",
      modules: false, // let Webpack handle ES modules
    }],
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }] // enables new JSX transform
  ]
};
