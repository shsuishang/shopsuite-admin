<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('编号')" prop="duw_id">
        <el-input v-model="form.duw_id" clearable :disabled="isUpdate" :placeholder="t('编号')"/>
      </el-form-item>
      <el-form-item :label="t('会员支付编号')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('会员支付编号')"/>
      </el-form-item>
      <el-form-item :label="t('提现额度')" prop="duw_amount">
        <el-input v-model="form.duw_amount" clearable :placeholder="t('提现额度')"/>
      </el-form-item>
      <el-form-item :label="t('是否成功')" prop="duw_state">
        <el-input v-model="form.duw_state" clearable :placeholder="t('是否成功')"/>
      </el-form-item>
      <el-form-item :label="t('操作管理员')" prop="duw_user_id">
        <el-input v-model="form.duw_user_id" clearable :placeholder="t('操作管理员')"/>
      </el-form-item>
      <el-form-item :label="t('创建时间')" prop="duw_time">
        <el-input v-model="form.duw_time" clearable :placeholder="t('创建时间')"/>
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
  import {doEdit, doAdd} from '@/api/pay/distributionWithdraw'

  export default defineComponent({
    name: 'DistributionWithdrawEdit',
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
          title: [{required: true, trigger: 'blur', message: t('请输入标题')}],
        },
        title: '',
        dialogFormVisible: false,
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
      })

      const showEdit = (row) => {

        if (!row) {
          state.isUpdate = false
          state.title = t('添加')
        } else {
          state.isUpdate = true
          state.title = t('编辑')
          state.form = Object.assign({}, row)
        }
        state.dialogFormVisible = true
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
            if (state.isUpdate) {
              const { msg, status } = await doEdit(state.form)
              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
            } else {
              const { msg, status } = await doAdd(state.form)
              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
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
