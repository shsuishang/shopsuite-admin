/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @description vue.config.js全局配置
 */

const {
  baseURL,
  title,
  devPort,
  assetsDir,
  outputDir,
  lintOnSave,
  publicPath,
  transpileDependencies,
} = require('./src/config')
const dayjs = require('dayjs')
const pkg = require('./package.json')

const { resolve, relative } = require('path')
const { defineConfig } = require('@vue/cli-service')
const {
  createVuePlugin,
  createChainWebpack,
} = require('./library/build/index.ts')

const pc = require('picocolors')

const info = {
  ...pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = pkg.author
process.env.VUE_APP_INFO = JSON.stringify(info)
process.env.VUE_APP_UPDATE_TIME = info.lastBuildTime
process.env.VUE_APP_RANDOM = `${info.lastBuildTime}-${process.env.VUE_APP_DOMAIN}`

module.exports = defineConfig({
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    compress: true,
    client: {
      progress: false,
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    hot: true,
    open: {
      target: [`http://localhost:${devPort}`],
    },
    port: devPort,
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      name: 'ShopSuite - Admin',
      short_name: 'ShopSuite',
      background_color: '#ffffff',
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '~': resolve(__dirname, '.'),
          '@': resolve(__dirname, 'src'),
          '/#': resolve(__dirname, 'types'),
          '@sslib': resolve(__dirname, 'library'),
          '@gp': resolve('library/plugins/ms'),
        },
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
        },
      },
      plugins: createVuePlugin(),
      performance: {
        hints: false,
      },
    }
  },
  chainWebpack(config) {
    createChainWebpack(process.env.NODE_ENV, config)
  },
  runtimeCompiler: false,
  productionSourceMap: false,
  css: {
    sourceMap: false,
    extract:false,
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' },
        additionalData(content, { rootContext, resourcePath }) {
          const relativePath = relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !==
            'library/styles/variables.scss'
          )
            return `@use "~@sslib/styles/variables.scss" as *;${content}`
          return content
        },
      },
    },
  },
})
