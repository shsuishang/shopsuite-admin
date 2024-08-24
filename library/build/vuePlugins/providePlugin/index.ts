// @ts-ignore
const Webpack = require('webpack')
const { WebpackChain } = require('webpack-ld')
const { providePlugin } = require('../../../../src/config')

module.exports = {
  createProvidePlugin: () => [WebpackChain(providePlugin)],
}
