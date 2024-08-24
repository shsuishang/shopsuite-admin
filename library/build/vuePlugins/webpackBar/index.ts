const WebpackBar = require('webpackbar')
const { version } = require('../../../../package.json')

module.exports = {
  createWebpackBar: () => [
    new WebpackBar({
      name: `ShopSuite ${version}`,
    }),
  ],
}
