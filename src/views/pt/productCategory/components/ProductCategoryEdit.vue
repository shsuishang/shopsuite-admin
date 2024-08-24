<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('分类编号')" prop="category_id">
        <el-input v-model="form.category_id" clearable :disabled="isUpdate" :placeholder="t('分类编号')"/>
      </el-form-item>
      <el-form-item :label="t('上级编号')" prop="category_parent_id">
        <el-tree-select
          v-model="form.category_parent_id"
          :check-strictly="true"
          :data="categoryList"
          :default-expand-all="isExpandTreeSelect"
          highlight-current
          node-key="category_id"
          :placeholder="t('请选择商品分类')"
          :props="{ value: 'category_id', label: 'category_name'}"
          style="width: 100%"
          value-key="category_name"
        />
      </el-form-item>
      <el-form-item :label="t('分类名称')" prop="category_name">
        <el-input v-model="form.category_name" clearable :placeholder="t('分类名称')"/>
      </el-form-item>
      <el-form-item :label="t('分类图片')" prop="category_image">
        <pic-upload
          ref="picUpRef"
          v-model="form.category_image"
          height="80"
          :limit="1"
          width="80"
        />
      </el-form-item>
      <el-form-item :label="t('类型名称')" prop="type_id">
        <el-select
          v-model="form.type_id"
          clearable
          :disabled="isUpdate && false"
          filterable
          :placeholder="t('请选择商品类型')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :disabled="item.disabled"
            :label="item.type_name"
            :value="item.type_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('分佣比例')" prop="category_commission_rate">
        <el-input v-model="form.category_commission_rate" clearable :placeholder="t('分佣比例')"/>
      </el-form-item>
      <el-form-item :label="t('排序')" prop="category_sort">
        <el-input v-model="form.category_sort" clearable :placeholder="t('排序')"/>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="category_is_enable">
        <el-switch
          v-model="form.category_is_enable"
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
import {doEdit, doAdd} from '@/api/pt/productCategory'
import {getList} from '@/api/pt/productType'
import {getTree} from "@/api/pt/productCategory";
import PicUpload from '@/plugins/MsUpload/PicUpload'

export default defineComponent({
  name: 'ProductCategoryEdit',
  components: {PicUpload},
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
        category_name: [{required: true, trigger: 'blur', message: t('请输入产品分类名称')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      isExpandTreeSelect:true,
      categoryList: [],
      typeOptions: [],
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

    const getCategoryData = async () => {
      const {
        data: list,
      } = await getTree({})

      const items = [
        {
          category_id: 0,
          category_name: t('根节点'),
          children: list,
        },
      ]

      state.categoryList = items
    }
    const initType = async () => {
      const { data } = await getList({size:500,})
      state.typeOptions = data.items
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
      initType()
      getCategoryData()
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
