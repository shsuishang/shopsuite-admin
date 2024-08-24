<script lang="ts" setup>
import {translate as t} from "@/i18n";
defineProps({
  id: {
    type: Number,
    default: () => 0,
  },
})
</script>

<template>
  <el-tag :type='({"2010":"info","2011":"","2013":"","2020":"warning","2030":"","2040":"danger","2060":"success","2070":"info"})[id]'>
    {{ ({"0":t('--'), "2010":t('待支付'),"2011":t('待订单审核'),"2013":t('待财务审核'),"2020":t('待配货\/待出库审核'),"2030":t('待发货'),"2040":t('已发货\/待收货确认'),"2060":t('已完成\/已签收'),"2070":t('已取消\/已作废')})[id] }}
  </el-tag>
</template>

<style lang="scss" scoped>
</style>
