<script lang="ts" setup>
  import { useRoutesStore } from '@/store/modules/routes'
  import { handleActivePath } from '@/utils/routes'

  const route = useRoute()

  const routesStore: any = useRoutesStore()
  const { tab, activeMenu } = storeToRefs(routesStore)

  watch(
    route,
    () => {
      if (tab.value.data !== route.matched[0].name)
        tab.value.data = route.matched[0].name
      activeMenu.value.data = handleActivePath(route)
    },
    { immediate: true }
  )
</script>

<template>
  <div class="ms-app-main">
    <section>
      <ms-router-view />
    </section>
  </div>
</template>
