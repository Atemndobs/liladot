const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: ['**/node_modules'],
    aggregateTimeout: 300,
    poll: 1000,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false, // Don't remove manifest.json
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.', noErrorOnMissing: true },
        { from: 'src/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
});
