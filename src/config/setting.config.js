/**
 * @description 导出通用配置
 */
module.exports = {
  // 标题
  title: 'ShopSuite',
  //开源版不允许更改 标准版及企业版可以修改
  copyright: 'Copyright 2018 随商信息技术（上海）有限公司 版权所有',
  // 路由模式，是否为hash模式
  isHashRouterMode: true,
  routesWhiteList: ['/login', '/register', '/callback', '/404', '/403'],
  // 加载时显示文字
  loadingText: '正在加载中...',
  // token名称
  tokenName: 'token',
  // token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'ukey',
  // token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  recordRoute: true,
  // 是否开启logo，不显示时设置false，请填写src/icon路径下的图标名称
  logo: 'vuejs-fill',
  // 语言类型zh、en
  i18n: 'zh',
  // 消息框消失时间
  messageDuration: 3000,
  // 在哪些环境下显示高亮错误 ['development', 'production']
  errorLog: 'development',
  // 是否开启登录拦截
  loginInterception: true,
  // 是否开启登录RSA加密
  loginRSA: true,
  rolesControl: true,
  // vertical column comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: true,
  // vertical column comprehensive common布局时默认展开的菜单path，使用逗号隔开建议只展开一个，true全部展开，false/[]不展开
  defaultOpeneds: [
    '/productBase',
    '/analytics/product',
  ],
  // 需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  // 分栏布局和综合布局时，是否点击一级菜单默认开启二级菜单(默认第一个，可通过redirect自定义)
  openFirstMenu: true,

  dateFmt: "yyyy-MM-dd",
  dateTimeFmt: "yyyy-MM-dd hh:mm:ss",
  timeFmt: "hh:mm:ss",

  maxListNum: 500,
}
