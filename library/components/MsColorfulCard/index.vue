<script lang="ts" setup>
  defineProps({
    shadow: {
      type: String,
      default: '',
    },
    colorFrom: {
      type: String,
      default: '',
    },
    colorTo: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  })
</script>

<template>
  <el-card
    class="ms-colorful-card"
    :shadow="shadow"
    :style="{
      background: `linear-gradient(50deg, ${colorFrom}, ${colorTo})`,
    }"
  >
    <template #header>{{ title }}</template>
    <ms-icon v-if="icon" :icon="icon" />
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
  .ms-colorful-card {
    position: relative;
    min-height: 120px;
    cursor: pointer;

    * {
      color: var(--el-color-white);
    }

    :deep() {
      .el-card__header {
        color: var(--el-color-white);
        border-bottom: 0;
      }

      .el-card__body {
        padding-top: 0;
      }
    }

    i {
      position: absolute;
      top: -30px;
      right: 20px;
      font-size: 60px;
      transform: rotate(15deg);
    }
  }
</style>
