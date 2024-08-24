<template>
  <div class="product-spec-item-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
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
        prop="spec_item_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('店铺编号')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('分类编号')"
        prop="category_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('规格编号')"
        prop="spec_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('名称')"
        prop="spec_item_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="spec_item_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="spec_item_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.spec_item_enable === 0 ? t('点击') + t('显示') :  t('点击')  + t('不显示')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.spec_item_enable" :before-change="beforeSwitchChange" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList, editState} from '@/api/pt/productSpecItem'
import Edit from './components/ProductSpecItemEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ProductSpecItem',
  components: {Edit},
  props:{
    id: {
      type: Number,
      default: () => {
        return 0
      },
    },
  },
  emits: [],
  setup(props) {
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
        size: 500,
        title: '',
        spec_id:0,
        category_id:0,
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.spec_item_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit({ spec_id: state.queryForm.spec_id },{ category_id: state.queryForm.category_id })
      }
    }
    const handleDelete = (row) => {
      if (row && row.spec_item_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({spec_item_id: row.spec_item_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const spec_item_id = state.selectRows.map((item) => item.spec_item_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({spec_item_id})
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
      const param = {
        spec_item_id: row.spec_item_id,
        spec_item_enable: row.spec_item_enable,
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
    const fetchData = async (spec_id) => {
      if (typeof spec_id != "undefined") {
        state.queryForm.spec_id = spec_id
      }
      else {
        state.queryForm.spec_id = props.id
      }

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
      beforeSwitchChange,
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
  watch: {
    id: {
      immediate: true,
      handler: function () {
        this.fetchData()
      },
    },
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-spec-item';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
