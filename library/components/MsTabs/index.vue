<script lang="ts" setup>
  import { useTabsStore } from '@/store/modules/tabs'
  import { useRoutesStore } from '@/store/modules/routes'
  import { useSettingsStore } from '@/store/modules/settings'
  import { handleActivePath, handleTabs } from '@/utils/routes'
  import { translate } from '@/i18n'
  import { ShopSuiteRoute, ShopSuiteRouteRecord } from '/#/router'

  defineProps({
    layout: {
      type: String,
      default: '',
    },
  })

  const $pub: any = inject('$pub')

  const route = useRoute()
  const router = useRouter()

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const routesStore = useRoutesStore()
  const { getRoutes: routes } = storeToRefs(routesStore)
  const tabsStore = useTabsStore()
  const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabsStore)
  const {
    addVisitedRoute,
    delVisitedRoute,
    delOthersVisitedRoutes,
    delLeftVisitedRoutes,
    delRightVisitedRoutes,
    delAllVisitedRoutes,
  } = tabsStore

  const tabActive = ref('')
  const active = ref(false)

  const hoverRoute = ref()
  const visible = ref(false)
  const top = ref(0)
  const left = ref(0)

  const isActive = (path: string) => path === handleActivePath(route, true)
  const isNoCLosable = (tag: any) => tag.meta.noClosable
  const handleTabClick = (tab: any) => {
    if (!isActive(tab.name)) router.push(visitedRoutes.value[tab.index])
  }
  const handleVisibleChange = (val: boolean) => {
    active.value = val
  }
  const initNoCLosableTabs = (routes: ShopSuiteRouteRecord[]) => {
    routes.forEach((_route) => {
      if (_route.meta.noClosable) addTabs(_route)
      if (_route.children) initNoCLosableTabs(_route.children)
    })
  }
  /**
   * 添加标签页
   * @param tag route
   * @returns {Promise<void>}
   */
  const addTabs = async (tag: ShopSuiteRoute | ShopSuiteRouteRecord) => {
    const tab = handleTabs(tag)
    if (tab) {
      await addVisitedRoute(tab)
      tabActive.value = tab.path
    }
  }
  /**
   * 根据原生路径删除标签中的标签
   * @param rawPath 原生路径
   * @returns {Promise<void>}
   */
  const handleTabRemove: any = async (rawPath: string) => {
    if (isActive(rawPath)) await toLastTab()
    await delVisitedRoute(rawPath)
  }
  const handleCommand = (command: string) => {
    switch (command) {
      case 'refreshThisTab':
        refreshThisTab()
        break
      case 'closeOthersTabs':
        closeOthersTabs()
        break
      case 'closeLeftTabs':
        closeLeftTabs()
        break
      case 'closeRightTabs':
        closeRightTabs()
        break
      case 'closeAllTabs':
        closeAllTabs()
        break
    }
  }
  /**
   * 刷新当前标签页
   * @returns {Promise<void>}
   */
  const refreshThisTab = () => {
    $pub('reload-router-view')
  }
  /**
   * 删除其他标签页
   * @returns {Promise<void>}
   */
  const closeOthersTabs = async () => {
    if (hoverRoute.value) {
      await router.push(hoverRoute.value)
      await delOthersVisitedRoutes(hoverRoute.value.path)
    } else await delOthersVisitedRoutes(handleActivePath(route, true))
    await closeMenu()
  }
  /**
   * 删除左侧标签页
   * @returns {Promise<void>}
   */
  const closeLeftTabs = async () => {
    if (hoverRoute.value) {
      await router.push(hoverRoute.value)
      await delLeftVisitedRoutes(hoverRoute.value.path)
    } else await delLeftVisitedRoutes(handleActivePath(route, true))
    await closeMenu()
  }
  /**
   * 删除右侧标签页
   * @returns {Promise<void>}
   */
  const closeRightTabs = async () => {
    if (hoverRoute.value) {
      await router.push(hoverRoute.value)
      await delRightVisitedRoutes(hoverRoute.value.path)
    } else await delRightVisitedRoutes(handleActivePath(route, true))
    await closeMenu()
  }
  /**
   * 删除所有标签页
   * @returns {Promise<void>}
   */
  const closeAllTabs = async () => {
    await delAllVisitedRoutes()
    await toLastTab()
    await closeMenu()
  }
  /**
   * 跳转最后一个标签页
   */
  const toLastTab = async () => {
    const latestView = visitedRoutes.value
      .filter((_: any) => _.path !== handleActivePath(route, true))
      .slice(-1)[0]
    if (latestView) await router.push(latestView)
    else await router.push('/')
  }

  const { x, y } = useMouse()
  const openMenu = () => {
    left.value = x.value
    top.value = y.value
    visible.value = true
  }
  const closeMenu = () => {
    visible.value = false
    hoverRoute.value = null
  }

  initNoCLosableTabs(routes.value)

  watch(
    () => route.fullPath,
    () => {
      addTabs(route)
    },
    {
      immediate: true,
    }
  )
  watchEffect(() => {
    if (visible.value) document.body.addEventListener('click', closeMenu)
    else document.body.removeEventListener('click', closeMenu)
  })
