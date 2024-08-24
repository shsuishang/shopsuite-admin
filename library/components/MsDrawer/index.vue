<template>
  <el-drawer
    v-model="visibleLocal"
    :before-close="beforeClose"
    :direction="direction"
    :size="size"
    :title="title"
    @close="closeDrawer"
  >
    <slot></slot>
  </el-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl' // 设置默认方向为从右到左
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '30%' // 设置默认宽度为 30%
    },
    beforeClose: {
      type: Function,
      default: null
    }
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const closeDrawer = () => {
      // 发送更新事件通知父组件
      emit('update:visible', false);
    };

    // const beforeClose = (done) => {
    //   // 可以在这里添加关闭抽屉前的逻辑
    //   // 如果需要阻止抽屉关闭，可以调用 done(false)
    //   // 如果允许抽屉关闭，调用 done() 或 done(true)
    //   done();
    // };


    return {
      closeDrawer,
    };
  },
  data: function () {
    return {
      visibleLocal: false,
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler: function () {
        this.visibleLocal = this.visible
      },
    },
  },
};
</script>
