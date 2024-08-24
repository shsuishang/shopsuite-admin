<template>
    <el-dialog
      v-model="dialogFormVisible"
      :title="title"
      top="1%"
      width="80%"
      @close="close"
    >
      <div class="stock-bill-item-container">
        <el-table
          v-loading="listLoading"
          border
          :data="items"
          :height="height"
        >
          <el-table-column
            align="center"
            fixed="left"
            :label="t('编号')"
            prop="stock_bill_item_id"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('源单号码')"
            prop="order_id"
            show-overflow-tooltip
            width="160"
          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('订单商品编号')"
            prop="order_item_id"
            show-overflow-tooltip
            width="120"
          />
          <el-table-column
            align="center"
            :label="t('订单编号')"
            prop="stock_bill_id"
            show-overflow-tooltip
            width="160"
          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('SPU编号')"
            prop="product_id"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('SPU名称')"
            prop="product_name"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('SKU编号')"
            prop="item_id"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('SKU名称')"
            prop="item_name"
            show-overflow-tooltip

          />
          <el-table-column
            align="center"
            :label="t('变动数量')"
            prop="bill_item_quantity"
            show-overflow-tooltip

          />
          <el-table-column
            align="center"
            :label="t('单价')"
            prop="bill_item_unit_price"
            show-overflow-tooltip

          />
          <el-table-column
            align="center"
            :label="t('小计')"
            prop="bill_item_subtotal"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('单位编号')"
            prop="unit_id"
            show-overflow-tooltip

          />
          <el-table-column
            align="center"
            :label="t('变动前库存')"
            prop="warehouse_item_quantity"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('店铺编号')"
            prop="store_id"
            show-overflow-tooltip

          />
          <el-table-column
            v-if="false"
            align="center"
            :label="t('所属仓库')"
            prop="warehouse_id"
            show-overflow-tooltip

          />
          <el-table-column
            align="center"
            :label="t('库存类型')"
            prop="stock_transport_type_id"
            show-overflow-tooltip

          >
            <template #default="{ row }">
              <el-tag :type='({"2705":"info","2706":"success","2751":"warning","2755":"danger"})[row.stock_transport_type_id]'>
                {{ ({"2705":t('初期入库'),"2706":t('手工入库'),"2751":t('销售出库'),"2755":t('手工出库')})[row.stock_transport_type_id] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="false"
            align="center"
            :label="t('备注')"
            prop="bill_item_remark"
            show-overflow-tooltip

          />
          <el-table-column
            align="center"
            :label="t('业务类别')"
            prop="bill_type_id"
            show-overflow-tooltip

          >
            <template #default="{ row }">
              <el-tag :type='({"2750":"","2700":"success"})[row.bill_type_id]'>
                {{ ({"2750":t('入库'),"2700":t('出库')})[row.bill_type_id] }}
              </el-tag>
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
      </div>
    </el-dialog>
</template>

<script>
import { translate as t } from '@/i18n'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getStockBillItemList} from '@/api/pt/productItem'

export default defineComponent({
  name: 'StockBillItem',
  setup() {
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        item_id: '',
      },
      title: '',
      dialogFormVisible: false,
    })

    const showStock = (item_id) => {
      state.queryForm.item_id = item_id
      fetchData();
      state.dialogFormVisible = true
    }

    const close = () => {

      state.queryForm = {
        page: 1,
        size: 10,
      }
      state.dialogFormVisible = false
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
      } = await getStockBillItemList(state.queryForm)
      state.items = items
      state.total = records
      state.listLoading = false
    }

    return {
      t,
      ...toRefs(state),
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      showStock,
      Delete,
      Plus,
      Search,
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
