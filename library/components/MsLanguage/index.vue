<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'
  import getPageTitle from '@/utils/pageTitle'
  import { ShopSuiteRoute } from '/#/router'
  const { locale } = useI18n()

  const route: ShopSuiteRoute = useRoute()

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const { changeLanguage } = settingsStore

  const handleCommand = (language: string) => {
    changeLanguage(language)
    locale.value = language
    document.title = getPageTitle(route.meta.title)
  }
</script>

<template>
  <el-dropdown v-if="theme.showLanguage" @command="handleCommand">
    <ms-icon icon="translate" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">中文简体</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
        <el-dropdown-item command="ru">Русский язык</el-dropdown-item>
        <el-dropdown-item command="es">España</el-dropdown-item>
        <el-dropdown-item command="th">ภาษาไทย</el-dropdown-item>
        <el-dropdown-item command="ja">日本語</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
