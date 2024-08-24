/**
 * @description 导出vue/cli配置，以下所有配置修改需要重启项目
 */
module.exports = {
  publicPath: '',
  // 生产环境构建文件的目录名
  outputDir: 'admin',
  // 放置生成的静态资源目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 进行编译的依赖
  transpileDependencies: [],
  // 开发环境端口号
  devPort: 16000,
  // 需要自动注入并加载的模块
  providePlugin: {},
  // pwa
  pwa: true,
  // 打包优化
  buildOptimize: false,
}
