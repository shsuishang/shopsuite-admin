<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="1200"
    :title="topTitle"
    top="3%"
    :with-header="true"
    @close="close"
  >
    <div v-loading="loading">
      <el-row>
        <el-col :span="4" style="padding-top: 5px">
<!--          <div v-for="(item, index) in returnStateList" :key="index">-->
<!--            <div v-if="item.value == data.return_state_id" style="color: red; font-weight: 400; font-size: 18px;">-->
<!--              {{ item.label }}-->
<!--            </div>-->
<!--          </div>-->
        </el-col>
        <el-col v-if="data.return_state_id === 3105" :push="16" :span="4">
          <el-button
            class="el-icon-circle-close"
            type="danger"
            @click="refusedOpen"
          >
            {{ t('不通过') }}
          </el-button>
          <el-button
            class="el-icon-circle-check"
            type="success"
            @click="reviewDialog = true"
          >
            {{ t('通过审核') }}
          </el-button>
        </el-col>
        <el-col v-if="data.return_state_id === 3110" :push="18" :span="2">
          <el-button
            class="el-icon-circle-check"
            type="success"
            @click="returnReceive"
          >
            {{ t('确认收货') }}
          </el-button>
        </el-col>
        <el-col v-if="data.return_state_id === 3115" :push="18" :span="2">
          <el-button
            class="el-icon-circle-check"
            type="success"
            @click="returnRefund"
          >
            {{ t('确认退款') }}
          </el-button>
        </el-col>
      </el-row>
      <div class="span_margin_right_10">
        <span>{{ t('退货类型') }}：{{ data.return_is_shipping_fee == 0 ? t('退款单') : t('退运费单')}}</span>
      </div>
      <div class="span_margin_right_10" style="margin-top: 20px">
        <span>{{ t('退单号') }}：{{ data.return_id }}</span>
        <span>{{ t('订单号') }}：{{ data.order_id }}</span>
        <span>{{ t('客户名称') }}：{{ data.buyer_user_name }}</span>
        <span v-if="data.return_type == 1">{{ t('申请类型') }}：{{ t('退款申请') }}</span>
        <span v-if="data.return_type == 2">{{ t('申请类型') }}：{{ t('退货申请') }}</span>
        <span v-if="data.return_type == 3">{{ t('申请类型') }}：{{ t('虚拟退款') }}</span>
        <span>{{ t('申请时间') }}：{{ data.return_add_time }}</span>
        <span v-if="data.return_buyer_message">{{ t('退货理由') }}：{{ data.return_buyer_message }}</span>
      </div>
      <div class="span_margin_right_10" style="margin-top: 20px">
        <span>{{ t('收货人') }}：{{ data.da_name }}</span>
        <span>{{ t('联系方式') }}：{{ data.da_mobile }}</span>
        <span>{{ t('收货地址') }}：{{ contactAddress }}</span>
      </div>

      <el-table
        border
        :data="tableData"
        show-summary
        style="margin-top: 20px; width: 100%"
        :summary-method="getSummaries"
      >
        <el-table-column align="center" :label="t('商品名称')" prop="product_item_name" width="660"/>
        <el-table-column align="center" :label="t('单位')" prop="unit_name" width="100"/>
        <el-table-column align="center" :label="t('单价')" prop="item_unit_price" width="100"/>
        <el-table-column align="center" :label="t('退款凭据')" prop="return_item_image_list" width="100">
          <template #default="{ row }">
            <el-image
                v-for="(image, index) in row.return_item_image_list"
                :key="index"
                :preview-src-list="row.return_item_image_list"
                preview-teleported
                :src="image"
                style="width: 35px; height: 35px;"
              />
          </template>
        </el-table-column>
        <el-table-column align="center" :label="t('数量')" prop="return_item_num" width="100"/>
        <el-table-column align="center" :label="t('金额小计')" prop="return_item_subtotal" width="100"/>
      </el-table>
      <el-row style="margin-top: 10px">
        <el-col :push="20" :span="4">
          <div>
            <span style="padding-left: 15px">
              &nbsp;&nbsp; {{ t('退运费额度') }} ：
            </span>
            <span v-text="data.return_shipping_fee" ></span>
            {{ t('元') }}
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :push="20" :span="4">
          <div>
            <span v-if="data.return_is_paid" style="padding-left: 15px">
              &nbsp;&nbsp; {{ t('实际退款总额') }} ：
            </span>
            <span v-else-if="data.return_state_id !== 3125"  style="padding-left: 32px">
              <el-link type="primary" @click="showRefund">
                {{ t('实际退款总额') }} ：
              </el-link>
            </span>
            <span style="color: red" v-text="data.return_refund_amount" ></span>
            {{ t('元') }}
          </div>
        </el-col>
      </el-row>

      <div  v-if="data.return_state_id == 3110 || data.return_state_id == 3115 || data.return_state_id == 3120 || data.return_state_id == 3125">
        <div style="font-weight: 400; font-size: 18px; padding-top: 50px">
          {{ t('售后详情') }}
        </div>
        <el-divider />

        <div class="span_margin_right_18" style="margin-top: 20px">
          <span>{{ t('退货') }}：{{ data.return_flag == 0 ? t('不用退货') : t('需要退货')}}</span>
          <span v-if="data.return_store_message">{{ t('商家备注') }}：{{ data.return_store_message }}</span>
          <span v-if="data.return_store_time">{{ t('商家处理时间') }}：{{ data.return_store_time }}</span>
        </div>

        <div v-if="data.return_state_id == 3120 || data.return_state_id == 3125" class="span_margin_right_18" style="margin-top: 20px">
          <span>{{ t('提现审核') }}：{{ data.return_withdraw_confirm ? t('已审核') : t('未审核') }}</span>
          <span v-if="data.return_withdraw_confirm">{{ t('退款财务确认') }}：{{ data.return_financial_confirm ? t('已确认') : t('未确认') }}</span>
          <span v-if="data.return_financial_confirm">{{ t('退款财务确认时间') }}：{{ data.return_financial_confirm_time }}</span>
          <span v-if="data.return_channel_code == 'money'">{{ t('退款渠道') }}：{{ t('余额') }}</span>
          <span v-if="data.return_channel_code == 'alipay'">{{ t('退款渠道') }}：{{ t('支付宝') }}</span>
          <span v-if="data.return_channel_code == 'wx_native'">{{ t('退款渠道') }}：{{ t('微信') }}</span>
          <span v-if="data.return_channel_flag == '0'">{{ t('渠道退款') }}：{{ t('待退') }}</span>
          <span v-if="data.return_channel_flag == '1'">{{ t('渠道退款') }}：{{ t('已退') }}</span>
          <span v-if="data.return_channel_flag == '2'">{{ t('渠道退款') }}：{{ t('异常') }}</span>
          <span v-if="data.return_channel_flag == '1' && data.return_channel_trans_id">{{ t('渠道退款单号') }}：{{ data.return_channel_trans_id }}</span>
          <span v-if="data.return_channel_flag == '1' && data.return_channel_time">{{ t('渠道退款时间') }}：{{ data.return_channel_time }}</span>
        </div>

        <div v-if="data.return_state_id == 3125" class="span_margin_right_18" style="margin-top: 20px">
          <span>{{ t('退款结算') }}：{{ data.return_is_paid ? t('已结算') : t('未结算') }}</span>
          <span v-if="data.return_is_paid && data.return_settlement_time">{{ t('订单结算时间') }}：{{ data.return_settlement_time }}</span>
          <span>{{ t('退款完成') }}：{{ data.return_is_paid ? t('是') : t('否') }}</span>
          <span v-if="data.return_finish_time">{{ t('退款完成时间') }}：{{ data.return_finish_time }}</span>
        </div>

        <div v-if="data.return_flag == 1">
          <div style="font-weight: 400; font-size: 18px; padding-top: 50px">
            {{ t('退货地址') }}
          </div>
          <el-divider />
          <div class="span_margin_right_18">
            <span>{{ t('收货人') }}：{{ data.return_contact_name }}</span>
            <span>{{ t('联系方式') }}：{{ data.return_tel }}</span>
            <span>{{ t('收货地址') }}：{{ data.return_addr }}</span>
          </div>
        </div>

        <div v-if="data.return_flag == 1">
          <div style="font-weight: 400; font-size: 18px; padding-top: 50px">
            {{ t('物流信息') }}
          </div>
          <el-divider />
          <div class="span_margin_right_18">
            <span v-if="data.return_item_state_id == '2030'">{{ t('物流状态') }}：{{ t('待发货') }}</span>
            <span v-if="data.return_item_state_id == '2040'">{{ t('物流状态') }}：{{ t('已发货') }}</span>
            <span v-if="data.return_item_state_id == '2060'">{{ t('物流状态') }}：{{ t('已完成') }}</span>
            <span v-if="data.return_item_state_id == '2070'">{{ t('物流状态') }}：{{ t('已取消') }}</span>
            <span v-if="data.return_tracking_name">{{ t('退货物流名称') }}：{{ data.return_tracking_name }}</span>
            <span v-if="data.return_tracking_number">{{ t('退货物流单号') }}：{{ data.return_tracking_number }}</span>
            <el-button
              v-if="viewLogisticsFlag"
              type="danger"
              @click="viewLogistics()"
            >
              {{ t('查看物流') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="refusedDialog"
      append-to-body
      :title="refusedTitle"
      @close="refusedClose"
    >
      <el-form
        ref="refusedFormRef"
        v-loading="refusedLoading"
        label-position="left"
        label-width="100px"
        :model="refusedForm"
        :rules="refusedRules"
        size="medium"
      >
        <el-form-item :label="t('商家备注')" prop="return_store_message">
          <el-input
            v-model="refusedForm.return_store_message"
            clearable
            :placeholder="t('请输入商家备注')"
            :style="{ width: '100%' }"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="refusedClose">{{ t('取 消')}}</el-button>
        <el-button type="primary" @click="refusedConfirm">{{ t('确 定')}}</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="reviewDialog"
      append-to-body
      :title="t('退货确认')"
      @close="reviewClose"
    >
      <el-form
        ref="reviewFormRef"
        v-loading="reviewLoading"
        label-position="left"
        label-width="100px"
        :model="reviewForm"
        :rules="reviewRules"
        size="medium"
      >
        <el-form-item :label="t('退货类型')" prop="return_flag">
          <el-radio-group v-model="reviewForm.return_flag" size="medium">
            <el-radio
              v-for="(item, index) in return_flagOptions"
              :key="index"
              :disabled="item.disabled"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="reviewForm.return_flag === 1"
          :label="t('请选择收货人')"
          :label-width="120"
          prop="receiving_address"
        >
          <el-select
            v-model="reviewForm.receiving_address"
            clearable
            :placeholder="t('请选择收货姓名')"
            :style="{ width: '30%' }"
          >
            <el-option
              v-for="item in addressList"
              :key="item.ss_id"
              :label="item.ss_name"
              :value="item.ss_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('商家备注')" prop="return_store_message">
          <el-input
            v-model="reviewForm.return_store_message"
            clearable
            :placeholder="t('请输入商家备注')"
            :style="{ width: '100%' }"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="reviewClose">{{ t('取消') }}</el-button>
        <el-button type="primary" @click="reviewConfirm">
          {{ t('确定') }}
        </el-button>
      </template>
    </el-dialog>

    <Refund ref="refundRef" @fetch-data="getData" />
    <ReturnLog ref="returnLogRef" @fetch-data="getData" />
  </el-drawer>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {getByReturnId, refused, review, receive, refund} from '@/api/trade/orderReturn'
  import {getList as getAddressList} from '@/api/shop/storeShippingAddress'
  import Refund from "./RefundAmountEdit";
  import ReturnLog from "./OrderReturnTracking";
  import { computed } from 'vue';
  import {useSettingsStore} from "@/store/modules/settings";

  export default defineComponent({
    name: 'OrderReturnItem',
    components: {Refund, ReturnLog},
    props:{
    },
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const settingsStore = useSettingsStore()

      const state = reactive({
        refusedFormRef: null,
        reviewFormRef: null,
        refundRef: null,
        returnLogRef: null,
        dialogFormVisible: false,
        data: {},
        topTitle: '',
        return_id: '',
        loading: false,
        refusedTitle: '',
        refusedDialog:false,
        refusedForm: {},
        reviewDialog: false,
        viewLogisticsFlag: false,
        reviewForm: {
          return_flag: 0,
        },
        return_flagOptions: [
          {
            label: '不用退货',
            value: 0,
          },
          {
            label: '需要退货',
            value: 1,
          },
        ],
        addressList: [],
        tableData: [],
        returnStateList: settingsStore.getConfigs.return_state_list,

      })

      const showEdit = async (row) => {
        state.dialogFormVisible = true
        state.return_id = row.return_id
        await getData(state.return_id)
      }

      const getData = async (return_id) => {
        state.loading = true

        const { data } = await getByReturnId({ return_id: return_id })
        state.tableData = data.return_item_list
        state.data = Object.assign({}, data)
        const timestamp = state.data.return_add_time;
        const dateObj = new Date(timestamp);
        state.data.return_add_time = formatDateOne(dateObj);

        if (state.data.return_store_time) {
          state.data.return_store_time = formatDateOne(new Date(state.data.return_store_time))
        }
        if (state.data.return_finish_time) {
          state.data.return_finish_time = formatDateOne(new Date(state.data.return_finish_time))
        }
        if (state.data.return_settlement_time) {
          state.data.return_settlement_time = formatDateOne(new Date(state.data.return_settlement_time))
        }
        if (state.data.return_channel_time) {
          state.data.return_channel_time = formatDateOne(new Date(state.data.return_channel_time))
        }
        if (state.data.return_financial_confirm_time) {
          state.data.return_financial_confirm_time = formatDateOne(new Date(state.data.return_financial_confirm_time))
        }

        if (state.returnStateList) {
          state.returnStateList.forEach( item => {
            if (item.value == state.data.return_state_id) {
              state.topTitle = item.label
              }
            }
          )
        }

        if (state.data.return_tracking_number) {
          state.viewLogisticsFlag = true
        }
        state.loading = false
      }

      const close = () => {
        state.dialogFormVisible = false
      }

      //审核不通过 相关
      const refusedOpen = () => {
        state.refusedTitle = state.data.return_id + ' 不通过审核'
        state.refusedDialog = true
      }

      const refusedClose = () => {
        state['refusedFormRef'].resetFields()
        state.refusedForm = {}
        state.refusedDialog = false
      }

      const refusedConfirm = () => {
        state['refusedFormRef'].validate(async (valid) => {
          state.refusedLoading = true
          if (valid) {
            state.refusedForm.return_id = state.return_id
            const { msg, status } = await refused(state.refusedForm)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            refusedClose()
            await getData(state.return_id)
            state.refusedLoading = false
          } else {
            state.refusedLoading = false
            return false
          }
        })
      }

      const refusedRules = reactive({
        return_store_message: [
          { required: true, message: '请输入商家备注', trigger: 'blur' },
        ],
      });

      //通过审核、退货 相关
      const reviewClose = () => {
        state['reviewFormRef'].resetFields()
        state.reviewForm = {
          return_flag: 0,
        }
        state.reviewDialog = false
      }

      const reviewConfirm = () => {
        state['reviewFormRef'].validate(async (valid) => {
          state.reviewLoading = true
          if (valid) {
            state.reviewForm.return_id = state.return_id
            const { msg, status } = await review(state.reviewForm)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            reviewClose()
            await getData(state.return_id)
            state.reviewLoading = false
          } else {
            state.reviewLoading = false
            return false
          }
        })
      }

      const reviewRules = reactive({
        return_flag: [
          {
            required: true,
            message: '退货类型不能为空',
            trigger: 'change',
          },
        ],
        return_store_message: [
          {
            required: true,
            message: '请输入商家备注',
            trigger: 'blur',
          },
        ],
        receiving_address: [
          {
            required: true,
            message: '请选择收货人',
            trigger: 'blur',
          },
        ],
      });

      const getAddress = async () => {
        const { data } = await getAddressList()
        state.addressList = data.items
      }

      onMounted(() => {
        getAddress()
      })

      const returnReceive = async () => {
          $confirm(t('是否确认收货'), null, async () => {
            const { msg, status } = await receive({return_id: state.return_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            await getData(state.return_id)
          })
      }

      const returnRefund = async () => {
          $confirm(t('是否确认退款'), null, async () => {
            const { msg, status } = await refund({return_id: state.return_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            await getData(state.return_id)

          })
      }

      const showRefund = () => {
        const params = {
        }
        params.return_id = state.return_id
        params.return_refund_amount = state.data.return_refund_amount
        state.refundRef.showEdit(params)
      }

      const viewLogistics = () => {
        const params = {
        }
        params.return_tracking_name = state.data.return_tracking_name
        params.return_tracking_number = state.data.return_tracking_number
        state.returnLogRef.showEdit(params)
      }

      // 统计申请总额
      function getSummaries(param) {
        const { columns, data } = param
        const sums = []
        sums[0] = '申请总额'
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '申请总额'
            return
          }
          if (index === 4 || index === 5) {
            let values = 0
            if (index === 4) {
              values = data.map((item) => {
                return Number(item['return_item_num'])
              })
            }
            if (index === 5) {
              values = data.map((item) => {
                return Number(item['return_item_subtotal'])
              })
            }
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        })
        return sums
      }

      const contactAddress = computed(() => {
        {
          let address = ''
          const da_province = state.data.da_province
          const da_city = state.data.da_city
          const da_county = state.data.da_county
          const da_address = state.data.da_address
          if (da_province) {
            address += da_province
          }
          if (da_city) {
            address += '/' + da_county
          }
          if (da_county) {
            address += '/' + da_county
          }
          if (da_address) {
            address += ' ' + da_address
          }
          return address
        }
      })

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
        t: t,
        close,
        showEdit,
        refusedConfirm,
        returnReceive,
        reviewConfirm,
        refusedRules,
        contactAddress,
        returnRefund,
        getSummaries,
        reviewRules,
        refusedOpen,
        refusedClose,
        showRefund,
        viewLogistics,
        reviewClose,
        getData,
        ...toRefs(state),
      }
    },
  })
</script>
<style lang="scss" scoped>
  .el-input__wrapper{
    width: 100%;
  }
  .span_margin_right_18 span {
    margin-right: 18px;
  }

  .span_margin_right_10 span {
    margin-right: 10px;
  }

</style>
