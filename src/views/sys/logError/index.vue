<template>
  <div class="log-error-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12"/>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/sys/logError/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-select
              v-model="queryForm.log_error_type"
              clearable
              filterable
              :placeholder="t('全部状态')"
              :style="{width:'140px'}"
            >
              <el-option
                v-for="item in configs.error_type_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.log_error_name"
              clearable
              :placeholder="t('请输入日志名称')"
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
        fixed="left"
        type="expand">
        <template #default="{ row }">
          <div class="ms-table-expand">
            <p>
              {{ row.log_error_info }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('日志编号')"
        prop="log_error_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('日志类型')"
        prop="log_error_type"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('日志名称')"
        prop="log_error_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('日志文件')"
        prop="log_error_line"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('日志时间')"
        prop="log_error_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('日志内容')"
        prop="log_error_info"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDate"
        :label="t('日志日期')"
        prop="log_error_date"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('日志时间')"
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
import {getList} from '@/api/sys/logError'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDate, formatDateTime} from "@/utils/format";
import {useSettingsStore} from "@/store/modules/settings";

export default defineComponent({
  name: 'LogError',
  components: {},
  emits: [],
  setup() {
    const settingsStore = useSettingsStore()
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      configs: settingsStore.getConfigs,
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
        log_error_name: '',
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
$base: '.log-error';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
