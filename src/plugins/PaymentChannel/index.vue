<script lang="ts" setup>
import {useSettingsStore} from "@/store/modules/settings";
const settingsStore = useSettingsStore()

const paymentChannelName = (id: any) => {
  for (const paymentChannelListKey in settingsStore.getConfigs.payment_channel_list) {
    if (settingsStore.getConfigs.payment_channel_list[paymentChannelListKey].value == id) {
      return settingsStore.getConfigs.payment_channel_list[paymentChannelListKey].label
    }
  }
}

defineProps({
  id: {
    type: Number,
    default: () => 0,
  },
})
</script>
<template>
  <el-tag :type='({"24":"","25":"success","26":"warning","27":"info","38":"danger"})[id]'>
    {{paymentChannelName(id)}}
  </el-tag>
</template>

<style lang="scss" scoped>
</style>
