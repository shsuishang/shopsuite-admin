<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('字典类型')" prop="dict_id">
        <el-input v-model="form.dict_id" clearable disabled :placeholder="t('字典类型')" />
      </el-form-item>
      <el-form-item :label="t('字典编号')" prop="dict_item_id">
        <el-input v-model="form.dict_item_id" clearable :disabled="isUpdate"  :placeholder="t('字典编号')"/>
      </el-form-item>
      <el-form-item :label="t('字典名称')" prop="dict_item_name">
        <el-input v-model="form.dict_item_name" clearable :placeholder="t('字典名称')"/>
      </el-form-item>
      <el-form-item :label="t('字典项值')" prop="dict_item_code">
        <el-input v-model="form.dict_item_code" clearable :placeholder="t('字典项值')"/>
      </el-form-item>
      <el-form-item :label="t('显示顺序')" prop="dict_item_sort">
        <el-input v-model="form.dict_item_sort" clearable :placeholder="t('显示顺序')"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消') }}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {translate as t} from '@/i18n'
import {doAddItem, doEditItem} from '@/api/sys/dict'
import {uuid} from "@/utils";

export default defineComponent({
  name: 'DictItemEdit',
  props: {},
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
      },
      rules: {
        dict_item_id: [{required: true, trigger: 'blur', message: t('请输入字典编号')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const showEdit = (row) => {

      if (row && row.dict_item_id) {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)
      } else {
        state.isUpdate = false
        state.title = t('添加')
        state.form = Object.assign({dict_item_id: uuid()}, row)
      }
      state.dialogFormVisible = true
    }
    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        roles: [],
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          if (state.isUpdate) {
            const { msg } = await doEditItem(state.form)
            $message(msg, 'success')
          } else {
            const { msg } = await doAddItem(state.form)
            $message(msg, 'success')
          }

          emit('fetch-data', {dict_id:state.form.dict_id})
          close()
        }
      })
    }

    return {
      t,
      ...toRefs(state),
      showEdit,
      close,
      save,
    }
  },
})
</script>
