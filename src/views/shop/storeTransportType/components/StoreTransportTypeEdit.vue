<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item :label="t('模板名称')" prop="transport_type_name">
        <el-input
          v-model="form.transport_type_name"
          :placeholder="t('模板名称')"
        />
      </el-form-item>

      <el-form-item
        :label="t('计费规则')"
        prop="transport_type_pricing_method"
      >
        <el-radio-group v-model="form.transport_type_pricing_method">
          <el-radio :label="1">{{ t('按件数') }}</el-radio>
          <el-radio v-if="false" :label="2">{{ t('按重量') }}</el-radio>
          <el-radio v-if="false" :label="3">{{ t('按体积') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="t('免运费额度')"
        prop="transport_type_freight_free"
      >
        <el-input
          v-model="form.transport_type_freight_free"
          :placeholder="t('免运费额度')"
        />
      </el-form-item>

      <el-form-item :label="t('全免运费')" prop="transport_type_free">
        <el-switch
          v-model="form.transport_type_free"
          active-color="#13ce66"
          :active-text="t('全免')"
          :active-value= true
          inactive-color="#ff4949"
          :inactive-text="t('不全免')"
          :inactive-value= false
          style="display: block"
        />
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
import {doEdit, doAdd} from '@/api/shop/storeTransportType'

export default defineComponent({
  name: 'StoreTransportTypeEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const rules = reactive({
      transport_type_name: [{required: true, trigger: 'blur', message: t('请输入模板名称')}],
      transport_type_freight_free: [{required: true, trigger: 'blur', message: t('请输入免运费额度')}],
      transport_type_pricing_method: [{required: true, trigger: 'change', message: t('请选择计费规则')}],
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
