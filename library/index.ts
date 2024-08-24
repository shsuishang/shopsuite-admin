import { App } from 'vue'

const name = process['env']['VUE' + '_'  + 'APP' + '_'+ 'DOMAIN']
const isse = name !== 'undefined'
const dev = process['env']['NODE' + '_' + 'ENV'] === 'de' + 'velop' + 'ment'

import '@/icon'
import './styles/ms.scss'
import { createHead } from '@vueuse/head'
import MsIcon from 'ms-icons'
import 'ms-icons/lib/ms-icons.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function setupMallSuite(app: App<Element>) {
  if ((isse && !dev && MsIcon) || (dev && MsIcon)) {
    app.use(createHead())

    app.component('MsIcon', MsIcon)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

    const Plugins = require.context('./plugins', true, /\.ts$/)
    Plugins.keys().forEach((key) => {
      app.use(Plugins(key).default)
    })
  }
}
