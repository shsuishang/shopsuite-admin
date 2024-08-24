<template>
  <div class="consume-record-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="4">
<!--        <el-button v-permissions="{ permission: ['/manage/pay/consumeRecord/add'] }" :icon="Plus" type="primary" @click="handleEdit">-->
<!--          {{ t('添加') }}-->
<!--        </el-button>-->
<!--        <el-button v-permissions="{ permission: ['/manage/pay/consumeRecord/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">-->
<!--          {{ t('批量删除') }}-->
<!--        </el-button>-->
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="20">
        <el-form v-permissions="{ permission: ['/manage/pay/consumeRecord/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
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
            <ms-date-range-picker v-model="record_time_range" style="margin-left: 10px"/>
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
        :label="t('支付流水号')"
        prop="consume_record_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('订单编号')"
        prop="order_id"
        show-overflow-tooltip
        width="140"
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
        :label="t('昵称')"
        prop="user_nickname"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('货币编号')"
        prop="currency_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('左符号')"
        prop="currency_symbol_left"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('总额')"
        prop="record_total"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('金额')"
        prop="record_money"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('佣金')"
        prop="record_commission_fee"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('分销佣金')"
        prop="record_distribution_commission_fee"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDate"
        :label="t('日期')"
        prop="record_date"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('年')"
        prop="record_year"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('月')"
        prop="record_month"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('日')"
        prop="record_day"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('标题')"
        prop="record_title"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('描述')"
        prop="record_desc"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatStartTime "
        :label="t('支付时间')"
        prop="record_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('交易类型')"
        prop="trade_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1201":"","1202":"success","1203":"warning","1204":"info","1205":"danger","1206":"","1207":"","1208":"","1209":""})[row.trade_type_id]'>
            {{ ({"1201":t('购物'),"1202":t('转账'),"1203":t('充值'),"1204":t('提现'),"1205":t('销售'),"1206":t('佣金'),"1207":t('退货付款'),"1208":t('退货收款'),"1209":t('转账收款')})[row.trade_type_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('支付方式')"
        prop="payment_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1301":"info","1302":"success","1303":"success","1304":"success","1305":"success"})[row.payment_type_id]'>
            {{ ({"1301":t('货到付款'),"1302":t('在线支付'),"1303":t('白条支付'),"1304":t('现金支付'),"1305":t('线下支付')})[row.payment_type_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('支付渠道')"
        prop="payment_channel_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <div v-for="(item, index) in paymentChannelList" :key="index">
            <el-tag v-if="item.value == row.payment_channel_id">
              {{ item.label }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
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
        :label="t('所属门店')"
        prop="chain_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('消费类型')"
        prop="payment_met_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"success","2":"success","3":"success","4":"success","5":"success"})[row.payment_met_id]'>
            {{ ({"1":t('余额支付'),"2":t('充值卡支付'),"3":t('积分支付'),"4":t('信用支付'),"5":t('红包支付')})[row.payment_met_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('状态')"
        prop="record_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"success","0":"info"})[row.record_enable ? 1 : 0]'>
            {{ ({"1":t('已收款'),"0":t('作废')})[row.record_enable ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属分站')"
        prop="subsite_id"
        show-overflow-tooltip
        width="100"
      />
<!--      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">-->
<!--        <template #default="{ row }">-->
<!--          <el-button v-permissions="{ permission: ['/manage/pay/consumeRecord/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>-->
<!--          <el-button v-permissions="{ permission: ['/manage/pay/consumeRecord/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
  import {doRemove, doRemoveBatch, getList} from '@/api/pay/consumeRecord'
  import Edit from './components/ConsumeRecordEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {formatDate} from "@/utils/format";
  import {getList as getUserList} from "@/api/account/userInfo";
  import {useSettingsStore} from "@/store/modules/settings";

  export default defineComponent({
    name: 'ConsumeRecord',
    components: {Edit},
    emits: [],
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')
      const settingsStore = useSettingsStore()

      const state = reactive({
        editRef: null,
        height: $tableHeight(),
        items: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        record_time_range: [],
        queryForm: {
          page: 1,
          size: 10,
          user_id : '',
          record_time_start : '',
          record_time_end : '',
        },
        loading: '',
        userList: [],
        paymentChannelList: settingsStore.getConfigs.payment_channel_list,
      })

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
        if (row && row.consume_record_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.consume_record_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({consume_record_id: row.consume_record_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const consume_record_id = state.selectRows.map((item) => item.consume_record_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({consume_record_id})
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

      // 格式化时间戳为可读时间格式的计算属性
      const formatStartTime  = computed(() => {
        return (row) => {
          const timestamp = row.record_time;
          const dateObj = new Date(timestamp);
          const formattedTime = formatDateOne(dateObj); // 调用自定义函数格式化时间
          return formattedTime;
        };
      });

      // 自定义函数，将Date对象格式化为时间字符串
      function formatDateOne(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

        if (state.record_time_range.length > 0) {
          if (state.record_time_range[0]) {
            state.queryForm.record_time_start = state.record_time_range[0].getTime();
          }
          if (state.record_time_range[1]) {
            state.queryForm.record_time_end = state.record_time_range[1].getTime();
          }
        } else {
          state.queryForm.record_time_start = undefined
          state.queryForm.record_time_end = undefined
        }

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
        formatStartTime,
        handleEdit,
        findRemoteUserList,
        handleDelete,
        handleState,
        formatDate,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        fetchData,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.consume-record';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
