<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="800px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('任务编号')" prop="crontab_id">
        <el-input v-model="form.crontab_id" clearable :disabled="isUpdate" :placeholder="t('任务编号')"/>
      </el-form-item>
      <el-form-item :label="t('任务名称')" prop="crontab_name">
        <el-input v-model="form.crontab_name" clearable :disabled="isUpdate" :placeholder="t('任务名称')"/>
      </el-form-item>
      <el-form-item :label="t('任务脚本')" prop="crontab_file">
        <el-input v-model="form.crontab_file" clearable :disabled="isUpdate" :placeholder="t('任务脚本')"/>
      </el-form-item>
      <el-form-item :label="t('执行周期')" prop="crontab_time">
        <el-input v-model="form.crontab_minute" class="cront-time" clearable :placeholder="t('分钟')"><template #append>{{ t('分')}}</template></el-input>
        <el-input v-model="form.crontab_hour" class="cront-time" clearable :placeholder="t('小时')"><template #append>{{ t('时')}}</template></el-input>
        <el-input v-model="form.crontab_day" class="cront-time" clearable :placeholder="t('每天')"><template #append>{{ t('天')}}</template></el-input>
        <el-input v-model="form.crontab_month" class="cront-time" clearable :placeholder="t('每月')"><template #append>{{ t('月')}}</template></el-input>
        <el-input v-model="form.crontab_week" class="cront-time" clearable :placeholder="t('每周')"><template #append>{{ t('周')}}</template></el-input>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="crontab_enable">
        <el-switch
          v-model="form.crontab_enable"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('任务备注')" prop="crontab_remark">
        <el-input v-model="form.crontab_remark" clearable :placeholder="t('任务备注')"/>
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
import {doEdit, doAdd} from '@/api/sys/crontabBase'

export default defineComponent({
  name: 'CrontabBaseEdit',
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

.cront-time {
  width: 120px;
  margin-left: 10px;
}
</style>
