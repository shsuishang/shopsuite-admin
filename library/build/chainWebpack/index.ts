const { createBanner } = require('./banner/index.ts')
const { createSvgSprite } = require('./svgSprite/index.ts')
const { createOptimization } = require('./optimization/index.ts')
const { createSourceInjector } = require('./sourceInjector/index.ts')

module.exports = {
  createChainWebpack: (env, config) => {
    config.resolve.symlinks(true)
    createBanner(config)
    createSvgSprite(config)
    if (env === 'production') {
      createOptimization(config)
    }

    if (env === 'development') config.devtool('cheap-module-source-map')
    createSourceInjector(config)
  },
}
