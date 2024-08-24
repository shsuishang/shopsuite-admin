<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('分组编号')" prop="config_type_id">
        <el-input v-model="form.config_type_id" clearable :disabled="true" :placeholder="t('分组编号')"/>
      </el-form-item>
      <el-form-item :label="t('分组名称')" prop="config_type_name">
        <el-input v-model="form.config_type_name" clearable :placeholder="t('分组名称')"/>
      </el-form-item>

      <el-form-item :label="t('所属模块')" prop="config_type_module">
        <el-select
          v-model="form.config_type_module"
          class="ele-block"
          clearable
          :placeholder="t('请选择所属模块')">
          <el-option v-for="([key, value]) in Object.entries(tagGroupModuleObj)" :key="key" :label="value" :value="Number(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('分组排序')" prop="config_type_sort">
        <el-input v-model="form.config_type_sort" clearable :placeholder="t('分组排序')"/>
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
import {doEditType, doAddType} from '@/api/sys/config'

export default defineComponent({
  name: 'ConfigTypeEdit',
  props:{
    tagGroupModule: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const opts = JSON.parse(JSON.stringify(props));

    const $message = inject('$message')
    const tagGroupModuleObj = ref(opts.tagGroupModule);

    console.info(Object.entries(opts.tagGroupModule))
    console.info(Object.entries(tagGroupModuleObj))

    const state = reactive({
      formRef: null,
      form: {
        roles: [],
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
        roles: [],
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          if (state.isUpdate) {
            const { msg, status } = await doEditType(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const { msg, status } = await doAddType(state.form)
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
      t,
      tagGroupModuleObj,
      ...toRefs(state),
      showEdit,
      close,
      save,
    }
  },
})
</script>
