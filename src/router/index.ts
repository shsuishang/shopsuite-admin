/**
 * @description router全局配置
 */
import type { RouteRecordName, RouteRecordRaw } from 'vue-router'
import type { ShopSuiteRouteRecord } from '/#/router'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import { setupPermissions } from './permissions'
import { isHashRouterMode, publicPath } from '@/config'

export const constantRoutes: ShopSuiteRouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('@/views/callback/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      hidden: true,
    },
  },
]

export const asyncRoutes: ShopSuiteRouteRecord[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history: isHashRouterMode
    ? createWebHashHistory(publicPath)
    : createWebHistory(publicPath),
  routes: constantRoutes as RouteRecordRaw[],
})

function fatteningRoutes(routes: ShopSuiteRouteRecord[]): ShopSuiteRouteRecord[] {
  return routes.flatMap((route: ShopSuiteRouteRecord) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

function addRouter(routes: ShopSuiteRouteRecord[]) {
  routes.forEach((route: ShopSuiteRouteRecord) => {
    if (!router.hasRoute(route.name)) router.addRoute(route as RouteRecordRaw)
    if (route.children) addRouter(route.children)
  })
}

export function resetRouter(routes: ShopSuiteRouteRecord[] = constantRoutes) {
  routes.map((route: ShopSuiteRouteRecord) => {
    if (route.children) route.children = fatteningRoutes(route.children)
  })
  router.getRoutes().forEach(({ name }) => {
    router.hasRoute(<RouteRecordName>name) &&
      router.removeRoute(<RouteRecordName>name)
  })
  addRouter(routes)
}

export function setupRouter(app: any) {
  setupPermissions(router)
  app.use(router)
  return router
}

export default router
