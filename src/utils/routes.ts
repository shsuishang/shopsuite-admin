import qs from 'qs'
import { resolve } from 'path'
import { ShopSuiteRoute, ShopSuiteRouteRecord } from '/#/router'
import { hasPermission } from '@/utils/permission'
import { isExternal } from '@/utils/validate'
import { recordRoute } from '@/config'

/**
 * @description all模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes: ShopSuiteRouteRecord[]) {
  return asyncRoutes.map((route: any) => {
    if (route.component) {
      const component = route.component.match(/^@\S+|^Layout$/)
      if (component)
        component[0] === 'Layout'
          ? (route.component = () => import('@sslib/layouts/index.vue'))
          : (route.component = () =>
              import(`@/${component[0].replace(/@\/*/, '')}.vue`))
      else
        throw `后端路由加载失败，请输入'Layout'或以'@/'开头的本地组件地址: ${route.component}`
    }

    if (route.children)
      route.children.length
        ? (route.children = convertRouter(route.children))
        : delete route.children

    return route
  })
}

/**
 * @description 根据roles数组拦截路由
 * @param routes 路由
 * @param rolesControl 是否进行权限控制
 * @param baseUrl 基础路由
 * @returns {[]}
 */
export function filterRoutes(
  routes: ShopSuiteRouteRecord[],
  rolesControl: boolean,
  baseUrl = '/'
): ShopSuiteRouteRecord[] {
  return routes
    .filter((route: ShopSuiteRouteRecord) =>
      rolesControl && route.meta.guard ? hasPermission(route.meta.guard) : true
    )
    .flatMap((route: ShopSuiteRouteRecord) =>
      baseUrl !== '/' && route.children && route.meta.levelHidden
        ? [...route.children]
        : route
    )
    .map((route: ShopSuiteRouteRecord) => {
      route = { ...route }
      route.path =
        route.path !== '*' && !isExternal(route.path)
          ? resolve(baseUrl, route.path)
          : route.path
      if (route.children && route.children.length > 0) {
        route.children = filterRoutes(route.children, rolesControl, route.path)
        if (route.children.length > 0) {
          route.childrenPathList = route.children.flatMap(
            (_) => <string[]>_.childrenPathList
          )
          if (!route.redirect)
            route.redirect =
              route.children[0].redirect || route.children[0].path
        }
      } else route.childrenPathList = [route.path]
      return route
    })
}

/**
 * 根据path路径获取matched
 * @param routes 菜单routes
 * @param path 路径
 * @returns {*} matched
 */
export function handleMatched(
  routes: ShopSuiteRouteRecord[],
  path: string
): ShopSuiteRouteRecord[] {
  return routes
    .filter(
      (route: ShopSuiteRouteRecord) =>
        (route?.childrenPathList || []).indexOf(path) + 1
    )
    .flatMap((route: ShopSuiteRouteRecord) =>
      route.children ? [route, ...handleMatched(route.children, path)] : [route]
    )
}

/**
 * 生成单个多标签元素，可用于同步/异步添加多标签
 * @param tag route页信息
 */
export function handleTabs(tag: ShopSuiteRoute | ShopSuiteRouteRecord): any {
  let parentIcon = null
  if ('matched' in tag)
    for (let i = tag.matched.length - 2; i >= 0; i--)
      if (!parentIcon && tag.matched[i].meta.icon)
        parentIcon = tag.matched[i].meta.icon
  if (!parentIcon) parentIcon = 'menu-line'
  const path = handleActivePath(<ShopSuiteRoute>tag, true)
  if (tag.name && tag.meta.tabHidden !== true)
    return {
      path,
      query: 'query' in tag ? tag.query : {},
      params: 'params' in tag ? tag.params : {},
      name: tag.name as string,
      parentIcon,
      meta: { ...tag.meta },
    }
}

/**
 * 根据当前route获取激活菜单
 * @param route 当前路由
 * @param isTab 是否是标签
 * @returns {string|*}
 */
export function handleActivePath(route: ShopSuiteRoute, isTab = false) {
  const { meta, path } = route
  const rawPath = route.matched
    ? route.matched[route.matched.length - 1].path
    : path
  const fullPath =
    route.query && Object.keys(route.query).length
      ? `${route.path}?${qs.stringify(route.query)}`
      : route.path
  if (isTab) return meta.dynamicNewTab ? fullPath : rawPath
  if (meta.activeMenu) return meta.activeMenu
  return fullPath
}

/**
 * 获取当前跳转登录页的Route
 * @param currentPath 当前页面地址
 */
export function toLoginRoute(currentPath: string) {
  if (recordRoute && currentPath !== '/')
    return {
      path: '/login',
      query: { redirect: currentPath },
      replace: true,
    }
  else return { path: '/login', replace: true }
}

/**
 * 获取路由中所有的Name
 * @param routes 路由数组
 * @returns {*} Name数组
 */
export function getNames(routes: ShopSuiteRouteRecord[]): string[] {
  return routes.flatMap((route: ShopSuiteRouteRecord) => {
    const names = []
    if (route.name) names.push(route.name)
    if (route.children) names.push(...getNames(route.children))
    return names
  })
}
