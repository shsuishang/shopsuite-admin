<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="60%"
    :title="title"
    top="1%"
    :with-header="true"
    @close="close"
  >
    <div class="order-detail-container">
      <el-tabs
        v-model="activeName"
        v-loading="loading"
        @tab-click="handleClick"
      >
        <el-tab-pane :label="t('订单详情')" name="1">
          <div>
            <div class="order-summary" style="margin-top: 10px">
              <span>{{ t('订单号') }}：{{ detail.order_id }}</span>
              <span>{{ t('客户名称') }}：{{ detail.user_nickname }}</span>
              <span v-if="detail.order_message">{{ t('留言') }}：{{ detail.order_message }}</span>
              <span v-if="false">{{ t('送货时间') }}：{{ detail.delivery_time_name }}</span>
            </div>
          </div>
          <el-table
            ref="itemTable"
            border
            :data="itemData"
            show-summary
            style="width: 100%; margin-top: 20px"
            :summary-method="getSummaries"
          >
            <el-table-column align="center" type="index" width="30"/>
            <el-table-column
              align="center"
              :label="t('图片')"
              prop="order_item_image"
              width="70"
            >
              <template #default="scope">
                <el-image
                  fit="fit"
                  :src="scope.row.order_item_image"
                  style="width: 35px; height: 35px"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="t('商品名称')"
              prop="product_name"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              :label="t('商品规格')"
              prop="item_name"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="false"
              align="center"
              :label="t('单位')"
              prop="detail_unit_name"
            />
            <el-table-column
              align="center"
              :label="t('积分')"
              prop="item_unit_points"
              width="60"
            />
            <el-table-column
              align="center"
              :label="t('单价')"
              prop="item_unit_price"
            />
            <el-table-column
              align="center"
              :label="t('成交单价')"
              prop="order_item_sale_price"
            />
            <el-table-column
              align="center"
              :label="t('数量')"
              prop="order_item_quantity"
              width="60"
            />
            <el-table-column
              align="center"
              :label="t('金额小计')"
              prop="order_item_amount"
            />
            <el-table-column
              align="center"
              :formatter="formatActivityType"
              :label="t('活动类型')"
              prop="activity_type_id"
            />
            <el-table-column
              v-if="false"
              align="center"
              :formatter="formatSync"
              :label="t('是否转单')"
              prop="order_item_supplier_sync"
            />
          </el-table>
          <div style="margin-top: 10px;">
            <el-row class="addtion-info">
              <el-col class="price-info" :span="3"><span>{{ t('活动优惠') }} ：</span></el-col>
              <el-col :span="1">
                {{ t('￥') }}{{ detail.order_discount_amount }}
              </el-col>
              <el-col class="price-info" :span="3" style="text-align: right">
                <span>{{ $t('优惠券抵扣') }}：</span>
              </el-col>
              <el-col :span="1">{{ t('￥') }}{{ detail.voucher_price }}</el-col>
              <el-col class="price-info" :span="3" style="text-align: right">
                <span>{{ $t('积分抵扣') }} ：</span>
              </el-col>
              <el-col :span="1">{{ t('￥') }}{{ detail.order_points_fee }}</el-col>
              <el-col class="price-info" :span="3">
              <span>
                <el-button
                  v-if="false && order_state_id === 2010"
                  circle
                  :icon="Edit"
                  size="small"
                  type="text"
                  @click="showShippingFeeEdit()"
                />
                <span>{{ $t('运费') }} ：</span>
              </span>
              </el-col>
              <el-col :span="1">{{ t('￥') }}{{ detail.order_shipping_fee }}</el-col>

              <el-col class="price-info" :offset="3" :span="3" style="">
                <span>{{ $t('应付金额') }} ：</span>
              </el-col>
              <el-col :span="2" style="color: red;">{{ t('￥') }}{{
                  mf(detail.order_payment_amount)
                }}
              </el-col>
            </el-row>
          </div>
          <div>
            <div style="font-weight: 400; font-size: 18px; padding-top: 30px">{{ $t('收货信息') }}</div>
            <el-divider/>
            <div v-if="detail.delivery">
              <span style="margin-right: 20px;"><span>{{ $t('收货人') }} ：</span>{{ detail.delivery.da_name }}</span>
              &nbsp;&nbsp;
              <span style="margin-right: 20px;">{{ $t('联系方式') }} ：
              <span>+{{ detail.currency_id }}{{ detail.delivery.da_mobile }}</span></span>
              &nbsp;&nbsp;
              <span style="margin-right: 20px;">{{ $t('收货地址') }} ：
              <span>{{ deliveryInfo() }}</span></span>
            </div>
            <div v-if="viewLogisticsFlag">
              <div v-for="item in logistics" :key="item" style="margin-top: 10px">
                <el-button
