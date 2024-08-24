// @ts-ignore
const Webpack = require('webpack')
const { buildOptimize } = require('../../../../src/config')

module.exports = {
  createMinChunkSizePlugin: () =>
    buildOptimize
      ? []
      : [
          new Webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 1024 * 300,
          }),
        ],
}
