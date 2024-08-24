<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('模板编号')" prop="message_id">
        <el-input v-model="form.message_id" clearable :disabled="isUpdate" :placeholder="t('模板编号')"/>
      </el-form-item>
      <el-form-item :label="t('模板名称')" prop="message_name">
        <el-input v-model="form.message_name" clearable :placeholder="t('模板名称')"/>
      </el-form-item>
      <el-form-item :label="t('邮件标题')" prop="message_email_title">
        <el-input v-model="form.message_email_title" clearable :placeholder="t('邮件标题')"/>
      </el-form-item>
      <el-form-item :label="t('邮件内容')" prop="message_email_content">
        <el-input v-model="form.message_email_content" clearable :placeholder="t('邮件内容')" type="textarea"/>
      </el-form-item>
      <el-form-item :label="t('站内消息')" prop="message_content">
        <el-input v-model="form.message_content" clearable :placeholder="t('站内消息')"/>
      </el-form-item>
      <el-form-item :label="t('短信内容')" prop="message_sms">
        <el-input v-model="form.message_sms" clearable :placeholder="t('短信内容')"/>
      </el-form-item>
      <el-form-item :label="t('APP内容')" prop="message_app">
        <el-input v-model="form.message_app" clearable :placeholder="t('APP内容')"/>
      </el-form-item>
      <el-form-item :label="t('消息类型')" prop="message_type">
        <el-select v-model="form.message_type" clearable :placeholder="t('请选择消息类型')" style="width: 100%">
          <el-option
            v-for="(item, index) in message_type_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('消息分组')" prop="message_category">
        <el-select v-model="form.message_category" clearable :placeholder="t('请选择消息分组')" style="width: 100%">
          <el-option
            v-for="(item, index) in message_category_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('消息排序')" prop="message_order">
        <el-input v-model="form.message_order" clearable :placeholder="t('消息排序')"/>
      </el-form-item>
      <el-form-item :label="t('模板编号')" prop="message_tpl_id">
        <el-input v-model="form.message_tpl_id" clearable :placeholder="t('模板编号')"/>
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
import {doEdit, doAdd} from '@/api/sys/messageTemplate'

export default defineComponent({
  name: 'MessageTemplateEdit',
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
      message_type_options: [
        {
          value: 1,
          label: '用户'
        },
        {
          value: 2,
          label: '商家'
        },
        {
          value: 3,
          label: '平台'
        },
      ],
      message_category_options: [
        {
          value: 0,
          label: '默认消息'
        },
        {
          value: 1,
          label: '公告消息'
        },
        {
          value: 2,
          label: '订单消息'
        },
        {
          value: 3,
          label: '商品消息'
        },
        {
          value: 4,
          label: '余额卡券'
        },
        {
          value: 5,
          label: '服务信息'
        },
      ],
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
