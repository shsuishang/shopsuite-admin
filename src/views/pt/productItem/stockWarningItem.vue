<template>
  <div class="product-item-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12" />
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/pt/productBase/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_name"
              clearable
              :placeholder="t('请输入产品名称')"
              :style="{width:'140px'}"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_id"
              clearable
              :placeholder="t('请输入SPU编号')"
              :style="{width:'140px'}"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.item_id"
              clearable
              :placeholder="t('请输入SKU编号')"
              :style="{width:'140px'}"
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
        :label="t('SPU编号')"
        prop="product_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('产品名称')"
        prop="product_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('SKU编号')"
        prop="item_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('规格型号')"
        prop="item_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('图片')"
        prop="category_image"
        show-overflow-tooltip
        width="80"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.product_image]"
            preview-teleported
            :src="row.product_image"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('商品价格')"
        prop="item_unit_price"
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
      <el-table-column align="center" fixed="right" :label="t('操作')" width="180">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" text @click="handleSubStock(row.item_id)">{{ t('出库') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" text @click="handleAddStock(row.item_id)">{{ t('入库') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" text @click="handleStockEdit(row.item_id)">{{ t('记录') }}</el-button>
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
    <stock ref="stockRef" />
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {getStockWarningItemList, editState, editStock} from '@/api/pt/productItem'
import Stock from './components/StockBillItem'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'StockWarningItem',
  components: {Stock},
  setup() {
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      stockRef: null,
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
      title: '',
      dialogFormVisible: false,
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }

    const handleStockEdit = (row) => {
      if (row) {
        state.stockRef.showStock(row)
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

    const handleAddStock = async (item_id) => {
      ElMessageBox.prompt(t('增加库存'), {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),

        //校验方法
        inputValidator: (val) => {
          return /^[0-9]*$/.test(val) && val>0;
        },
        inputErrorMessage: t('请填写库存数，且需要为大于0的数字'),
      })
        .then(async ({ value }) => {
          const {msg, status} = await editStock({
            item_id: item_id,
            bill_type_id: 2750,
            item_quantity: value
          })

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          fetchData()
        })
        .catch(() => {})
    }

    const handleSubStock = async (item_id) => {
      ElMessageBox.prompt(t('减少库存'), {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        //校验方法
        inputValidator: (val) => {
          return /^[0-9]*$/.test(val) && val>0;
        },
        inputErrorMessage: t('请填写库存数，且需要为大于0的数字'),
      })
        .then(async ({ value }) => {
          const {msg, status} = await editStock({
            item_id: item_id,
            bill_type_id: 2700,
            item_quantity: value
          })

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          fetchData()
        })
        .catch(() => {})
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
      } = await getStockWarningItemList(state.queryForm)
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
      handleStockEdit,
      handleState,
      handleAddStock,
      handleSubStock,
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
$base: '.product-item';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 36px;
    }
  }
}
</style>
