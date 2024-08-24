import { App } from 'vue'
import pinia from '@/store'
import { useErrorLogStore } from '@/store/modules/errorLog'
import { errorLog } from '@/config'
import { isArray, isString } from '@/utils/validate'

export const needErrorLog = () => {
  const errorLogArray = isArray(errorLog)
    ? [...errorLog]
    : isString(errorLog)
    ? [...[errorLog]]
    : []
  return errorLogArray.includes(process.env.NODE_ENV as string)
}

export const addErrorLog = (err: any) => {
  // eslint-disable-next-line no-console
  if (!err.isRequest) console.error('ShopSuite错误:', err)
  const url = window.location.href
  const { addErrorLog } = useErrorLogStore(pinia)
  addErrorLog({ err, url })
}

export default {
  install(app: App<Element>) {
    if (needErrorLog()) {
      app.config.errorHandler = addErrorLog
    }
  },
}
