<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item :label="t('快递名称')" prop="express_name">
        <el-input v-model="form.express_name" :placeholder="t('请输入快递名称')" />
      </el-form-item>
      <el-form-item :label="t('快递编码')" prop="express_pinyin">
        <el-input v-model="form.express_pinyin" :placeholder="t('请输入快递编码')" />
      </el-form-item>
      <el-form-item :label="t('快递官网')" prop="express_site">
        <el-input
          v-model="form.express_site"
          :placeholder="t('请输入快递官网')"
        />
      </el-form-item>
      <el-form-item :label="t('快递排序')" prop="express_order">
        <el-input
          v-model="form.express_order"
          :placeholder="t('请输入快递排序')"
        />
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="express_enable">
        <el-switch
          v-model="form.express_enable"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
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
import {doEdit, doAdd} from '@/api/sys/expressBase'

export default defineComponent({
  name: 'BaseExpressEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        express_is_fav: false,
        express_enable: false,
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      expressList: [],
    })

    const rules = reactive({
      express_name: [{required: true, trigger: 'blur', message: t('请输入快递公司名称')}],
      express_pinyin: [{required: true, trigger: 'blur', message: t('请输入快递编码')}],
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
