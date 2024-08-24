<template>
  <div class="log-action-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12"/>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/sys/logAction/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.log_url"
              clearable
              :placeholder="t('请输入请求接口')"
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
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('日志编号')"
        prop="log_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('用户编号')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('请求名称')"
        prop="log_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('请求接口')"
        prop="log_url"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('请求方法')"
        prop="log_method"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('请求的参数')"
        prop="log_param"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('日志IP')"
        prop="log_ip"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDate"
        :label="t('日志日期')"
        prop="log_date"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('记录时间')"
        prop="log_time"
        show-overflow-tooltip
        width="160"
      />
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
</template>

<script>
import { translate as t } from '@/i18n'
import {getList} from '@/api/sys/logAction'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDate, formatDateTime} from "@/utils/format";

export default defineComponent({
  name: 'LogAction',
  components: {},
  emits: [],
  setup() {
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
        size: 10,
        log_url: '',
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
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      formatDate,
      formatDateTime,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.log-action';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
