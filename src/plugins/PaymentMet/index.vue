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
  <el-tag :type='({"1":"","2":"success","3":"warning","4":"info","5":"danger"})[id]'>
    {{ ({"1":t('余额支付'),"2":t('充值卡支付'),"3":t('积分支付'),"4":t('信用支付'),"5":t('红包支付')})[id] }}
  </el-tag>
</template>

<style lang="scss" scoped>
</style>
