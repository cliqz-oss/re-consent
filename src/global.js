if (typeof window === 'object') {
  module.exports = window;
} else {
  module.exports = this;
}
