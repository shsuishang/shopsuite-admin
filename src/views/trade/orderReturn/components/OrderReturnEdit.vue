<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="130px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('退单号')" prop="return_id">
        <el-input v-model="form.return_id" clearable :disabled="isUpdate" :placeholder="t('退单号')"/>
      </el-form-item>
      <el-form-item :label="t('服务类型')" prop="service_type_id">
        <el-input v-model="form.service_type_id" clearable :placeholder="t('服务类型')"/>
      </el-form-item>
      <el-form-item :label="t('订单编号')" prop="order_id">
        <el-input v-model="form.order_id" clearable :placeholder="t('订单编号')"/>
      </el-form-item>
      <el-form-item :label="t('退款金额')" prop="return_refund_amount">
        <el-input v-model="form.return_refund_amount" clearable :placeholder="t('退款金额')"/>
      </el-form-item>
      <el-form-item :label="t('积分部分')" prop="return_refund_point">
        <el-input v-model="form.return_refund_point" clearable :placeholder="t('积分部分')"/>
      </el-form-item>
      <el-form-item :label="t('店铺编号')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('店铺编号')"/>
      </el-form-item>
      <el-form-item :label="t('买家编号')" prop="buyer_user_id">
        <el-input v-model="form.buyer_user_id" clearable :placeholder="t('买家编号')"/>
      </el-form-item>
      <el-form-item :label="t('买家是否有店铺')" prop="buyer_store_id">
        <el-input v-model="form.buyer_store_id" clearable :placeholder="t('买家是否有店铺')"/>
      </el-form-item>
      <el-form-item :label="t('添加时间')" prop="return_add_time">
        <el-date-picker
          v-model="form.return_add_time"
          clearable
          :placeholder="t('添加时间')"
          style="width:100%;"
          type="datetime"
        />
      </el-form-item>
      <el-form-item :label="t('退款理由编号')" prop="return_reason_id">
        <el-input v-model="form.return_reason_id" clearable :placeholder="t('退款理由编号')"/>
      </el-form-item>
      <el-form-item :label="t('买家退货备注')" prop="return_buyer_message">
        <el-input v-model="form.return_buyer_message" clearable :placeholder="t('买家退货备注')"/>
      </el-form-item>
      <el-form-item :label="t('收货人')" prop="return_addr_contacter">
        <el-input v-model="form.return_addr_contacter" clearable :placeholder="t('收货人')"/>
      </el-form-item>
      <el-form-item :label="t('联系电话')" prop="return_tel">
        <el-input v-model="form.return_tel" clearable :placeholder="t('联系电话')"/>
      </el-form-item>
      <el-form-item :label="t('收货地址详情')" prop="return_addr">
        <el-input v-model="form.return_addr" clearable :placeholder="t('收货地址详情')"/>
      </el-form-item>
      <el-form-item :label="t('邮编')" prop="return_post_code">
        <el-input v-model="form.return_post_code" clearable :placeholder="t('邮编')"/>
      </el-form-item>
      <el-form-item :label="t('物流公司编号')" prop="express_id">
        <el-input v-model="form.express_id" clearable :placeholder="t('物流公司编号')"/>
      </el-form-item>
      <el-form-item :label="t('物流名称')" prop="return_tracking_name">
        <el-input v-model="form.return_tracking_name" clearable :placeholder="t('物流名称')"/>
      </el-form-item>
      <el-form-item :label="t('物流单号')" prop="return_tracking_number">
        <el-input v-model="form.return_tracking_number" clearable :placeholder="t('物流单号')"/>
      </el-form-item>
      <el-form-item :label="t('申请状态平台')" prop="plantform_return_state_id">
        <el-input v-model="form.plantform_return_state_id" clearable :placeholder="t('申请状态平台')"/>
      </el-form-item>
      <el-form-item :label="t('卖家处理状态')" prop="return_state_id">
        <el-input v-model="form.return_state_id" clearable :placeholder="t('卖家处理状态')"/>
      </el-form-item>
      <el-form-item :label="t('退款完成')" prop="return_is_paid">
        <el-switch
          v-model="form.return_is_paid"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('退货类型')" prop="return_is_shipping_fee">
        <el-select v-model="form.return_is_shipping_fee" clearable :placeholder="t('请选择退货类型')" style="width: 100%">
          <el-option
            v-for="(item, index) in return_fee_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('退货类型')" prop="return_flag">
        <el-select v-model="form.return_flag" clearable :placeholder="t('请选择是否需要退货')" style="width: 100%">
          <el-option
            v-for="(item, index) in return_flag_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('申请类型')" prop="return_type">
        <el-select v-model="form.return_type" clearable :placeholder="t('请选择申请类型')" style="width: 100%">
          <el-option
            v-for="(item, index) in return_type_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('订单锁定类型')" prop="return_order_lock">
        <el-select v-model="form.return_order_lock" clearable :placeholder="t('请选择订单锁定类型')" style="width: 100%">
          <el-option
            v-for="(item, index) in order_lock_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('物流状态')" prop="return_item_state_id">
        <el-input v-model="form.return_item_state_id" clearable :placeholder="t('物流状态')"/>
      </el-form-item>
      <el-form-item :label="t('商家处理时间')" prop="return_store_time">
        <el-date-picker
          v-model="form.return_store_time"
          clearable
          :placeholder="t('商家处理时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('商家备注')" prop="return_store_message">
        <el-input v-model="form.return_store_message" clearable :placeholder="t('商家备注')"/>
      </el-form-item>
      <el-form-item :label="t('退还佣金')" prop="return_commision_fee">
        <el-input v-model="form.return_commision_fee" clearable :placeholder="t('退还佣金')"/>
      </el-form-item>
      <el-form-item :label="t('退款完成时间')" prop="return_finish_time">
        <el-date-picker
          v-model="form.return_finish_time"
          clearable
          :placeholder="t('退款完成时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('平台留言')" prop="return_platform_message">
        <el-input v-model="form.return_platform_message" clearable :placeholder="t('平台留言')"/>
      </el-form-item>
      <el-form-item :label="t('订单是否结算')" prop="return_is_settlemented">
        <el-switch
          v-model="form.return_is_settlemented"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('订单结算时间')" prop="return_settlement_time">
        <el-date-picker
          v-model="form.return_settlement_time"
          clearable
          :placeholder="t('订单结算时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('退款渠道')" prop="return_channel_code">
        <el-select v-model="form.return_channel_code" clearable :placeholder="t('请选择退款渠道')">
          <el-option :label="t('余额')" value="money" />
          <el-option :label="t('支付宝')" value="alipay" />
          <el-option :label="t('微信')" value="wx_native" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('渠道是否退款')" prop="return_channel_flag">
        <el-select v-model="form.return_channel_flag" clearable :placeholder="t('请选择渠道是否退款')" style="width: 100%">
          <el-option
            v-for="(item, index) in channel_flag_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('渠道退款时间')" prop="return_channel_time">
        <el-date-picker
          v-model="form.return_channel_time"
          clearable
          :placeholder="t('渠道退款时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('渠道退款单号')" prop="return_channel_trans_id">
        <el-input v-model="form.return_channel_trans_id" clearable :placeholder="t('渠道退款单号')"/>
      </el-form-item>
      <el-form-item :label="t('交易号')" prop="deposit_trade_no">
        <el-input v-model="form.deposit_trade_no" clearable :placeholder="t('交易号')"/>
      </el-form-item>
      <el-form-item :label="t('支付渠道')" prop="payment_channel_id">
        <el-input v-model="form.payment_channel_id" clearable :placeholder="t('支付渠道')"/>
      </el-form-item>
      <el-form-item :label="t('实付金额')" prop="trade_payment_amount">
        <el-input v-model="form.trade_payment_amount" clearable :placeholder="t('实付金额')"/>
      </el-form-item>
      <el-form-item :label="t('联系人')" prop="return_contact_name">
        <el-input v-model="form.return_contact_name" clearable :placeholder="t('联系人')"/>
      </el-form-item>
      <el-form-item :label="t('审核人员id')" prop="return_store_user_id">
        <el-input v-model="form.return_store_user_id" clearable :placeholder="t('审核人员id')"/>
      </el-form-item>
      <el-form-item :label="t('提现审核')" prop="return_withdraw_confirm">
        <el-switch
          v-model="form.return_withdraw_confirm"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('退款财务确认')" prop="return_financial_confirm">
        <el-switch
          v-model="form.return_financial_confirm"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('退款财务确认时间')" prop="return_financial_confirm_time">
        <el-date-picker
          v-model="form.return_financial_confirm_time"
          clearable
          :placeholder="t('退款财务确认时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('所属分站')" prop="subsite_id">
        <el-input v-model="form.subsite_id" clearable :placeholder="t('所属分站')"/>
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { translate as t } from '@/i18n'
import {doEdit, doAdd} from '@/api/trade/orderReturn'

