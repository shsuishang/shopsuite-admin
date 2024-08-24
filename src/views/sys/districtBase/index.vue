<template>
  <div class="district-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/sys/districtBase/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
        <el-button v-permissions="{ permission: ['/manage/sys/districtBase/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">
          {{ t('批量删除') }}
        </el-button>

        <el-button
          v-permissions="{ permission: ['/manage/sys/districtBase/list'] }"
          :icon="Upload"
          type="primary"
          @click="toggleRowExpansion(true)"
        >
          {{ t('全部展开') }}
        </el-button>
        <el-button
          v-permissions="{ permission: ['/manage/sys/districtBase/list'] }"
          :icon="Download"
          type="primary"
          @click="toggleRowExpansion(false)"
        >
          {{ t('全部折叠') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/sys/districtBase/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.district_name"
              clearable
              :placeholder="t('请输入地区名称')"
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
      row-key="district_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="left"
        fixed="left"
        :label="t('地区名称')"
        prop="district_name"
        show-overflow-tooltip
        width="300"
      />
      <el-table-column
        align="center"
        :label="t('地区编号')"
        prop="district_id"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('上级编号')"
        prop="district_parent_id"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('地区排序')"
        prop="district_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="260">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/districtBase/add'] }" text @click="handleAdd(row)">{{ t('添加') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/districtBase/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/districtBase/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
import {doRemove, doRemoveBatch, getTree} from '@/api/sys/districtBase'
import Edit from './components/DistrictBaseEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'DistrictBase',
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
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 500,
        district_name: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleAdd = (row) => {
      if (row && row.district_id) {
        state.editRef.showAdd(row)
      } else {
        state.editRef.showAdd()
      }
    }

    const handleEdit = (row) => {
      if (row && row.district_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.district_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({district_id: row.district_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const district_id = state.selectRows.map((item) => item.district_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({district_id})
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
      console.info(row)
      const param = {
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

    const queryData = () => {
      state.queryForm.page = 1
      fetchData()
    }
    const fetchData = async () => {
      state.listLoading = true
      const {
        data: items,
      } = await getTree(state.queryForm)

      state.items = items
      state.listLoading = false
    }
    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleAdd,
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
      toggleRowExpansion,
      toggleRowExpansionAll,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.district-base';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
