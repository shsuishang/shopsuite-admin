<template>
  <el-dialog
    v-model="dialogFormVisible"
    class="dialog-height-65"
    :title="title"
    width="60%"
    @close="close"
  >
    <div :loading="loading">
      <div style="margin-bottom: 10px">
        <el-input v-model="chain_code" :placeholder="t('请输入提货码/服务码')">
          <template #append>
            <el-button :icon="Search" @click="getOrderByPickUpCode"/>
          </template>
        </el-input>
      </div>
      <div v-show="itemData && itemData.length > 0">
        <div>
          <div style="color: red; font-weight: 400; font-size: 18px">
            {{ detail.order_state_name }}
          </div>
          <div
            class="span_margin_right_10"
            style="position: relative; overflow: auto; line-height: 30px"
          >
            <span>{{ t('订单号')}}：</span>
            <span v-if="detail">{{ detail.order_id }}</span>
            <span>{{ t('客户名称')}}：</span>
            <span v-if="detail">{{ detail.buyer_user_name }}</span>
            <span>{{ t('留言')}}：</span>
            <span v-if="detail">{{ detail.order_message }}</span>
            <span>{{ t('送货时间')}}：</span>
            <span v-if="detail">{{ detail.delivery_time_name }}</span>
            <span v-show="detail.chain_code_status === 0" style="float: right">
            <el-button :disabled="loading" @click="doPickUp">
              {{ t('确认提货') }}
            </el-button>
          </span>
          </div>
        </div>

        <el-table
          ref="itemTable"
          :border="true"
          :data="itemData"
          :height="300"
          :show-summary="true"
          style="width: 100%; margin-top: 20px"
          :summary-method="getSummaries"
        >
          <el-table-column
            :height="250"
            :label="t('商品图片')"
            :prop="order_item_image"
          >
            <template #default="{ row }">
              <el-image
                :fit="fit"
                :src="row.order_item_image"
                style="width: 35px; height: 35px"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="t('商品名称')"
            :prop="item_name"
            :show-overflow-tooltip="true"
            :width="160"
          />
          <el-table-column
            align="center"
            :label="t('单位')"
            :prop="order_detail_unit_name"
          />
          <el-table-column
            align="center"
            :label="t('积分')"
            :prop="item_unit_points"
          />
          <el-table-column
            align="center"
            :label="t('单价')"
            :prop="order_item_unit_price"
          />
          <el-table-column
            align="center"
            :label="t('数量')"
            :prop="order_item_quantity"
          />
          <el-table-column
            align="center"
            :label="t('金额小计')"
            :prop="order_item_amount"
          />
          <el-table-column
            align="center"
            :formatter="formatActivityType"
            :label="t('活动类型')"
            :prop="activity_type_id"
          />
          <el-table-column
            align="center"
            :formatter="formatSync"
            :label="t('是否转单')"
            :prop="order_item_supplier_sync"
          />
        </el-table>

        <div style="margin-top: 10px">
          <el-row>
            <el-col :offset="18" :span="3"><span>{{ t('活动优惠：￥')}}</span></el-col>
            <el-col :span="3">
              {{ detail.order_discount_amount }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="18" :span="3">
              <span>{{ t('优惠券抵扣：￥')}}</span>
            </el-col>
            <el-col :span="3">
              {{ detail.voucher_price }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="18" :span="3">
            <span>
              <el-button v-if="order_state_id === 2010" circle :icon="Edit" type="text"/>
              <span>{{ t('运费：￥')}}</span>
            </span>
            </el-col>
            <el-col :span="3">
              {{ detail.order_shipping_fee }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="18" :span="3">
              <span>{{ t('应付金额：￥')}}</span>
            </el-col>
            <el-col :span="3" style="color: red">
              {{ detail.order_payment_amount }}
            </el-col>
          </el-row>
        </div>
        <div>
          <div style="font-weight: 400; font-size: 18px; padding-top: 50px">
            {{ t('收货信息')}}
          </div>
          <el-divider />
          <div>
            <span>{{ t('客户名称')}}：</span>
            <span v-if="detail.delivery">{{ detail.delivery.da_name }}</span>
            <span>{{ t('收货人')}} ：</span>
            <span v-if="detail">{{ detail.buyer_user_name }}</span>
            &nbsp;&nbsp;
            <span>{{ t('联系方式')}} ：</span>
            <span v-if="detail.delivery">+{{ detail.currency_id }}{{ detail.delivery.da_mobile }}</span>
            &nbsp;&nbsp;
            <span>{{ t('收货地址')}}:</span>
            <span>{{ shippingAddress }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {translate as t} from "@/i18n";
import {Delete, Plus, Search, Edit} from "@element-plus/icons-vue";
export default defineComponent({
    name: 'PickUpWriteOff',
    components: {},
    emits: [],
    setup() {
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
        queryForm: {
          page: 1,
          size: 10,
          product_name: '',
          product_id:'',
          product_number:"",
        },
        data: {},
        order_state_id: undefined,
        chain_code: undefined,
        loading: false,
        itemData: [],
        detail: {},
        title: '',
        dialogFormVisible: false,
        activityTypes: [
          { value: 1101, label: t('加价购') },
          { value: 1102, label: t('店铺满赠') },
          { value: 1103, label: t('限时折扣') },
          { value: 1104, label: t('优惠套装') },
          { value: 1105, label: t('店铺优惠券') },
          { value: 1106, label: t('砸金蛋') },
          { value: 1107, label: t('满减') },
          { value: 1109, label: t('积分换购') },
          { value: 1131, label: t('市场活动') },
          { value: 1121, label: t('幸运大抽奖') },
          { value: 1122, label: t('秒杀') },
          { value: 1123, label: t('拼团') },
          { value: 1124, label: t('砍价') },
          { value: 1125, label: t('一元购') },
          { value: 1126, label: t('团购') },
          { value: 1127, label: t('批发团购') },
          { value: 5001, label: t('今日爆款') },
          { value: 5002, label: t('每日好店') },
          { value: 5003, label: t('限时秒杀') },
          { value: 5004, label: t('天天秒淘') },
          { value: 5005, label: t('零元购') },
          { value: 5006, label: t('高额返区') },
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
      })

      /*const shippingAddress = () => {
        const delivery = state.detail.delivery
        if (!delivery) return ''

        const daProvince = delivery.da_province
        const daCity = delivery.da_city
        const daCounty = delivery.da_county
        const daAddress = delivery.da_address
        return daProvince + '/' + daCity + '/' + daCounty + ' ' + daAddress
      }*/

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
      const formatSync = (row) => {
        return row.order_item_supplier_sync === 0
          ? t('否')
          : t('是')
      }
      const showEdit = () => {
        state.title = t('提货核销')
        state.dialogFormVisible = true
      }
      // 统计
      const getSummaries = (param) => {
        const { columns, data } = param
        const sums = []
        if (!data) return sums

        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '合计'
            return
          }
          if (index === 6 || index === 5) {
            const values = data.map((item) => Number(item[column.property]))
            if (!values.every((value) => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          }
        })
        return sums
      }
      const close = () => {
        state.detail = {}
        state.itemData = []
        state.order_state_id = undefined
        state.chain_code = undefined
        state.dialogFormVisible = false
      }
      const getOrderByPickUpCode = async () => {
        const chain_code = state.chain_code
        state.loading = true
        if (chain_code) {
          const { data, msg } = await pickUpCode({
            chain_code: chain_code,
          })
          if (data) {
            state.detail = data
            state.itemData = data.items
          } else {
            state.detail = {}
            state.itemData = {}
            $message(msg, 'error')
          }
        } else {
          state.detail = {}
          state.itemData = {}
          $message('请输入自提码/服务码', 'error')
        }
        state.loading = false
      }
      const doPickUp = async () => {
        const order_id = state.detail.order_id
        const chain_code = state.detail.chain_code
        state.loading = true
        if (order_id) {
          const { msg, status } = await doPickUp({
            chain_code: chain_code,
            order_id: order_id,
          })
          if (200 == status)
          {
            $message(msg, 'success')
          }
          else
          {
            $message(msg, 'error')
          }
          await state.getOrderByPickUpCode()
          $emit('fetch-data')
        }
        state.loading = false
      }

      onMounted(() => {

      })

      return {
        t,
        ...toRefs(state),
        formatActivityType,
        formatPaymentMet,
        formatSync,
        showEdit,
        getSummaries,
        close,
        getOrderByPickUpCode,
        doPickUp,
        Delete,
        Plus,
        Search,
        Edit,
      }
    },
  })

</script>
<style>
  .dialog-height-65 .el-dialog__body {
    height: 68vh;
    overflow: auto;
  }

  .span_margin_right_10 span {
    margin-right: 10px;
  }
</style>
