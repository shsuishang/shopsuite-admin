<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'

  const fullYear = new Date().getFullYear()
  const settingsStore = useSettingsStore()
  const { cmp, url } = storeToRefs(settingsStore)
</script>

<template>
  <footer class="ms-footer">
    Powered by
    <ms-link :to="url">
      {{ cmp }} {{ url }}
    </ms-link>
  </footer>
</template>

<style lang="scss" scoped>
  .ms-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    background: var(--el-color-white);
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
    .beian {
      margin-left: 5px;
      user-select: none;
    }
  }
</style>
