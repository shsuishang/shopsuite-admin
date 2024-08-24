<template>
  <div class="store-express-logistics-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/shop/storeExpressLogistics/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/shop/storeExpressLogistics/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.logistics_name"
              clearable
              :placeholder="t('请输入物流名称')"
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
        :label="t('物流编号')"
        prop="logistics_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('物流名称')"
        prop="logistics_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('公司编号')"
        prop="express_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('快递公司')"
        prop="express_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('国家编码')"
        prop="logistics_intl"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('联系手机')"
        prop="logistics_mobile"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('联系人')"
        prop="logistics_contacter"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('联系地址')"
        prop="logistics_address"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('是否默认')"
        prop="logistics_is_default"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.logistics_is_default === 0 ? t('点击') + t('默认') :  t('点击')  + t('非默认')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.logistics_is_default"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="logistics_is_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.logistics_is_enable === 0 ? t('点击') + t('启用') :  t('点击')  + t('禁用')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.logistics_is_enable"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/shop/storeExpressLogistics/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/shop/storeExpressLogistics/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
  import {doEditState, doRemove, doRemoveBatch, getList} from '@/api/shop/storeExpressLogistics'
  import Edit from './components/StoreExpressLogisticsEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'StoreExpressLogistics',
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
        switchStatus: false,
        selectRows: '',
        queryForm: {
          page: 1,
          size: 10,
          logistics_name: '',
        },
      })

      const beforeSwitchChange = () => {
        state.switchStatus = true;
        return state.switchStatus;
      }

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.logistics_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.logistics_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({logistics_id: row.logistics_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const logistics_id = state.selectRows.map((item) => item.logistics_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({logistics_id})
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
        if (state.switchStatus) {
          const param = {
            logistics_id: row.logistics_id,
            logistics_is_default: row.logistics_is_default,
            logistics_is_enable: row.logistics_is_enable,
          }

          const {msg, status} = await doEditState(param)

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
        beforeSwitchChange,
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
  $base: '.store-express-logistics';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
