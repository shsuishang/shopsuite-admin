<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="120px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('交易订单编号')" prop="consume_trade_id">
        <el-input v-model="form.consume_trade_id" clearable :disabled="isUpdate" :placeholder="t('交易订单编号')"/>
      </el-form-item>
      <el-form-item :label="t('标题')" prop="trade_title">
        <el-input v-model="form.trade_title" clearable :placeholder="t('标题')"/>
      </el-form-item>
      <el-form-item :label="t('商户订单编号')" prop="order_id">
        <el-input v-model="form.order_id" clearable :placeholder="t('商户订单编号')"/>
      </el-form-item>
      <el-form-item :label="t('买家编号')" prop="buyer_id">
        <el-input v-model="form.buyer_id" clearable :placeholder="t('买家编号')"/>
      </el-form-item>
      <el-form-item :label="t('买家是否有店铺')" prop="buyer_store_id">
        <el-input v-model="form.buyer_store_id" clearable :placeholder="t('买家是否有店铺')"/>
      </el-form-item>
      <el-form-item :label="t('店铺编号')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('店铺编号')"/>
      </el-form-item>
      <el-form-item :label="t('所属分站')" prop="subsite_id">
        <el-input v-model="form.subsite_id" clearable :placeholder="t('所属分站')"/>
      </el-form-item>
      <el-form-item :label="t('卖家编号')" prop="seller_id">
        <el-input v-model="form.seller_id" clearable :placeholder="t('卖家编号')"/>
      </el-form-item>
      <el-form-item :label="t('门店编号')" prop="chain_id">
        <el-input v-model="form.chain_id" clearable :placeholder="t('门店编号')"/>
      </el-form-item>
      <el-form-item :label="t('支付状态')" prop="trade_is_paid">
        <el-input v-model="form.trade_is_paid" clearable :placeholder="t('支付状态')"/>
      </el-form-item>
      <el-form-item :label="t('交易类型')" prop="trade_type_id">
        <el-select v-model="form.trade_type_id" clearable :placeholder="t('请选择交易类型')">
          <el-option
            v-for="(item, index) in trade_type_id_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item :label="t('交易模式')" prop="trade_mode_id">
        <el-select v-model="form.trade_mode_id" clearable :placeholder="t('请选择交易模式')">
          <el-option
            v-for="(item, index) in trade_mode_id_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('充值编号')" prop="recharge_level_id">
        <el-input v-model="form.recharge_level_id" clearable :placeholder="t('充值编号')"/>
      </el-form-item>
      <el-form-item :label="t('货币编号')" prop="currency_id">
        <el-input v-model="form.currency_id" clearable :placeholder="t('货币编号')"/>
      </el-form-item>
      <el-form-item :label="t('左符号')" prop="currency_symbol_left">
        <el-input v-model="form.currency_symbol_left" clearable :placeholder="t('左符号')"/>
      </el-form-item>
      <el-form-item :label="t('总付款额度')" prop="order_payment_amount">
        <el-input v-model="form.order_payment_amount" clearable :placeholder="t('总付款额度')"/>
      </el-form-item>
      <el-form-item :label="t('平台交易佣金')" prop="order_commission_fee">
        <el-input v-model="form.order_commission_fee" clearable :placeholder="t('平台交易佣金')"/>
      </el-form-item>
      <el-form-item :label="t('实付金额')" prop="trade_payment_amount">
        <el-input v-model="form.trade_payment_amount" clearable :placeholder="t('实付金额')"/>
      </el-form-item>
      <el-form-item :label="t('余额支付')" prop="trade_payment_money">
        <el-input v-model="form.trade_payment_money" clearable :placeholder="t('余额支付')"/>
      </el-form-item>
      <el-form-item :label="t('充值卡余额支付')" prop="trade_payment_recharge_card">
        <el-input v-model="form.trade_payment_recharge_card" clearable :placeholder="t('充值卡余额支付')"/>
      </el-form-item>
      <el-form-item :label="t('积分支付')" prop="trade_payment_points">
        <el-input v-model="form.trade_payment_points" clearable :placeholder="t('积分支付')"/>
      </el-form-item>
      <el-form-item :label="t('众宝支付')" prop="trade_payment_sp">
        <el-input v-model="form.trade_payment_sp" clearable :placeholder="t('众宝支付')"/>
      </el-form-item>
      <el-form-item :label="t('信用支付')" prop="trade_payment_credit">
        <el-input v-model="form.trade_payment_credit" clearable :placeholder="t('信用支付')"/>
      </el-form-item>
      <el-form-item :label="t('红包支付')" prop="trade_payment_redpack">
        <el-input v-model="form.trade_payment_redpack" clearable :placeholder="t('红包支付')"/>
      </el-form-item>
      <el-form-item :label="t('折扣优惠')" prop="trade_discount">
        <el-input v-model="form.trade_discount" clearable :placeholder="t('折扣优惠')"/>
      </el-form-item>
      <el-form-item :label="t('总额虚拟')" prop="trade_amount">
        <el-input v-model="form.trade_amount" clearable :placeholder="t('总额虚拟')"/>
      </el-form-item>
      <el-form-item :label="t('描述')" prop="trade_desc">
        <el-input v-model="form.trade_desc" clearable :placeholder="t('描述')"/>
      </el-form-item>
      <el-form-item :label="t('备注')" prop="trade_remark">
        <el-input v-model="form.trade_remark" clearable :placeholder="t('备注')"/>
      </el-form-item>
      <el-form-item :label="t('创建时间')" prop="trade_create_time">
        <el-date-picker
          v-model="form.trade_create_time"
          clearable
          :placeholder="t('创建时间')"
          style="width:30%;"
          type="datetime"
        />
      </el-form-item>
      <el-form-item :label="t('付款时间')" prop="trade_paid_time">
        <el-date-picker
          v-model="form.trade_paid_time"
          clearable
          :placeholder="t('付款时间')"
          style="width:30%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('是否删除')" prop="trade_delete">
        <el-switch
          v-model="form.trade_delete"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
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
  import {doEdit, doAdd} from '@/api/pay/consumeTrade'
  import {useSettingsStore} from "@/store/modules/settings";

  export default defineComponent({
    name: 'ConsumeTradeEdit',
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
        trade_type_id_options : [
          {
            value: 1201,
            label: '购物'
          },
          {
            value: 1202,
            label: '转账'
          },
          {
            value: 1203,
            label: '充值'
          },
          {
            value: 1204,
            label: '提现'
          },
          {
            value: 1205,
            label: '销售'
          },
          {
            value: 1206,
            label: '佣金'
          },
        ],
        trade_mode_id_options : [
          {
            value: 1,
            label: '担保交易'
          },
          {
            value: 2,
            label: '直接交易'
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
            if (state.form.trade_create_time) {
              state.form.trade_create_time = state.form.trade_create_time.getTime()
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
