<template>
  <div class="order-return-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="4">
        <el-button
          :icon="Check" type="primary" @click="exportCsv()">
          {{ t('导出打印') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="20">
        <el-form v-permissions="{ permission: ['/manage/trade/orderReturn/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-select
              v-model="queryForm.return_state_id"
              class="ml10"
              clearable
              :placeholder="t('请选择处理状态')"
              :style="{width:'150px'}"
            >
              <el-option
                v-for="item in returnStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.return_id"
              clearable
              :placeholder="t('请输入退单编号')"
              style="margin-left: 10px;width: 150px"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.order_id"
              clearable
              :placeholder="t('请输入订单编号')"
              style="margin-left: 10px;width: 150px"
            />
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-select v-model="queryForm.return_channel_code" clearable :placeholder="t('请选择退款渠道')" style="margin-left: 10px;width: 150px">-->
<!--              <el-option :label="t('余额')" value="money" />-->
<!--              <el-option :label="t('支付宝')" value="alipay" />-->
<!--              <el-option :label="t('微信')" value="wx_native" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item>
            <ms-date-range-picker v-model="return_add_range" style="margin-left: 10px"/>
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
      <el-table-column align="center" show-overflow-tooltip type="selection"/>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('退单号')"
        prop="return_id"
        show-overflow-tooltip
        width="140"
      >
        <template #default="{ row }">
          <el-link style="color: #1890ff" @click="showTime(row)">
            {{ row.return_id }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('服务类型')"
        prop="service_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success","3":"warning","4":"info"})[row.service_type_id]'>
            {{ ({"1":t('退款'),"2":t('退货'),"3":t('换货'),"4":t('维修')})[row.service_type_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('订单编号')"
        prop="order_id"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        align="center"
        :label="t('退款金额')"
        prop="return_refund_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('积分部分')"
        prop="return_refund_point"
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
        align="center"
        :label="t('买家编号')"
        prop="buyer_user_id"
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
        align="center"
        :formatter="formatStartTime"
        :label="t('添加时间')"
        prop="return_add_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('退款理由')"
        prop="return_reason_name"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('买家退货备注')"
        prop="return_buyer_message"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('收货人')"
        prop="return_addr_contacter"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('联系电话')"
        prop="return_tel"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('收货地址详情')"
        prop="return_addr"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('邮编')"
        prop="return_post_code"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('物流公司编号')"
        prop="express_id"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('物流名称')"
        prop="return_tracking_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('物流单号')"
        prop="return_tracking_number"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('申请状态')"
        prop="plantform_return_state_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"3180":"warning","3181":"info","3182":"success"})[row.plantform_return_state_id]'>
            {{ ({"3180":t('未申请'),"3181":t('待处理'),"3182":t('已完成')})[row.plantform_return_state_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('卖家处理状态')"
        prop="return_state_id"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type='({"3100":"info","3105":"info","3110":"warning","3115":"warning","3120":"warning","3125":"success","3130":"danger","3135":"warning"})[row.return_state_id]'>
            {{ ({"3100":t('【客户】提交退单'),"3105":t('退单审核'),"3110":t('收货确认'),"3115":t('退款确认'),"3120":t('收款确认'),"3125":t('完成'),"3130":t('商家拒绝'),"3135":t('买家取消')})[row.return_state_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('退款完成')"
        prop="return_is_paid"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["danger","success"])[row.return_is_paid ? 1 : 0]'>
            {{ ([t('否'),t('是')])[row.return_is_paid ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('退货类型')"
        prop="return_is_shipping_fee"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.return_is_shipping_fee ? 1 : 0]'>
            {{ ([t('退款单'),t('退运费单')])[row.return_is_shipping_fee ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('退货类型')"
        prop="return_flag"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["warning","success"])[row.return_flag]'>
            {{ ([t('不用退货'),t('需要退货')])[row.return_flag] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('申请类型')"
        prop="return_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"info","2":"success","3":"warning"})[row.return_type]'>
            {{ ({"1":t('退款申请'),"2":t('退货申请'),"3":t('虚拟退款')})[row.return_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('物流状态')"
        prop="return_item_state_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"2030":"info","2040":"warning","2060":"success","2070":"danger"})[row.return_item_state_id]'>
            {{ ({"2030":t('待发货'),"2040":t('已发货'),"2060":t('已完成'),"2070":t('已取消')})[row.return_item_state_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('商家处理时间')"
        prop="return_store_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('商家备注')"
        prop="return_store_message"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('退还佣金')"
        prop="return_commision_fee"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('退款完成时间')"
        prop="return_finish_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('平台留言')"
        prop="return_platform_message"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('订单是否结算')"
        prop="return_is_settlemented"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type='(["danger","success"])[row.return_is_settlemented ? 1 : 0]'>
            {{ ([t('未结算'),t('已结算')])[row.return_is_settlemented ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('订单结算时间')"
        prop="return_settlement_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('退款渠道')"
        prop="return_channel_code"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"money":"info","alipay":"success","wx_native":"warning"})[row.return_channel_code]'>
            {{ ({"money":t('余额'),"alipay":t('支付宝'),"wx_native":t('微信')})[row.return_channel_code] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('渠道退款')"
        prop="return_channel_flag"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["warning","success","danger"])[row.return_channel_flag]'>
            {{ ([t('待退'),t('已退'),t('异常')])[row.return_channel_flag] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('渠道退款时间')"
        prop="return_channel_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('渠道退款单号')"
        prop="return_channel_trans_id"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('交易号')"
        prop="deposit_trade_no"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('支付渠道')"
        prop="payment_channel_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('实付金额')"
        prop="trade_payment_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('联系人')"
        prop="return_contact_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('审核人员')"
        prop="return_store_user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('提现审核')"
        prop="return_withdraw_confirm"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["warning","success"])[row.return_withdraw_confirm ? 1 : 0]'>
            {{ ([t('未审核'),t('已审核')])[row.return_withdraw_confirm ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('退款财务确认')"
        prop="return_financial_confirm"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type='(["warning","success"])[row.return_financial_confirm ? 1 : 0]'>
            {{ ([t('未确认'),t('已确认')])[row.return_financial_confirm ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('退款财务确认时间')"
        prop="return_financial_confirm_time"
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
    <item ref="itemRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {getList, doEdit} from '@/api/trade/orderReturn'
import Edit from './components/OrderReturnEdit'
import Item from './components/OrderReturnItem'
import {Check, Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDateTime} from "@/utils/format";
import {useSettingsStore} from "@/store/modules/settings";


export default defineComponent({
  name: 'OrderReturn',
  components: {Edit, Item},
  emits: [],
  setup() {
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')
    const settingsStore = useSettingsStore()

    const state = reactive({
      editRef: null,
      itemRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        order_id: '',
        return_id : '',
        return_state_id: '',
        return_add_start: '',
        return_add_end: '',
        return_channel_code: '',
      },
      return_add_range: [],
      returnStateList: settingsStore.getConfigs.return_state_list,
      filename: '退单列表',
      autoWidth: true,
      bookType: 'xlsx',
    })

    const exportCsv = () => {
      if (state.selectRows.length <= 0) {
        $message('没有选中的数据！', 'error')
        return
      }

      import('@/utils/excel').then((excel) => {
        const tHeader = ['退单号', '服务类型', '订单编号', '退款金额', '积分部分', '买家编号', '添加时间', '退款理由编号', '买家退货备注', '卖家处理状态', '退款完成', '退货类型', '退货类型', '申请类型', '商家处理时间', '商家备注', '退还佣金']
        const filterVal = ['return_id', 'service_type_id', 'order_id', 'return_refund_amount', 'return_refund_point', 'buyer_user_id', 'return_add_time', 'return_reason_id', 'return_buyer_message', 'return_state_id', 'return_is_paid', 'return_is_shipping_fee', 'return_flag', 'return_type', 'return_store_time', 'return_store_message', 'return_commision_fee']

        const items = state.selectRows
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

    const setSelectRows = (val) => {
      state.selectRows = val
    }

    const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) =>
          filterVal.map((j) => {
            if (v[j] == null) return null;

            if (j == 'service_type_id') {
              if (v[j] === 1) {
                return t('退款')
              } else if (v[j] === 2) {
                return t('退货')
              } else if (v[j] === 3) {
                return t('换货')
              } else if (v[j] === 4) {
                return t('维修')
              }
            } else if (j == 'return_add_time') {
              return formatDateOne(new Date(v[j]))
            } else if (j == 'return_state_id') {
              if (v[j] === 3100) {
                return t('【客户】提交退单')
              } else if (v[j] === 3105) {
                return t('退单审核')
              } else if (v[j] === 3110) {
                return t('收货确认')
              } else if (v[j] === 3115) {
                return t('退款确认')
              } else if (v[j] === 3120) {
                return t('收款确认')
              } else if (v[j] === 3125) {
                return t('完成')
              } else if (v[j] === 3130) {
                return t('商家拒绝')
              } else if (v[j] === 3135) {
                return t('买家取消')
              }
            } else if (j == 'return_is_paid') {
              if (v[j] === 1) {
                return t('是')
              } else {
                return t('否')
              }
            } else if (j == 'return_flag') {
              if (v[j]) {
                return t('需要退货')
              } else if (v[j] === 0) {
                return t('不用退货')
              }
            } else if (j == 'return_type') {
              if (v[j] === 1) {
                return t('退款申请')
              } else if (v[j] === 2) {
                return t('退货申请')
              } else if (v[j] === 3) {
                return t('虚拟退款')
              }
            } else if (j == 'return_item_state_id') {
              if (v[j] === 2030) {
                return t('待发货')
              } else if (v[j] === 2040) {
                return t('已发货')
              } else if (v[j] === 2060) {
                return t('已完成')
              } else if (v[j] === 2070) {
                return t('已取消')
              }
            } else if (j == 'return_is_shipping_fee') {
              if (v[j]) {
                return t('退运费单')
              } else {
                return t('退款单')
              }
            }

            return v[j]
          })
        )
      }

    const handleEdit = (row) => {
      if (row && row.return_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }

    const showTime = (row) => {
      state.itemRef.showEdit(row)
    }

    const handleState = async (row) => {
      console.info(row)
      const param = {
        return_id : row.return_id,
        return_is_paid: row.return_is_paid,
        return_is_settlemented : row.return_is_settlemented,
        return_withdraw_confirm : row.return_withdraw_confirm,
        return_financial_confirm : row.return_financial_confirm,
      }

      const {msg, status} = await doEdit(param)

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
    const fetchData = async () => {
      state.listLoading = true

      if (state.return_add_range.length > 0) {
        if (state.return_add_range[0]) {
          state.queryForm.return_add_start = state.return_add_range[0].getTime();
        }
        if (state.return_add_range[1]) {
          state.queryForm.return_add_end = state.return_add_range[1].getTime();
        }
      } else {
        state.queryForm.return_add_start = undefined
        state.queryForm.return_add_end = undefined
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
        const timestamp = row.return_add_time;
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

    return {
      t,
      ...toRefs(state),
      handleEdit,
      showTime,
      handleState,
      handleSizeChange,
      formatStartTime,
      handleCurrentChange,
      formatDateTime,
      queryData,
      fetchData,
      exportCsv,
      setSelectRows,
      formatJson,
      Delete,
      Check,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.order-return';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 36px;
    }
  }
}
</style>
