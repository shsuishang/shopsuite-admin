<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('默认数量')" prop="transport_item_default_num">
        <el-input v-model="form.transport_item_default_num" clearable :placeholder="t('默认数量')"/>
      </el-form-item>
      <el-form-item :label="t('默认运费')" prop="transport_item_default_price">
        <el-input v-model="form.transport_item_default_price" clearable :placeholder="t('默认运费')"/>
      </el-form-item>
      <el-form-item :label="t('增加数量')" prop="transport_item_add_num">
        <el-input v-model="form.transport_item_add_num" clearable :placeholder="t('增加数量')"/>
      </el-form-item>
      <el-form-item :label="t('增加运费')" prop="transport_item_add_price">
        <el-input v-model="form.transport_item_add_price" clearable :placeholder="t('增加运费')"/>
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
  import {doEdit, doAdd} from '@/api/shop/storeTransportItem'

  export default defineComponent({
    name: 'StoreTransportItemEdit',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          transport_type_id: 0,
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

      const addEdit = (row) => {

        if (!row.transport_item_id) {
          state.isUpdate = false
          state.title = t('添加')
        } else {
          state.isUpdate = true
          state.title = t('编辑')
          state.form = Object.assign({}, row)
        }

        state.form.transport_type_id = row.transport_type_id

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
        addEdit,
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
