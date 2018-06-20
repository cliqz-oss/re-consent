const defaultConfig = require( '../webpack.config.js');

module.exports = {
  resolve: defaultConfig.resolve,
  module: {
    rules: defaultConfig.module.rules,
  },
};
