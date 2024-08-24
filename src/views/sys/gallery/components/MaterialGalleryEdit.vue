<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('分类编号')" prop="gallery_id">
        <el-input v-model="form.gallery_id" clearable :disabled="isUpdate" :placeholder="t('分类编号')"/>
      </el-form-item>
      <el-form-item :label="t('分类名称')" prop="gallery_name">
        <el-input v-model="form.gallery_name" clearable :placeholder="t('分类名称')"/>
      </el-form-item>
      <el-form-item :label="t('分类排序')" prop="gallery_sort">
        <el-input v-model="form.gallery_sort" clearable :placeholder="t('分类排序')"/>
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
import {doEditGallery as doEdit, doAddGallery as doAdd} from '@/api/sys/material'

export default defineComponent({
  name: 'MaterialGalleryEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        roles: [],
      },
      rules: {
        gallery_name: [{required: true, trigger: 'blur', message: t('请输入分类名称')}],
        gallery_sort:[
          {pattern: /^\+?[0-9]*$/, trigger: ['blur','change'], message: t('只能输入数字')},
        ]
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
        roles: [],
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
