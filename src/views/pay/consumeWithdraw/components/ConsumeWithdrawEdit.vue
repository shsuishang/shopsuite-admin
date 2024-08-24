<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="110px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('编号')" prop="withdraw_id">
        <el-input v-model="form.withdraw_id" clearable :disabled="isUpdate" :placeholder="t('编号')"/>
      </el-form-item>
      <el-form-item :label="t('提现状态')" prop="withdraw_state">
        <el-radio-group v-model="form.withdraw_state">
          <el-radio :label="1">{{ t('提现通过')}}</el-radio>
          <el-radio :label="2">{{ t('驳 回')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.withdraw_state == 1" :label="t('银行流水账号')" prop="withdraw_bankflow" :rules="{required: true, trigger: 'blur', message: t('请输入银行流水账号')}">
        <el-input v-model="form.withdraw_bankflow" clearable :placeholder="t('银行流水账号')"/>
      </el-form-item>
      <el-form-item :label="t('操作时间')" prop="withdraw_opertime">
        <el-date-picker
          v-model="form.withdraw_opertime"
          clearable
          :placeholder="t('操作时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('描述')" prop="withdraw_desc">
        <el-input v-model="form.withdraw_desc" clearable :placeholder="t('描述')" type="textarea"/>
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
  import {doEdit} from '@/api/pay/consumeWithdraw'

  export default defineComponent({
    name: 'ConsumeWithdrawEdit',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          withdraw_state: '',
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
          state.form.withdraw_state = ''
        }
        state.dialogFormVisible = true
      }

      const close = () => {
        state['formRef'].resetFields()
        state.form = {
        }
        state.dialogFormVisible = false
      }

      const rules = reactive({
        withdraw_state: [{required: true, trigger: 'change', message: t('请选择提现状态')}],
        withdraw_desc: [{required: true, trigger: 'blur', message: t('请输入描述')}],
        withdraw_opertime: [{required: true, trigger: 'change', message: t('请输入操作时间')}],
      })

      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            if (state.isUpdate) {
              if (state.form.withdraw_opertime) {
                state.form.withdraw_opertime = new Date(state.form.withdraw_opertime).getTime()
              }
              const { msg, status } = await doEdit(state.form)
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
