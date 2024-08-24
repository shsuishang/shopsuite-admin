<template>
  <div class="store-transport-type-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/shop/storeTransportType/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/shop/storeTransportType/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.transport_type_name"
              clearable
              :placeholder="t('请输入模板名称')"
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
        :label="t('编号')"
        prop="transport_type_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('模板名称')"
        prop="transport_type_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('计费规则')"
        prop="transport_type_pricing_method"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success","3":"warning"})[row.transport_type_pricing_method]'>
            {{ ({"1":t('按件数'),"2":t('按重量'),"3":t('按体积')})[row.transport_type_pricing_method] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('免运费额度')"
        prop="transport_type_freight_free"
        show-overflow-tooltip
        width="120"
      />
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('系统内置')"-->
<!--        prop="transport_type_buildin"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      >-->
<!--        <template #default="{ row }">-->
<!--          <el-tag :type='(["info","success"])[row.transport_type_buildin ? 1 : 0]'>-->
<!--            {{ ([t('非内置'),t('内置')])[row.transport_type_buildin ? 1 : 0] }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        align="center"
        :label="t('全免运费')"
        prop="transport_type_free"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.transport_type_free ? 1 : 0]'>
            {{ ([t('不全免'),t('全免（不限制地区且免运费）')])[row.transport_type_free ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="250">
        <template #default="{ row }">
          <el-button
            v-permissions="{ permission: ['/manage/shop/storeTransportType/list'] }"
            :disabled="row.transport_type_free"
            type="text"
            @click="handleShowItems(row)"
          >
            {{ t('查看') }}
          </el-button>
          <el-button v-permissions="{ permission: ['/manage/shop/storeTransportType/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/shop/storeTransportType/remove'] }" :disabled="row.transport_type_buildin" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <item ref="itemRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList, editState} from '@/api/shop/storeTransportType'
import Item from './components/StoreTransportItem'
import Edit from './components/StoreTransportTypeEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'StoreTransportType',
  components: {Edit, Item},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      itemRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        transport_type_name: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.transport_type_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }

    const handleShowItems = (row) => {
      state.itemRef.showItems(row)
    }

    const handleDelete = (row) => {
      if (row.transport_type_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({transport_type_id: row.transport_type_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const transport_type_id = state.selectRows.map((item) => item.transport_type_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({transport_type_id})
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
        transport_type_id: row.transport_type_id,
        transport_type_buildin: row.transport_type_buildin,
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
      handleShowItems,
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
$base: '.store-transport-type';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
