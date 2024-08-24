<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('新密码')" prop="user_password">
        <el-input v-model="form.user_password" clearable :placeholder="t('请输入新密码')" />
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
  import {passWordEdit} from '@/api/account/userInfo'

  export default defineComponent({
    name: 'PassWordEdit',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          user_id: '',
        },

        title: '更改密码',
        dialogFormVisible: false,
      })

      const showPassWordEdit = (row) => {

        if (row) {
          state.form.user_id = row.user_id
          state.dialogFormVisible = true
        } else {
          state.dialogFormVisible = false
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
            const { msg, status } = await passWordEdit(state.form)
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

      const rules = reactive({
        user_password: [{required: true, trigger: 'blur', message: t('请输入新密码')}],
      })

      return {
        t: t,
        ...toRefs(state),
        showPassWordEdit,
        close,
        rules,
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
