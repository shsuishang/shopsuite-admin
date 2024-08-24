<template>
  <div class="order-state-log-container">
    <el-table
      v-loading="listLoading"
      border
      :data="items"
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" type="index" width="30"/>
      <el-table-column align="center" :label="$t('用户编号')" prop="user_id" width="100"/>
      <el-table-column align="center" :label="$t('操作人')" prop="user_nickname" width="100"/>
      <el-table-column align="center" :formatter="formatDateTime" :label="$t('时间')" prop="order_state_time" width="160"/>
      <el-table-column align="center" :label="$t('操作前')" prop="order_state_type" width="160">
        <template #default="{ row }">
          <order-state :id="row.order_state_pre_id"/>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作后')" prop="order_state_type" width="160">
        <template #default="{ row }">
          <order-state :id="row.order_state_id"/>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作日志')" prop="order_state_note"/>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
      </template>
    </el-table>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {listStateLog} from '@/api/trade/orderBase'
import OrderState from '@/plugins/OrderState'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDateTime} from "@/utils/format";

export default defineComponent({
  name: 'OrderStateLog',
  components: {OrderState},
  props: {
    modelValue: {
      type: String,
      default: ''
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const $tableHeight = inject('$tableHeight')
    const opts = JSON.parse(JSON.stringify(props));

    const state = reactive({
      editRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      dialogFormVisible: false,
      title: '',
      queryForm: {
        page: 1,
        size: 100,
        title: '',
        order_id: opts.modelValue,
      },
    })


    const setSelectRows = (val) => {
      state.selectRows = val
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
      } = await listStateLog(state.queryForm)
      state.items = items
      state.total = records
      state.listLoading = false
    }

    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          state.queryForm.order_id = newVal
          //alert(newVal)
          if (state.queryForm.order_id) {
            fetchData()
          }
        }
      },
      { deep: true, immediate: true }
    )

    onMounted(() => {
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      Delete,
      Plus,
      Search,
      formatDateTime,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.order-state-log';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text {
      width: 36px;
    }
  }
}
</style>
