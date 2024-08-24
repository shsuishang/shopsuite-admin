<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="140px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('发票编号')" prop="order_invoice_id">
        <el-input v-model="form.order_invoice_id" clearable :disabled="isUpdate" :placeholder="t('请输入发票编号')"/>
      </el-form-item>
      <el-form-item :label="t('电子发票链接')" prop="invoice_img">
        <el-input v-model="form.invoice_img" clearable :placeholder="t('电子发票链接')"/>
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
import {editStatus} from '@/api/trade/orderInvoice'

export default defineComponent({
  name: 'OrderInvoiceStatusEdit',
  components: {},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        invoice_img: "",
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const rules = reactive({
      invoice_img: [{required: true, trigger: 'blur', message: t('请输入电子发票链接')}],
    })

    const showEdit = (row) => {

      if (row) {
        state.isUpdate = true
        state.title = t('开票')
        state.form = Object.assign({}, row)
      }
      state.dialogFormVisible = true
    }

    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        invoice_img: "",
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          if (state.isUpdate) {
            const { msg, status } = await editStatus(state.form)
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
      rules,
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
