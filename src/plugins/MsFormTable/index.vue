<template>
  <div class="ms-form-table">
    <ms-search-box>
      <ms-search-box-top-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleAdd($event)">
          添加
        </el-button>
      </ms-search-box-top-panel>
    </ms-search-box>
    <el-table
:key="toggleIndex" ref="tableRef" border
              :data="data"  :height="height" :row-class-name="tableRowClassName" @row-click="rowClick">
      <el-table-column v-if="drag" align="center" label="操作" width="60">
        <template #default>
          <ms-icon
            class="ms-rank"
            icon="drag-move-2-line"
            style="cursor: move"
          />
        </template>
      </el-table-column>

      <slot></slot>
      <el-table-column align="center" label="操作" width="120">
        <template #default="{ $index, row }">
          <el-button
            :icon="Delete"
            plain
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" description="暂无数据" />
      </template>
    </el-table>
  </div>
</template>

<script>
  import { Delete, Plus } from '@element-plus/icons-vue'
  import Sortable from 'sortablejs'

  export default defineComponent({
    name: 'MsFormTable',
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
      rowTemplate: {
        type: Object,
        default: () => {},
      },
      drag: {
        type: Boolean,
        default: false,
      },
      height: {
        type: Number,
        default: 200,
      }
    },
    emits: ['update:modelValue', 'row-click'],
    setup(props, { emit }) {
      const state = reactive({
        tableRef: null,
        data: [],
        toggleIndex: 0,
      })

      const rowDrop = () => {
        const tbody = state.tableRef.$el.querySelector(
          '.el-table__body-wrapper tbody'
        )
        Sortable.create(tbody, {
          handle: '.ms-rank',
          animation: 300,
          onEnd({ newIndex, oldIndex }) {
            const tableData = state.data
            const currRow = tableData.splice(oldIndex, 1)[0]
            tableData.splice(newIndex, 0, currRow)
            state.toggleIndex += 1
            nextTick(() => {
              rowDrop()
            })
          },
        })
      }
      const handleAdd = () => {
        state.data.push(JSON.parse(JSON.stringify(props.rowTemplate)))
      }
      const handleDelete = (row, index) => {
        state.data.splice(index, 1)
      }
      const rowClick = (row, column, event) => {
        emit('row-click', row, column, event)
      }
      // 把每一行的索引放进row
      const tableRowClassName = ({ row, rowIndex }) => {
        row.index = rowIndex;
      }

      onMounted(() => {
        state.data = props.modelValue
        if (props.drag) rowDrop()
      })

      watch(
        () => props.modelValue,
        () => (state.data = props.modelValue)
      )

      watch(
        () => state.data,
        () => emit('update:modelValue', state.data)
      )

      return {
        ...toRefs(state),
        rowDrop,
        handleAdd,
        handleDelete,
        rowClick,
        tableRowClassName,
        Delete,
        Plus,
      }
    },
  })
</script>
