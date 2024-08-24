<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'

  const settingsStore = useSettingsStore()
  const { theme, logo, title } = storeToRefs(settingsStore)
</script>

<template>
  <div
    class="logo-container"
    :class="{
      ['logo-container-' + theme.layout]: true,
    }"
  >
    <router-link to="/">
      <span class="logo">
        <!-- 使用自定义svg示例 -->
        <ms-icon v-if="logo" :icon="logo" is-custom-svg />
      </span>
      <span
        class="title"
        :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
      >
        {{ title }}
      </span>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
  @mixin container {
    position: relative;
    height: $base-header-height;
    overflow: hidden;
    line-height: $base-header-height;
    background: transparent;
  }

  @mixin logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    color: $base-title-color;
    vertical-align: middle;
    fill: currentColor;
  }

  @mixin title {
    display: inline-block;
    margin-left: 5px;
    overflow: hidden;
    font-size: 20px;
    line-height: 55px;
    color: $base-title-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .logo-container {
    &-horizontal,
    &-common {
      @include container;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
      }
    }

    &-vertical,
    &-column,
    &-comprehensive,
    &-float {
      @include container;

      height: $base-logo-height;
      line-height: $base-logo-height;
      text-align: center;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
        max-width: calc(var(--el-left-menu-width) - 60px);
      }
    }

    &-column {
      background: $base-column-second-menu-background !important;

      .logo {
        position: fixed;
        top: 0;
        display: block;
        width: $base-left-menu-width-min;
        height: $base-logo-height;
        margin: 0;
        background: $base-column-first-menu-background;
      }

      .title {
        padding-right: 15px;
        padding-left: 15px;
        margin-left: $base-left-menu-width-min !important;
        color: var(--el-color-black) !important;
        background: $base-column-second-menu-background !important;
        @include title;
      }
    }
  }


  .ms-side-bar:not(.is-collapse) .logo{
    margin-left: 20px;
    float: left;
  }

  .ms-side-bar:not(.is-collapse) .title{
    float: left;
    line-height:60px;
    margin-left:8px;
  }

  .logo-container.logo-container-vertical {
    border-bottom: 1px solid #323435;
  }

</style>
