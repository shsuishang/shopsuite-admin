<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('所属分组')" prop="tag_group_id">
        <el-input v-model="form.tag_group_id" clearable :disabled="true" :placeholder="t('所属分组')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('标签编码')" prop="tag_id">
        <el-input v-model="form.tag_id" clearable :disabled="isUpdate" :placeholder="t('标签编码')"/>
      </el-form-item>
      <el-form-item :label="t('标签名称')" prop="tag_title">
        <el-input v-model="form.tag_title" clearable :placeholder="t('标签名称')"/>
      </el-form-item>
      <el-form-item :label="t('排序')" prop="tag_sort">
        <el-input v-model="form.tag_sort" clearable :placeholder="t('排序')"/>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="tag_enable">
        <el-switch
          v-model="form.tag_enable"
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
  import {doEdit, doAdd} from '@/api/account/userTagBase'

  export default defineComponent({
    name: 'UserTagBaseEdit',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          tag_enable: false,
        },
        rules: {
          tag_title: [{required: true, trigger: 'blur', message: t('请输入标签名称')}],
        },
        title: '',
        dialogFormVisible: false,
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
      })

      const showEdit = (row) => {

        if (!row || (row && !row.tag_id)) {
          state.isUpdate = false
          state.title = t('添加')
          state.form = Object.assign({}, row)
          state.form.tag_enable = false
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
          tag_enable: false,
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
