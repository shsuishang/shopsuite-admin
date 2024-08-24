<script lang="ts" setup>
  import { useRoutesStore } from '@/store/modules/routes'
  import { translate } from '@/i18n'
  import { isExternal } from '@/utils/validate'
  import { openFirstMenu } from '@/config'

  defineProps({
    layout: {
      type: String,
      default: '',
    },
  })

  const router = useRouter()

  const routesStore: any = useRoutesStore()
  const {
    getTab: tab,
    getTabMenu: tabMenu,
    getRoutes: routes,
  } = storeToRefs(routesStore)

  const handleTabClick = () => {
    nextTick(() => {
      if (isExternal(tabMenu.value.path)) {
        window.open(tabMenu.value.path)
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else if (openFirstMenu)
        router.push(tabMenu.value.redirect || tabMenu.value)
    })
  }
</script>

<template>
  <div class="ms-nav">
    <el-row :gutter="15">
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="4">
        <div class="left-panel">
          <ms-fold v-if="layout !== 'float'" />
          <el-tabs
            v-if="layout === 'comprehensive'"
            v-model="tab.data"
            tab-position="top"
            @tab-click="handleTabClick"
          >
            <template v-for="(item, index) in routes" :key="index + item.name">
              <el-tab-pane :name="item.name">
                <template #label>
                  <ms-icon
                    v-if="item.meta.icon"
                    :icon="item.meta.icon"
                    :is-custom-svg="item.meta.isCustomSvg"
                    style="min-width: 16px"
                  />
                  <span>{{ translate(item.meta.title) }}</span>
                </template>
              </el-tab-pane>
            </template>
          </el-tabs>
          <ms-breadcrumb v-else class="hidden-xs-only" />
        </div>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="20">
        <div class="right-panel">
          <ms-error-log />
          <ms-lock />
          <ms-search />
          <ms-notice />
          <ms-full-screen />
          <ms-language />
          <ms-theme />
          <ms-refresh />
          <ms-avatar />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .ms-nav {
    position: relative;
    height: $base-nav-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    overflow: hidden;
    user-select: none;
    background: var(--el-color-white);
    box-shadow: $base-box-shadow;

    .left-panel {
      display: flex;
      align-items: center;
      justify-items: center;
      height: $base-nav-height;

      :deep() {
        .fold-unfold {
          margin-right: $base-margin;
        }

        .el-tabs {
          width: 100%;
          margin-left: $base-margin;

          .el-tabs__header {
            margin: 0;

            > .el-tabs__nav-wrap {
              display: flex;
              align-items: center;

              .el-icon-arrow-left,
              .el-icon-arrow-right {
                font-weight: 600;
                color: var(--el-color-grey);
              }

              .el-tabs__item {
                i {
                  margin-right: 3px;
                }
              }
            }
          }
        }

        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
    }

    .right-panel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: $base-nav-height;

      :deep() {
        [class*='ri-'] {
          margin-left: $base-margin;
          color: var(--el-color-grey);
          cursor: pointer;
        }

        button {
          [class*='ri-'] {
            margin-left: 0;
            color: var(--el-color-white);
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
