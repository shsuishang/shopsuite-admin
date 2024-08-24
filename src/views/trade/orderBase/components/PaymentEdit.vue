<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    :title="title"
    width="50%"
    @close="close"
  >
    <el-form
      ref="formRef"
      label-position="left"
      label-width="100px"
      :model="form"
      :rules="rules"
      size="medium"
    >
      <el-row v-if="false">
        <el-col :span="12">
          <el-form-item label="预付款支付" prop="pm_money">
            <el-input
              v-model="form.pm_money"
              clearable
              :placeholder="t('请输入预付款支付')"
              :style="{ width: '90%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="充值卡支付" prop="pm_recharge_card">
            <el-input
              v-model="form.pm_recharge_card"
              clearable
              :placeholder="t('请输入充值卡支付')"
              :style="{ width: '90%' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="付款金额" prop="deposit_total_fee">
            <el-input
              v-model="form.deposit_total_fee"
              clearable
              :placeholder="t('请输入付款金额')"
              :style="{ width: '90%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款日期" prop="deposit_time">
            <el-date-picker
              v-model="form.deposit_time"
              clearable
              :placeholder="t('请输入付款日期')"
              :style="{ width: '90%' }"
              type="datetime"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="支付凭证号" prop="deposit_trade_no">
            <el-input
              v-model="form.deposit_trade_no"
              clearable
              :placeholder="t('请输入支付凭证号')"
              :style="{ width: '90%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款账户" prop="payment_channel_id">
            <el-select
              v-model="form.payment_channel_id"
              clearable
              disabled
              :placeholder="t('请选择收款账户')"
              :style="{ width: '90%' }"
            >
              <el-option
                v-for="(item, index) in paymentChannelList"
                :key="index"
                :disabled="item.disabled"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="trade_remark">
          <el-input
            v-model="form.trade_remark"
            clearable
            :placeholder="t('请输入备注')"
            :style="{ width: '90%' }"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">{{ t('取消') }}</el-button>
        <el-button type="primary" @click="save">{{ t('确定') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {translate as t} from "@/i18n";
import { doOfflinePay } from '@/api/pay/consumeDeposit'
import { ref } from 'vue'
import {useSettingsStore} from "@/store/modules/settings";

export default defineComponent({
  name: 'PaymentEdit',
  components: {
  },
  emits: ["fetch-data"],
  setup(props, {emit}) {
    const $message = inject('$message')
    const settingsStore = useSettingsStore()
    const state = reactive({
      formRef: null,
      form:{
        deposit_time: new Date(), // 默认当前时间,
        deposit_trade_no: undefined,
        deposit_total_fee: undefined,
        payment_channel_id: 1422,
      },
      rules: {
        deposit_trade_no: [
          {
            required: true,
            message: t('请输入支付凭证号'),
            trigger: 'blur',
          },
        ],
        deposit_total_fee: [
          {
            required: true,
            message: t('请输入付款金额'),
            trigger: 'blur',
          },
        ],
      },
      paymentChannelList:settingsStore.getConfigs.payment_channel_list
    })

    const dialogFormVisible = ref(false)

    const showEdit = (row) => {
      if (!row) {
        state.title = t('添加')
      } else {
        state.title = t('编辑')
        state.form.order_id = row.order_id
        state.form.deposit_total_fee = row.deposit_total_fee
      }
      dialogFormVisible.value = true
    }

    const close = () => {
      state.form = {
        deposit_time: new Date(), // 默认当前时间,
        deposit_total_fee: undefined,
        payment_channel_id: 1422,
      }
      state['formRef'].resetFields()
      dialogFormVisible.value = false
    }

    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          const params = Object.assign({}, state.form)
          params.deposit_time = state.form.deposit_time.getTime();
          const { msg, status } = await doOfflinePay(params)
          if (200 == status) {
            $message(msg, 'success')
            emit('fetch-data')
            close()
          } else {
            $message(msg, 'error')
          }
        } else {
          return false
        }
      })
    }

    return {
      t,
      ...toRefs(state),
      dialogFormVisible,
      showEdit,
      close,
      save,
    }
  },
})
</script>
