<template>
  <ms-app />
</template>

<script lang="ts" setup>
  import {
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onErrorCaptured,
    onMounted,
    onRenderTracked,
    onRenderTriggered,
    onUnmounted,
    onUpdated,
  } from 'vue'

  import { useSettingsStore } from '@/store/modules/settings'
  import { getSysInfo } from '@/api/router'
  const { changeTitle, changeLogo, setConfigs } = useSettingsStore()

  console.log('---setup')
  // 挂载阶段
  onBeforeMount(async () => {
    //初始化信息，必须初始化完成。

    const sys_res = await getSysInfo({})

    if (sys_res.status == 200) {
      setConfigs(sys_res.data)
      changeTitle(sys_res.data.site_name)
      changeLogo(sys_res.data.site_admin_logo)
    }
  })

  onRenderTracked(() => console.log('---跟踪'))
  onMounted(() => console.log('---挂载完成'))

  // 更新阶段
  onRenderTriggered(() => console.log('---触发'))
  onBeforeUpdate(() => console.log('---开始更新'))
  onUpdated(() => console.log('---更新完成'))

  // 销毁阶段
  onBeforeUnmount(() => console.log('---开始销毁'))
  onUnmounted(() => console.log('---销毁完成'))

  // 与动态组件有关
  onActivated(() => console.log('---激活'))
  onDeactivated(() => console.log('---休眠'))

  // 异常捕获
  onErrorCaptured(() => console.log('---错误捕获'))
</script>
