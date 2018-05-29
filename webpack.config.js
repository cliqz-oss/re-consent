const path = require("path");

module.exports = {
    devtool: "source-map",
    entry: {
        background: "./src/background.js",
        popup: "./src/popup.js",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { presets: ['env'] }
        }
      ]
    },
  resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    }
};