<template>
  <div class="store-shipping-address-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/shop/storeShippingAddress/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/shop/storeShippingAddress/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.ss_name"
              clearable
              :placeholder="t('请输入联系人')"
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
        prop="ss_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('联系人')"
        prop="ss_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('国家编码')"
        prop="ss_intl"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('手机号码')"
        prop="ss_mobile"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('邮编')"
        prop="ss_postalcode"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('省份')"
        prop="ss_province"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('市')"
        prop="ss_city"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('县区')"
        prop="ss_county"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('详细地址')"
        prop="ss_address"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('默认地址')"
        prop="ss_is_default"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"info","0":"success"})[row.ss_is_default ? 1 : 0]'>
            {{ ({"1":t('是'),"0":t('否')})[row.ss_is_default ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/shop/storeShippingAddress/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/shop/storeShippingAddress/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
import {doRemove, doRemoveBatch, getList} from '@/api/shop/storeShippingAddress'
import Edit from './components/StoreShippingAddressEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'StoreShippingAddress',
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
        ss_name: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.ss_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.ss_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({ss_id: row.ss_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const ss_id = state.selectRows.map((item) => item.ss_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({ss_id})
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
$base: '.store-shipping-address';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
