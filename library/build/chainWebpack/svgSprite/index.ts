const { resolve } = require('path')

module.exports = {
  createSvgSprite: (config) => {
    config.module.rule('svg').exclude.add(resolve('src/icon'))
    config.module
      .rule('msIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'ms-icon-[name]' })
  },
}
