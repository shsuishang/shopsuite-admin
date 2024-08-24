<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="800px"
    @close="close"
  >
    <div class="product-item-container">
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
          :label="t('SKU编号')"
          prop="item_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('副标题')"
          prop="item_name"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="false"
          align="center"
          :label="t('SKU商家编码')"
          prop="item_number"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          v-if="false"
          align="center"
          :label="t('条形码')"
          prop="item_barcode"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('商品价格')"
          prop="item_unit_price"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          v-if="false"
          align="center"
          :label="t('市场价')"
          prop="item_market_price"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          v-if="false"
          align="center"
          :label="t('积分价格')"
          prop="item_unit_points"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('商品库存')"
          prop="item_quantity"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('冻结库存')"
          prop="item_quantity_frozen"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          v-if="false"
          align="center"
          :label="t('库存预警值')"
          prop="item_warn_quantity"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('是否启用')"
          prop="item_enable"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row.item_enable === 1002 ? t('点击') + t('启用') :  t('点击')  + t('禁用')"
              :enterable="false"
              placement="top"
            >
              <el-switch v-model="row.item_enable" :active-value="1001" :inactive-value="1002" @change="handleState(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="false" align="center" fixed="right" :label="t('操作')" width="100">
          <template #default="{ row }">
            <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="ms-data-empty" :description="t('暂无数据')" />
        </template>
      </el-table>
      <edit ref="editRef" @fetch-data="fetchData"/>
    </div>
  </el-dialog>
</template>

<script>
import { translate as t } from '@/i18n'
import {getList, editState} from '@/api/pt/productItem'
import Edit from './components/ProductItemEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ProductItem',
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
        size: 500,
        product_id: '',
      },
      title: '',
      dialogFormVisible: false,
    })
    const show = (product_id) => {
      state.queryForm.product_id = product_id
      fetchData();
      state.dialogFormVisible = true
    }
    const close = () => {
      state.dialogFormVisible = false
    }

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.item_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.item_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({item_id: row.item_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const item_id = state.selectRows.map((item) => item.item_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({item_id})
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
        item_id: row.item_id,
        item_enable: row.item_enable,
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
      show,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-item';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 36px;
    }
  }
}
</style>
