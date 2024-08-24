<template>
  <div class="contract-type-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/sys/contractType/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/sys/contractType/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.contract_type_name"
              clearable
              :placeholder="t('请输入保障名称')"
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
        :label="t('保障编号')"
        prop="contract_type_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('保障名称')"
        prop="contract_type_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('项目图标')"
        prop="contract_type_icon"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.contract_type_icon]"
            preview-teleported
            :src="row.contract_type_icon"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('保障描述')"
        prop="contract_type_text"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span v-html="row.contract_type_text"></span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('保证金')"-->
<!--        prop="contract_type_deposit"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      />-->
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('说明网址')"-->
<!--        prop="contract_type_url"-->
<!--        show-overflow-tooltip-->
<!--      />-->
      <el-table-column
        align="center"
        :label="t('保障排序')"
        prop="contract_type_order"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否开启')"
        prop="contract_type_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.contract_type_enable === 0 ? t('点击') + t('启用') :  t('点击')  + t('关闭')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.contract_type_enable" active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/contractType/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/contractType/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
  import {doRemove, doRemoveBatch, getList, editState} from '@/api/sys/contractType'
  import Edit from './components/ContractTypeEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ContractType',
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
        switchStatus: false,
        queryForm: {
          page: 1,
          size: 10,
          contract_type_name: '',
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.contract_type_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.contract_type_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({contract_type_id: row.contract_type_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const contract_type_id = state.selectRows.map((item) => item.contract_type_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({contract_type_id})
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
        console.info(row)
        if (state.switchStatus) {
          const param = {
            contract_type_id: row.contract_type_id,
            contract_type_enable: row.contract_type_enable
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
  $base: '.contract-type';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
