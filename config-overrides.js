const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function override(config, env) {
  config = rewireCompressionPlugin(config, env, {
    test: /\.js(\?.*)?$/i,
    cache: true
  });

  config.plugins.push(new MiniCssExtractPlugin());

  let loaders = config.module.rules[2].oneOf;
  loaders.splice(loaders.length - 1, 0, {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development',
        },
      },
      'css-loader',
      'postcss-loader',
      'sass-loader',
    ],
  });

  return config;
};
