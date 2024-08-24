<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="120px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('选项编号')" prop="assist_item_id">
        <el-input v-model="form.assist_item_id" clearable :disabled="isUpdate" :placeholder="t('选项编号')"/>
      </el-form-item>
      <el-form-item :label="t('选项名称')" prop="assist_item_name">
        <el-input v-model="form.assist_item_name" clearable :placeholder="t('选项名称')"/>
      </el-form-item>
      <el-form-item :label="t('属性编号')" prop="assist_id">
        <el-input v-model="form.assist_id" clearable disabled :placeholder="t('属性编号')"/>
      </el-form-item>
      <el-form-item :label="t('选项排序')" prop="assist_item_sort">
        <el-input v-model="form.assist_item_sort" clearable :placeholder="t('选项排序')"/>
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
import {doEdit, doAdd} from '@/api/pt/productAssistItem'
import {event} from "@/config";

export default defineComponent({
  name: 'ProductAssistItemEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')
    const $eventBus = inject('$eventBus')

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

      if (!row || (row && !row.assist_item_id)) {
        state.isUpdate = false
        state.title = t('添加')
        state.form = Object.assign({}, row)
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
          $eventBus.$emit(event.CHANGE_ASSISTITEM_EVENT)
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
