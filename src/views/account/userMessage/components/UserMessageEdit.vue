<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('消息编号')" prop="message_id">
        <el-input v-model="form.message_id" clearable :disabled="isUpdate" :placeholder="t('消息编号')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('上级编号')" prop="message_parent_id">
        <el-input v-model="form.message_parent_id" clearable :placeholder="t('上级编号')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('所属用户')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('所属用户')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('用户昵称')" prop="user_nickname">
        <el-input v-model="form.user_nickname" clearable :placeholder="t('用户昵称')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('消息种类')" prop="message_kind">
        <el-select v-model="form.message_kind" :placeholder="t('请选择消息种类')" style="width: 80%">
          <el-option
            v-for="(item, index) in message_kind_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('相关用户')" prop="user_other_id">
        <el-input v-model="form.user_other_id" clearable :placeholder="t('相关用户')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('相关昵称')" prop="user_other_nickname">
        <el-input v-model="form.user_other_nickname" clearable :placeholder="t('相关昵称')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('消息标题')" prop="message_title">
        <el-input v-model="form.message_title" clearable :placeholder="t('消息标题')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('消息内容')" prop="message_content">
        <el-input v-model="form.message_content" clearable :placeholder="t('消息内容')" style="width: 80%" type="textarea" />
      </el-form-item>
      <el-form-item :label="t('发送时间')" prop="message_time">
        <el-date-picker
          v-model="form.message_time"
          clearable
          :placeholder="t('发送时间')"
          style="width:80%;"
          type="datetime"
        />
      </el-form-item>
      <el-form-item :label="t('是否读取')" prop="message_is_read">
        <el-switch
          v-model="form.message_is_read"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('是否删除')" prop="message_is_delete">
        <el-switch
          v-model="form.message_is_delete"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('消息类型')" prop="message_type">
        <el-select v-model="form.message_type" :placeholder="t('请选择消息类型')" style="width: 80%">
          <el-option
            v-for="(item, index) in message_type_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('消息类型')" prop="message_cat">
        <el-select v-model="form.message_cat" :placeholder="t('请选择消息类型')" style="width: 80%">
          <el-option
            v-for="(item, index) in message_cat_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('消息分类')" prop="message_data_type">
        <el-select v-model="form.message_data_type" :placeholder="t('请选择消息分类')" style="width: 80%">
          <el-option
            v-for="(item, index) in message_data_type_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('消息数据')" prop="message_data_id">
        <el-input v-model="form.message_data_id" clearable :placeholder="t('消息数据')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('消息长度')" prop="message_length">
        <el-input v-model="form.message_length" clearable :placeholder="t('消息长度')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('图片宽度')" prop="message_w">
        <el-input v-model="form.message_w" clearable :placeholder="t('图片宽度')" style="width: 80%"/>
      </el-form-item>
      <el-form-item :label="t('图片高度')" prop="message_h">
        <el-input v-model="form.message_h" clearable :placeholder="t('图片高度')" style="width: 80%"/>
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
import {doEdit, doAdd} from '@/api/account/userMessage'

export default defineComponent({
  name: 'UserMessageEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        message_time: '',
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
      message_kind_options: [
        {
          value: 1,
          label: '发送消息'
        },
        {
          value: 2,
          label: '接收消息'
        },
      ],
      message_type_options: [
        {
          value: 1,
          label: '系统消息'
        },
        {
          value: 1,
          label: '用户消息'
        },
      ],
      message_cat_options: [
        {
          value: 'text',
          label: '文本消息'
        },
        {
          value: 'img',
          label: '图片消息'
        },
        {
          value: 'video',
          label: '视频消息'
        },
        {
          value: 'file',
          label: '文件'
        },
        {
          value: 'location',
          label: '位置'
        },
        {
          value: 'redpack',
          label: '红包'
        },
      ],
      message_data_type_options: [
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
          label: '服务消息'
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

          if (state.form.message_time) {
            state.form.message_time = state.form.message_time.getTime()
          }

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
