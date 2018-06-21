const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    plugin: './src/index-plugin.jsx',
    website: './src/index-website.jsx',
  },
  mode,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      regeneratorRuntime: 'regenerator-runtime',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['website'],
    }),
  ],
  devtool: mode !== 'production' ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
      },
      {
        test: /\.(jpg|png)$/,
        use: 'file-loader',
      },
      {
        test: path.resolve(__dirname, 'src/scss/index-plugin.scss'),
        use: [
          'style-loader',
          'css-loader?module',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules'],
            },
          },
        ],
      },
      {
        test: path.resolve(__dirname, 'src/scss/index-website.scss'),
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
