<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('编号')" prop="type_id">
        <el-input v-model="form.type_id" clearable :disabled="isUpdate" :placeholder="t('编号')"/>
      </el-form-item>
      <el-form-item :label="t('类型名称')" prop="type_name">
        <el-input v-model="form.type_name" clearable :placeholder="t('类型名称')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('备注')" prop="type_remark">
        <el-input v-model="form.type_remark" clearable :placeholder="t('备注')"/>
      </el-form-item>
      <el-form-item :label="t('商品分类')" prop="category_id">
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
      <el-form-item :label="t('关联规格')" prop="spec_ids">
        <el-tree-select
          v-model="form.spec_ids"
          :data="specList"
          :default-expand-all="isExpandTreeSelect"
          filterable
          highlight-current
          multiple
          node-key="spec_id"
          :placeholder="t('请选择商品规格')"
          :props="{ value: 'spec_id', label: 'spec_name'}"
          style="width: 100%"
          value-key="spec_name"
        />
      </el-form-item>
      <el-form-item :label="t('关联品牌')" prop="brand_ids">
        <el-tree-select
          v-model="form.brand_ids"
          :data="brandList"
          :default-expand-all="isExpandTreeSelect"
          filterable
          highlight-current
          multiple
          node-key="brand_id"
          :placeholder="t('请选择商品品牌')"
          :props="{ value: 'brand_id', label: 'brand_name'}"
          style="width: 100%"
          value-key="brand_name"
        />
      </el-form-item>
      <el-form-item :label="t('辅助属性')" prop="assist_ids">
        <el-tree-select
          v-model="form.assist_ids"
          :data="assistList"
          :default-expand-all="isExpandTreeSelect"
          filterable
          highlight-current
          multiple
          node-key="assist_id"
          :placeholder="t('请选择辅助属性')"
          :props="{ value: 'assist_id', label: 'assist_name'}"
          style="width: 100%"
          value-key="assist_name"
        />
      </el-form-item>
      <el-form-item v-if="false" :label="t('是否草稿')" prop="type_is_draft">
        <el-radio-group
          v-model="form.type_is_draft">
          <el-radio :label="1">草稿</el-radio>
          <el-radio :label="0">发布</el-radio>
        </el-radio-group>
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
import {doEdit, doAdd} from '@/api/pt/productType'
import {getTree} from "@/api/pt/productCategory";
import {getBrandTree} from "@/api/pt/productBrand";
import {getSpecTree} from "@/api/pt/productSpec";
import {getAssistTree} from "@/api/pt/productAssist";

export default defineComponent({
  name: 'ProductTypeEdit',
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
        type_name: [{required: true, trigger: 'blur', message: t('请输入类型名称')}],
        category_id: [{required: true, trigger: 'blur', message: t('请选择分类')}],
        //spec_ids: [{required: true, trigger: 'blur', message: t('请选择规格')}],
        //brand_ids: [{required: true, trigger: 'blur', message: t('请选择品牌')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      isExpandTreeSelect:true,
      categoryList: [],
      brandList: [],
      assistList: [],
      specList: []
    })

    const showEdit = (row) => {

      if (!row) {
        state.isUpdate = false
        state.title = t('添加')

        state.form.brand_ids = []
        state.form.spec_ids = []
        state.form.assist_ids = []
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)
        state.form.brand_ids = row.brand_ids ? row.brand_ids.split(',').map(Number) : []
        state.form.spec_ids = row.spec_ids ? row.spec_ids.split(',').map(Number) : []
        state.form.assist_ids = row.assist_ids ? row.assist_ids.split(',').map(Number) : []
      }

      state.dialogFormVisible = true
    }

    const getCategoryData = async () => {
      const {
        data: list,
      } = await getTree({
        page: 1,
        size: 4,
      })
      state.categoryList = list
    }

    const getBrandData = async () => {
      const {
        data: list,
      } = await getBrandTree({})
      state.brandList = list
    }

    const getAssistData = async () => {
      const {
        data: list,
      } = await getAssistTree({})
      state.assistList = list
    }


    const getSpecData = async () => {
      const {
        data: list,
      } = await getSpecTree({})
      state.specList = list
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
          state.form.brand_ids = state.form.brand_ids.join()
          state.form.spec_ids = state.form.spec_ids.join()
          state.form.assist_ids = state.form.assist_ids.join()
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
      getBrandData()
      getCategoryData()
      getSpecData()
      getAssistData()
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
