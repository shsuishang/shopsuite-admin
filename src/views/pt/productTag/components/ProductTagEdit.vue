<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="false" :label="t('标签编号')" prop="product_tag_id">
        <el-input v-model="form.product_tag_id" clearable :disabled="false" :placeholder="t('标签编号')"/>
      </el-form-item>
      <el-form-item :label="t('标签名称')" prop="product_tag_name">
        <el-input v-model="form.product_tag_name" clearable :placeholder="t('标签名称')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('店铺编号')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('店铺编号')"/>
      </el-form-item>
      <el-form-item :label="t('排序')" prop="product_tag_sort">
        <el-input v-model="form.product_tag_sort" clearable :placeholder="t('排序')"/>
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
import {doEdit, doAdd} from '@/api/pt/productTag'

export default defineComponent({
  name: 'ProductTagEdit',
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
        product_tag_name: [{required: true, trigger: 'blur', message: t('请输入标签名称')}],
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
