const path = require("path");

module.exports = {
    entry: "./src/index.jsx",
    output: { path: path.resolve(__dirname, "dist") },
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options:{
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    }
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')
        ]
    }
};
