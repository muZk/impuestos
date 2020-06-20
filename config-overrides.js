const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function override(config, env) {
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
      'sass-loader',
    ],
  });

  return config;
};
