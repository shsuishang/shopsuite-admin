<template>
  <div class="product-assist-item-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="8">
        <el-button class="tree-button" :disabled="queryForm.assist_id==0" :icon="Plus" type="primary" @click="handleEdit()">
          {{ t('添加选项') }}
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
        v-if="false"
        align="center"
        fixed="left"
        :label="t('属性编号')"
        prop="assist_item_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('选项名称')"
        prop="assist_item_name"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('属性编号')"
        prop="assist_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('选项排序')"
        prop="assist_item_sort"
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
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList} from '@/api/pt/productAssistItem'
import Edit from './components/ProductAssistItemEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import { reactive } from 'vue'
import {event} from "@/config";

export default defineComponent({
  name: 'ProductAssistItem',
  components: {Edit},
  emits: [],
  setup() {
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
        size: 500,
        title: '',
        assist_id: 0
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.assist_item_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit({assist_id: state.queryForm.assist_id})
      }
    }
    const handleDelete = (row) => {
      if (row.assist_item_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({assist_item_id: row.assist_item_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
          $eventBus.$emit(event.CHANGE_ASSISTITEM_EVENT)
        })
      } else {
        if (state.selectRows.length > 0) {
          const assist_item_id = state.selectRows.map((item) => item.assist_item_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({assist_item_id})
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            await fetchData()
            $eventBus.$emit(event.CHANGE_ASSISTITEM_EVENT)
          })
        } else {
          $message(t('未选中任何行'), 'error')
        }
      }
    }
    const handleState = async (row) => {
      console.info(row)
      const param = {}

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
    const close =  () => {
      state.queryForm.assist_id = 0
    }
    const fetchData = async (assist_id) => {
      if (typeof assist_id != "undefined") {
        state.queryForm.assist_id = assist_id
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
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      close,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-assist-item';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
