<script lang="ts" setup>
  import { translate } from '@/i18n'
  import { useSettingsStore } from '@/store/modules/settings'

  defineProps({
    itemOrMenu: {
      type: Object,
      default() {
        return null
      },
    },
  })

  const settingsStore: any = useSettingsStore()
  const { theme }: any = storeToRefs(settingsStore)
</script>

<template>
  <el-sub-menu
    :index="itemOrMenu.path"
    :teleported="theme.layout != 'horizontal'"
  >
    <template #title>
      <ms-icon
        v-if="itemOrMenu.meta.icon"
        :icon="itemOrMenu.meta.icon + ' '+ itemOrMenu.meta.icon"
        :is-custom-svg="itemOrMenu.meta.isCustomSvg"
        :title="translate(itemOrMenu.meta.title)"
      />
      <span :style="{paddingLeft: itemOrMenu.meta.icon ? '6px' : '6px'}" :title="translate(itemOrMenu.meta.title)">
        {{ translate(itemOrMenu.meta.title) }}
      </span>
    </template>
    <slot />
  </el-sub-menu>
</template>
