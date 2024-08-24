<template>
  <div class="consume-trade-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="4">
<!--        <el-button v-permissions="{ permission: ['/manage/pay/consumeTrade/add'] }" :icon="Plus" type="primary" @click="handleEdit">-->
<!--          {{ t('添加') }}-->
<!--        </el-button>-->
<!--        <el-button v-permissions="{ permission: ['/manage/pay/consumeTrade/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">-->
<!--          {{ t('批量删除') }}-->
<!--        </el-button>-->
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="20">
        <el-form v-permissions="{ permission: ['/manage/pay/consumeTrade/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.trade_title"
              clearable
              :placeholder="t('请输入标题')"
            />
          </el-form-item>
          <el-form-item>
            <ms-date-range-picker v-model="trade_time_range" style="margin-left: 10px"/>
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
        :label="t('交易订单')"
        prop="consume_trade_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('标题')"
        prop="trade_title"
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
        :label="t('买家编号')"
        prop="buyer_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('买家店铺')"
        prop="buyer_store_id"
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
        :label="t('所属分站')"
        prop="subsite_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('卖家编号')"
        prop="seller_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('门店编号')"
        prop="chain_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('支付状态')"
        prop="trade_is_paid"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('交易类型')"
        prop="trade_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1201":"","1202":"success","1203":"warning","1204":"info","1205":"danger","1206":null})[row.trade_type_id]'>
            {{ ({"1201":t('购物'),"1202":t('转账'),"1203":t('充值'),"1204":t('提现'),"1205":t('销售'),"1206":t('佣金')})[row.trade_type_id] }}
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
        :label="t('交易模式')"
        prop="trade_mode_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.trade_mode_id]'>
            {{ ({"1":t('担保交易'),"2":t('直接交易')})[row.trade_mode_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('充值编号')"
        prop="recharge_level_id"
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
        :label="t('总付款额度')"
        prop="order_payment_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('平台交易佣金')"
        prop="order_commission_fee"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('实付金额')"
        prop="trade_payment_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('余额支付')"
        prop="trade_payment_money"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('充值卡余额')"
        prop="trade_payment_recharge_card"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('积分支付')"
        prop="trade_payment_points"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('众宝支付')"
        prop="trade_payment_sp"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('信用支付')"
        prop="trade_payment_credit"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('红包支付')"
        prop="trade_payment_redpack"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('折扣优惠')"
        prop="trade_discount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('总额虚拟')"
        prop="trade_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('描述')"
        prop="trade_desc"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('备注')"
        prop="trade_remark"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatStartTime "
        :label="t('创建时间')"
        prop="trade_create_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('付款时间')"
        prop="trade_paid_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('是否删除')"
        prop="trade_delete"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
<!--          <el-tooltip-->
<!--            :content="row.trade_delete === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"-->
<!--            :enterable="false"-->
<!--            placement="top"-->
<!--          >-->
<!--            <el-switch v-model="row.trade_delete" active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />-->
<!--          </el-tooltip>-->
          <el-tag :type='(["info","success"])[row.trade_delete ? 1 : 0]'>
            {{ ([t('否'),t('是')])[row.trade_delete ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">-->
<!--        <template #default="{ row }">-->
<!--          <el-button v-permissions="{ permission: ['/manage/pay/consumeTrade/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>-->
<!--          <el-button v-permissions="{ permission: ['/manage/pay/consumeTrade/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>-->
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
  import {doRemove, getList, doEdit} from '@/api/pay/consumeTrade'
  import Edit from './components/ConsumeTradeEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {useSettingsStore} from "@/store/modules/settings";
  import {formatDateTime} from "@/utils/format";

  export default defineComponent({
    name: 'ConsumeTrade',
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
        trade_time_range: [],
        queryForm: {
          page: 1,
          size: 10,
          trade_title: '',
          trade_time_start: '',
          trade_time_end: '',

        },
        switchStatus: false,
        paymentChannelList: settingsStore.getConfigs.payment_channel_list,
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.consume_trade_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.consume_trade_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({consume_trade_id: row.consume_trade_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const consume_trade_id = state.selectRows.map((item) => item.consume_trade_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({consume_trade_id})
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
              consume_trade_id : row.consume_trade_id,
              trade_delete : row.trade_delete
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

        if (state.trade_time_range.length > 0) {
          if (state.trade_time_range[0]) {
            state.queryForm.trade_time_start = state.trade_time_range[0].getTime();
          }
          if (state.trade_time_range[1]) {
            state.queryForm.trade_time_end = state.trade_time_range[1].getTime();
          }
        } else {
          state.queryForm.trade_time_start = undefined
          state.queryForm.trade_time_end = undefined
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

      // 格式化时间戳为可读时间格式的计算属性
      const formatStartTime  = computed(() => {
        return (row) => {
          const timestamp = row.trade_create_time;
          const dateObj = new Date(timestamp);
          const formattedTime = formatDate(dateObj); // 调用自定义函数格式化时间
          return formattedTime;
        };
      });

      // 自定义函数，将Date对象格式化为时间字符串
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      return {
        t,
        ...toRefs(state),
        setSelectRows,
        formatStartTime,
        handleEdit,
        handleDelete,
        handleState,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        formatDateTime,
        fetchData,
        beforeSwitchChange,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.consume-trade';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