size="small" type="danger"
                            @click="viewLogistics(item.order_tracking_number, item.express_name)">
                  {{ $t('查看物流') }}
                </el-button>
              </div>
            </div>
          </div>
          <div v-if="detail.chain_id">
            <div style="font-weight: 400; font-size: 18px; padding-top: 30px">{{ $t('自提信息') }}</div>
            <el-divider/>
            <div>
              <span style="margin-right: 20px;"><span>{{ $t('自提门店') }} ：</span>{{ detail.chain_name }}</span>
              &nbsp;&nbsp;
              <span style="margin-right: 20px;">{{ $t('自提日期') }} ：<span>{{ renderDate(detail.virtual_service_date) }}</span></span>
            </div>
          </div>
          <div>
            <div style="font-weight: 400; font-size: 18px; padding-top: 30px">{{ $t('操作日志') }}</div>
            <el-divider/>
            <order-state-log ref="orderStateLogRef" v-model="detail.order_id" @fetch-data="fetchData"/>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('出库发货记录')" name="2">
          <div>
            <div>
              <div class="order-summary" style="margin-top: 10px">
                <span>{{ t('订单号') }}：{{ detail.order_id }}</span>
                <span v-if="false">{{ t('客户名称') }}：{{ detail.user_nickname }}</span>
                <span v-if="detail.order_message">{{ t('留言') }}：{{ detail.order_message }}</span>
                <span v-if="false">{{ t('送货时间') }}：{{ detail.delivery_time_name }}</span>
                <span>{{ t('收货信息') }}：{{ deliveryInfo() }}</span>
              </div>
            </div>
          </div>
          <div v-if="stockData.length > 0">
            <div style="font-weight: 400; font-size: 18px; padding-top: 30px">
              {{ t('待出库商品清单') }}
            </div>
            <el-divider/>
            <ms-search-box
              v-if="detail.order_state_id===stateCode.ORDER_STATE_PICKING || detail.order_state_id===stateCode.ORDER_STATE_WAIT_SHIPPING">
              <ms-search-box-right-panel :span="24">
                <el-button
                  :disabled="isdisabled"
                  :icon="Check"
                  size="small"
                  type="primary"
                  @click="doPicking()"
                >
                  {{ t('出库') }}
                </el-button>
              </ms-search-box-right-panel>
            </ms-search-box>
            <el-table border :data="stockData">
              <el-table-column align="center" type="index" width="50"/>
              <el-table-column align="center" :label="t('图片')" :prop="order_item_image" width="70">
                <template #default="{ row }">
                  <el-image
                    fit="fit"
                    :src="row.order_item_image"
                    style="width: 35px; height: 35px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="t('商品名称')"
                prop="product_item_name"
                show-overflow-tooltip
              />
              <el-table-column v-if="false" align="center" :label="t('单位')" prop="unit_name" width="100"/>
              <el-table-column
                align="center"
                :label="t('库存数量')"
                prop="warehouse_item_quantity"
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('订购数')"
                prop="order_item_quantity"
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('已出库数')"
                prop="out_of_warehouse_num"
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('出库数')"
                prop="need_warehouse_num"
                width="100"
              >
                <template #default="{ row }">
                  <el-input-number
                    :key="tablekey"
                    v-model="row.bill_item_quantity"
                    controls-position="right"
                    :max="row.need_warehouse_num"
                    :min="0"
                    style="width: 80px"
                    @change="() => (tablekey = !tablekey)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <el-scrollbar style="height: 100%">
              <div v-for="(stock, i) in stock_bill" :key="i">
                <div style="font-weight: 400; font-size: 18px; padding-top: 30px">
                  {{ t("出库记录") }}
                </div>
                <el-divider/>
                <ms-search-box>
                  <ms-search-box-left-panel :span="14">
                    <div v-if="!stock.is_cancelled" style="width: 100%;">
                      <span>{{ t('出库编号') }} : {{ stock.stock_bill_id }}</span>
                      <span style="margin-left: 10px">{{ t('出库时间') }} : {{ renderTime(stock.stock_bill_time) }}</span>
                    </div>
                    <div v-else>
                      <span>{{ t('状态') }} : {{ t('已作废') }}</span>
                    </div>
                  </ms-search-box-left-panel>
                  <ms-search-box-right-panel :span="10">
                    <el-button
                      v-if="!(stock.order_logistics_id && stock.logistics_enable)"
                      size="small"
                      type="primary"
                      @click="showExpressEdit(stock)"
                    >
                      {{ t('快递发货') }}
                    </el-button>
                    <el-button
                      v-if="false && !(stock.order_logistics_id && stock.logistics_enable)"
                      size="small"
                      type="primary"
                      @click="doPicking()"
                    >
                      {{ t('骑手派送') }}
                    </el-button>
                    <el-button
                      v-if="(stock.order_logistics_id && stock.logistics_enable)"
                      size="small"
                      type="primary"
                      @click="showExpressEdit(stock)"
                    >
                      {{ t('修改物流') }}
                    </el-button>
                    <el-button
