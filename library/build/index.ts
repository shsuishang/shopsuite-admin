const { createVuePlugin } = require('./vuePlugins/index.ts')
const { createChainWebpack } = require('./chainWebpack/index.ts')

module.exports = {
  createVuePlugin,
  createChainWebpack,
}
