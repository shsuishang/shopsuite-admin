<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="160px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('支付流水号')" prop="deposit_id">
        <el-input v-model="form.deposit_id" clearable :disabled="isUpdate" :placeholder="t('支付流水号')"/>
      </el-form-item>
      <el-form-item :label="t('商城支付编号')" prop="deposit_no">
        <el-input v-model="form.deposit_no" clearable :placeholder="t('商城支付编号')"/>
      </el-form-item>
      <el-form-item :label="t('交易号')" prop="deposit_trade_no">
        <el-input v-model="form.deposit_trade_no" clearable :placeholder="t('交易号')"/>
      </el-form-item>
      <el-form-item :label="t('商户网站唯一订单号')" prop="order_id">
        <el-input v-model="form.order_id" clearable :placeholder="t('商户网站唯一订单号')"/>
      </el-form-item>
      <el-form-item :label="t('支付渠道')" prop="payment_channel_id">
        <el-select v-model="form.payment_channel_id" clearable :placeholder="t('请选择支付渠道')" style="width: 100%;">
          <el-option
            v-for="(item, index) in paymentChannelList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('商品名称')" prop="deposit_subject">
        <el-input v-model="form.deposit_subject" clearable :placeholder="t('商品名称')"/>
      </el-form-item>
      <el-form-item :label="t('支付方式')" prop="deposit_payment_type">
        <el-select v-model="form.deposit_payment_type" clearable :placeholder="t('请选择支付方式')">
          <el-option
            v-for="(item, index) in deposit_payment_type_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('交易状态')" prop="deposit_trade_status">
        <el-input v-model="form.deposit_trade_status" clearable :placeholder="t('交易状态')"/>
      </el-form-item>
      <el-form-item :label="t('卖家户号')" prop="deposit_seller_id">
        <el-input v-model="form.deposit_seller_id" clearable :placeholder="t('卖家户号')"/>
      </el-form-item>
      <el-form-item :label="t('卖家支付账号')" prop="deposit_seller_email">
        <el-input v-model="form.deposit_seller_email" clearable :placeholder="t('卖家支付账号')"/>
      </el-form-item>
      <el-form-item :label="t('买家支付用户号')" prop="deposit_buyer_id">
        <el-input v-model="form.deposit_buyer_id" clearable :placeholder="t('买家支付用户号')"/>
      </el-form-item>
      <el-form-item :label="t('买家支付账号')" prop="deposit_buyer_email">
        <el-input v-model="form.deposit_buyer_email" clearable :placeholder="t('买家支付账号')"/>
      </el-form-item>
      <el-form-item :label="t('货币编号')" prop="currency_id">
        <el-input v-model="form.currency_id" clearable :placeholder="t('货币编号')"/>
      </el-form-item>
      <el-form-item :label="t('左符号')" prop="currency_symbol_left">
        <el-input v-model="form.currency_symbol_left" clearable :placeholder="t('左符号')"/>
      </el-form-item>
      <el-form-item :label="t('交易金额')" prop="deposit_total_fee">
        <el-input v-model="form.deposit_total_fee" clearable :placeholder="t('交易金额')"/>
      </el-form-item>
      <el-form-item :label="t('购买数量')" prop="deposit_quantity">
        <el-input v-model="form.deposit_quantity" clearable :placeholder="t('购买数量')"/>
      </el-form-item>
      <el-form-item :label="t('商品单价')" prop="deposit_price">
        <el-input v-model="form.deposit_price" clearable :placeholder="t('商品单价')"/>
      </el-form-item>
      <el-form-item :label="t('商品描述')" prop="deposit_body">
        <el-input v-model="form.deposit_body" clearable :placeholder="t('商品描述')"/>
      </el-form-item>
      <el-form-item :label="t('交易创建时间')" prop="deposit_gmt_create">
        <el-date-picker
          v-model="form.deposit_gmt_create"
          clearable
          :placeholder="t('交易创建时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('交易付款时间')" prop="deposit_gmt_payment">
        <el-date-picker
          v-model="form.deposit_gmt_payment"
          clearable
          :placeholder="t('交易付款时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('是否调整总价')" prop="deposit_is_total_fee_adjust">
        <el-switch
          v-model="form.deposit_is_total_fee_adjust"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('是否使用红包买家')" prop="deposit_use_coupon">
        <el-switch
          v-model="form.deposit_use_coupon"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('折扣')" prop="deposit_discount">
        <el-input v-model="form.deposit_discount" clearable :placeholder="t('折扣')"/>
      </el-form-item>
      <el-form-item :label="t('通知时间')" prop="deposit_notify_time">
        <el-date-picker
          v-model="form.deposit_notify_time"
          clearable
          :placeholder="t('通知时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('通知类型')" prop="deposit_notify_type">
        <el-input v-model="form.deposit_notify_type" clearable :placeholder="t('通知类型')"/>
      </el-form-item>
      <el-form-item :label="t('通知校验编号')" prop="deposit_notify_id">
        <el-input v-model="form.deposit_notify_id" clearable :placeholder="t('通知校验编号')"/>
      </el-form-item>
      <el-form-item :label="t('签名方式')" prop="deposit_sign_type">
        <el-input v-model="form.deposit_sign_type" clearable :placeholder="t('签名方式')"/>
      </el-form-item>
      <el-form-item :label="t('签名')" prop="deposit_sign">
        <el-input v-model="form.deposit_sign" clearable :placeholder="t('签名')"/>
      </el-form-item>
      <el-form-item :label="t('额外参数')" prop="deposit_extra_param">
        <el-input v-model="form.deposit_extra_param" clearable :placeholder="t('额外参数')"/>
      </el-form-item>
      <el-form-item :label="t('支付')" prop="deposit_service">
        <el-input v-model="form.deposit_service" clearable :placeholder="t('支付')"/>
      </el-form-item>
      <el-form-item :label="t('支付状态')" prop="deposit_state">
        <el-radio-group v-model="form.deposit_state">
          <el-radio
            v-for="(item, index) in deposit_state_radio"
            :key="index"
            :disabled="item.disabled"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('是否同步')" prop="deposit_async">
        <el-switch
          v-model="form.deposit_async"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('收款确认')" prop="deposit_review">
        <el-switch
          v-model="form.deposit_review"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('是否作废')" prop="deposit_enable">
        <el-switch
          v-model="form.deposit_enable"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item v-if="false" :label="t('所属店铺')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('所属店铺')"/>
      </el-form-item>
      <el-form-item :label="t('所属用户')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('所属用户')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('所属门店')" prop="chain_id">
        <el-input v-model="form.chain_id" clearable :placeholder="t('所属门店')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('所属分站')" prop="subsite_id">
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
  import {doEdit, doAdd} from '@/api/pay/consumeDeposit'
  import {useSettingsStore} from "@/store/modules/settings";

  export default defineComponent({
    name: 'ConsumeDepositEdit',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')
      const settingsStore = useSettingsStore()

      const state = reactive({
        formRef: null,
        form: {
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
        paymentChannelList: settingsStore.getConfigs.payment_channel_list,
        deposit_payment_type_options : [
          {
            value: 1301,
            label: '货到付款'
          },
          {
            value: 1302,
            label: '在线支付'
          },
          {
            value: 1303,
            label: '白条支付'
          },
          {
            value: 1304,
            label: '现金支付'
          },
          {
            value: 1305,
            label: '线下支付'
          },
        ],
        deposit_state_radio: [
          {
            value: 0,
            label: '默认'
          },
          {
            value: 1,
            label: '正常'
          },
          {
            value: 9,
            label: '异常订单'
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
