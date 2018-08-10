const defaultConfig = require( '../webpack.config.js');

module.exports = {
  resolve: defaultConfig.resolve,
  plugins: defaultConfig.plugins,
  module: {
    rules: defaultConfig.module.rules,
  },
};
