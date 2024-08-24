<template>
  <div class="order-base-container" :class="{ 'ms-fullscreen': isFullscreen }">
    <ms-search-box>
      <ms-search-box-left-panel :span="6">
        <el-button
          v-permissions="{ permission: ['/manage/trade/orderBase/add'] }" :icon="Plus" type="primary"
          @click="handleAdd">
          {{ t('添加') }}
        </el-button>

        <el-button
          v-show="selectRows.length > 0"
          v-permissions="{ permission: ['/manage/trade/orderBase/cancel'] }"
          :icon="Check"
          type="primary"
          @click="reviewCancel"
        >
          {{ t('取消订单') }}
        </el-button>

        <el-button
          v-show="ifReview && selectRows.length > 0"
          v-permissions="{ permission: ['/manage/trade/orderBase/review'] }"
          :icon="Check"
          type="primary"
          @click="reviewOrder"
        >
          {{ t('订单审核') }}
        </el-button>

        <el-button
          v-show="ifFinanceReview && selectRows.length > 0"
          v-permissions="{ permission: ['/manage/trade/orderBase/finance'] }"
          :icon="Check"
          type="primary"
          @click="reviewFinance"
        >
          {{ t('财务审核') }}
        </el-button>
        <el-button
          v-show="ifPickingReview && selectRows.length > 0"
          v-permissions="{ permission: ['/manage/trade/orderBase/picking'] }"
          :icon="Check"
          type="primary"
          @click="reviewPicking()"
        >
          {{ t('出库确认') }}
        </el-button>
        <el-button
          v-show="selectRows.length > 0"
          v-permissions="{ permission: ['/manage/trade/orderBase/shipping'] }"
          :icon="Check"
          type="primary"
          @click="reviewShipping()"
        >
          {{ t('发货确认') }}
        </el-button>
        <el-button
          :icon="Check" type="primary" @click="exportCsv()">
          {{ t('导出打印') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="18">
        <el-form
          v-permissions="{ permission: ['/manage/trade/orderBase/list'] }" :inline="true" :model="queryForm"
          @submit.prevent>
          <el-form-item>
            <el-select
              v-model="queryForm.order_state_id"
              clearable
              filterable
              :placeholder="t('全部状态')"
              :style="{width:'140px'}"
            >
              <el-option
                v-for="item in configs.order_state_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="false">
            <el-select
              v-model="queryForm.kind_id"

              clearable
              :placeholder="t('订单类型')"
              :style="{width:'140px'}"
            >
              <el-option
                v-for="item in optionsKindId"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item >
            <el-select
              v-model="queryForm.search_code"
              clearable
              filterable
              :loading="codeLoading"
              :placeholder="t('虚拟码')"
              remote
              :remote-method="findRemoteCodeList"
              reserve-keyword
              :style="{width:'80px'}"
            >
              <el-option
                v-for="item in codeList"
                :key="item.order_id"
                :label="item.chain_code"
                :value="item.order_id"
                @click="queryData"
              />
            </el-select>
          </el-form-item>

          <el-form-item >
            <el-select
              v-model="queryForm.user_id"
              clearable
              filterable
              :loading="loading"
              :placeholder="t('请输入买家昵称')"
              remote
              :remote-method="findRemoteUserList"
              reserve-keyword
              :style="{width:'100px'}"
            >
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.user_nickname"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item >
            <el-input
              v-model.trim="queryForm.search_text"

              clearable
              :placeholder="t('请输入')"
              :style="{width:'200px'}"
            >
              <template #prepend>
                <el-select v-model="queryForm.search_type" :placeholder="t('请选择')" :style="{width:'100px'}">
                  <el-option :label="t('订单编号')" value="order_id"/>
                  <el-option :label="t('订单标题')" value="order_title"/>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item >
            <ms-date-range-picker v-model="order_time_range"/>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="queryData">
              {{ t('查询') }}
            </el-button>
            <el-button
              text
              type="primary"
              @click="clickFullScreen"
            />
          </el-form-item>
        </el-form>
      </ms-search-box-right-panel>
    </ms-search-box>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :data="list"
      :height="height"
      :size="lineHeight"
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" show-overflow-tooltip type="selection"/>
      <el-table-column
        v-if="false"
        fixed="left"
        type="expand">
        <template #default="{ row }">
          <div class="ms-table-expand">
            <p>
              <span class="ms-table-expand-title">{{ t('订单编号')}}:</span>
              {{ row.order_id }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('订单编号')"
        show-overflow-tooltip
        width="140"
      >
        <template #default="{ row }">
          <span v-if="row.return_flag">
            <el-link style="color: red" @click="handleEdit(row)">
              {{ row.order_id }}
            </el-link>
          </span>
          <span v-if="!row.return_flag">
            <el-link type="primary" @click="handleEdit(row)">
              {{ row.order_id }}
            </el-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('订单标题')"
        prop="order_title"
        show-overflow-tooltip
        width="180"
      />
      <el-table-column
        align="center"
        :label="t('客户名称')"
        prop="user_nickname"
        show-overflow-tooltip
        width="140px"
      />
      <el-table-column
        align="center"
        :label="t('应付金额')"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          {{ row.currency_symbol_left }}{{ row.order_payment_amount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatTime"
        :label="t('下单时间')"
        prop="order_time"
        show-overflow-tooltip
        width="160"
      />

      <el-table-column
        align="center"
        :label="t('配送方式')"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <span v-if="row.delivery_type_id === 5">{{ t('自提') }}</span>
          <span v-else-if="row.delivery_type_id === 10">{{ t('配送') }}</span>
          <span v-else>
            {{ t('配送') }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="false"
        align="center"
        :label="t('配送时间')"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <span v-if="row.delivery_time_name != '正常配送'" style="color: red">
            {{ row.delivery_time_name }}
          </span>
          <span v-if="row.delivery_time_name == '正常配送'">
            {{ row.delivery_time_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('配送地址')"
        prop="mo_receive_area"
        show-overflow-tooltip
        width="250"
      />
      <el-table-column
        align="center"
        :label="t('订单状态')"
        prop="order_state_id"
        show-overflow-tooltip
        width="130"
      >
        <template #default="{ row }">
          <order-state :id="row.order_state_id" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('退款状态')"
        show-overflow-tooltip
        width="100px"
      >
        <template #default="{ row }">
          <el-tag :type='({"0":"info","1":"warning","2":"success"})[row.order_refund_status]'>
            {{ ({"0":t('无退款'),"1":t('部分退款'),"2":t('全部退款')})[row.order_refund_status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('转单状态')"
        prop="has_supplier_trans"
        show-overflow-tooltip
        width="160"
      >
        <template #default="{ row }">
          <el-button
            v-if="row.has_supplier_trans == 0"
            type="info"
            @click="doSupplierTrans(row.order_id)"
          >
            {{ t('转单') }}
          </el-button>
          <span v-else-if="row.has_supplier_trans==3">

          </span>
          <span v-else>
            {{ row.has_supplier_trans }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="false"
        align="center"
        :label="t('积分')"
        prop="order_resource_ext1"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('报关状态')"
        prop="order_cb_sync"
        show-overflow-tooltip
      />

      <el-table-column
        v-if="ifReview"
        align="center"
        :label="t('订单审核')"
        prop="order_is_review"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({false:"info",true:"success"})[row.order_is_review]'>
            {{ ({false:t('未审核'),true:t('已审核')})[row.order_is_review] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="ifFinanceReview"
        align="center"
        :label="t('财务状态')"
        prop="order_finance_review"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({false:"info",true:"success"})[row.order_finance_review]'>
            {{ ({false:t('未审核'),true:t('已审核')})[row.order_finance_review] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-if="ifPickingReview"
        align="center"
        :label="t('出库状态')"
        prop="order_is_out"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"3020":"info","3021":"warning","3022":"success"})[row.order_is_out]'>
            {{ ({"3020":t('未出库'),"3021":t('部分出库'),"3022":t('已出库')})[row.order_is_out] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('发货状态')"
        prop="order_is_shipped"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"3030":"info","3032":"success","3031":"warning"})[row.order_is_shipped]'>
            {{ ({"3030":t('未发货'),"3032":t('已发货'),"3031":t('部分发货')})[row.order_is_shipped] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('付款状态')"
        prop="order_is_paid"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"3010":"info","3011":"","3012":"warning","3013":"success"})[row.order_is_paid]'>
            {{ ({"3010":t('未付款'),"3011":t('付款待审核'),"3012":t('部分付款'),"3013":t('已付款')})[row.order_is_paid] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('收货状态')"
        prop="order_is_received"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({false:"info",true:"success"})[row.order_is_received]'>
            {{ ({false:t('未收货'),true:t('已收货')})[row.order_is_received] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('买家留言')"
        prop="order_message"
        show-overflow-tooltip
        width="180"
      />

      <el-table-column
        align="center"
        :label="t('支付方式')"
        prop="payment_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1301":"","1302":"success","1303":"warning","1304":"info","1305":"danger","":null})[row.payment_type_id]'>
            {{ ({"1301":t('货到付款'),"1302":t('在线支付'),"1303":t('白条支付'),"1304":t('现金支付'),"1305":t('线下支付'),"":t('')})[row.payment_type_id] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('活动类型')"
        prop="activity_type_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <activity-type-name v-if="row.activity_type_id" :id='row.activity_type_id' />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-if="stateCode.ORDER_STATE_WAIT_PAY==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/edit'] }" size="default" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-if="stateCode.ORDER_STATE_WAIT_PAY==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/finance'] }" size="default" text @click="handlePaid(row)">{{ t('付款') }}</el-button>

          <el-button v-if="ifReview && stateCode.ORDER_STATE_WAIT_REVIEW==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/review'] }" size="default" text @click="handleReview(row.order_id)">{{ t('订单审核') }}</el-button>
          <el-button v-if="ifFinanceReview && stateCode.ORDER_STATE_WAIT_FINANCE_REVIEW==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/finance'] }" size="default" text @click="handleFinanceReview(row.order_id)">{{ t('财务审核') }}</el-button>

          <el-button v-if="ifPickingReview && stateCode.ORDER_STATE_PICKING==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/picking'] }" size="default" text @click="pickingOut(row.order_id)">{{ t('出库') }}</el-button>
          <el-button v-if="stateCode.ORDER_STATE_PICKING==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/shipping'] }" size="default" text @click="handleShipping(row)">{{ t('发货') }}</el-button>

          <el-button v-if="stateCode.ORDER_STATE_WAIT_SHIPPING==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/shipping'] }" size="default" text @click="handleShipping(row)">{{ t('发货') }}</el-button>

          <el-button v-if="stateCode.ORDER_STATE_SHIPPED==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/receive'] }" size="default" text @click="handleReceive(row.order_id)">{{ t('签收') }}</el-button>
          <el-button v-if="stateCode.ORDER_STATE_SHIPPED==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/shipping'] }" size="default" text @click="handleTraceInfo(row)">{{ t('配送') }}</el-button>

          <el-popover placement="left-end" trigger="hover" width="150">
            <template #reference>
              <el-button text>
                <ms-icon class="rightIcon" icon="more-fill"/>
              </el-button>
            </template>
            <div class="oper-btn">
              <el-button v-permissions="{ permission: ['/manage/trade/orderBase/list'] }" size="small"  text type="primary" @click.stop="handleEdit(row)">{{ t('订单详情') }}</el-button>
              <el-button v-permissions="{ permission: ['/manage/trade/orderBase/list'] }" size="small"  text type="primary" @click.stop="handleLogInfo(row)">{{ t('操作记录') }}</el-button>
              <el-button v-if="stateCode.ORDER_STATE_WAIT_PAY==row.order_state_id || stateCode.ORDER_STATE_WAIT_REVIEW==row.order_state_id || stateCode.ORDER_STATE_PICKING==row.order_state_id || stateCode.ORDER_STATE_WAIT_SHIPPING==row.order_state_id" v-permissions="{ permission: ['/manage/trade/orderBase/remove'] }" size="small"  text type="primary" @click.stop="handleCancel(row.order_id)">{{ t('取消订单') }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
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
    <add ref="addRef" @fetch-data="fetchData"/>
    <Return ref="ReturnRef"/>
    <item ref="itemRef" :order-row="orderRow" @fetch-data="fetchData"/>
    <ms-drawer ref="drawerRef" v-model:visible="showDetail">
      fdsafdaf
    </ms-drawer>

    <payment-edit ref="paymentEditRef" @fetch-data="fetchData" />
    <order-state-log-drawer ref="orderStateLogDrawerRef" @fetch-data="fetchData" />
    <express-edit ref="expressRef" :shipping="true" @fetch-data="fetchData" />
  </div>
</template>

<script>
import {transferToSupplier, getList, cancel, review, finance, picking, receive} from '@/api/trade/orderBase'
import {getList as getCodeList} from '@/api/trade/chainCode'
import {getList as getUserList} from '@/api/account/userInfo'
import {renderTime} from '@/utils/format'
import {translate as t} from "@/i18n";
import Item from './components/OnlineOrderItem'
import add from './components/OrderBaseEdit'
import PaymentEdit from './components/PaymentEdit'
import OrderStateLogDrawer from './components/OrderStateLogDrawer'
import ExpressEdit from './components/ExpressEdit'
import OrderState from '@/plugins/OrderState'
import ActivityTypeName from '@/plugins/ActivityTypeName'
import {Check, Delete, Plus, Search} from "@element-plus/icons-vue";
import {useSettingsStore} from "@/store/modules/settings";
import { stateCode } from '@/config'

export default defineComponent({
  name: 'OrderBase',
  components: {Item, add, OrderState, ActivityTypeName, PaymentEdit, OrderStateLogDrawer, ExpressEdit},
  emits: [],
  setup() {
    const settingsStore = useSettingsStore()
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')
    const state = reactive({
      configs: settingsStore.getConfigs,
      tableRef: null,
      itemRef: null,
      drawerRef: null,
      addRef: null,
      ReturnRef: null,
      paymentEditRef:null,
      expressRef:null,
      orderStateLogDrawerRef:null,
      list: [],
      userList: [],
      codeList: [],
      optionsStatus: [
        {
          value: 0,
          label: t('未评价'),
        },
        {
          value: 1,
          label: t('已评价'),
        },
      ],
      optionsKindId: [
        {
          value: 1201,
          label: t('实物订单'),
        },
        {
          value: 1202,
          label: t('服务订单'),
        },
        {
          value: 1203,
          label: t('电子卡券'),
        },
        {
          value: 1204,
          label: t('外卖订单'),
        },
        {
          value: 1205,
          label: t('课程订单'),
        },
      ],
      editRef: null,
      height: $tableHeight(),
      lineHeight: 'default',
      items: [],
      orderRow: {},
      showDetail: false,
      isFullscreen: false,
      listLoading: true,
      codeLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      order_time_range: ["", ""],
      queryForm: {
        page: 1,
        size: 10,
        search_text: "",
        search_type: "order_id",
        order_id: "",
        order_title: "",
        user_id: "",
        order_stime:"",
        order_etime:"",
        search_code: "",
      },
      filename: '订单列表',
      autoWidth: true,
      bookType: 'xlsx',
    })

    const formatTime = (row) => {
      return renderTime(row.order_time)
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

    const findRemoteCodeList = (chain_code) => {
      if (chain_code !== '') {
        state.codeLoading = true
        setTimeout(() => {
          state.codeLoading = false
          getCodeList({chain_code: chain_code}).then((res) => {
            state.codeList = res.data.items
          })
        }, 200)
      } else {
        state.codeList = []
      }
    }

    const handleAdd = (row) => {
      state.addRef.showEdit(row)
    }
    const handleReturnTable = (row) => {
      state.ReturnRef.showEdit(row)
    }

    const handleEdit = (row) => {
      //state.showDetail = true;
      state.itemRef.showEdit(row)
    }


    const handleCancel = async (order_id) => {
      ElMessageBox.prompt(t('取消订单原因'), {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
      })
        .then(async ({ value }) => {
          const {msg, status} = await cancel({
            order_id: order_id,
            order_cancel_reason: value
          })

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          fetchData()
        })
        .catch(() => {})
    }

    const handlePaid = (row) => {
      //state.itemRef.showEdit(row)
      const obj = {
        order_id: row.order_id,
        deposit_total_fee: row.trade_payment_amount,
      }

      state.paymentEditRef.showEdit(obj)
    }

    const handleReview = async (order_id) => {
      $confirm(t('你确定要审核订单吗?'), null, async () => {
        const {msg, status} = await review({order_id})
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      })
    }

    const handleFinanceReview = (order_id) => {
      $confirm(t('你确定要财务审核订单吗?'), null, async () => {
        const {msg, status} = await finance({order_id})
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      })
    }

    const pickingOut = async (row) => {
      const id = row
      const obj = {
        order_id: id,
        bill_type_id: 2700,
        warehouse_id: 0,
        stock_transport_type_id: 2751,
        picking_flag: true,
      }
      handlePicking(obj)
    }

    const handlePicking = (params) => {
      $confirm(t('你确定要出库吗?'), null, async () => {
        const {msg, status} = await picking(params)
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      })
    }

    const handleShipping = (row) => {
      //调出UI
      state.expressRef.showEdit(row)

      /*
      $confirm(t('你确定要发货吗?'), null, async () => {
        const {msg, status} = await shipping({order_id})
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      })
       */
    }

    const handleReceive = (order_id) => {
      $confirm(t('你确定要将订单更改为收货状态吗?'), null, async () => {
        const {msg, status} = await receive({order_id})
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await fetchData()
      })
    }

    const handleLogInfo = (row) => {
      state.orderStateLogDrawerRef.showEdit(row)
    }

    const handleTraceInfo = (row) => {
      state.itemRef.showEdit(row, 2)
    }

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
    const doSupplierTrans = async (order_id) => {
      state.$confirm(state.t('请确认是否转单？'), null, async () => {
        const {msg, status} = await transferToSupplier({
          order_id: order_id
        })

        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }

        fetchData()
      })
    }
    const reviewCancel = async () => {
      const order_id = state.selectRows.map((item) => item.order_id).join()
      handleCancel(order_id)
    }

    const reviewOrder = async () => {
      const order_id = state.selectRows.map((item) => item.order_id).join()
      handleReview(order_id)
    }
    const reviewFinance = async () => {
      const order_id = state.selectRows.map((item) => item.order_id).join()
      handleFinanceReview(order_id)
    }
    const reviewShipping = async () => {
      const order_id = state.selectRows.map((item) => item.order_id).join()
      const params  = {
        order_id: order_id
      }
      handleShipping(params)
    }
    const reviewPicking = async () => {
      const order_id = state.selectRows.map((item) => item.order_id).join()
      const obj = {
        order_id: order_id,
        bill_type_id: 2700,
        warehouse_id: 0,
        stock_transport_type_id: 2751,
        picking_flag: true,
      }
      handlePicking(obj)
    }

    const reviewReceive = async () => {
      const order_id = state.selectRows.map((item) => item.order_id)

      handleReview(JSON.stringify(order_id))
    }


    const fetchData = async () => {
      state.listLoading = true

      state.queryForm.order_id = ""
      state.queryForm.order_title = ""

      //虚拟码
      if (state.queryForm.search_code) {
        state.queryForm.search_text = state.queryForm.search_code
      }

      //搜索类型
      if (state.queryForm.search_text) {
        if (state.queryForm.search_type == 'order_id') {
          state.queryForm.order_id = state.queryForm.search_text
        } else if (state.queryForm.search_type == 'order_title') {
          state.queryForm.order_title = state.queryForm.search_text
        }
      }

      //
      if (state.order_time_range.length > 0) {
        if (state.order_time_range[0]) {
          state.queryForm.order_stime = state.order_time_range[0].getTime();
        }

        if (state.order_time_range[1]) {
          state.queryForm.order_etime = state.order_time_range[1].getTime();
        }
      } else {
        state.queryForm.order_stime = null
        state.queryForm.order_etime = null
      }

      const {data} = await getList(state.queryForm)
      state.list = data.items
      console.log(state.list)
      state.total = data.records
      state.listLoading = false
    }

    const exportCsv = () => {
      if (state.selectRows.length <= 0) {
        $message('没有选中的数据！', 'error')
        return
      }

      import('@/utils/excel').then((excel) => {
        const tHeader = ['订单编号', '订单标题', '客户名称', '应付金额', '下单时间', '配送方式', '订单状态', '退款状态', '发货状态', '付款状态', '收货状态', '买家留言', '支付方式', '活动类型']
        const filterVal = ['order_id', 'order_title', 'user_nickname', 'order_payment_amount', 'order_time', 'delivery_type_id', 'order_state_id', 'order_refund_status', 'order_is_shipped', 'order_is_paid', 'order_is_received', 'order_message', 'payment_type_id', 'activity_type_id']

        const tHeaderIndex = tHeader.indexOf('退款状态') + 1;
        const filterValIndex = filterVal.indexOf('order_refund_status') + 1;

        if (ifReview.value) {
          tHeader.splice(tHeaderIndex, 0, '订单审核');
          filterVal.splice(filterValIndex, 0, 'order_is_review');
        }

        if (ifFinanceReview.value) {
          tHeader.splice(tHeaderIndex, 0, '财务状态');
          filterVal.splice(filterValIndex, 0, 'order_finance_review');
        }

        if (ifPickingReview.value) {
          tHeader.splice(tHeaderIndex, 0, '出库状态');
          filterVal.splice(filterValIndex, 0, 'order_is_out');
        }

        const list = state.selectRows
        const data = formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: state.filename,
          autoWidth: state.autoWidth,
          bookType: state.bookType,
        })
      })
    }

    const clickFullScreen = () => {
      state.isFullscreen = !state.isFullscreen
      handleHeight()
    }

    const handleHeight = () => {
      if (state.isFullscreen) state.height = $tableHeight() + 155
      else state.height = $tableHeight()
    }

    const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) =>
          filterVal.map((j) => {
            if (v[j] == null) return null;

            if (j == 'order_payment_amount') {
              return v['currency_symbol_left'] + v[j]
            } else if (j == 'order_time') {
              return renderTime(v[j])
            } else if (j == 'delivery_type_id') {
              if (v[j] === 5) {
                return t('自提')
              } else if (v[j] === 10) {
                return t('配送')
              } else {
                return t('配送')
              }
            } else if (j == 'order_refund_status') {
              if (v[j] === 0) {
                return t('无退款')
              } else if (v[j] === 1) {
                return t('部分退款')
              } else if (v[j] === 2) {
                return t('全部退款')
              }
            } else if (j == 'order_is_review' || j == 'order_finance_review') {
              if (v[j]) {
                return t('已审核')
              } else {
                return t('未审核')
              }
            } else if (j == 'order_is_out') {
              if (v[j] === 3020) {
                return t('未出库')
              } else if (v[j] === 3021) {
                return t('部分出库')
              } else if (v[j] === 3022) {
                return t('已出库')
              }
            } else if (j == 'order_is_shipped') {
              if (v[j] === 3030) {
                return t('未发货')
              } else if (v[j] === 3032) {
                return t('已发货')
              } else if (v[j] === 3031) {
                return t('部分发货')
              }
            } else if (j == 'order_is_paid') {
              if (v[j] === 3010) {
                return t('未付款')
              } else if (v[j] === 3011) {
                return t('付款待审核')
              } else if (v[j] === 3012) {
                return t('部分付款')
              } else if (v[j] === 3013) {
                return t('已付款')
              }
            } else if (j == 'order_is_received') {
              if (v[j]) {
                return t('已收货')
              } else {
                return t('未收货')
              }
            } else if (j == 'payment_type_id') {
              if (v[j] === 1301) {
                return t('货到付款')
              } else if (v[j] === 1302) {
                return t('在线支付')
              } else if (v[j] === 1303) {
                return t('白条支付')
              } else if (v[j] === 1304) {
                return t('现金支付')
              } else if (v[j] === 1305) {
                return t('线下支付')
              }
            } else if (j == 'order_state_id') {
              if (v[j] === 2010) {
                return t('待支付')
              } else if (v[j] === 2011) {
                return t('待订单审核')
              } else if (v[j] === 2013) {
                return t('待财务审核')
              } else if (v[j] === 2020) {
                return t('待配货/待出库审核')
              } else if (v[j] === 2030) {
                return t('待发货')
              } else if (v[j] === 2040) {
                return t('已发货/待收货确认')
              } else if (v[j] === 2060) {
                return t('已完成/已签收')
              } else if (v[j] === 2070) {
                return t('已取消/已作废')
              }
            } else if (j == 'activity_type_id') {
              if (v[j] == 1123) {
                return t('拼团')
              } else if (v[j] == 1103) {
                return t('限时折扣')
              } else if (v[j] == 1105) {
                return t('优惠券')
              } else if (v[j] == 1132) {
                return t('组合套餐')
              } else if (v[j] == 1124) {
                return t('砍价')
              } else if (v[j] == 1135) {
                return t('阶梯价')
              } else if (v[j] == 1133) {
                return t('多件折')
              }
            }

            return v[j]
          })
        )
      }

    // 是否需要审核
    const ifReview = computed(() => {
      for (const k in state.configs.order_state_list) {
        const item = state.configs.order_state_list[k]

        if (item.value == stateCode.ORDER_STATE_WAIT_REVIEW) {
          return true
        }
      }

      return false
    })

    // 是否需要审核
    const ifFinanceReview = computed(() => {
      for (const k in state.configs.order_state_list) {
        const item = state.configs.order_state_list[k]

        if (item.value == stateCode.ORDER_STATE_WAIT_FINANCE_REVIEW) {
          return true
        }
      }

      return false
    })

    // 是否需要审核
    const ifPickingReview = computed(() => {
      for (const k in state.configs.order_state_list) {
        const item = state.configs.order_state_list[k]

        if (item.value == stateCode.ORDER_STATE_PICKING) {
          return true
        }
      }

      return false
    })

    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      formatTime,
      findRemoteUserList,
      findRemoteCodeList,
      handleAdd,
      handleReturnTable,
      handleEdit,
      handlePaid,
      handleReview,
      handleFinanceReview,
      handlePicking,
      pickingOut,
      handleShipping,
      handleReceive,
      handleLogInfo,
      handleTraceInfo,
      handleCancel,

      setSelectRows,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      doSupplierTrans,

      reviewCancel,
      reviewOrder,
      reviewFinance,
      reviewPicking,
      reviewShipping,
      reviewReceive,

      fetchData,
      exportCsv,
      handleHeight,
      clickFullScreen,

      ifReview,
      ifFinanceReview,
      ifPickingReview,
      formatJson,
      Delete,
      Plus,
      Search,
      Check,
      stateCode,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.order-base';

#{$base}-container {
  .ml10 {
    margin-left: 10px;
  }

  //.ms-search-box .el-form-item {
  //  width: 14.28%;
  //}

  //.ms-search-box .el-select, .ms-search-box .el-input, .ms-search-box .block, .ms-search-box .el-date-editor.el-input, .ms-search-box .el-date-editor.el-input__wrapper {
  //  width: 96%;
  //}

  :deep(.el-form) {
    .el-range-editor.el-input__wrapper{
      width: 240px;
    }

    .ms-date-range-picker{
      //margin-left: 10px;
    }

    .el-date-editor .el-range-input{
      width: 80px!important;
    }
  }

  :deep(.el-table) {
    .el-button.is-text {
      width: 36px;
    }
  }
}

.el-popper {
  width: 100px;

  .oper-btn{
    display: inline-grid;
    width: 100%;

    .el-button{
      margin: 5px auto;
    }
  }
}

</style>

