import { createApp } from 'vue'
import App from './App.vue'
import { setupMallSuite } from '~/library'
import { setupI18n } from '@/i18n'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import { setupEventBus } from '@/utils/eventBus'

import { pwa } from './config'

const app = createApp(App)


/**
 * @description 生产环境启用组件初始化，编译，渲染和补丁性能跟踪。仅在开发模式和支持 Performance.mark API的浏览器中工作。
 */
//if (process.env.NODE_ENV === 'development') app.config.performance = true

if (pwa) require('./registerServiceWorker')

setupMallSuite(app)
setupI18n(app)
setupStore(app)
setupEventBus(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))
