<template>
  <div class="order-return-reason-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/trade/orderReturnReason/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/trade/orderReturnReason/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.return_reason_name"
              clearable
              :placeholder="t('请输入售后理由')"
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
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('售后编号')"
        prop="return_reason_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('售后理由')"
        prop="return_reason_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('售后排序')"
        prop="return_reason_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/trade/orderReturnReason/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/trade/orderReturnReason/remove'] }" :disabled="true" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
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
  import { translate as t } from '@/i18n'
  import {doRemove, getList} from '@/api/trade/orderReturnReason'
  import Edit from './components/OrderReturnReasonEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'OrderReturnReason',
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
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.return_reason_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.return_reason_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({return_reason_id: row.return_reason_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
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
      onMounted(() => {
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
  $base: '.order-return-reason';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