</script>

<template>
  <div class="ms-tabs">
    <ms-fold v-if="layout === 'common'" />
    <el-tabs
      v-model="tabActive"
      class="ms-tabs-content"
      :class="{
        ['ms-tabs-content-' + theme.tabsBarStyle]: true,
      }"
      type="card"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        :closable="!isNoCLosable(item)"
        :name="item.path"
      >
        <template #label>
          <span style="display: inline-block" @contextmenu.prevent="openMenu">
            <template v-if="theme.showTabsIcon">
              <ms-icon
                v-if="item.meta && item.meta.icon"
                :icon="item.meta.icon  + ' ' + item.meta.icon"
                :is-custom-svg="item.meta.isCustomSvg"
              />
              <!--  如果没有图标那么取第二级的图标 -->
              <ms-icon v-else :icon="item.parentIcon" />
            </template>
            <span v-if="item.meta && item.meta.title">
              {{ translate(item.meta.title) }}
            </span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown
      placement="bottom-end"
      popper-class="ms-tabs-more-dropdown"
      @command="handleCommand"
      @visible-change="handleVisibleChange"
    >
      <span class="ms-tabs-more" :class="{ 'ms-tabs-more-active': active }">
        <span class="ms-tabs-more-icon">
          <i class="box box-t"></i>
          <i class="box box-b"></i>
        </span>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="tabs-more">
          <el-dropdown-item command="refreshThisTab">
            <ms-icon icon="refresh-line" />
            <span>
              {{ translate('刷新') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeOthersTabs">
            <ms-icon icon="close-line" />
            <span>
              {{ translate('关闭其他') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeLeftTabs">
            <ms-icon icon="arrow-left-line" />
            <span>
              {{ translate('关闭左侧') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeRightTabs">
            <ms-icon icon="arrow-right-line" />
            <span>
              {{ translate('关闭右侧') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeAllTabs">
            <ms-icon icon="close-line" />
            <span>
              {{ translate('关闭全部') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul
      v-if="visible"
      class="contextmenu el-dropdown-menu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li class="el-dropdown-menu__item" @click="refreshThisTab">
        <ms-icon icon="refresh-line" />
        <span>{{ translate('刷新') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': visitedRoutes.length === 1 }"
        @click="closeOthersTabs"
      >
        <ms-icon icon="close-line" />
        <span>{{ translate('关闭其他') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': !visitedRoutes.indexOf(hoverRoute) }"
        @click="closeLeftTabs"
      >
        <ms-icon icon="arrow-left-line" />
        <span>{{ translate('关闭左侧') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{
          'is-disabled':
            visitedRoutes.indexOf(hoverRoute) === visitedRoutes.length - 1,
        }"
        @click="closeRightTabs"
      >
        <ms-icon icon="arrow-right-line" />
        <span>{{ translate('关闭右侧') }}</span>
      </li>
      <li class="el-dropdown-menu__item" @click="closeAllTabs">
        <ms-icon icon="close-line" />
        <span>{{ translate('关闭全部') }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  @use 'sass:math';
  .ms-tabs {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    min-height: $base-tabs-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    user-select: none;
    background: var(--el-color-white);
    border-top: 1px solid #f6f6f6;

    :deep() {
      .fold-unfold {
        margin-right: $base-margin;
      }

      .el-tabs__nav-wrap{
        margin-bottom: -4px;
      }

      [class*='ri'] {
        margin-right: 3px;
      }

      .ms-icon {
        vertical-align: -3px;
      }
    }

    &-content {
      display: unset;
      width: calc(100% - 40px);

      &-card {
        height: $base-tag-item-height;

        :deep() {
          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            height: $base-tag-item-height;
            line-height: $base-tag-item-height;
          }

          .el-tabs__header {
            border-bottom: 0;

            .el-tabs__nav {
              border: 0;
            }

            .el-tabs__item {
              box-sizing: border-box;
              height: $base-tag-item-height;
              margin-right: 5px;
              line-height: $base-tag-item-height;
              border: 1px solid $base-border-color !important;
              border-radius: $base-border-radius;
              transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

              &.is-active {
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                border: 1px solid var(--el-color-primary);
                outline: none;
              }

              &:hover {
                border: 1px solid var(--el-color-primary);
              }
            }
          }
        }
      }

      &-smart {
        height: $base-tag-item-height;

        :deep() {
          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            height: $base-tag-item-height;
            line-height: $base-tag-item-height;
          }

          .el-tabs__header {
            border-bottom: 0;

            .el-tabs__nav {
              border: 0;
            }

            .el-tabs__item {
              height: $base-tag-item-height;
              margin-right: 5px;
              line-height: $base-tag-item-height;
              border: 0;
              outline: none;
              transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

              &.is-active {
                background: var(--el-color-primary-light-9);
                outline: none;

                &:after {
                  width: 100%;
                  transition: $base-transition;
                }
              }

              &:after {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                content: '';
                background-color: var(--el-color-primary);
                transition: $base-transition;
              }

              &:hover {
                background: var(--el-color-primary-light-9);

                &:after {
                  width: 100%;
                  transition: $base-transition;
                }
              }
            }
          }
        }
      }

      &-smooth {
        height: $base-tag-item-height + 4;

        :deep() {
          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            height: $base-tag-item-height + 14;
            line-height: $base-tag-item-height + 14;
          }

          .el-tabs__header {
            border-bottom: 0;

            .el-tabs__nav {
              border: 0;
            }

            .el-tabs__item {
              height: $base-tag-item-height + 4;
              padding: 0 30px 0 30px;
              margin-top: #{math.div(
                  $base-tabs-height - $base-tag-item-height - 4.1,
                  2
                )};
              margin-right: -18px;
              line-height: $base-tag-item-height + 4;
              text-align: center;
              border: 0;
              outline: none;
              transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
              &.is-closable:hover {
                padding: 0 30px 0 30px;
              }

              &.is-active {
                padding: 0 30px 0 30px;
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                outline: none;
                mask: url('~@/assets/images/tabs/ms-tab.png');
                mask-size: 100% 100%;

                &:hover {
                  padding: 0 30px 0 30px;
                  color: var(--el-color-primary);
                  background: var(--el-color-primary-light-9);
                  mask: url('~@/assets/images/tabs/ms-tab.png');
                  mask-size: 100% 100%;
                }

                &.is-closable {
                  padding: 0 30px 0 30px;
                }
              }

              &:hover {
                padding: 0 30px 0 30px;
                color: var(--el-color-black);
                background: #dee1e6;
                mask: url('~@/assets/images/tabs/ms-tab.png');
                mask-size: 100% 100%;
              }
            }
          }
        }
      }
    }

    .contextmenu {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      .el-dropdown-menu__item:hover {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }
    }

    &-more {
      position: relative;
      box-sizing: border-box;
      display: block;
      text-align: left;

      &-active,
      &:hover {
        &:after {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 0;
          content: '';
        }

        .ms-tabs-more-icon {
          transform: rotate(90deg);

          .box-t {
            &:before {
              transform: rotate(45deg);
            }
          }

          .box:before,
          .box:after {
            background: var(--el-color-primary);
          }
        }
      }

      &-icon {
        display: inline-block;
        color: #9a9a9a;
        cursor: pointer;
        transition: transform 0.3s ease-out;

        .box {
          position: relative;
          display: block;
          width: 14px;
          height: 8px;

          &:before {
            position: absolute;
            top: 2px;
            left: 0;
            width: 6px;
            height: 6px;
            content: '';
            background: #9a9a9a;
          }

          &:after {
            position: absolute;
            top: 2px;
            left: 8px;
            width: 6px;
            height: 6px;
            content: '';
            background: #9a9a9a;
          }
        }

        .box-t {
          &:before {
            transition: transform 0.3s ease-out 0.3s;
          }
        }
      }
    }
  }
</style>
