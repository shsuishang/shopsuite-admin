<template>
  <div class="product-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="5">
        <ms-link to="/add">
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" :icon="Plus" type="primary">
            {{ t('添加') }}
          </el-button>
        </ms-link>
        <ms-link to="">
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" type="success" @click="importEdit">
            {{ t('导入') }}
          </el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" type="warning" @click="importEditItem">
            {{ t('批量修改') }}
          </el-button>
          <el-button v-if="hasSelected" :icon="Top" type="success" @click="batchUpdate(1001)">
            {{ t('上架') }}
          </el-button>
          <el-button v-if="hasSelected" :icon="Bottom" type="danger" @click="batchUpdate(1002)">
            {{ t('下架') }}
          </el-button>
        </ms-link>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="19">
        <el-form v-permissions="{ permission: ['/manage/pt/productBase/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_name"
              clearable
              :placeholder="t('产品名称')"
              style="width:120px;"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_id"
              clearable
              :placeholder="t('商品编码')"
              style="width:100px;"
            />
          </el-form-item>
          <el-form-item v-if="false">
            <el-input
              v-model.trim="queryForm.product_number"
              clearable
              :placeholder="t('商品货号')"
              style="width:100px;"
            />
          </el-form-item>
          <el-form-item>
            <el-tree-select
              v-model="queryForm.category_id"
              :check-strictly="true"
              clearable
              :data="categoryList"
              :default-expand-all="isExpandTreeSelect"
              filterable
              highlight-current
              node-key="category_id"
              :placeholder="t('商品分类')"
              :props="{ value: 'category_id', label: 'category_name'}"
              style="width: 160px;"
              value-key="category_name"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.product_tags"
              clearable
              filterable
              multiple
              :placeholder="t('商品标签')"
              :style="{width:'120px'}"
            >
              <el-option
                v-for="item in productTags"
                :key="item.product_tag_id"
                :label="item.product_tag_name"
                :value="item.product_tag_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-tree-select
              v-model="queryForm.brand_id"
              clearable
              :data="brandList"
              :default-expand-all="isExpandTreeSelect"
              filterable
              highlight-current
              multiple
              node-key="brand_id"
              :placeholder="t('商品品牌')"
              :props="{ value: 'brand_id', label: 'brand_name'}"
              style="width: 140px;"
              value-key="brand_name"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.product_state_id"
              clearable
              filterable
              :placeholder="t('状态')"
              :style="{width:'95px'}"
            >
              <el-option
                v-for="item in productStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="configs.edu_enable">
            <el-select
              v-model="queryForm.kind_id"
              clearable
              filterable
              :placeholder="t('种类')"
              :style="{width:'95px'}"
            >
              <el-option
                v-for="item in kindList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
      :cell-class-name="getCellClass"
      :data="items"
      :header-cell-class-name="getCellClass"
      :height="height"
      @cell-click="tabClick"
      @selection-change="setSelectRows"
      @sort-change="handleSortChange"
    >
      <el-table-column align="center" show-overflow-tooltip type="selection"/>
      <el-table-column
        v-if="false"
        fixed="left"
        type="expand">
        <template #default="{ row }">
          <div class="ms-table-expand">
            <p>
              <span class="ms-table-expand-title">{{ t('商品货号')}}:</span>
              {{ row.product_number }}
            </p>
            <p>
              <span class="ms-table-expand-title">{{ t('来源编号')}}:</span>
              <span>
                <span class="ms-dot ms-dot-success"><span></span></span>
                {{ row.product_src_id }}
              </span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('商品编码')"
        prop="product_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('主图')"
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
        v-if="false"
        align="center"
        :label="t('分销商品编号')"
        prop="product_src_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('商品货号')"
        prop="product_number"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('产品名称')"
        prop="product_name"
        show-overflow-tooltip="true"
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
        align="center"
        :formatter="(row, column)=>{if (row.product_unit_price_min!=row.product_unit_price_max && row.product_unit_price_min<row.product_unit_price_max){return t('￥') + row.product_unit_price_min + ' ~ ' + row.product_unit_price_max}else{return t('￥') + row.product_unit_price_min}}"
        :label="t('商品单价')"
        prop="product_unit_price"
        show-overflow-tooltip
        sortable
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('销售数量')"
        prop="product_sale_num"
        show-overflow-tooltip
        sortable
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('商品审核')"
        prop="product_verify_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"3001":"","3002":"success","3000":"warning"})[row.product_verify_id]'>
            {{ ({"3001":t('审核通过'),"3002":t('审核中'),"3000":t('审核未通过')})[row.product_verify_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('商品状态')"
        prop="product_state_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.product_state_id === 1002 ? t('点击') + t('上架') :  t('点击')  + t('下架')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.product_state_id" :active-value="1001" :inactive-value="1002" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('上架时间')"
        prop="product_sale_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('三级分销')"
        prop="product_dist_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.product_dist_enable ? t('点击') + t('不允许') :  t('点击')  + t('允许')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.product_dist_enable" @change="handleEnable(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('佣金比率')"
        prop="product_commission_rate"
        show-overflow-tooltip
        width="110"
      >
        <template #header="scope">
              <span>
                {{ t('佣金比率') }}
                <el-tooltip
                  :aa="scope"
                  class="item"
                  :content="t('点击数字，更改平台佣金比率')"
                  effect="dark"
                  placement="top-start"
                >
                  <ms-icon icon="question-line" style="cursor:pointer;"/>
                </el-tooltip>
              </span>
        </template>
        <template #default="scope">
            <span
              v-if="
                scope.row.product_id === tabClickIndex &&
                scope.column.id === columnId
              "
            >
              <el-input
                ref="editInputRef"
                v-model="scope.row.product_commission_rate"
                @blur.stop="rateInputBlur(scope.row)"
                @keyup.enter.stop="rateInputBlur(scope.row)"
              />
            </span>
          <span v-else>{{ scope.row.product_commission_rate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="product_order"
        show-overflow-tooltip
        width="80"
      >
        <template #header="scope">
              <span>
                {{ t('排序') }}
                <el-tooltip
                  :aa="scope"
                  class="item"
                  :content="t('点击数字，更改排序')"
                  effect="dark"
                  placement="top-start"
                >
                  <ms-icon icon="question-line" style="cursor:pointer;"/>
                </el-tooltip>
              </span>
        </template>
        <template #default="scope">
            <span
              v-if="
                scope.row.product_id === tabClickIndex &&
                scope.column.id === columnId
              "
            >
              <el-input
                ref="editInputRef"
                v-model="scope.row.product_order"
                @blur.stop="inputBlur(scope.row)"
                @keyup.enter.stop="inputBlur(scope.row)"
              />
            </span>
          <span v-else>{{ scope.row.product_order }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="180">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/edit'] }" text @click="handleStock(row)">{{ t('库存') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productBase/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <edit-base ref="editRef" @fetch-data="fetchData"/>
    <product-item ref="itemRef" @fetch-data="fetchData"/>
    <import ref="importRef" @fetch-data="fetchData"/>
    <import-item ref="importItemRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList, editState, batchEditState, editSort, editEnable, editCommissionRate} from '@/api/pt/productBase'
import EditBase from './components/ProductBaseEdit'
import {Delete, Plus, Search, Top, Bottom, FolderAdd, Edit} from '@element-plus/icons-vue'
import Import from './components/ProductBaseImport'
import ImportItem from './components/ProductItemImport'
import {formatDateTime} from "@/utils/format";
import ProductItem from "@/views/pt/productItem";
import {getTree} from "@/api/pt/productCategory";
import {getBrandTree} from "@/api/pt/productBrand";
import {getList as getTags} from '@/api/pt/productTag'
import {isNumbers} from "vue-plugin-utils";
import {useSettingsStore} from "@/store/modules/settings";

export default defineComponent({
  name: 'ProductBase',
  components: {ProductItem, EditBase, Import, ImportItem},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')
    const settingsStore = useSettingsStore()

    const state = reactive({
      editRef: null,
      itemRef: null,
      importRef: null,
      importItemRef: null,
      height: $tableHeight(),
      items: [],
      productTags: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      hasSelected:false,
      editInputRef: null,
      queryForm: {
        page: 1,
        size: 10,
        product_name: '',
        product_id:'',
        product_number:"",
        category_id:"",
        brand_id:[],
        product_tags: [],
      },

      productStateList:[
        {label:t("售卖中"), value:1001},
        {label:t("仓库中"), value:1002}
      ],
      kindList:[
        {label:t("实体商品"), value:1201},
        {label:t("教育课程"), value:1205}
      ],

      isExpandTreeSelect:true,
      categoryList: [],
      brandList: [],
      tabClickIndex: null, // 点击的行
      columnId: null, // 点击的列
    })

    const setSelectRows = (val) => {
      if (val.length > 0) {
        state.hasSelected = true
      }
      else {
        state.hasSelected = false
      }

      state.selectRows = val
    }

    const batchUpdate = (product_state_id) => {
      if (state.selectRows.length > 0) {
        const product_ids = state.selectRows.map((item) => item.product_id).join()
        $confirm(t('你确定执行吗'), null, async () => {
          const {msg, status} = await batchEditState({product_ids: product_ids, product_state_id: product_state_id })
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

    const handleEdit = (row) => {
      if (row && row.product_id) {
        if (row.kind_id == 1205) {
          $message(t('课程类商品请进入课程管理中编辑'), 'error')
          return
        }

        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleStock = (row) => {
      if (row && row.product_id) {
        if (row.kind_id == 1205) {
          $message(t('课程类商品请进入课程管理中修改'), 'error')
          return
        }

        state.itemRef.show(row.product_id)
      }
    }
    const handleDelete = (row) => {
      if (row.product_id) {
        if (row.kind_id == 1205) {
          $message(t('课程类商品请进入课程管理中删除'), 'error')
          return
        }

        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({product_id: row.product_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const product_id = state.selectRows.map((item) => item.product_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({product_id})
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
        product_id: row.product_id,
        product_state_id:row.product_state_id
      }

      const {msg, status} = await editState(param)

      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }

      await fetchData()
    }

    const handleEnable = async (row) => {
      const param = {
        product_id: row.product_id,
        product_dist_enable:row.product_dist_enable
      }

      const {msg, status} = await editEnable(param)

      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }

      await fetchData()
    }

    const handleSortChange = ({ column, prop, order }) => {
      console.info(column)
      state.queryForm.sidx = prop

      if (order == "ascending") {
        state.queryForm.sort = "asc"

        if (prop == 'product_unit_price') {
          state.queryForm.sidx = "product_unit_price_min"
        }
      } else {
        state.queryForm.sort = "desc"

        if (prop == 'product_unit_price') {
          state.queryForm.sidx = "product_unit_price_max"
        }
      }



      fetchData()
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
      const params = Object.assign({}, state.queryForm)

      if (params.brand_id) {
        params.brand_id = params.brand_id.join();
      }

      if (params.product_tags) {
        params.product_tags = params.product_tags.join();
      }

      state.listLoading = true
      const {
        data: {items, records},
      } = await getList(params)
      state.items = items
      state.total = records
      state.listLoading = false
    }

    const getCategoryData = async () => {
      const {
        data: items,
      } = await getTree({})

      state.categoryList = items
    }

    const getBrandData = async () => {
      const {
        data: list,
      } = await getBrandTree({})
      state.brandList = list
    }

    const getProductTags = async () => {
      const {data} = await getTags({page:1, size: 500})
      state.productTags = data.items;
    }

    const tabClick = (row, column) => {
      state.tabClickIndex = row.product_id
      state.columnId = column.id
      // inout 获取焦点
      nextTick(() => {
        if (!state.editInputRef) return
        state.editInputRef.focus()
      })
    }

    // 失去焦点初始化
    const inputBlur = async (row) => {
      if (state.tabClickIndex != null && state.columnId != null) {
        state.tabClickIndex = null
        state.columnId = null
        // 保存数据
        const obj = {
          product_id: row.product_id,
          product_order: row.product_order,
        }

        if (!isNumbers(row.product_order)) {
          row.product_order = 0
          $message('排序值不能为负数且不能输入中文', 'warning')
          return
        }

        const {msg, status} = await editSort(obj)
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      }
    }

    // 失去焦点初始化
    const rateInputBlur = async (row) => {
      if (state.tabClickIndex != null && state.columnId != null) {
        state.tabClickIndex = null
        state.columnId = null
        // 保存数据
        const obj = {
          product_id: row.product_id,
          product_commission_rate: row.product_commission_rate,
        }

        if (!isNumbers(row.product_commission_rate)) {
          row.product_commission_rate = 0
          $message('佣金比例不能为负数且不能输入中文', 'warning')
          return
        }

        const {msg, status} = await editCommissionRate(obj)
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      }
    }

    const tableHeaderColor = (data) => {
      if (data.column.property == "activity_item_price") {
        return 'product-item-order';
      } else {
        return '';
      }
    }

    const getCellClass = ({columnIndex}) => {
      if (columnIndex == 8) {
        return 'product-item-order'
      } else {
        return ''
      }
    }

    const importEdit = (row) => {
      state.importRef.showEdit(row)
    }

    const importEditItem = () => {
      state.importItemRef.showEdit()
    }

    onMounted(() => {
      fetchData()
      getCategoryData()
      getBrandData()
      getProductTags()
    })

    return {
      t,
      configs: settingsStore.getConfigs,
      ...toRefs(state),
      setSelectRows,
      importEdit,
      importEditItem,
      tabClick,
      handleEdit,
      handleDelete,
      inputBlur,
      rateInputBlur,
      tableHeaderColor,
      getCellClass,
      batchUpdate,
      handleStock,
      handleState,
      handleEnable,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      formatDateTime,
      handleSortChange,
      Delete,
      Plus,
      Search,
      Top,
      Bottom,
      Edit,
      FolderAdd,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-base';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}

.product-item-order {

  span {
    color: #f6741b;
  }

  .cell {
    color: #f6741b !important;
  }
}
</style>
