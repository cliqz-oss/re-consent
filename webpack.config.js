const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    'background': './src/background.js',
    'content': './src/content.js',
    'content-page-bridge': './src/content-page-bridge.js',
    'popup': './src/popup.jsx',
    'clicker-content': './src/clicker-content.js',
  },
  mode,
  node: {
    global: false,
  },
  output: {
    path: path.resolve(__dirname, 'build/src'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      constants: path.resolve(__dirname, './src/constants.js'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      global: path.resolve(__dirname, './src/global.js'),
      regeneratorRuntime: 'regenerator-runtime',
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/_locales',
        to: '_locales',
      },
      {
        from: 'src/manifest.json',
        to: 'manifest.json',
      },
      {
        from: 'src/assets/icons',
        to: 'icons',
      },
    ]),
  ],
  devtool: mode !== 'production' ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 15000,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules'],
            },
          },
        ],
      },
    ],
  },
};
