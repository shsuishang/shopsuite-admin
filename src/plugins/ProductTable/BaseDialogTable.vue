<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    :title="title"
    width="80%"
    @close="close"
  >
    <ms-search-box>
      <ms-search-box-right-panel :span="24">
        <el-form :inline="true" :model="queryForm">
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_name"
              clearable
              :placeholder="t('请输入商品名称')"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_id"
              clearable
              :placeholder="t('请输入商品编号')"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.brand_id"
              clearable
              filterable
              :loading="loading"
              :placeholder="t('请输入商品品牌')"
              remote
              :remote-method="remoteFindBrandList"
              reserve-keyword
              style="width: 140px"
            >
              <el-option
                v-for="item in brandList"
                :key="item.brand_id"
                :label="item.brand_name"
                :value="item.brand_id"

              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-tree-select
              v-model="queryForm.category_id"
              :check-strictly="true"
              clearable
              :data="data"
              :default-expand-all="true"
              filterable
              highlight-current
              node-key="category_id"
              :placeholder="t('请选择商品分类')"
              :props="{ value: 'category_id', label: 'category_name'}"
              style="width: 160px"
              value-key="category_name"
            />
          </el-form-item>

<!--          <el-form-item>-->
<!--            <el-select-->
<!--              v-model="queryForm.kind_id"-->
<!--              clearable-->
<!--              :placeholder="t('请输入商品种类')"-->
<!--              style="width: 192px"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in kindType"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->

          <el-form-item>
            <el-button type="primary" @click="fetchData">
              {{ t('查询') }}
            </el-button>
          </el-form-item>
        </el-form>
      </ms-search-box-right-panel>
    </ms-search-box>
    <el-table
      ref="tbRef"
      v-loading="listLoading"
      border
      :data="list"
      :height="height"
      @row-click="handleClickRow"
      @select="onTableSelect"
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" :selectable="canBeSelect" show-overflow-tooltip type="selection" />
      <el-table-column
        align="center"
        :label="t('SKU编号')"
        prop="item_id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('产品名称')"
        prop="product_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('SKU名称')"
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
        :label="t('商品单价')"
        prop="item_unit_price"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('可用库存')"
        prop="available_quantity"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatState"
        :label="t('商品状态')"
        prop="product_state_id"
        show-overflow-tooltip
        width="90"
      />
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
    <div class="dialog-footer" style="margin-top: 20px;display : flex;flex-direction: row-reverse ">
      <el-button style="margin-left: 10px" type="primary" @click="checkItem">{{ t('确定') }}</el-button>
      <el-button @click="close">{{ t('取消') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {translate as t} from '@/i18n'
import { getTree } from '@/api/pt/productCategory'
import {getProductItems} from '@/api/pt/productBase'
import {getList as brandList} from '@/api/pt/productBrand'

export default defineComponent({
  name: 'ProductItemTable',
  components: { },
  props:{
    limit: {
      type: Number,
      default() {
        return 100
      },
    },
    selected: {
      type: Array,
      default() {
        return []
      },
    },
    closeClear: {
      type: Boolean,
      default() {
        return true
      },
    },
  },
  emits: ['checkItem'],
  setup(props, {emit}) {
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      tbRef: null,
      height: $tableHeight() - 120,
      treeSelect: null,
      list: [],
      listLoading: true,
      form: {},
      title: '',
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      brandList:[],
      data: [], // 产品规格数据
      selectRows: {},
      queryForm: {
        page: 1,
        size: 10,
        category_id: '',
      },
      dialogFormVisible: false,
      stateOptions: [
        {
          value: 1001,
          label: t('正常'),
        },
        {
          value: 1002,
          label: t('下架仓库中'),
        },
        {
          value: 1000,
          label: t('违规禁售'),
        },
      ],
      verifyOptions: [
        {
          value: 3001,
          label: t('审核通过'),
        },
        {
          value: 3002,
          label: t('审核中'),
        },
        {
          value: 3000,
          label: t('审核未通过'),
        },
      ],
      kindType: [
        {
          label: t('实体商品'),
          value: 1201,
        },
        {
          label: t('虚拟商品'),
          value: 1202,
        },
      ],
    })

    const formatVerify = async (row) => {
      const obj = state.verifyOptions.find(
        (item) => item.value === row.product_verify_id
      )
      return obj ? obj.label : ''
    }

    const formatState = (row) => {
      const obj = state.stateOptions.find(
        (item) => item.value === row.product_state_id
      )
      return obj ? obj.label : ''
    }

    // 获取规格数据
    const getTreeData = async () => {
      const { data : list } = await getTree({})
      state.data = list
    }

    //商品品牌
    const remoteFindBrandList = (brand_name) => {
      if (brand_name !== '') {
        state.loading = true
        setTimeout(() => {
          state.loading = false
          brandList({brand_name: brand_name}).then((res) => {
            state.brandList = res.data.items
          })
        }, 200)
      } else {
        state.brandList = []
      }
    }

    const showTable = () => {
      fetchData()
      state.dialogFormVisible = true
    }

    const result = getCurrentInstance();

    const handleClickRow = () => {
    }

    const onTableSelect = (rows, row) => {
      const selected = rows.length && rows.indexOf(row) !== -1
      const targetRow = JSON.parse(JSON.stringify(row))

      // true就是选中，0或者false是取消选中
      if (selected)
      {
        //存在
        const index = result.data.checkedAllList.indexOf(targetRow.item_id)
        if (index == -1) {
          result.data.checkedDataList.push(targetRow)
          result.data.checkedAllList.push(targetRow.item_id)
        }
      }
      else
      {
        //不存在，取消了
        const index = result.data.checkedAllList.indexOf(targetRow.item_id)
        if (index > -1) {
          result.data.checkedDataList.splice(index, 1)
          result.data.checkedAllList.splice(index, 1)
        }
      }

      //emit('get-files', result.data.checkedAllList)
    }

    const setSelectRows = (val) => {
      state.selectRows = val

      if (props.limit == 1) {
        if (state.selectRows) {
          result.data.checkedDataList = [state.selectRows]
          result.data.checkedAllList = [state.selectRows.item_id]
        }

        state.tbRef.clearSelection()
        state.tbRef.toggleRowSelection(val[0])
      }
      result.data.checkedDataList = state.selectRows

      //const targetList = JSON.parse(JSON.stringify(val))
      //emit('get-files', targetList.map((item) => item.material_url))
    }

    const close = () => {
      state.list = []
      state.selectRows = {}

      if (props.closeClear) {
        result.data.checkedDataList = []
        result.data.checkedAllList = []
      }

      state.dialogFormVisible = false
    }

    const fetchData = async () => {
      state.listLoading = true
      const { data } = await getProductItems(state.queryForm)
      state.list = data.items
      state.total = data.records
      state.listLoading = false

      nextTick(() => {
        state.list.forEach((row) => {
          if (result.data.checkedAllList.indexOf(row.item_id) >= 0)
          {
            state.tbRef.toggleRowSelection(row, true)
          }
        })
      })
    }

    const handleSizeChange = (val) => {
      state.queryForm.size = val
      fetchData()
    }

    const handleCurrentChange = (val) => {
      state.queryForm.page = val
      fetchData()
    }

    const checkItem = () => {
      emit('checkItem', result.data.checkedDataList, result.data.checkedAllList)
      close()
    }

    // 设置当前行是否禁用【可以选择】 参数row 传入当前行数据
    const canBeSelect = (row) => {
      if ( row.product_state_id == 1001) {
        return true; // 返回true 可以选择
      } else {
        return false; // 返回false 禁止选择
      }
    }

    onMounted(() => {
      getTreeData()
    })

    return {
      t,
      ...toRefs(state),
      close,
      formatVerify,
      formatState,
      getTree,
      remoteFindBrandList,
      showTable,
      handleClickRow,
      setSelectRows,
      onTableSelect,
      fetchData,
      handleSizeChange,
      handleCurrentChange,
      checkItem,
      canBeSelect
    }
  },
  data: function () {
    return {
      checkedAllList: [],
      checkedDataList: [],
    };
  },
  watch: {
    selected: {
      immediate: true,
      handler: function () {
        this.checkedAllList = JSON.parse(JSON.stringify(this.selected))
        this.checkedDataList = JSON.parse(JSON.stringify(this.selected))
        this.list.forEach((row) => {
          if (this.selected.indexOf(row.item_id) >= 0)
          {
            this.tbRef.toggleRowSelection(row, true)
          }
          else
          {
            this.tbRef.toggleRowSelection(row, false)
          }
        })
      },
    },
  },
})
</script>
