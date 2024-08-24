// @ts-ignore
const Webpack = require('webpack')

module.exports = {
  createDefinePlugin: () => [
    new Webpack.DefinePlugin({
      __APP_INFO__: process.env.VUE_APP_INFO,
    }),
  ],
}
