<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('编号')" prop="category_nav_id">
        <el-input v-model="form.category_nav_id" clearable :disabled="isUpdate" :placeholder="t('编号')"/>
      </el-form-item>

      <el-form-item
        :label="t('模板分类')"
        prop="category_nav_type"
      >
        <el-radio-group v-model="form.category_nav_type">
          <el-radio :label="1">{{ t('分类') }}</el-radio>
          <el-radio :label="2">{{ t('商品') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('导航名称')" prop="category_nav_name">
        <el-input v-model="form.category_nav_name" clearable :placeholder="t('导航名称')"/>
      </el-form-item>
      <el-form-item :label="t('导航图片')" prop="category_nav_image">
        <pic-upload
          ref="picUpRef"
          v-model="form.category_nav_image"
          height="80"
          :limit="1"
          width="80"
        />
      </el-form-item>
      <el-form-item v-if="form.category_nav_type==1" :label="t('商品分类')" prop="category_ids">
        <el-select v-model="form.category_ids" clearable :placeholder="t('请选择商品分类')" style="width: 100%;">
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.category_name"
            :value="item.category_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.category_nav_type==2" :label="t('推荐商品')" prop="item_ids">
        <el-input v-model="form.item_ids" clearable :placeholder="t('推荐商品')" @click="handleItemTable"/>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="category_nav_enable">
        <el-switch v-model="form.category_nav_enable"/>
      </el-form-item>

      <el-form-item :label="t('排序')" prop="category_nav_order">
        <el-input v-model="form.category_nav_order" clearable :placeholder="t('排序')"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>

    <item ref="tableRef" :close-clear="false" :selected="selectedItems" @check-item="getListItem"/>
  </el-dialog>
</template>

<script>
import { translate as t } from '@/i18n'
import {doEdit, doAdd} from '@/api/sys/pageCategoryNav'
import PicUpload from '@/plugins/MsUpload/PicUpload'
import {getList} from "@/api/pt/productCategory";
import Item from '@/plugins/ProductTable/BaseDialogTable'



export default defineComponent({
  name: 'PageCategoryNavEdit',
  components: {PicUpload, Item},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      tableRef: null,
      selectedItems:[],
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

      isExpandTreeSelect:true,
      categoryList: [],
    })

    const showEdit = (row) => {

      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
        state.selectedItems = []
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)

        if (state.form.category_ids) {
          state.form.category_ids = parseInt(state.form.category_ids)
        }

        if (state.form.item_ids) {
          state.selectedItems = state.form.item_ids.split(',').map(Number)
        } else {
          state.selectedItems = []
        }
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

    const getListItem = async (e, ids) => {
      console.info(ids)
      console.info(ids)
      console.info(JSON.stringify(ids))
      if (ids) {
        /*
        const itemIds = []

        e.forEach((item) => {
          itemIds.push(item.item_id)
        })

         */

        state.selectedItems = ids
        state.form.item_ids = ids.toString()

      }
    }

    const handleItemTable = () => {
      state.tableRef.showTable()
    }
    const getCategoryData = async () => {
      const {
        data: {items},
      } = await getList({
        page: 1,
        size:500
      })

      state.categoryList = items
    }

    onMounted(() => {
      getCategoryData()
    })

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      close,
      save,
      getListItem,
      handleItemTable,
    }
  },
})
</script>
<style lang="scss">
.el-input__wrapper{
  width: 100%;
}
</style>
