<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('主键编号')" prop="dict_id">
        <el-input v-model="form.dict_id" clearable :disabled="isUpdate" :placeholder="t('主键编号')"/>
      </el-form-item>
      <el-form-item :label="t('字典名称')" prop="dict_name">
        <el-input v-model="form.dict_name" clearable :placeholder="t('字典名称')"/>
      </el-form-item>
      <el-form-item :label="t('显示顺序')" prop="dict_sort">
        <el-input v-model="form.dict_sort" clearable :placeholder="t('显示顺序')"/>
      </el-form-item>
      <el-form-item :label="t('字典备注')" prop="dict_note">
        <el-input v-model="form.dict_note" clearable :placeholder="t('字典备注')"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/sys/dict'
  import { uuid } from '@/utils'
  import {translate as t} from "@/i18n";

  export default defineComponent({
    name: 'DictEdit',
    emits: ['fetch-data', 'fetch-tree'],
    setup(props, { emit }) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          roles: [],
        },
        rules: {
          dict_id: [{required: true, trigger: 'blur', message: t('请输入主键编号')}],
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
          state.form = { dict_id: uuid()}
        } else {
          state.isUpdate = true
          state.title = t('编辑')
          state.form = { ...JSON.parse(JSON.stringify(row))}
        }

        state.dialogFormVisible = true
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          dict_id: uuid(),
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {

            if (state.isUpdate) {

              const { msg } = await doEdit(state.form)
              $message(msg, 'success')
            } else {
              const { msg } = await doAdd(state.form)
              $message(msg, 'success')
            }

            emit('fetch-tree', {  })
            //emit('fetch-data', { key: state.form.parentKey })
            close()
          }
        })
      }

      return {
        t,
        ...toRefs(state),
        showEdit,
        close,
        save,
      }
    },
  })
</script>
