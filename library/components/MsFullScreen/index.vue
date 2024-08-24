<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'

  const { isFullscreen, toggle } = useFullscreen()

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>

<template>
  <ms-icon
    v-if="theme.showFullScreen"
    :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
    @click="toggle"
  />
</template>
