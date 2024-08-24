<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item v-if="false" :label="t('属性编号')" prop="assist_id">
        <el-input v-model="form.assist_id" clearable :disabled="isUpdate" :placeholder="t('属性编号')"/>
      </el-form-item>
      <el-form-item :label="t('属性名称')" prop="assist_name">
        <el-input v-model="form.assist_name" clearable :placeholder="t('属性名称')"/>
      </el-form-item>
      <el-form-item :label="t('类型编号')" prop="type_id">
        <el-input v-model="form.type_id" clearable disabled :placeholder="t('类型编号')"/>
      </el-form-item>
      <el-form-item :label="t('排序')" prop="assist_sort">
        <el-input v-model="form.assist_sort" clearable :placeholder="t('排序')"/>
      </el-form-item>
      <el-form-item :label="t('备注分类')" prop="category_id">
        <el-tree-select
          v-model="form.category_id"
          :data="categoryList"
          :default-expand-all="isExpandTreeSelect"
          filterable
          highlight-current
          node-key="category_id"
          :placeholder="t('请选择上级菜单')"
          :props="{ value: 'category_id', label: 'category_name'}"
          style="width: 100%"
          value-key="category_name"
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
import {doEdit, doAdd} from '@/api/pt/productAssist'
import {getTree} from "@/api/pt/productCategory";

export default defineComponent({
  name: 'ProductAssistEdit',
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
        category_id: [{required: true, trigger: 'blur', message: t('请备注分类')}],
        assist_name: [{required: true, trigger: 'blur', message: t('请输入属性名称')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      isExpandTreeSelect:true,
      categoryList: []
    })

    const showEdit = (row) => {

      if (!row || (row && !row.assist_id)) {
        state.isUpdate = false
        state.title = t('添加')
        state.form = Object.assign({}, row)
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

    onMounted(() => {
      getCategoryTree()
    })

    const getCategoryTree = async () => {
      const {
        data: list,
      } = await getTree({
        page: 1,
        size: 4,
      })
      state.categoryList = list
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
