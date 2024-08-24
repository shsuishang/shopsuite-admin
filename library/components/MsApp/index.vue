<script lang="ts" setup>
  import { pwa } from '@/config'
  import { useHead } from '@vueuse/head'
  import { enLocale, zhLocale } from '@/i18n'

  const route = useRoute()
  const { locale: language } = useI18n()

  const locale = computed(() => (language.value === 'en' ? enLocale : zhLocale))

  const MsUpdate = defineAsyncComponent(
    () => import('@/plugins/MsUpdate/index.vue')
  )

  const siteData = reactive({
    description: '',
  })
  watchEffect(() => {
    siteData.description = `${'ShopSuite'}-${
      route.meta.title
    } - ShopSuite.CN`
  })
  useHead({
    meta: [
      {
        name: `description`,
        content: computed(() => siteData.description),
      },
    ],
  })
</script>
<template>
  <el-config-provider
    :button="{
      autoInsertSpace: true,
    }"
    :locale="locale"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <ms-update v-if="pwa" ref="MsUpdateRef" />
  </el-config-provider>
</template>
