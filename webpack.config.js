const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.ts',
    popup: './src/popup/popup.ts',
    'content/meetingDetector': './src/content/meetingDetector.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Remove HtmlWebpackPlugin since we're copying the HTML file directly
    new CopyPlugin({
      patterns: [
        { 
          from: 'public/assets', 
          to: 'assets', 
          noErrorOnMissing: true 
        },
        { 
          from: 'manifest.json', 
          to: 'manifest.json' 
        },
        {
          from: 'src/popup/popup.css',
          to: 'popup.css'
        },
        {
          from: 'src/popup/popup.html',
          to: 'popup.html'
        }
      ],
    }),
  ],
  devtool: 'source-map',
  mode: 'development',
};

// Production configuration
if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production';
  module.exports.devtool = undefined;
}