v-if="stock.order_logistics_id && stock.logistics_enable" size="small"
                               type="info" @click="viewLogistics(stock.order_tracking_number, stock.express_name)">
                      {{ $t('物流追踪') }}
                    </el-button>
                    <el-button
                      :icon="Check"
                      size="small"
                      type="primary" @click="exportCsv(stock.items)">
                      {{ t('导出打印') }}
                    </el-button>
                  </ms-search-box-right-panel>
                </ms-search-box>
                <el-table border :data="stock.items">
                  <el-table-column align="center" type="index" width="50"/>
                  <el-table-column
                    align="center"
                    :label="t('图片')"
                    prop="order_item_image"
                    width="70"
                  >
                    <template #default="{row}">
                      <el-image
                        fit="fit"
                        :src="row.order_item_image"
                        style="width: 35px; height: 35px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :label="t('商品名称')"
                    prop="product_item_name"
                    show-overflow-tooltip
                  />
                  <el-table-column v-if="false" :label="t('单位')" prop="unit_name" width="100"/>
                  <el-table-column
                    align="center"
                    :label="t('出库价格')"
                    prop="bill_item_unit_price"
                    width="100"
                  />
                  <el-table-column
                    align="center"
                    :label="t('出库数量')"
                    prop="bill_item_quantity"
                    width="100"
                  />
                  <el-table-column
                    align="center"
                    :label="t('小计')"
                    prop="bill_item_subtotal"
                    width="100"
                  />
                </el-table>

                <el-row v-if="(stock.order_logistics_id && stock.logistics_enable)" style="margin-top: 20px">
                  <el-col v-if="stock.logistics_time" :span="6">
                    {{ t('发货日期') }}：{{ renderDate(stock.logistics_time) }}
                  </el-col>
                  <el-col v-if="stock.logistics_name" :span="6">
                    {{ t('物流公司') }}：{{ stock.logistics_name }}
                  </el-col>
                  <el-col v-if="stock.order_tracking_number" :span="6">
                    {{ t('物流单号') }}：{{ stock.order_tracking_number }}
                  </el-col>
                  <el-col v-if="stock.logistics_explain" :span="6">
                    {{ t('物流备注') }}：{{ stock.logistics_explain }}
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('收款记录')" name="3">
          <div>
            <div class="order-summary" style="margin-top: 10px">
              <span>{{ t('订单号') }}：{{ detail.order_id }}</span>
              <span>{{ t('订单金额') }}：{{ tradeData.currency_symbol_left + tradeData.order_payment_amount }}</span>
              <span>{{ t('已付款') }}：{{ tradeData.currency_symbol_left + payment() }}</span>
              <span v-if="tradeData.trade_payment_points">{{ t('支付积分') }}：{{ tradeData.trade_payment_points }}</span>
              <span v-if="false">{{ t('待确认') }}：{{
                  tradeData.currency_symbol_left + tradeData.payment_waiting_review
                }}</span>
              <span>{{ t('待支付') }}：{{ tradeData.currency_symbol_left + tradeData.trade_payment_amount }}</span>
            </div>

            <div style="float: right">
              <el-button
