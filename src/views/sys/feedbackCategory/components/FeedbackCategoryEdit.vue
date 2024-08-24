<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('分类编号')" prop="feedback_category_id">
        <el-input v-model="form.feedback_category_id" clearable :disabled="isUpdate" :placeholder="t('分类编号')"/>
      </el-form-item>
      <el-form-item :label="t('分类名称')" prop="feedback_category_name">
        <el-input v-model="form.feedback_category_name" clearable :placeholder="t('分类名称')"/>
      </el-form-item>
      <el-form-item :label="t('反馈类型')" prop="feedback_type_id">
        <el-select v-model="form.feedback_type_id" clearable :placeholder="t('请选择反馈类型')" style="width: 100%;">
          <el-option
            v-for="(item, index) in feedbackTypeList"
            :key="index"
            :label="item.feedback_type_name"
            :value="item.feedback_type_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="feedback_category_enable">
        <el-switch
          v-model="form.feedback_category_enable"
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
import {doEdit, doAdd} from '@/api/sys/feedbackCategory'
import {getList} from '@/api/sys/feedbackType'

export default defineComponent({
  name: 'FeedbackCategoryEdit',
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
      feedbackTypeList: [],
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

    const getFeedbackTypeList = async () => {
      const { data } = await getList({size:500, feedback_type_enable : true})
      state.feedbackTypeList = data.items
    }

    onMounted(() => {
      getFeedbackTypeList()
    })

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      getFeedbackTypeList,
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
