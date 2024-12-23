/**
 * @description 所有全局配置的状态管理
 */
import { SettingsModuleType } from '/#/store'
import { isJson } from '@/utils/validate'
import {
  logo as _logo,
  title as _title,
  i18n,
  layout,
  themeName,
  background,
  columnStyle,
  fixedHeader,
  foldSidebar,
  menuWidth,
  showProgressBar,
  showTabs,
  showTabsIcon,
  showLanguage,
  showRefresh,
  showNotice,
  showFullScreen,
  showPageTransition,
  tabsBarStyle,
} from '@/config'

const defaultTheme: ThemeType = {
  layout,
  themeName,
  background,
  columnStyle,
  fixedHeader,
  foldSidebar,
  menuWidth,
  showProgressBar,
  showTabs,
  showTabsIcon,
  showLanguage,
  showRefresh,
  showNotice,
  showFullScreen,
  showPageTransition,
  tabsBarStyle,
}

const getLocalStorage = (key: string) => {
  const value: string | null = localStorage.getItem(key)
  return value && isJson(value) ? JSON.parse(value) : false
}

const theme = getLocalStorage('theme') || { ...defaultTheme }
const { collapse = foldSidebar } = getLocalStorage('collapse')
const { language = i18n } = getLocalStorage('language')
const { lock = false } = getLocalStorage('lock')
const { logo = _logo } = getLocalStorage('logo')
const { title = _title } = getLocalStorage('title')

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsModuleType => <SettingsModuleType>({
    configs: {},
    theme,
    device: 'desktop',
    collapse,
    language,
    lock,
    logo,
    title,
    cmp:'随商信息技术（上海）有限公司',
    url:'https://www.shopsuite.cn',
    echartsGraphic1: ['#3ED572', '#399efd'],
    echartsGraphic2: ['#399efd', '#8cc8ff'],
  }),
  getters: {
    getConfigs: (state) => state.configs,
    getTheme: (state) => state.theme,
    getDevice: (state) => state.device,
    getCollapse: (state) => state.collapse,
    getLanguage: (state) => state.language,
    getLock: (state) => state.lock,
    getLogo: (state) => state.logo,
    getTitle: (state) => state.title,
  },
  actions: {
    updateState(obj: any) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[key] = obj[key]
        localStorage.setItem(
          key,
          typeof obj[key] == 'string'
            ? `{"${key}":"${obj[key]}"}`
            : `{"${key}":${obj[key]}}`
        )
      })
    },
    saveTheme() {
      localStorage.setItem('theme', JSON.stringify(this.theme))
    },
    resetTheme() {
      this.theme = { ...defaultTheme }
      localStorage.removeItem('theme')
      this.updateTheme()
    },
    updateTheme() {
      let variables = require(`@sslib/styles/ms-themes.scss`)
      if (variables.default) variables = variables.default

      Object.keys(variables).forEach((key) => {
        if (key.startsWith('ms-')) {
          useCssVar(key.replace('ms-', '--el-'), ref(null)).value =
            variables[key]
        }
      })

      if (this.theme.menuWidth && this.theme.menuWidth.endsWith('px'))
        useCssVar('--el-left-menu-width', ref(null)).value =
          this.theme.menuWidth
      else useCssVar('--el-left-menu-width', ref(null)).value = '266px'

      this.echartsGraphic1 = [
        variables['ms-color-transition'],
        variables['ms-color-primary'],
      ]

      this.echartsGraphic2 = [
        variables['ms-color-primary-light-5'],
        variables['ms-color-primary'],
      ]
    },
    toggleCollapse() {
      this.collapse = !this.collapse
      localStorage.setItem('collapse', `{"collapse":${this.collapse}}`)
    },
    toggleDevice(device: string) {
      this.updateState({ device })
    },
    openSideBar() {
      this.updateState({ collapse: false })
    },
    foldSideBar() {
      this.updateState({ collapse: true })
    },
    changeLanguage(language: string) {
      this.updateState({ language })
    },
    handleLock() {
      this.updateState({ lock: true })
    },
    handleUnLock() {
      this.updateState({ lock: false })
    },
    changeLogo(logo: string) {
      this.updateState({ logo })
    },
    changeTitle(title: string) {
      this.updateState({ title })
    },
    setConfigs(configs: any) {
      this.updateState({ configs })
    },
  },
})
