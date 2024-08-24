import { ShopSuiteRouteMeta, ShopSuiteRouteRecord } from '/#/router'

declare interface AclModuleType {
  admin: boolean
  role: string[]
  permission: string[]
}

declare interface ErrorLogModuleType {
  errorLogs: any[]
}

declare interface RoutesModuleType {
  tab: {
    data: string | undefined
  }
  tabMenu: string | undefined
  activeMenu: {
    data: string | undefined
  }
  routes: ShopSuiteRouteRecord[]
}

declare type DeviceType = 'mobile' | 'desktop'
//declare type LanguageType = "ar" | "az" | "da" | "de" | "el" | "es" | "en" | "fi" | "fr" | "id" | "it" | "ja" | "kk" | "ko" | "lv" | "ms" | "my" | "nl" | "pl" | "pt" | "ro" | "ru" | "sr" | "th" | "tr" | "uk" | "vi" | "zh"
declare type LanguageType = "en" | "ja" | "ru" | "es" | "th" | "zh"

declare interface SettingsModuleType {
  configs: any
  theme: ThemeType
  device: DeviceType
  collapse: boolean
  language: LanguageType
  lock: boolean
  logo: string
  title: string
  echartsGraphic1: string[]
  echartsGraphic2: string[]
}

declare interface TabsModuleType {
  visitedRoutes: ShopSuiteRouteRecord[]
}

declare interface OptionType {
  name?: string
  title?: string
  meta: ShopSuiteRouteMeta
}

declare interface UserModuleType {
  token: string | boolean
  username: string
  avatar: string
  roleId: int
  siteId: int
}
