module.exports={
    "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
    "plugins": [["transform-remove-console", { "exclude": ["error", "warn"] }]]
}