<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="90px" :model="form" :rules="rules">
      <el-form-item v-if="false" :label="t('等级编号')" prop="user_level_id">
        <el-input v-model="form.user_level_id" clearable :disabled="isUpdate" :placeholder="t('等级编号')"/>
      </el-form-item>
      <el-form-item :label="t('等级名称')" prop="user_level_name">
        <el-input v-model="form.user_level_name" clearable :placeholder="t('等级名称')"/>
      </el-form-item>
      <el-form-item :label="t('升级经验值')" prop="user_level_exp">
        <el-input v-model="form.user_level_exp" clearable :placeholder="t('升级经验值')"/>
      </el-form-item>
      <el-form-item :label="t('累计消费')" prop="user_level_spend">
        <el-input v-model="form.user_level_spend" clearable :placeholder="t('累计消费')"/>
      </el-form-item>
      <el-form-item :label="t('等级图标')" prop="user_level_logo">
        <pic-upload
          ref="picUpRef"
          v-model="form.user_level_logo"
          :limit="1"
          size="200"
        />
      </el-form-item>
      <el-form-item :label="t('折扣率')" prop="user_level_rate">
        <el-input v-model="form.user_level_rate" clearable :placeholder="t('折扣率')"/>
      </el-form-item >
      <el-form-item v-if="false" :label="t('修改时间')" prop="user_level_time">
        <el-date-picker
          v-model="form.user_level_time"
          clearable
          :disabled="isUpdate"
          :placeholder="t('修改时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item v-if="false" :label="t('系统内置')" prop="user_level_is_buildin">
        <el-input v-model="form.user_level_is_buildin" clearable :disabled="isUpdate" :placeholder="t('系统内置')"/>
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
import {doEdit, doAdd} from '@/api/account/userLevel'
import PicUpload from '@/plugins/MsUpload/PicUpload'

export default defineComponent({
  name: 'UserLevelEdit',
  components:{PicUpload},
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
        user_level_name: [{required: true, trigger: 'blur', message: t('请输入等级名称')}],
        user_level_exp: [{required: true, trigger: 'blur', message: t('请输入升级经验值')}],
        user_level_spend: [{required: true, trigger: 'blur', message: t('请输入累计消费')}],
        user_level_logo: [{required: true, trigger: 'blur', message: t('请上传等级图标')}],
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
