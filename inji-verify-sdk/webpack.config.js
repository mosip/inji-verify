const path = require("path");

module.exports = {
  mode: "production", // or 'development'
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
    library: "@mosip/react-inji-verify-sdk",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /__test__/],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/, // optional: only apply to imports from TS/JS files
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: "react",
    "react-dom": "ReactDOM",
  },
};
