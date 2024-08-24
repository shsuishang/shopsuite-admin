/**
 * @description 异常捕获的状态拦截
 */
import { ErrorLogModuleType } from '/#/store'

export const useErrorLogStore = defineStore('errorLog', {
  state: (): ErrorLogModuleType => ({
    errorLogs: [],
  }),
  getters: {
    getErrorLogs: (state) => state.errorLogs,
  },
  actions: {
    addErrorLog(errorLog: any) {
      this.errorLogs.push(errorLog)
    },
    clearErrorLog() {
      this.errorLogs.splice(0)
    },
  },
})
