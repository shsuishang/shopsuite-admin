<template>
  <div class="article-category-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/cms/articleCategory/add'] }" :icon="Plus" type="primary" @click="handleEdit">
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
        <el-form v-permissions="{ permission: ['/manage/cms/articleCategory/list'] }" :inline="true" :model="queryForm" @submit.prevent>
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
        width="150"
      />
      <el-table-column
        align="center"
        :label="t('分类编号')"
        prop="category_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('上级编号')"
        prop="category_parent_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('分类图标')"
        prop="category_image_url"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.category_image_url]"
            preview-teleported
            :src="row.category_image_url"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('分类描述')"
        prop="category_desc"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span v-html="row.category_desc"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('内容数量')"
        prop="category_count"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('分类排序')"
        prop="category_order"
        show-overflow-tooltip
        width="100"
      />
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('系统内置')"-->
<!--        prop="category_buildin"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      >-->
<!--        <template #default="{ row }">-->
<!--          <el-tag :type='(["info","success"])[row.category_buildin ? 1 : 0]'>-->
<!--            {{ ([t('否'),t('是')])[row.category_buildin ? 1 : 0] }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column align="center" fixed="right" :label="t('操作')" width="250">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/cms/articleCategory/add'] }" text @click="handleAdd(row)">{{ $t('添加') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/cms/articleCategory/edit'] }" text @click="handleEdit(row)">{{ $t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/cms/articleCategory/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
import {doRemove, doRemoveBatch, getTree, doEdit} from '@/api/cms/articleCategory'
import Edit from './components/ArticleCategoryEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ArticleCategory',
  components: {Edit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      treeRef: null,
      editRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      switchStatus: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
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

    const handleAdd = (row) => {
      if (row.category_id) {
        state.editRef.showAdd(row)
      } else {
        state.editRef.showAdd()
      }
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
          category_buildin: row.category_buildin,
          category_is_leaf: row.category_is_leaf,
        }
        const {msg, status} = await doEdit(param)

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
      // state.total = records
      state.listLoading = false
    }
    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleEdit,
      handleDelete,
      handleAdd,
      handleState,
      handleSizeChange,
      beforeSwitchChange,
      handleCurrentChange,
      toggleRowExpansion,
      toggleRowExpansionAll,
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
$base: '.article-category';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