v-if="detail.order_is_paid != stateCode.ORDER_PAID_STATE_YES" :icon="Plus" size="small"
                         @click="paymentEdit">
                {{ t('添加付款记录') }}
              </el-button>
            </div>
          </div>
          <div>
            <div style="font-weight: 400; font-size: 18px; padding-top: 30px">
              {{ t('付款记录') }}
            </div>
            <el-divider/>
            <el-table border :data="consumeRecords" style="width: 100%">
              <el-table-column align="center" :label="t('支付流水号')" prop="consume_record_id"/>
              <el-table-column
align="center" :formatter="formatDateTime" :label="t('时间')" prop="record_time"
                               width="160"/>
              <el-table-column align="center" :label="t('付款金额')" prop="record_money"/>
              <el-table-column
                align="center"
                :label="t('支付方式')"
                prop="payment_met_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <payment-met :id="row.payment_met_id"/>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="t('收款账户')" prop="payment_channel_id">
                <template #default="{ row }">
                  <payment-channel :id="row.payment_channel_id"/>
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
                    {{ ({"1": t('已收款'), "0": t('作废')})[row.record_enable ? 1 : 0] }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div style="position: absolute; right: 10px; top: 7px">
        <order-state :id="detail.order_state_id" style="margin-right: 10px;"/>
        <el-button
          v-if="ifFinanceReview && stateCode.ORDER_STATE_WAIT_FINANCE_REVIEW==order_state_id"
          size="small"
          type="primary"
          @click="handleFinanceReview"
        >
          {{ t('财务审核') }}
        </el-button>
        <el-button
          v-else-if="order_state_id === 2020 && activeName !== '2'"
          size="small"
          type="primary"
          @click="changeTab(2)"
        >
          {{ t('出库') }}
        </el-button>
        <el-button
          v-else-if="order_state_id === 2030 && activeName !== '2'"
          size="small"
          type="primary"
          @click="changeTab(2)"
        >
          {{ t('发货') }}
        </el-button>
        <el-button
          v-else-if="ifReview && stateCode.ORDER_STATE_WAIT_REVIEW==order_state_id"
          size="small"
          type="primary"
          @click="handleReview"
        >
          {{ t('审核') }}
        </el-button>
        <el-button
          v-else-if="order_state_id === 2010 && activeName !== '3'"
          size="small"
          type="primary"
          @click="changeTab(3)"
        >
          {{ t('添加收款记录') }}
        </el-button>
      </div>
    </div>
    <payment-edit ref="paymentEditRef" @fetch-data="orderRecord"/>
    <shipping-fee-edit ref="shippingFeeRef" @fetch-data="getOrderDetail"/>
    <express-edit ref="expressRef" @fetch-data="getOrderDetail"/>
    <ReturnLog ref="returnLogRef" @fetch-data="getOrderDetail"/>
    <Returnlog ref="returnlog"/>
  </el-drawer>
</template>

<script>
import {translate as t} from "@/i18n";
import {formatDateTime, renderTime, mf, renderDate} from '@/utils/format'
import {finance, getDetail, picking, review} from '@/api/trade/orderBase'
import PaymentEdit from './PaymentEdit'
import OrderStateLog from './OrderStateLog'
import ExpressEdit from './ExpressEdit'
import ShippingFeeEdit from './ShippingFeeEdit'
import {Check, Delete, Plus, Search, Edit} from "@element-plus/icons-vue";
import OrderState from '@/plugins/OrderState'
import PaymentMet from '@/plugins/PaymentMet'
import PaymentChannel from '@/plugins/PaymentChannel'
import * as math from "mathjs"
import {stateCode} from '@/config'
import {useSettingsStore} from "@/store/modules/settings";
import ReturnLog from "@/views/trade/orderReturn/components/OrderReturnTracking";

export default defineComponent({
  name: 'OnlineOrderItem',
  components: {
    OrderState, PaymentMet, PaymentChannel, PaymentEdit, OrderStateLog, ExpressEdit, ShippingFeeEdit,ReturnLog
  },
  props: {},
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const settingsStore = useSettingsStore()
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      tableConfig: {
        height: window.innerHeight - 220 - 90,
      },
      configs: settingsStore.getConfigs,
      paymentEditRef: null,
      orderStateLogRef: null,
      expressRef: null,
      shippingFeeRef: null,
      order_state_id: undefined,
      isdisabled: false,
      loading: false,
      viewLogisticsFlag: false,
      returnLogRef: null,
      logistics: [],
      activeName: '1',
      state_log_items: [],
      warehouse_items: [],
      itemData: [],
      detail: {},
      modelLists: [],
      data: {}, // 订单详情数据
      stockData: [], // 发货出库数据
      tablekey: false,
      stock_bill: [], // 出库记录
      tradeData: {}, //  交易数据
      consumeRecords: [], //收款数据
      dialogFormVisible: false,
      title: '',
      stateOption: [
        {
          value: 2011,
          label: t('待订单审核'),
        },
        {
          value: 2013,
          label: t('待财务审核'),
        },
        {
          value: 2020,
          label: t('待配货/待出库审核'),
        },
        {
          value: 2030,
          label: t('待发货'),
        },
        {
          value: 2040,
          label: t('已发货/待收货确认'),
        },
        {
          value: 2060,
          label: t('已完成/已签收'),
        },
        {
          value: 2070,
          label: t('已取消/已作废'),
        },
      ],
      activityTypes: [
        {value: 1101, label: t('加价购')},
        {value: 1102, label: t('店铺满赠')},
        {value: 1103, label: t('限时折扣')},
        {value: 1104, label: t('优惠套装')},
        {value: 1105, label: t('店铺优惠券')},
        {value: 1106, label: t('砸金蛋')},
        {value: 1107, label: t('满减')},
        {value: 1109, label: t('积分换购')},
        {value: 1131, label: t('市场活动')},
        {value: 1121, label: t('幸运大抽奖')},
        {value: 1122, label: t('秒杀')},
        {value: 1123, label: t('拼团')},
        {value: 1124, label: t('砍价')},
        {value: 1125, label: t('一元购')},
        {value: 1126, label: t('团购')},
        {value: 1127, label: t('批发团购')},
        {value: 1132, label: t('组合套餐')},
        {value: 1133, label: t('多件折')},
        {value: 1135, label: t('阶梯价')},
        {value: 5001, label: t('今日爆款')},
        {value: 5002, label: t('每日好店')},
        {value: 5003, label: t('限时秒杀')},
        {value: 5004, label: t('天天秒淘')},
        {value: 5005, label: t('零元购')},
        {value: 5006, label: t('高额返区')},
      ],
      paymentMets: [
        {
          value: 1,
          label: t('余额支付'),
        },
        {
          value: 2,
          label: t('充值卡支付'),
        },
        {
          value: 3,
          label: t('积分支付'),
        },
        {
          value: 4,
          label: t('信用支付'),
        },
        {
          value: 5,
          label: t('红包支付'),
        },
        {
          value: 6,
          label: t('线下支付'),
        },
        {
          value: 7,
          label: t('众宝支付'),
        },
      ],
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
        product_name: '',
        product_id: '',
        product_number: "",
      },
      filename: '出库记录',
      autoWidth: true,
      bookType: 'xlsx',
    })

    const exportCsv = (items) => {
      import('@/utils/excel').then((excel) => {
        const tHeader = ['图片', '商品名称', '出库价格', '出库数量', '小计']
        const filterVal = ['order_item_image','product_item_name', 'bill_item_unit_price', 'bill_item_quantity', 'bill_item_subtotal']

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

          if (j == 'bill_item_unit_price' || j == 'bill_item_quantity' || j == 'bill_item_subtotal') {
              if (!v[j]) {
                return 0
              }
            } else {
              if (!v[j]) return null;
            }

          return v[j]
        })
      )
    }

    const showShippingFeeEdit = () => {
      const orderShippingFee = state.detail.order_shipping_fee
      const order_id = state.detail.order_id
      state.shippingFeeRef.showEdit(order_id, orderShippingFee)
    }
    const viewLogistics = (order_tracking_number, express_name) => {
      const params = {}
      params.return_tracking_number = order_tracking_number
      params.return_tracking_name = express_name
      state.returnLogRef.showEdit(params)
    }
    const isRetrieval = (stock) => {
      console.info(stock)
      return true
    }
    const getTitleName = (data) => {
      if (data.logistics.logistics_enable === 1) {
        return '发货记录'
      } else if (
        data.logistics.order_logistics_id &&
        data.logistics.logistics_enable === 0
      ) {
        return t('已作废记录')
      } else {
        return t('出库记录')
      }
    }
    const paymentEdit = () => {
      const obj = {
        order_id: state.tradeData.order_id,
        deposit_total_fee: state.tradeData.trade_payment_amount,
      }
      state.paymentEditRef.showEdit(obj)
    }
    const updateState = async () => {
      state.activeName = '3'
      await orderRecord()
    }
    const formatTime = (row) => {
      return renderTime(row.order_state_time)
    }
    const formatSync = (row) => {
      return row.order_item_supplier_sync === 0
        ? t('否')
        : t('是')
    }
    const formatActivityType = (row) => {
      const activity_type_id = row.activity_type_id
      const obj = state.activityTypes.find(
        (item) => item.value === activity_type_id
      )
      return obj ? obj.label : '无'
    }
    const formatPaymentMet = (row) => {
      const payment_met_id = row.payment_met_id
      const obj = state.paymentMets.find(
        (item) => item.value === payment_met_id
      )
      return obj ? obj.label : ''
    }
    const Decimal = require('decimal.js');

    // 统计
    const getSummaries = (param) => {
      const {columns, data} = param
      const sums = []
      if (!data) return sums

      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        if (index === 6 || index === 7) {
          const values = data.map((item) => new Decimal(item[column.property]));

          if (!values.some((value) => value.isNaN())) {
            const sum = values.reduce((prev, curr) => {
              const currOne = new Decimal(curr);
              if (!currOne.isNaN()) {
                const prevOne = new Decimal(prev);
                return prevOne.add(currOne);
              } else {
                return prev;
              }
            }, new Decimal(0));

            sums[index] = sum.toNumber(); // 将 Decimal 对象转换为数值类型
          }
        }
      });

      return sums;
    }
    const showEdit = async (row, activeName) => {
      if (typeof activeName != "undefined") {
        changeTab(activeName)
      }

      state.dialogFormVisible = true
      clearData()
      state.data = row
      await getOrderDetail()
    }
    const close = async () => {
      state.modelLists = [];
      state.order_state_id = undefined
      state.dialogFormVisible = false
      state.activeName = '1'
    }
    const showExpressEdit = async (row) => {
      if (row && row.order_logistics_id) {
        state.expressRef.showEdit(row)
      } else {
        const obj = {
          order_id: row.order_id,
          stock_bill_id: row.stock_bill_id,
        }
        state.expressRef.showEdit(obj)
      }
    }
    // tab 切换事件
    const handleClick = async (tab) => {
      const index = tab.index
      switch (index) {
        case '0':
          //await getOrderDetail()
          break
        case '1':
          //await getOrderStock()
          break
        case '2':
          //await orderRecord()
          break
      }
    }
    // 订单详情
    const getOrderDetail = async () => {
      state.loading = true
      const order_id = state.data.order_id

      if (order_id) {
        const {data} = await getDetail({order_id: order_id})

        if (data) {
          state.detail = data
          state.itemData = data.items
          state.order_state_id = data.order_state_id
          state.state_log_items = data.log_items
          state.warehouse_items = data.warehouse_items

          if (data.shopOrderUserForm) {
            state.modelLists = JSON.parse(data.shopOrderUserForm.form_data);
          }

          if (data.logistics) {
            state.viewLogisticsFlag = true
            state.logistics = data.logistics
          }

          //支付记录
          if (data.consume_record) {
            state.consumeRecords = data.consume_record
          }

          if (data.consume_trade) {
            state.tradeData = data.consume_trade
          }

          //出库记录
          if (data.stock_bill) {
            state.stock_bill = data.stock_bill

            //处理出库单物流信息
            for (const key in state.stock_bill) {
              for (const logisticsKey in state.logistics) {
                if (state.logistics[logisticsKey].stock_bill_id == state.stock_bill[key].stock_bill_id) {
                  state.stock_bill[key]['order_logistics_id'] = state.logistics[logisticsKey].order_logistics_id
                  state.stock_bill[key]['logistics_id'] = state.logistics[logisticsKey].logistics_id
                  state.stock_bill[key]['logistics_name'] = state.logistics[logisticsKey].logistics_name
                  state.stock_bill[key]['logistics_explain'] = state.logistics[logisticsKey].logistics_explain
                  state.stock_bill[key]['order_tracking_number'] = state.logistics[logisticsKey].order_tracking_number
                  state.stock_bill[key]['logistics_time'] = state.logistics[logisticsKey].logistics_time
                  state.stock_bill[key]['logistics_enable'] = state.logistics[logisticsKey].logistics_enable
                  state.stock_bill[key]['ss_id'] = state.logistics[logisticsKey].ss_id
                  state.stock_bill[key]['express_name'] = state.logistics[logisticsKey].express_name

                  break
                }
              }

              //处理出库单商品图片

              for (const k in state.itemData) {
                if (state.stock_bill[key].items) {
                  for (const t in state.stock_bill[key].items) {
                    if (state.itemData[k].order_item_id == state.stock_bill[key].items[t].order_item_id) {
                      state.stock_bill[key].items[t]['order_item_image'] = state.itemData[k].order_item_image

                      break
                    }
                  }
                }
              }
            }
          }

          initBillItemQuantity(data.items, data.stock_bill)
        }
      }
      state.loading = false
    }
    // 出库发货
    const getOrderStock = async () => {
    }

    //计算有出库的item列表
    const initBillItemQuantity = (order_items, stock_bills) => {
      const stockItemOutObj = {}

      if (stock_bills) {
        stock_bills.forEach((stock_bill) => {
          if (stock_bill.items) {
            stock_bill.items.forEach((item) => {
              if (typeof stockItemOutObj[item.item_id] == "undefined") {
                stockItemOutObj[item.item_id] = 0
              }

              stockItemOutObj[item.item_id] = math.add(stockItemOutObj[item.item_id], item.bill_item_quantity)
            })
          }
        })
      }

      if (order_items.length > 0) {
        state.stockData = []

        order_items.forEach((item) => {
          if (typeof stockItemOutObj[item.item_id] == "undefined") {
            stockItemOutObj[item.item_id] = 0
          }

          for (const key in state.warehouse_items) {
            if (state.warehouse_items[key]['item_id'] == item.item_id) {
              //库存数量
              item['warehouse_item_quantity'] = state.warehouse_items[key]['warehouse_item_quantity']
              break
            }
          }


          //待出库数量
          const need_warehouse_num = math.subtract(item.order_item_quantity, stockItemOutObj[item.item_id])

          if (need_warehouse_num > 0) {
            //已出库数量
            item['out_of_warehouse_num'] = stockItemOutObj[item.item_id]

            item['bill_item_quantity'] = need_warehouse_num
            item['need_warehouse_num'] = need_warehouse_num

            state.stockData.push(item)
          }
        })
      }
    }
    // 收款记录
    const orderRecord = async () => {
      state.loading = true
      state.loading = false
      getOrderDetail()
    }
    const clearData = () => {
      state.itemData = []
      state.detail = {}
      state.data = {} // 订单详情数据
      state.stockData = [] // 待出库数据
      state.tradeData = {} // 交易数据
      state.state_log_items = []
      state.consumeRecords = []// 收款数据
      state.stock_bill = []
    }
    const doPicking = async () => {
      state.isdisabled = true
      const {msg, status} = await picking(getPickingParams())
      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }
      state.isdisabled = false
      await getOrderDetail()

      emit('fetch-data')
    }
    const getPickingParams = () => {
      const items = []
      state.stockData.forEach((stock) => {
        const item = {
          item_id: stock.item_id,
          order_item_id: stock.order_item_id,
          bill_item_quantity: stock.bill_item_quantity,
          bill_item_price: stock.order_item_sale_price,

          product_id: stock.product_id,
        }

        items.push(item)
      })
      const obj = {
        order_id: state.detail.order_id,

        bill_type_id: 2700,
        warehouse_id: 0,
        stock_transport_type_id: 2751,

        picking_flag: false,
        items: JSON.stringify(items),
      }

      return obj
    }

    const handleFinanceReview = async () => {
      $confirm(t('你确定要财务审核订单吗?'), null, async () => {
        const {msg, status} = await finance({order_id: state.data.order_id})
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }

        await updateTabData()
        emit('fetch-data')
      })
    }
    const handleReview = async () => {
      $confirm(t('你确定要审核订单吗?'), null, async () => {
        const {msg, status} = await review({order_id: state.data.order_id})
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        await updateTabData()
        emit('fetch-data')
      })
    }
    const changeTab = (activeName) => {
      state.activeName = String(activeName)
      handleClick({
        index: String(activeName - 1),
      })
    }
    const updateTabData = async () => {
      await getOrderDetail()
      return
      /*
      const activeName = state.activeName
      switch (activeName) {
        case '1':
          await getOrderDetail()
          break
        case '2':
          await getOrderStock()
          break
        case '3':
          await orderRecord()
          break
      }
       */
    }

    const orderState = () => {
      const obj = state.stateOption.find(
        (item) => item.value === state.data.order_state_id
      )
      return obj ? obj.label : ''
    }

    const shippingAddress = () => {
      const delivery = state.detail.delivery
      if (!delivery) return ''

      const daProvince = delivery.da_province
      const daCity = delivery.da_city
      const daCounty = delivery.da_county
      const daAddress = delivery.da_address
      return daProvince + '/' + daCity + '/' + daCounty + ' ' + daAddress
    }

    const deliveryInfo = () => {
      const delivery = state.detail.delivery
      if (!delivery) return ''

      const daName = delivery.da_name
      const daIntl = delivery.da_intl
      const da_mobile = delivery.da_mobile
      const daProvince = delivery.da_province
      const daCity = delivery.da_city
      const daCounty = delivery.da_county
      const daAddress = delivery.da_address
      return (
        daName +
        ', ' +
        daIntl +
        da_mobile +
        ', ' +
        daProvince +
        '/' +
        daCity +
        '/' +
        daCounty +
        ' ' +
        daAddress
      )
    }
    const payment = () => {
      const tradeData = state.tradeData
      if (!tradeData) return 0
      const tradePaymentMoney = tradeData.trade_payment_money
      const trade_payment_recharge_card = tradeData.trade_payment_recharge_card
      //const trade_payment_points = tradeData.trade_payment_points
      const trade_payment_credit = tradeData.trade_payment_credit
      const trade_payment_redpack = tradeData.trade_payment_redpack
      return (
        tradePaymentMoney * 1 +
        trade_payment_recharge_card * 1 +
        trade_payment_credit * 1 +
        trade_payment_redpack * 1
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
      orderState();
      shippingAddress();
      deliveryInfo();
      payment();
    })

    return {
      t,
      ...toRefs(state),
      showShippingFeeEdit,
      viewLogistics,
      isRetrieval,
      getTitleName,
      paymentEdit,
      updateState,
      formatTime,
      formatDateTime,
      renderTime,
      renderDate,
      formatSync,
      formatActivityType,
      formatPaymentMet,
      getSummaries,
      showEdit,
      close,
      showExpressEdit,
      handleClick,
      getOrderDetail,
      getOrderStock,
      initBillItemQuantity,
      orderRecord,
      clearData,
      doPicking,
      getPickingParams,
      handleFinanceReview,
      handleReview,
      changeTab,
      Decimal,
      updateTabData,
      orderState,
      shippingAddress,
      deliveryInfo,
      payment,

      ifReview,
      ifFinanceReview,
      ifPickingReview,
      exportCsv,
      formatJson,
      Delete,
      Plus,
      Search,
      Check,
      Edit,
      stateCode,

      mf,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.order-detail';

#{$base}-container {
  position: relative;
}

.order-summary {
  span {
    margin-right: 20px;
  }
}

.el-row {
  margin: 5px auto;
}

.price-info {
  text-align: right;

  .el-button {
    height: 14px;
  }
}

.addtion-info {
  .el-col {
    padding-top: 10px;
  }
}

</style>
