<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="110px" :model="form" :rules="rules">
      <el-form-item :label="t('评论回复内容')" prop="comment_reply_content">
        <el-input v-model="form.comment_reply_content" clearable :placeholder="t('评论回复内容')" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {doAdd} from '@/api/pt/productCommentReply'

  export default defineComponent({
    name: 'Reply',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
        },
        rules: {
          comment_reply_content: [{required: true, trigger: 'blur', message: t('请输入评论回复内容')}],
        },
        title: '',
        dialogFormVisible: false,
        // 提交状态
        loading: false,
      })

      const showEdit = (comment_id) => {
        if (comment_id) {
          state.title = t('回复')
          state.form.comment_id = comment_id
          state.dialogFormVisible = true
        }
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            const { msg, status } = await doAdd(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            emit('fetch-data')
            close()
          }
        })
      }

      return {
        t: t,
        ...toRefs(state),
        showEdit,
        close,
        save,
      }
    },
  })
</script>
<style lang="scss">
  .el-input__wrapper{
    width: 100%;
  }
</style>
