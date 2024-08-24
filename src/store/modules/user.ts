/**
 * @description 用户
 */
import { useAclStore } from './acl'
import { useTabsStore } from './tabs'
import { useRoutesStore } from './routes'
import { useSettingsStore } from './settings'
import { UserModuleType } from '/#/store'
import { login, logout, socialLogin } from '@/api/login'
import { getUserInfo } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/token'
import { resetRouter } from '@/router'
import { isArray, isString } from '@/utils/validate'
import { tokenName } from '@/config'
import { gp } from '@gp'


export const useUserStore = defineStore('user', {
  state: (): UserModuleType => ({
    token: getToken() as string,
    username: '游客',
    avatar: 'https://www.suteshop.cn/uploads/static/icon-s-default.png',
    roleId: 0,
    siteId: 0,
  }),
  getters: {
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getRoleId: (state) => state.roleId,
    getSiteId: (state) => state.siteId,
  },
  actions: {
    /**
     * @description 设置token
     * @param {*} token
     */
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    /**
     * @description 设置用户名
     * @param {*} username
     */
    setUsername(username: string) {
      this.username = username
    },
    /**
     * @description 设置头像
     * @param {*} avatar
     */
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    /**
     * @description 设置角色
     * @param {*} roleId
     */
    setRoleId(roleId: string) {
      this.roleId = roleId
    },

    /**
     * @description 设置分站
     * @param {*} siteId
     */
    setSiteId(siteId: string) {
      this.siteId = siteId
    },

    /**
     * @description 登录拦截放行时，设置虚拟角色
     */
    setVirtualRoles() {
      const aclStore = useAclStore()
      aclStore.setFull(true)
      this.setUsername('admin(未开启登录拦截)')
      this.setAvatar('https://www.suteshop.cn/uploads/static/icon-s-default.png')
    },
    /**
     * @description 设置token并发送提醒
     * @param {string} token 更新令牌
     * @param {string} tokenName 令牌名称
     */
    afterLogin(token: string, tokenName: string) {
      const settingsStore = useSettingsStore()
      if (token) {
        this.setToken(token)
        const hour = new Date().getHours()
        const thisTime =
          hour < 8
            ? '早上好'
            : hour <= 11
            ? '上午好'
            : hour <= 13
            ? '中午好'
            : hour < 18
            ? '下午好'
            : '晚上好'
        gp.$notify(`欢迎登录${settingsStore.title}`, `${thisTime}！`)
      } else {
        const err = `登录接口异常，未正确返回${tokenName}...`
        gp.$message(err, 'error', 'ms-hey-message-error')
        throw err
      }
    },
    /**
     * @description 登录
     * @param {*} userInfo
     */
    async login(userInfo: any) {
      userInfo["user_account"] = userInfo.username;

      const {
        data: { [tokenName]: token },
      } = await login(userInfo)

      this.afterLogin(token, tokenName)
    },
    /**
     * @description 第三方登录
     * @param {*} tokenData
     */
    async socialLogin(tokenData: any) {
      const {
        data: { [tokenName]: token },
      } = await socialLogin(tokenData)
      this.afterLogin(token, tokenName)
    },
    /**
     * @description 获取用户信息接口
     * @returns
     */
    async getUserInfo() {
      const { data } = await getUserInfo()
      const { user_nickname, user_avatar, rid, site_id, roles, permissions} = data

      //todo 设置风格颜色

      /**
       * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
       * username {String}
       * avatar {String}
       * roles {List}
       * ability {List}
       */
      if (
        (user_nickname && !isString(user_nickname)) ||
        (user_avatar && !isString(user_avatar)) ||
        (roles && !isArray(roles)) ||
        (permissions && !isArray(permissions))
      ) {
        const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确'
        gp.$message(err, 'error', 'ms-hey-message-error')
        throw err
      } else {
        const aclStore = useAclStore()
        // 如不使用username用户名,可删除以下代码
        if (user_nickname) this.setUsername(user_nickname)
        // 如不使用avatar头像,可删除以下代码
        if (user_avatar) this.setAvatar(user_avatar)
        if (rid) this.setRoleId(rid)
        if (site_id) this.setSiteId(site_id)

        // 如不使用roles权限控制,可删除以下代码
        if (roles) aclStore.setRole(roles)
        // 如不使用permissions权限控制,可删除以下代码
        if (permissions) aclStore.setPermission(permissions)
      }

      //初始化IM
      if (typeof initIm == "function") {
        initIm()
      }
    },
    /**
     * @description 退出登录
     */
    async logout() {
      await logout()
      await this.resetAll()
      // 解决横向布局退出登录显示不全的bug
      location.reload()
    },
    /**
     * @description 重置token、roles、permission、router、tabsBar等
     */
    async resetAll() {
      this.setToken('')
      this.setUsername('游客')
      this.setAvatar('https://www.suteshop.cn/uploads/static/icon-s-default.png')

      const aclStore = useAclStore()
      const routesStore = useRoutesStore()
      const tabsStore = useTabsStore()
      aclStore.setPermission([])
      aclStore.setFull(false)
      aclStore.setRole([])
      tabsStore.delAllVisitedRoutes()
      routesStore.clearRoutes()
      await resetRouter()
      removeToken()
    },
  },
})
