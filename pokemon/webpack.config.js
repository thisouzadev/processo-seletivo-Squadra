const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  // outras configurações do Webpack...
  resolve: {
    fallback: {
      path: false,
      process: false,
      buffer: false,
      os: false,
      crypto: false
      // Outros módulos que você deseja desativar
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    // outros plugins...
  ],
};
