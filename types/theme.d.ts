declare type LayoutName =
  /**
   * 横向布局
   */
  | 'horizontal'
  /**
   * 纵向布局
   */
  | 'vertical'
  /**
   * 分栏布局
   */
  | 'column'
  /**
   * 综合布局
   */
  | 'comprehensive'
  /**
   * 常规布局
   */
  | 'common'
  /**
   * 浮动布局
   */
  | 'float'
  | string

declare type ThemeName =
  | 'blue-black'
  | 'blue-white'
  | 'green-black'
  | 'green-white'
  | 'ocean'
  | 'red-white'
  | 'red-black'
  | string

declare type Background =
  /**
   * 无背景
   */
  | 'none'
  /**
   * 自定义背景
   */
  | 'ms-background'
  | string

declare type ColumnStyle =
  /**
   * 横向风格
   */
  | 'horizontal'
  /**
   * 纵向风格
   */
  | 'vertical'
  /**
   * 卡片风格
   */
  | 'card'
  /**
   * 箭头风格
   */
  | 'arrow'
  | string

declare type TabsBarStyle =
  /**
   * 卡片风格
   */
  | 'card'
  /**
   * 灵动风格
   */
  | 'smart'
  /**
   * smooth
   */
  | 'smooth'
  | string

declare interface ThemeType {
  // 布局名称
  layout: LayoutName
  // 主题名称
  themeName: ThemeName
  // 菜单背景
  background: Background
  // 分栏风格(仅针对分栏布局column时生效)
  columnStyle: ColumnStyle
  // 是否固定头部固定
  fixedHeader: boolean
  // 纵向布局、常规布局、综合布局时是否默认收起左侧菜单（不支持分栏布局、横向布局）
  foldSidebar: boolean
  // 菜单宽度
  menuWidth: string
  // 是否开启顶部进度条
  showProgressBar: boolean
  // 是否开启标签页
  showTabs: boolean
  // 显示标签页时标签页样式
  tabsBarStyle: TabsBarStyle
  // 是否标签页图标
  showTabsIcon: boolean
  // 是否开启语言选择组件
  showLanguage: boolean
  // 是否开启刷新组件
  showRefresh: boolean
  // 是否开启通知组件
  showNotice: boolean
  // 是否开启全屏组件
  showFullScreen: boolean
  // 是否开启页面动画
  showPageTransition: boolean
}
