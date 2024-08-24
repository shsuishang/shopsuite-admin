<script lang="ts" setup>
import {translate as t} from "@/i18n";
defineProps({
  id: {
    type: String,
    default: () => "",
  },
})

const tagList = {
  "1101": "tag-info",
    "1102": "tag-info",
    "1103": "tag-info",
    "1104": "tag-info",
    "1105": "tag-info",
    "1106": "tag-info",
    "1107": "tag-info",
    "1140": "tag-info",
    "1131": "tag-info",
    "1132": "tag-info",
    "1121": "tag-info",
    "1122": "tag-info",
    "1123": "tag-info",
    "1124": "tag-info",
    "1125": "tag-info",
    "1135": "tag-info",
    "1133": "tag-info"
}

const tagNameMap = {
  "1101": t('加价购'),
  "1102": t('满赠'),
  "1103": t('限时折扣'),
  "1104": t('优惠套装'),
  "1105": t('优惠券'),
  "1106": t('砸金蛋'),
  "1107": t('满减'),
  "1140": t('折上折'),
  "1131": t('市场活动'),
  "1132": t('组合套餐'),
  "1121": t('幸运大抽奖'),
  "1122": t('秒杀'),
  "1123": t('拼团'),
  "1124": t('砍价'),
  "1125": t('一元购'),
  "1135": t('阶梯价'),
  "1133": t('多件折')
}

</script>

<template>
  <el-tag :type='(tagList)[id]'>
    {{ tagNameMap[id] }}
  </el-tag>
</template>

<style lang="scss" scoped>
</style>
