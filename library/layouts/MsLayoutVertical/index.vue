<!-- 纵向布局 -->
<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'

  defineProps({
    collapse: {
      type: Boolean,
      default() {
        return false
      },
    },
    fixedHeader: {
      type: Boolean,
      default() {
        return true
      },
    },
    showTabs: {
      type: Boolean,
      default() {
        return true
      },
    },
    device: {
      type: String,
      default() {
        return 'desktop'
      },
    },
  })

  const settingsStore = useSettingsStore()
  const { foldSideBar } = settingsStore
</script>

<template>
  <div
    class="ms-layout-vertical"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <ms-side-bar />
    <div
      v-if="device === 'mobile' && !collapse"
      class="v-modal"
      @click="foldSideBar"
    />
    <div
      class="ms-main"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="ms-layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
      >
        <ms-nav />
        <ms-tabs v-show="showTabs" />
      </div>
      <ms-app-main />
    </div>
  </div>
</template>
