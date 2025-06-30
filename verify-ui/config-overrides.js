module.exports = function override(config, env) {
  config.module.exprContextCritical = false;

  config.module.rules.push({
    test: /pdfjs-dist[\/]build[\/]pdf\.js$/,
    parser: { requireEnsure: false },
  });

  return config;
};
