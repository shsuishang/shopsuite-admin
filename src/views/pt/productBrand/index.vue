<template>
  <div class="product-brand-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="6">
        <el-button
v-permissions="{ permission: ['/manage/pt/productBrand/add'] }" :icon="Plus" type="primary"
                   @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="18">
        <el-form
v-permissions="{ permission: ['/manage/pt/productBrand/list'] }" :inline="true" :model="queryForm"
                 @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.brand_name"
              clearable
              :placeholder="t('请输入品牌名称')"
            />
          </el-form-item>

          <el-form-item>
            <el-tree-select
              v-model="queryForm.category_id"
              clearable
              :data="categoryList"
              :default-expand-all="isExpandTreeSelect"
              filterable
              highlight-current
              node-key="category_id"
              :placeholder="t('请选择关联分类')"
              :props="{ value: 'category_id', label: 'category_name'}"
              style="width: 180px;"
              value-key="category_name"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="queryData">
              {{ t('查询') }}
            </el-button>
          </el-form-item>
        </el-form>
      </ms-search-box-right-panel>
    </ms-search-box>

    <el-table
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('品牌编号')"
        prop="brand_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('品牌名称')"
        prop="brand_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('品牌拼音')"
        prop="brand_code"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('首字母')"
        prop="brand_initial"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('品牌描述')"
        prop="brand_desc"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('所属分类')"
        prop="category_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('展示方式')"
        prop="brand_show_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.brand_show_type]'>
            {{ ({"1": t('图片'), "2": t('文字')})[row.brand_show_type] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="t('品牌LOGO')"
        prop="category_image"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.brand_image]"
            preview-teleported
            :src="row.brand_image"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否推荐')"
        prop="brand_recommend"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.brand_recommend ? t('点击') + t('不推荐') :  t('点击')  + t('推荐')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.brand_recommend" @change="handleState(row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="brand_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.brand_enable ? t('点击') + t('禁用') :  t('点击')  + t('启用')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.brand_enable" @change="handleState(row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('店铺编号')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('品牌申请')"
        prop="brand_apply"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["","success"])[row.brand_apply]'>
            {{ ([t('申请中'), t('通过')])[row.brand_apply] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('背景图')"
        prop="brand_bg"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productBrand/edit'] }" text @click="handleEdit(row)">
            {{ t('编辑') }}
          </el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productBrand/remove'] }" text @click="handleDelete(row)">
            {{ t('删除') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.size"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {doRemove, doRemoveBatch, getList, editState} from '@/api/pt/productBrand'
import Edit from './components/ProductBrandEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getTree} from "@/api/pt/productCategory";

export default defineComponent({
  name: 'ProductBrand',
  components: {Edit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        brand_name: '',
      },

      isExpandTreeSelect:true,
      categoryList: [],
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.brand_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.brand_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({brand_id: row.brand_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const brand_id = state.selectRows.map((item) => item.brand_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({brand_id})
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            await fetchData()
          })
        } else {
          $message(t('未选中任何行'), 'error')
        }
      }
    }
    const handleState = async (row) => {
      const param = {
        brand_id: row.brand_id,
        brand_recommend: row.brand_recommend,
        brand_enable: row.brand_enable
      }

      const {msg, status} = await editState(param)

      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }

      await fetchData()
    }
    const handleSizeChange = (val) => {
      state.queryForm.size = val
      fetchData()
    }
    const handleCurrentChange = (val) => {
      state.queryForm.page = val
      fetchData()
    }
    const queryData = () => {
      state.queryForm.page = 1
      fetchData()
    }
    const fetchData = async () => {
      state.listLoading = true
      const {
        data: {items, records},
      } = await getList(state.queryForm)
      state.items = items
      state.total = records
      state.listLoading = false
    }

    const getCategoryData = async () => {
      const {
        data: items,
      } = await getTree({})

      state.categoryList = items
    }

    onMounted(() => {
      getCategoryData()
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleEdit,
      handleDelete,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-brand';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
