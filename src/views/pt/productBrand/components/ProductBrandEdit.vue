<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('品牌编号')" prop="brand_id">
        <el-input v-model="form.brand_id" clearable :disabled="isUpdate" :placeholder="t('品牌编号')"/>
      </el-form-item>
      <el-form-item :label="t('品牌名称')" prop="brand_name">
        <el-input v-model="form.brand_name" clearable :placeholder="t('品牌名称')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('品牌拼音')" prop="brand_code">
        <el-input v-model="form.brand_code" clearable :placeholder="t('品牌拼音')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('首字母')" prop="brand_initial">
        <el-input v-model="form.brand_initial" clearable :placeholder="t('首字母')"/>
      </el-form-item>
      <el-form-item :label="t('品牌描述')" prop="brand_desc">
        <el-input v-model="form.brand_desc" clearable :placeholder="t('品牌描述')"/>
      </el-form-item>
      <el-form-item :label="t('所属分类')" prop="category_id">
        <el-tree-select
          v-model="form.category_id"
          :data="categoryList"
          :default-expand-all="isExpandTreeSelect"
          filterable
          highlight-current
          node-key="category_id"
          :placeholder="t('请选择商品分类')"
          :props="{ value: 'category_id', label: 'category_name'}"
          style="width: 100%"
          value-key="category_name"
        />
      </el-form-item>
      <el-form-item prop="brand_show_type">
        <el-radio-group
          v-model="form.brand_show_type">
          <el-radio :label="1">图片</el-radio>
          <el-radio :label="2">文字</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('品牌LOGO')" prop="brand_image">
        <pic-upload
          ref="picUpRef"
          v-model="form.brand_image"
          :limit="1"
          size="200"
        />
      </el-form-item>
      <el-form-item :label="t('是否推荐')" prop="brand_recommend">
        <el-switch
          v-model="form.brand_recommend"
        />
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="brand_enable">
        <el-switch
          v-model="form.brand_enable"
        />
      </el-form-item>
      <el-form-item v-if="false" :label="t('店铺编号')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('店铺编号')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('品牌申请')" prop="brand_apply">
        <el-radio-group
          v-model="form.brand_apply">
          <el-radio :label="0">申请中</el-radio>
          <el-radio :label="1">通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="false" :label="t('背景图')" prop="brand_bg">
        <el-input v-model="form.brand_bg" clearable :placeholder="t('背景图')"/>
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
import {doEdit, doAdd} from '@/api/pt/productBrand'
import {getTree} from "@/api/pt/productCategory";
import PicUpload from '@/plugins/MsUpload/PicUpload'

export default defineComponent({
  name: 'ProductBrandEdit',
  components:{PicUpload},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        brand_enable: true,
      },
      rules: {
        brand_name: [{required: true, trigger: 'blur', message: t('请输入品牌名称')}],
        brand_desc: [{required: true, trigger: 'blur', message: t('请输入品牌描述')}],
        category_id: [{required: true, trigger: 'blur', message: t('请选择所属分类')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      isExpandTreeSelect:true,
      categoryList: [],
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
    const initCategory = async () => {
      const { data: list, } = await getTree({ page: 1, size: 500, })
      state.categoryList = list
    }
    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        brand_enable: true,
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

              emit('fetch-data')
            } else {
              $message(msg, 'error')
            }
          } else {
            const { msg, status } = await doAdd(state.form)
            if (200 == status) {
              $message(msg, 'success')

              emit('fetch-data')
            } else {
              $message(msg, 'error')
            }
          }

          close()
        }
      })
    }
    onMounted(() => {
      initCategory()
    })

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
