<template>
  <el-dialog
    v-model="dialogFormVisible"
    class="page_pc_diy_dialog"
    :fullscreen="true"
    :title="title"
    top="2%"
    width="80%"
    @close="close"
  >
    <iframe
      class="placeholder"
      frameborder="0"
      scrolling="auto"
      :src="
        'diy-pc/index.html?page_id=' +
        page_id +
        '&api_url=' +
        encodeURIComponent(URL.apiUrl) +
        '&admin_url=' +
        encodeURIComponent(URL.adminUrl)
      "
      style="width: 100%; height: 770px"
    ></iframe>
    <template #footer>
      <el-button @click="close">{{ t('确定')}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { translate as t } from '@/i18n'
  import { URL } from '@/config'

  export default defineComponent({
    name: 'PcDiy',
    setup() {
      const state = reactive({
        dialogFormVisible: false,
        page_id : '',
        URL : URL,


      })

      const showDiy = (row) => {
        state.dialogFormVisible = true
        state.page_id = row.page_id
      }
      const close = () => {
        state.dialogFormVisible = false
      }

      return {
        t: t,
        ...toRefs(state),
        showDiy,
        close,
      }
    },
  })
</script>
<style lang="scss">
  .el-input__wrapper{
    width: 100%;
  }
</style>
