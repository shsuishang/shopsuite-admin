<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="140px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('咨询编号')" prop="ask_id">
        <el-input v-model="form.ask_id" clearable :disabled="isUpdate" :placeholder="t('咨询编号')"/>
      </el-form-item>
      <el-form-item :label="t('咨询类别编号')" prop="ask_type_id">
        <el-input v-model="form.ask_type_id" clearable :placeholder="t('咨询类别编号')"/>
      </el-form-item>
      <el-form-item :label="t('商品编号')" prop="product_id">
        <el-input v-model="form.product_id" clearable :placeholder="t('商品编号')"/>
      </el-form-item>
      <el-form-item :label="t('店铺编号')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('店铺编号')"/>
      </el-form-item>
      <el-form-item :label="t('用户编号')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('用户编号')"/>
      </el-form-item>
      <el-form-item :label="t('用户名称')" prop="user_nickname">
        <el-input v-model="form.user_nickname" clearable :placeholder="t('用户名称')"/>
      </el-form-item>
      <el-form-item :label="t('回复用户')" prop="ask_answer_user_id">
        <el-input v-model="form.ask_answer_user_id" clearable :placeholder="t('回复用户')"/>
      </el-form-item>
      <el-form-item :label="t('回复昵称')" prop="ask_answer_user_nickname">
        <el-input v-model="form.ask_answer_user_nickname" clearable :placeholder="t('回复昵称')"/>
      </el-form-item>
      <el-form-item :label="t('点赞数量')" prop="ask_helpful">
        <el-input v-model="form.ask_helpful" clearable :placeholder="t('点赞数量')"/>
      </el-form-item>
      <div style="height: 500px">
        <el-form-item :label="t('咨询内容')" prop="ask_question">
          <MsRichEditor
          ref="msRichEditorRef"
          v-model="form.ask_question"
          style="height: 400px;width: 100%"
          />
        </el-form-item>
      </div>
      <div style="height: 500px">
        <el-form-item :label="t('答案')" prop="ask_answer">
          <MsRichEditor
          ref="msRichEditorRef"
          v-model="form.ask_answer"
          style="height: 400px;width: 100%"
          />
        </el-form-item>
      </div>
      <el-form-item :label="t('是否展示')" prop="ask_enable">
        <el-switch
          v-model="form.ask_enable"
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
import {doEdit, doAdd} from '@/api/pt/productAskBase'
import MsRichEditor from "@/plugins/MsRichEditor";

export default defineComponent({
  name: 'ProductAskBaseEdit',
  components: {MsRichEditor},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        ask_enable: false,
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
      }
      state.dialogFormVisible = true
    }
    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        ask_question: '',
        ask_answer: '',
        ask_enable: false,
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
