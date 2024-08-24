/**
 * @description 路由守卫
 */
import { useUserStore } from '@/store/modules/user'
import { useRoutesStore } from '@/store/modules/routes'
import { useSettingsStore } from '@/store/modules/settings'
import MsProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { toLoginRoute } from '@/utils/routes'
import {
  loginInterception,
  routesWhiteList,
} from '@/config'
import { Router } from 'vue-router'
import {getSysInfo} from "@/api/router";

export function setupPermissions(router: Router) {
  MsProgress.configure({
    easing: 'ease',
    speed: 500,
    trickleSpeed: 200,
    showSpinner: false,
  })
  router.beforeEach(async (to: { path: string }, from: any, next: any) => {
    const {
      getTheme: { showProgressBar },
    } = useSettingsStore()
    const { routes, setRoutes } = useRoutesStore()
    const { token, getUserInfo, setVirtualRoles, resetAll } = useUserStore()

    if (showProgressBar) MsProgress.start()

    let hasToken = token

    if (!loginInterception) hasToken = true

    if (hasToken) {
      if (routes.length) {
        // 禁止已登录用户返回登录页
        if (to.path === '/login') {
          next({ path: '/' })
          if (showProgressBar) MsProgress.done()
        } else next()
      } else {
        try {
          //begain 读取站点配置信息
          const { changeTitle, changeLogo, setConfigs } = useSettingsStore()
          const sys_res = await getSysInfo({})

          if (sys_res.status == 200) {
            setConfigs(sys_res.data)
            changeTitle(sys_res.data.site_name)
            changeLogo(sys_res.data.site_admin_logo)
          }
          //end 读取站点配置信息

          if (loginInterception) await getUserInfo()
          // config/setting.config.js loginInterception为false(关闭登录拦截时)时，创建虚拟角色
          else await setVirtualRoles()
          // 根据路由模式获取路由并根据权限过滤
          await setRoutes("all")
          next({ ...to, replace: true })
        } catch (err) {
          console.error('vue-shop-suite错误拦截:', err)
          await resetAll()
          next(toLoginRoute(to.path))
        }
      }
    } else {
      if (routesWhiteList.includes(to.path)) {
        next()
      } else next(toLoginRoute(to.path))
    }
  })
  router.afterEach((to: any) => {
    document.title = getPageTitle(to.meta.title)
    if (MsProgress.status) MsProgress.done()
  })
}
