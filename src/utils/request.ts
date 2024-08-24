import { useUserStore } from '@/store/modules/user'
import {
  baseURL,
  debounce,
  httpCode,
} from '@/config'
import qs from 'qs'
import router from '@/router'
//import { isArray } from '@/utils/validate'
import { addErrorLog, needErrorLog } from '@sslib/plugins/errorLog'
import { refreshToken } from '@/api/refreshToken'
import { gp } from '@gp'

let loadingInstance: any

let refreshToking = false

let requests: (() => void)[] = []

/**
 * axios请求拦截器配置
 * @param config
 * @returns {any}
 */
const requestConf: any = (config: any) => {
  const userStore = useUserStore()
  const { token } = userStore

  // 规范写法 不可随意自定义
  if (token) config.headers['Authorization'] = `Bearer ${token}`

  if (
    config.data &&
    config.headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8'
  )
    config.data = qs.stringify(config.data)
  if (debounce.some((item) => config.url.includes(item)))
    loadingInstance = gp.$loading()
  return config
}

/**
 * 刷新刷新令牌
 * @param config 过期请求配置
 * @returns {any} 返回结果
 */
const tryRefreshToken = async (config: any) => {
  if (!refreshToking) {
    refreshToking = true
    try {
      const {
        data: { token },
      }: any = await refreshToken()
      if (token) {
        const { setToken } = useUserStore()
        setToken(token)
        // 已经刷新了token，将所有队列中的请求进行重试
        requests.forEach((cb: any) => cb(token))
        requests = []
        return instance(requestConf(config))
      }
    } catch (error) {
      console.error('refreshToken error =>', error)
      router.push({ path: '/login', replace: true }).then(() => {})
    } finally {
      refreshToking = false
    }
  } else {
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push(() => {
        resolve(instance(requestConf(config)))
      })
    })
  }
}

/**
 * axios响应拦截器
 * @param config 请求配置
 * @param data response数据
 * @param status HTTP status
 * @param statusText HTTP status text
 * @returns {Promise<*|*>}
 */
const handleData = async ({ config, data, status, statusText }: any) => {
  const { resetAll } = useUserStore()
  if (loadingInstance) loadingInstance.close()

  const code = data && data["code"] ? data["code"] : -1
  const statusRes = data && data['status'] ? data['status'] : status


  if (data && data["data"]==null) {
    data["data"] = []
  }

  if (typeof (data["data"].items) != "undefined") {
    if (data["data"].items == null) {
      data["data"].items = []
    }
  }

  switch (statusRes) {
    case 200:
      // 例如响应内容：
      // 错误内容：{ code: 1, status:250, msg: '非法参数' }
      // 正确内容：{ code: 200, status:200, data: {  }, msg: '操作正常' }
      return data
    case 250:
      switch (code) {
        case httpCode.StatusUnauthorized:
          router.push({ path: '/login', replace: true }).then(() => {
            resetAll().then(() => {})
          })
          break
        case httpCode.StatusPaymentRequired:
          return await tryRefreshToken(config)
        case httpCode.StatusForbidden:
          router.push({ path: '/403' }).then(() => {})
          break
        case httpCode.CODE_BUSINESS_VALIDATION_FAILED:
          break
        default:
          return  data
      }
  }
  // 异常处理
  const codeMap: any = {
    200: '服务器成功返回请求数据',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队(异步任务)',
    204: '删除数据成功',
    400: '发出信息有误',
    401: '用户没有权限(令牌失效、用户名、密码错误、登录过期)',
    402: '令牌过期',
    403: '用户得到授权，但是访问是被禁止的',
    404: '访问资源不存在',
    406: '请求格式不可得',
    410: '请求资源被永久删除，且不会被看到',
    500: '服务器发生错误',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
  }
  const errMsg = `${
    data && data['msg']
      ? data['msg']
      : codeMap[code]
      ? codeMap[code]
      : statusText
  }`
  // 是否显示高亮错误(与errorHandler钩子触发逻辑一致)
  gp.$message(errMsg, 'error', 'ms-hey-message-error', false)
  if (needErrorLog())
    addErrorLog({ message: errMsg, stack: data, isRequest: true })
  return Promise.reject(data)
}

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL,
  timeout: 10000, //最长请求时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  },
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(requestConf, (error) => {
  return Promise.reject(error)
})

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error
    if (response === undefined) {
      if (loadingInstance) loadingInstance.close()
      gp.$message(
        '连接后台接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题 ',
        'error',
        'ms-hey-message-error',
        false
      )
      return {}
    } else return handleData(response)
  }
)

export default instance
