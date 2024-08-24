<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    title="视频播放"
    width="50%"
    @close="close"
  >
    <el-card>
      <template #header>{{ video.material_name }}</template>
      <div>
        <videoPlay
          :src="video.material_url"
          @canplay="onCanplay"
          @pause="onPause"
          @play="onPlay"
          @timeupdate="onTimeupdate" />
      </div>
    </el-card>
    <template #footer>
      <el-button @click="close">{{ t('取 消') }}</el-button>
    </template>
  </el-dialog>
</template>



<script>
import { translate as t } from '@/i18n'
import { videoPlay } from 'vue3-video-play'
import 'vue3-video-play/dist/style.css'  // 引入相关的css

export default defineComponent({
  name: 'Player',
  components: {videoPlay
  },
  setup() {
    const state = reactive({
      video: {
        material_name:'',
        material_url: '',
      },
      dialogFormVisible: false,
    })

    const showEdit = (val) => {
      // const  row = JSON.parse(JSON.stringify(val))
      // console.info(row)
      state.video = val
      state.dialogFormVisible = true
    }

    const close = () => {
      state.video = {}
      state.dialogFormVisible = false
    }

    const onPlay = () => {
      console.log('播放')
      console.log(ev)
    }
    const onPause = (ev) => {
      console.log(ev, '暂停')
    }

    const onTimeupdate = (ev) => {
      console.log(ev, '时间更新')
    }
    const onCanplay = (ev) => {
      console.log(ev, '可以播放')
    }

    return {
      t,
      ...toRefs(state),
      showEdit,
      onPlay,
      onPause,
      onTimeupdate,
      onCanplay,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.player';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;
}
</style>
