<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="70%"
    :title="title"
    top="1%"
    :with-header="true"
    @close="close"
  >
    <div class="activity-base-container">
      <ms-search-box>
        <ms-search-box-left-panel :span="12">
          <div style="display: flex">
            <div>{{ t('可用短信条数') }}：{{ userSmsNum }}</div>
            <div style="margin-left: 20px">{{ t('已用条数') }}：{{ total }}</div>
          </div>
        </ms-search-box-left-panel>
        <ms-search-box-right-panel :span="12">
          <el-form :inline="true" :model="queryForm" @submit.prevent>
            <el-button :icon="Refresh" type="primary" @click="queryData">
              {{ t('刷新') }}
            </el-button>
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
          :label="t('编号')"
          prop="sms_record_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('会员编号')"
          prop="user_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('接收号码')"
          prop="sms_mobile"
          show-overflow-tooltip
          width="120"
        />
        <el-table-column
          align="center"
          :label="t('短信内容')"
          prop="sms_content"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          :formatter="formatDate"
          :label="t('发送日期')"
          prop="sms_date"
          show-overflow-tooltip
          width="160"
        />
        <el-table-column
          align="center"
          :formatter="formatDateTime"
          :label="t('发送时间')"
          prop="sms_time"
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
        :page-size="queryForm.rows"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </el-drawer>
</template>

<script>
  import {getSmsRecord} from '@/api/sys/config'
  import { translate as t } from '@/i18n'
  import {Plus, Refresh} from '@element-plus/icons-vue'
  import {formatDateTime, formatDate} from "@/utils/format";

  export default defineComponent({
    name: 'SmsRecord',
    emits: [],
    setup() {
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        height: $tableHeight(),
        items: [],
        listLoading: true,
        loading : false,
        title: t('消费记录'),
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        userSmsNum: 0,
        dialogFormVisible: false,
        queryForm: {
          page: 1,
          rows: 10,
        },
      })

      const showRecord = () => {
        fetchData()
        state.dialogFormVisible = true
      }


      const close = () => {
        state.queryForm = {
          page: 1,
          rows: 10
        }
        state.dialogFormVisible = false
      }

      const handleSizeChange = (val) => {
        state.queryForm.rows = val
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
        const { data } = await getSmsRecord(state.queryForm)
        state.items = data.items
        state.total = data.records
        state.userSmsNum = data.user_sms_num
        state.listLoading = false
      }

      return {
        t,
        ...toRefs(state),
        showRecord,
        close,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        formatDateTime,
        formatDate,
        fetchData,
        Plus,
        Refresh,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.activity-groupbooking';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
