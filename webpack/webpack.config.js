const path = require('path');
const pages = require('./pages');
const loaders = require('./loaders');
const util = require('./util');

const development = !!process.env.DEV;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const I18nWebpackPlugin = require('./plugins/i18n-webpack-plugin');

const plugins = [
  new MiniCssExtractPlugin({
    filename: util.filePath('p-assets/styles/[name]', '.css'),
  }),
];

//-- Register all lands templates --//

plugins.push(...pages.mainTemp, ...pages.templates, ...pages.landswithopt);

plugins.push(new I18nWebpackPlugin({
  template: './[locale]/[name]/index.html',
  locales: path.resolve(__dirname, '../src/locales'),
}));

const config = {
  entry: {...pages.paths, ...pages.landswithoptPath , main: path.join(__dirname, '../src') },
  context: path.resolve(__dirname, '../src'),
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    filename: util.filePath('p-assets/scripts/[name]', '.js')
  },
  mode: development ? 'development' : 'production',
  resolveLoader: {
    alias: {
      'pug-html-loader': path.join(__dirname, 'loaders', 'pug-html-loader'),
    }
  },
  resolve: {
    alias: util.getAliases(),
  },
  module: {
    rules: loaders,
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 1000,
  },
  plugins,
};

if (development) {
  config.devtool = 'source-map';
}

module.exports = config;

console.log(plugins);
