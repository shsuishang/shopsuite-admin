<template>
  <div class="user-points-history-container">
    <ms-search-box>

      <ms-search-box-left-panel :span="6">
        <el-button
          :icon="Check" type="primary" @click="exportCsv()">
          {{ t('导出打印') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="18">
        <el-form v-permissions="{ permission: ['/manage/pay/userPointsHistory/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item >
            <el-select
              v-model="queryForm.user_id"
              class="ml10"
              clearable
              filterable
              :loading="loading"
              :placeholder="t('请输入用户昵称')"
              remote
              :remote-method="findRemoteUserList"
              reserve-keyword
              :style="{width:'140px'}"
            >
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.user_nickname"
                :value="item.user_id"
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
      :data="items"
      :height="height"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('编号')"
        prop="points_log_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('类型')"
        prop="points_kind_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.points_kind_id]'>
            {{ ({"1":t('获取积分'),"2":t('消费积分')})[row.points_kind_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('积分类型')"
        prop="points_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"danger","2":"success","3":"warning","4":"info","5":"danger","6":"danger","7":"success","8":"warning","9":"warning","10":"warning","11":"warning","12":"info","14":"info","15":"info","21":"info"})[row.points_type_id]'>
            {{ ({"1":t('会员注册'),"2":t('会员登录'),"3":t('商品评论'),"4":t('购买商品'),"5":t('管理员操作'),"6":t('店铺评论'),"7":t('积分换购商品'),"8":t('积分兑换代金券'),"9":t('积分兑换'),"10":t('积分转出'),"11":t('积分转入'),"12":t('积分退还'),"14":t('升级商家'),"15":t('发展粉丝赠送'),"21":t('购买商品抵扣')})[row.points_type_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('会员编号')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('会员昵称')"
        prop="user_nickname"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('积分变动值')"
        prop="points_log_points"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('当前积分')"
        prop="user_points"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('描述')"
        prop="points_log_desc"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属店铺')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDate"
        :label="t('积分日期')"
        prop="points_log_date"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('交互会员')"
        prop="user_id_other"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('领取状态')"
        prop="points_log_state"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.points_log_state === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.points_log_state" active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('关联单号')"
        prop="ext_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('创建时间')"
        prop="points_log_time"
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
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList, doEdit} from '@/api/pay/userPointsHistory'
import Edit from './components/UserPointsHistoryEdit'
import {Check, Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDate, formatDateTime,renderTime} from "@/utils/format";
import {getList as getUserList} from "@/api/account/userInfo";

export default defineComponent({
  name: 'UserPointsHistory',
  components: {Edit},
  emits: [],
  setup() {
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
        size: 10,
        user_id: '',
      },
      loading : false,
      userList: [],
      filename: '积分记录',
      autoWidth: true,
      bookType: 'xlsx',
    })

    const exportCsv = () => {
      import('@/utils/excel').then((excel) => {
        const tHeader = ['编号', '类型', '积分类型', '会员编号','会员昵称','可用积分', '当前积分', '描述', '关联单号', '创建时间']
        const filterVal = ['points_log_id', 'points_kind_id', 'points_type_id', 'user_id','user_nickname','points_log_points', 'user_points', 'points_log_desc', 'ext_id', 'points_log_time']

        const items = state.items
        const data = formatJson(filterVal, items)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: state.filename,
          autoWidth: state.autoWidth,
          bookType: state.bookType,
        })
      })
    }

    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (!v[j]) return null;

          if (j == 'points_kind_id') {
            if (v[j] === 1) {
              return t('获取积分')
            } else if (v[j] === 2) {
              return t('消费积分')
            }
          } else if (j == 'points_type_id') {
            if (v[j] === 1) {
              return t('会员注册')
            } else if (v[j] === 2) {
              return t('会员登录')
            } else if (v[j] === 3) {
              return t('商品评论')
            } else if (v[j] === 4) {
              return t('购买商品')
            } else if (v[j] === 5) {
              return t('管理员操作')
            } else if (v[j] === 6) {
              return t('店铺评论')
            } else if (v[j] === 7) {
              return t('积分换购商品')
            } else if (v[j] === 8) {
              return t('积分兑换代金券')
            } else if (v[j] === 9) {
              return t('积分兑换')
            } else if (v[j] === 10) {
              return t('积分转出')
            } else if (v[j] === 11) {
              return t('积分转入')
            } else if (v[j] === 12) {
              return t('积分退还')
            } else if (v[j] === 14) {
              return t('升级商家')
            } else if (v[j] === 15) {
              return t('发展粉丝赠送')
            } else if (v[j] === 21) {
              return t('购买商品抵扣')
            }
          } else if (j == 'points_log_time') {
            return renderTime(v[j])
          }
          return v[j]
        })
      )
    }

    const findRemoteUserList = (user_nickname) => {
      if (user_nickname !== '') {
        state.loading = true
        setTimeout(() => {
          state.loading = false
          getUserList({user_nickname: user_nickname}).then((res) => {
            state.userList = res.data.items
          })
        }, 200)
      } else {
        state.userList = []
      }
    }

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.points_log_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.points_log_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({points_log_id: row.points_log_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const points_log_id = state.selectRows.map((item) => item.points_log_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({points_log_id})
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
      console.info(row)
        if (state.switchStatus) {
          const param = {
            points_log_id : row.points_log_id,
            points_log_state : row.points_log_state
          }

          const {msg, status} = await doEdit(param)

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        }
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
      handleEdit,
      findRemoteUserList,
      handleDelete,
      handleState,
      handleSizeChange,
      formatDateTime,
      formatDate,
      handleCurrentChange,
      beforeSwitchChange,
      queryData,
      fetchData,
      exportCsv,
      formatJson,
      Delete,
      Plus,
      Search,
      Check,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.user-points-history';
#{$base}-container {

  .ml10 {
    margin-left: 10px;
  }

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
