<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="1000px"
    @close="close"
  >
    <el-form ref="formRef" label-width="140px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('分类编号')" prop="category_id">
        <el-input v-model="form.category_id" clearable :disabled="isUpdate" :placeholder="t('分类编号')"/>
      </el-form-item>
      <el-form-item :label="t('分类名称')" prop="category_name">
        <el-input v-model="form.category_name" clearable :placeholder="t('分类名称')"/>
      </el-form-item>
      <el-form-item :label="t('上级分类')" prop="category_parent_id">
        <el-tree-select
          v-model="form.category_parent_id"
          :check-strictly="true"
          :data="categoryList"
          :default-expand-all="isExpandTreeSelect"
          highlight-current
          node-key="category_id"
          :placeholder="t('请选择上级分类')"
          :props="{ value: 'category_id', label: 'category_name'}"
          style="width: 100%"
          value-key="category_name"
        />
      </el-form-item>
      <el-form-item :label="t('分类图标')" prop="category_image_url">
        <pic-upload
          ref="picUpRef"
          v-model="form.category_image_url"
          height="50"
          :limit="1"
          width="50"
        />
      </el-form-item>
      <div style="height: 500px">
        <el-form-item :label="t('分类描述')" prop="category_desc">
          <MsRichEditor
            v-if="showRichEditor"
            ref="msRichEditorRef"
            v-model="form.category_desc"
            style="height: 300px;"
          />
        </el-form-item>
      </div>
      <el-form-item :label="t('分类排序')" prop="category_order">
        <el-input v-model="form.category_order" clearable :placeholder="t('分类排序')"/>
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
import {doEdit, doAdd, getTree} from '@/api/cms/articleCategory'
import PicUpload from "@/plugins/MsUpload/PicUpload";
import MsRichEditor from "@/plugins/MsRichEditor";

export default defineComponent({
  name: 'ArticleCategoryEdit',
  components: {PicUpload, MsRichEditor},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      showRichEditor:false,
      formRef: null,
      form: {
        category_is_leaf: true,
        category_buildin: false,
      },
      title: '',
      categoryList: [],
      isExpandTreeSelect:true,
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const rules = reactive({
      category_name: [{required: true, trigger: 'blur', message: t('请输入分类名称')}],
      //category_desc: [{required: true, trigger: 'blur', message: t('请输入分类描述')}],
      category_is_leaf: [{required: true, trigger: 'change', message: t('请选择是否叶节点')}],
    })

    const getCategoryData = async () => {
      const {
        data: list,
      } = await getTree({})
      state.categoryList = list
    }

    const showEdit = (row) => {
      state.showRichEditor = true
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

    const showAdd = (row) => {
      getCategoryData()
      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = false
        state.title = t('添加')
        state.form.category_parent_id = row.category_id
      }
      state.dialogFormVisible = true
    }

    const close = () => {
      state.showRichEditor = false;
      state['formRef'].resetFields()
      state.form = {
        category_is_leaf: true,
        category_buildin: false,
        category_desc: '',
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
          await getCategoryData()
          close()
        }
      })
    }

    onMounted(() => {
      getCategoryData()
    })

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      showAdd,
      rules,
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
