const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');

module.exports = function override(config, env) {
  config = rewireCompressionPlugin(config, env, {
    test: /\.js(\?.*)?$/i,
    cache: true
  });

  return config;
};