export default defineComponent({
  name: 'OrderReturnEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        return_add_time: '',
      },
      rules: {
        title: [{required: true, trigger: 'blur', message: t('请输入标题')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      return_fee_options : [
        {
          value: 0,
          label: '退款单'
        },
        {
          value: 1,
          label: '退运费单'
        },
      ],
      return_flag_options : [
        {
          value: 0,
          label: '不用退货'
        },
        {
          value: 1,
          label: '需要退货'
        },
      ],
      return_type_options: [
        {
          value: 1,
          label: '退款申请'
        },
        {
          value: 2,
          label: '退货申请'
        },
        {
          value: 3,
          label: '虚拟退款'
        },
      ],
      order_lock_options : [
        {
          value: 1,
          label: '不用锁定'
        },
        {
          value: 2,
          label: '需要锁定'
        },
      ],
      channel_flag_options : [
        {
          value: 0,
          label: '待退'
        },
        {
          value: 1,
          label: '已退'
        },
        {
          value: 2,
          label: '异常'
        },
      ],
    })

    const showEdit = (row) => {

      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)
      }
      state.dialogFormVisible = true
    }
    const close = () => {
      state['formRef'].resetFields()
      state.form = {
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {

          if (state.form.return_add_time) {
            state.form.return_add_time = new Date(state.form.return_add_time).getTime()
          }

          if (state.isUpdate) {
            const { msg, status } = await doEdit(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const { msg, status } = await doAdd(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          }

          emit('fetch-data')
          close()
        }
      })
    }

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      close,
      save,
    }
  },
})
</script>
<style lang="scss">
.el-input__wrapper{
  width: 100%;
}
</style>
