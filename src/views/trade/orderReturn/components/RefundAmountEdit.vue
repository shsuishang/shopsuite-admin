<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    :title="title"
    width="40%"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item :label="t('退款金额')" prop="return_refund_amount">
        <el-input
          v-model="form.return_refund_amount"
          clearable
          oninput="value=value.replace(/[^0-9.]/g,'')"
          :placeholder="t('请输入退款金额')"
          :style="{ width: '100%' }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" @click="close">{{ t('取消') }}</el-button>
      <el-button
        v-loading="loading"
        :disabled="loading"
        type="primary"
        @click="save"
      >
        {{ t('确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {doEdit} from '@/api/trade/orderReturn'


    export default defineComponent({
      name: "RefundAmountEdit",
      props:{
      },
      emits: ['fetch-data'],
      setup(props, {emit}) {
        const $message = inject('$message')
        const state = reactive({
          title: '',
          dialogFormVisible: false,
          formRef: null,
          form: {
          },

        })

        const showEdit = (params) => {
          state.title = t('修改退款金额')
          state.form = {
            return_id: params.return_id,
            return_refund_amount: params.return_refund_amount,
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
            state.loading = true
            if (valid) {
              const { msg, status } = await doEdit(state.form)
              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
              emit('fetch-data', state.form.return_id)
              state.loading = false
              close()
            } else {
              state.loading = false
              return false
            }
          })
        }

        const rules = reactive({
          return_refund_amount: [
            {
              required: true,
              message: '请输入退款金额',
              trigger: 'blur',
            },
          ]
        });


        return {
          t: t,
          showEdit,
          rules,
          save,
          close,
          ...toRefs(state),
        }
      }
    })
</script>

<style scoped>

</style>
