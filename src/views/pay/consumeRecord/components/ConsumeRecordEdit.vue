<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="700px"
    @close="close"
  >
    <el-form ref="formRef" label-width="110px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('支付流水号')" prop="consume_record_id">
        <el-input v-model="form.consume_record_id" clearable :disabled="isUpdate" :placeholder="t('支付流水号')"/>
      </el-form-item>
      <el-form-item :label="t('商户订单编号')" prop="order_id">
        <el-input v-model="form.order_id" clearable :placeholder="t('商户订单编号')"/>
      </el-form-item>
      <el-form-item :label="t('用户编号')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('用户编号')"/>
      </el-form-item>
      <el-form-item :label="t('昵称')" prop="user_nickname">
        <el-input v-model="form.user_nickname" clearable :placeholder="t('昵称')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('货币编号')" prop="currency_id">
        <el-input v-model="form.currency_id" clearable :placeholder="t('货币编号')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('左符号')" prop="currency_symbol_left">
        <el-input v-model="form.currency_symbol_left" clearable :placeholder="t('左符号')"/>
      </el-form-item>
      <el-form-item :label="t('金额')" prop="record_total">
        <el-input v-model="form.record_total" clearable :placeholder="t('金额')"/>
      </el-form-item>
      <el-form-item :label="t('金额')" prop="record_money">
        <el-input v-model="form.record_money" clearable :placeholder="t('金额')"/>
      </el-form-item>
      <el-form-item :label="t('佣金')" prop="record_commission_fee">
        <el-input v-model="form.record_commission_fee" clearable :placeholder="t('佣金')"/>
      </el-form-item>
      <el-form-item :label="t('分销佣金')" prop="record_distribution_commission_fee">
        <el-input v-model="form.record_distribution_commission_fee" clearable :placeholder="t('分销佣金')"/>
      </el-form-item>
      <el-form-item :label="t('年-月-日')" prop="record_date">
        <el-date-picker
          v-model="form.record_date"
          clearable
          :placeholder="t('年-月-日')"
          style="width:100%;"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item :label="t('年')" prop="record_year">
        <el-input v-model="form.record_year" clearable :placeholder="t('年')"/>
      </el-form-item>
      <el-form-item :label="t('月')" prop="record_month">
        <el-input v-model="form.record_month" clearable :placeholder="t('月')"/>
      </el-form-item>
      <el-form-item :label="t('日')" prop="record_day">
        <el-input v-model="form.record_day" clearable :placeholder="t('日')"/>
      </el-form-item>
      <el-form-item :label="t('标题')" prop="record_title">
        <el-input v-model="form.record_title" clearable :placeholder="t('标题')"/>
      </el-form-item>
      <el-form-item :label="t('描述')" prop="record_desc">
        <el-input v-model="form.record_desc" clearable :placeholder="t('描述')"/>
      </el-form-item>
      <el-form-item :label="t('支付时间')" prop="record_time">
        <el-date-picker
          v-model="form.record_time"
          clearable
          :placeholder="t('创建支付时间')"
          style="width:100%;"
          type="datetime"
        />
      </el-form-item>
      <el-form-item :label="t('交易类型')" prop="trade_type_id">
        <el-select v-model="form.trade_type_id" clearable :placeholder="t('请选择交易类型')" style="width: 100%;">
          <el-option
            v-for="(item, index) in tradeTypeList"
            :key="index"
            :label="item.trade_type_text"
            :value="item.trade_type_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('支付方式')" prop="payment_type_id">
        <el-select v-model="form.payment_type_id" clearable :placeholder="t('请选择支付方式')" style="width: 100%;">
          <el-option
            v-for="(item, index) in paymentTypeList"
            :key="index"
            :label="item.payment_type_name"
            :value="item.payment_type_id"
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
      <el-form-item v-if="false" :label="t('所属店铺')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('所属店铺')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('所属门店')" prop="chain_id">
        <el-input v-model="form.chain_id" clearable :placeholder="t('所属门店')"/>
      </el-form-item>
      <el-form-item :label="t('消费类型')" prop="payment_met_id">
        <el-input v-model="form.payment_met_id" clearable :placeholder="t('消费类型')"/>
      </el-form-item>
      <el-form-item :label="t('状态')" prop="record_enable">
        <el-switch
          v-model="form.record_enable"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
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
  import {doEdit, doAdd} from '@/api/pay/consumeRecord'
  import {useSettingsStore} from "@/store/modules/settings";

  export default defineComponent({
    name: 'ConsumeRecordEdit',
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
        tradeTypeList: [],
        paymentTypeList: [],
        paymentChannelList: settingsStore.getConfigs.payment_channel_list,

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
            if (state.form.record_time) {
              state.form.record_time = state.form.record_time.getTime()
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
