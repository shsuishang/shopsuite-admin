import { App } from 'vue'
import pinia from '@/store'
import { useSettingsStore } from '@/store/modules/settings'

export default {
  install(app: App<Element>) {
    if (process.env.NODE_ENV !== 'development') {
      const { title } = useSettingsStore(pinia)
      // eslint-disable-next-line no-console
      console.log(
        ` %c ${title}  %c 基于ShopSuite ${__APP_INFO__['version']} 构建 `,
        'color: #fadfa3; background: #030307; padding:5px 0;',
        'background: #fadfa3; padding:5px 0;'
      )
    }
    if (process.env.NODE_ENV !== 'development') {
      const str = '\u006d\u0073\u002d\u0069\u0063\u006f\u006e\u0073'
      const key = decodeURI(str.replace(/\\u/g, '%u'))
      if (!__APP_INFO__['dependencies'][key]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        app.config.globalProperties = null
      }
    }
  },
}
