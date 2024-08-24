<template>
  <div class="product-category-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/pt/productCategory/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
        <el-button
          :icon="Upload"
          type="primary"
          @click="toggleRowExpansion(true)"
        >
          {{ t('全部展开') }}
        </el-button>
        <el-button
          :icon="Download"
          type="primary"
          @click="toggleRowExpansion(false)"
        >
          {{ t('全部折叠') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/pt/productCategory/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.category_name"
              clearable
              :placeholder="t('请输入分类名称')"
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
      ref="treeRef"
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      row-key="category_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="left"
        fixed="left"
        :label="t('分类名称')"
        prop="category_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('分类编号')"
        prop="category_id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('上级编号')"
        prop="category_parent_id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('分类图片')"
        prop="category_image"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.category_image]"
            preview-teleported
            :src="row.category_image"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('类型名称')"
        prop="type_id"
        show-overflow-tooltip
        width="90"
      >
        <template #default="{ row }">
          <block v-if="typeOptions">
            <div v-for="(item, index) in typeOptions" :key="index">
              <el-tag v-if="item.type_id == row.type_id">
                {{ item.type_name }}
              </el-tag>
            </div>
          </block>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('分佣比例')"
        prop="category_commission_rate"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="category_sort"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="category_is_enable"
        show-overflow-tooltip
        width="90"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.category_is_enable === 0 ? t('点击') + t('显示') :  t('点击')  + t('不显示')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.category_is_enable" :before-change="beforeSwitchChange" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productCategory/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productCategory/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, editState, getTree} from '@/api/pt/productCategory'
import Edit from './components/ProductCategoryEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getList} from '@/api/pt/productType'

export default defineComponent({
  name: 'ProductCategory',
  components: {Edit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      treeRef: null,
      editRef: null,
      height: $tableHeight() + 55,
      items: [],
      typeOptions: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      switchStatus: false,
      queryForm: {
        page: 1,
        size: 10,
        category_name: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.category_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.category_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({category_id: row.category_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const category_id = state.selectRows.map((item) => item.category_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({category_id})
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
    const beforeSwitchChange = () => {
      state.switchStatus = true;
      return state.switchStatus;
    }
    const handleState = async (row) => {
        if (state.switchStatus) {
          const param = {
            category_id: row.category_id,
            category_is_enable: row.category_is_enable,
          }

          const {msg, status} = await editState(param)

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        }
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
        data: data,
      } = await getTree(state.queryForm)
      state.items = data
      state.listLoading = false
    }

    const toggleRowExpansion = (isExpansion) => {
      toggleRowExpansionAll(state.items, isExpansion)
    }

    const toggleRowExpansionAll = (data, isExpansion) => {
      data.forEach((item) => {
        state['treeRef'].toggleRowExpansion(item, isExpansion)
        if (item.children !== undefined && item.children != null) {
          toggleRowExpansionAll(item.children, isExpansion)
        }
      })
    }

    const initType = async () => {
      const { data } = await getList({size:500,})
      state.typeOptions = data.items
    }

    onMounted(() => {
      initType()
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleEdit,
      handleDelete,
      initType,
      beforeSwitchChange,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      toggleRowExpansion,
      toggleRowExpansionAll,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-category';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
