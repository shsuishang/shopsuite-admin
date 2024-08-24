<script lang="ts" setup>
  import { useRoutesStore } from '@/store/modules/routes'
  import { useSettingsStore } from '@/store/modules/settings'
  import variables from '@sslib/styles/variables.scss'
  import { defaultOpeneds, uniqueOpened } from '@/config'

  const props = defineProps({
    layout: {
      type: String,
      default: 'vertical',
    },
  })

  const settingsStore = useSettingsStore()
  const { collapse } = storeToRefs(settingsStore)
  const routesStore = useRoutesStore()
  const {
    getRoutes: routes,
    getActiveMenu: activeMenu,
    getPartialRoutes: partialRoutes,
  } = storeToRefs(routesStore)

  const handleRoutes = computed(() => {
    return props.layout === 'comprehensive'
      ? partialRoutes.value
      : routes.value.flatMap((route: any) =>
          route.meta.levelHidden && route.children ? [...route.children] : route
        )
  })
</script>

<template>
  <el-scrollbar
    class="ms-side-bar"
    :class="{ 'is-collapse': collapse, 'side-bar-common': layout === 'common' }"
  >
    <ms-logo
      v-if="
        layout === 'vertical' ||
        layout === 'comprehensive' ||
        layout === 'float'
      "
    />
    <el-menu
      :active-text-color="variables['menu-color-active']"
      :background-color="variables['menu-background']"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu.data"
      :default-openeds="defaultOpeneds"
      menu-trigger="click"
      mode="vertical"
      :text-color="variables['menu-color']"
      :unique-opened="uniqueOpened"
    >
      <template v-for="(item, index) in handleRoutes" :key="index + item.name">
        <ms-menu v-if="!item.meta.hidden" :item="item" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: var(--el-color-white);
      background-color: $base-menu-active;
    }

    &.is-active {
      color: var(--el-color-white);
      background-color: $base-menu-active;
    }
  }

  .ms-side-bar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index + 1;
    width: var(--el-left-menu-width);
    height: 100vh;
    overflow: hidden;
    background: $base-menu-background;
    box-shadow: $base-box-shadow;
    transition: $base-transition;

    &.side-bar-common {
      top: $base-header-height;
      height: calc(100vh - #{$base-header-height});
    }

    &.is-collapse {
      width: $base-left-menu-width-min;
      border-right: 0;

      :deep() {
        .el-menu--collapse.el-menu {
          > .el-menu-item,
          > .el-sub-menu {
            text-align: center;

            .el-tag {
              display: none;
            }
          }
        }

        .el-menu-item,
        .el-sub-menu {
          text-align: left;
        }

        .el-menu--collapse {
          border-right: 0;

          .el-sub-menu__icon-arrow {
            right: 10px;
            margin-top: -3px;
          }
        }
      }
    }

    :deep() {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu-item,
      .el-sub-menu__title {
        height: $base-menu-item-height;
        overflow: hidden;
        line-height: $base-menu-item-height;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;

        i {
          color: inherit;
        }
      }

      .el-menu-item {
        @include active;
      }
    }
  }
</style>

<!--由于element-plus
bug使用popper-append-to-body=false会导致多级路由无法显示，故所有菜单必须生成至body下，样式必须放到body下-->
<style lang="scss">
  @mixin menuActiveHover {
    &:hover,
    &.is-active {
      i {
        color: var(--el-color-white);
      }

      color: var(--el-color-white);
      background: var(--el-color-primary);

      .el-sub-menu__title {
        i {
          color: var(--el-color-white);
        }

        color: var(--el-color-white);
        background: var(--el-color-primary);
      }
    }
  }

  .el-menu {
    border-right: 0;
  }

  .el-popper {
    .el-menu--vertical {
      .el-menu-item,
      .el-sub-menu {
        height: $base-menu-item-height;
        line-height: $base-menu-item-height;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        @include menuActiveHover;

        i {
          color: inherit;
        }

        .el-sub-menu__title {
          height: $base-menu-item-height;
          line-height: $base-menu-item-height;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          @include menuActiveHover;
        }
      }
    }
  }
</style>
