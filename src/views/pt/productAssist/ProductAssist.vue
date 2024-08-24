<template>
  <div class="product-assist-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加属性') }}
        </el-button>
        <el-button v-permissions="{ permission: ['/manage/pt/productAssist/remove'] }" :icon="Delete" type="danger" @click="handleDelete">
          {{ t('批量删除') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form
v-permissions="{ permission: ['/manage/pt/productAssist/list'] }" :inline="true" :model="queryForm"
                 @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.assist_name"
              clearable
              :placeholder="t('请输入属性名称')"
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
      highlight-current-row
      @row-click="rowClick"
    >

      <el-table-column
        v-if="false"
        align="center"
        fixed="left"
        :label="t('属性编号')"
        prop="assist_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('属性名称')"
        prop="assist_name"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('类型编号')"
        prop="type_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('属性选项')"
        prop="assist_item"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('属性排序')"
        prop="assist_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('分类编号')"
        prop="category_id"
        show-overflow-tooltip
        width="100"
      />
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
    <el-pagination
      v-if="queryForm.type_id==null"
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
import {doRemoveBatch, doRemove, getList} from '@/api/pt/productAssist'
import Edit from './components/ProductAssistEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {event} from "@/config";

export default defineComponent({
  name: 'ProductAssist',
  components: {Edit},
  props:{
    id: {
      type: Number,
      default: () => {
        return 0
      },
    },
  },
  emits: ['fetch-item-data'],
  setup(props, {emit}) {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')
    const $eventBus = inject('$eventBus')

    const state = reactive({
      editRef: null,
      height: $tableHeight() + 0,
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        assist_name: '',
        type_id:null
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const rowClick = (val) => {
      emit('fetch-item-data', JSON.parse(JSON.stringify(val)))
    }

    const handleEdit = (row) => {
      if (row && row.assist_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit({ type_id: state.queryForm.type_id })
      }
    }
    const handleDelete = (row) => {
      if (row.assist_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({assist_id: row.assist_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const assist_id = state.selectRows.map((item) => item.assist_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({assist_id})
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
    const fetchData = async (type_id) => {
      if (typeof type_id != "undefined") {
        state.queryForm.type_id = type_id
      }
      else {
        state.queryForm.type_id = props.id
      }

      if (state.queryForm.type_id !== null) {
        //state.height = $tableHeight() + 150
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
      // 监听自定义事件
      $eventBus.$on(event.CHANGE_ASSISTITEM_EVENT, () => {
        fetchData()
      })
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      rowClick,
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
$base: '.product-assist';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
