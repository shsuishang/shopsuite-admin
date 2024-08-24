<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('导航编号')" prop="nav_id">
        <el-input v-model="form.nav_id" clearable :disabled="isUpdate" :placeholder="t('导航编号')"/>
      </el-form-item>
      <el-form-item :label="t('导航标题')" prop="nav_title">
        <el-input v-model="form.nav_title" clearable :placeholder="t('导航标题')"/>
      </el-form-item>
      <el-form-item :label="t('导航链接')" prop="nav_url">
        <el-input v-model="form.nav_url" clearable :placeholder="t('导航链接')"/>
      </el-form-item>
      <el-form-item :label="t('导航位置')" prop="nav_position">
        <el-select
          v-model="form.nav_position"
          class="ele-block"
          placeholder="请选择导航位置">
          <el-option label="头部" :value="0"/>
          <el-option label="中部" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('下拉内容')" prop="nav_dropdown_menu">
        <el-input v-model="form.nav_dropdown_menu" clearable :placeholder="t('导航下拉内容')" type="textarea"/>
      </el-form-item>
      <el-form-item :label="t('排序')" prop="nav_order">
        <el-input v-model="form.nav_order" clearable :placeholder="t('排序')"/>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="nav_enable">
        <el-switch v-model="form.nav_enable"/>
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
import {doEdit, doAdd} from '@/api/sys/pagePcNav'

export default defineComponent({
  name: 'PagePcNavEdit',
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
</style>
