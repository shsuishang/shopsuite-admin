<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="140px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('发票编号')" prop="order_invoice_id">
        <el-input v-model="form.order_invoice_id" clearable :disabled="isUpdate" :placeholder="t('请输入发票编号')"/>
      </el-form-item>
      <el-form-item :label="t('订单编号')" prop="order_id">
        <el-input v-model="form.order_id" clearable :placeholder="t('请输入订单编号')" @change="getOrderDetail"/>
      </el-form-item>
      <el-form-item :label="t('所属用户')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('请输入所属用户')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('店铺编号')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('请输入店铺编号')"/>
      </el-form-item>
      <el-form-item :label="t('发票抬头')" prop="invoice_title">
        <el-select
          v-model="form.invoice_title"
          clearable
          filterable
          :placeholder="t('请选择发票抬头')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in invoiceOptions"
            :key="index"
            :label="item.invoice_title"
            :value="item.invoice_title"
            @click="chooseInvoice(item)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('发票内容')" prop="invoice_content">
        <el-input v-model="form.invoice_content" clearable :placeholder="t('请输入发票内容')"  type="textarea"/>
      </el-form-item>
      <el-form-item :label="t('开票金额')" prop="invoice_amount">
        <el-input v-model="form.invoice_amount" clearable :placeholder="t('请输入开票金额')"/>
      </el-form-item>
      <el-form-item :label="t('纳税人识别号')" prop="invoice_company_code">
        <el-input v-model="form.invoice_company_code" clearable :placeholder="t('请输入纳税人识别号')"/>
      </el-form-item>
      <el-form-item :label="t('单位地址')" prop="invoice_address">
        <el-input v-model="form.invoice_address" clearable :placeholder="t('请输入单位地址')"/>
      </el-form-item>
      <el-form-item :label="t('单位电话')" prop="invoice_phone">
        <el-input v-model="form.invoice_phone" clearable :placeholder="t('请输入单位电话')"/>
      </el-form-item>
      <el-form-item :label="t('开户银行')" prop="invoice_bankname">
        <el-input v-model="form.invoice_bankname" clearable :placeholder="t('请输入开户银行')"/>
      </el-form-item>
      <el-form-item :label="t('银行账号')" prop="invoice_bankaccount">
        <el-input v-model="form.invoice_bankaccount" clearable :placeholder="t('请输入银行账号')"/>
      </el-form-item>
      <el-form-item :label="t('收票人')" prop="invoice_contact_name">
        <el-input v-model="form.invoice_contact_name" clearable :placeholder="t('请输入收票人')"/>
      </el-form-item>
      <el-form-item :label="t('收票人地区')" prop="invoice_contact_area">
        <el-input v-model="form.invoice_contact_area" clearable :placeholder="t('请输入收票人地区')"/>
      </el-form-item>
      <el-form-item :label="t('收票详细地址')" prop="invoice_contact_address">
        <el-input v-model="form.invoice_contact_address" clearable :placeholder="t('请输入收票详细地址')"/>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item :label="t('手机号码')" prop="ss_intl">
            <el-select v-model="form.user_intl" :style="{ width: '100%' }">
              <el-option
                v-for="(item, index) in intlOptions"
                :key="index"
                :disabled="item.disabled"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label-width="0" prop="ss_mobile">
            <el-input
              v-model="form.user_mobile"
              clearable
              :placeholder="t('请输入手机号码')"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="t('用户邮箱')" prop="user_email">
        <el-input v-model="form.user_email" clearable :placeholder="t('请输入用户邮箱')"/>
      </el-form-item>
      <el-form-item :label="t('个人/公司')" prop="invoice_is_company">
        <el-radio-group v-model="form.invoice_is_company">
          <el-radio
            v-for="(item, index) in invoice_is_companys"
            :key="index"
            :disabled="item.disabled"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('发票种类')" prop="invoice_is_electronic">
        <el-radio-group v-model="form.invoice_is_electronic">
          <el-radio
            v-for="(item, index) in invoice_is_electronics"
            :key="index"
            :disabled="item.disabled"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('发票类型')" prop="invoice_type">
        <el-radio-group v-model="form.invoice_type">
          <el-radio
            v-for="(item, index) in invoice_types"
            :key="index"
            :disabled="item.disabled"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.invoice_is_electronic == 1" :label="t('电子发票链接')" prop="invoice_url">
        <el-input v-model="form.invoice_url" clearable :placeholder="t('请输入电子发票链接')"/>
      </el-form-item>
      <el-form-item :label="t('开票状态')" prop="invoice_status">
        <el-switch
          v-model="form.invoice_status"
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
import {doEdit, doAdd} from '@/api/trade/orderInvoice'
import {getList} from '@/api/account/userInvoice';
import {getDetail} from "@/api/trade/orderBase";

export default defineComponent({
  name: 'OrderInvoiceEdit',
  components: {},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        invoice_is_company: true,
        invoice_is_electronic: 1,
        invoice_type: 1,
        invoice_status: false,
        store_id: 0,
      },
      title: '',
      invoiceOptions: [],
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      invoice_is_companys: [
        {
          label: '个人',
          value: false,
        },
        {
          label: '公司',
          value: true,
        },
      ],
      invoice_is_electronics: [
        {
          label: '纸质发票',
          value: 0,
        },
        {
          label: '电子发票',
          value: 1,
        },
      ],
      invoice_types: [
        {
          label: '普通发票',
          value: 1,
        },
        {
          label: '增值税专用发票',
          value: 2,
        },
      ],
      intlOptions: [
        {
          label: t('简中（+86）'),
          value: '+86',
        },
        {
          label: 'U.S.A(+1)',
          value: '+1',
        },
        {
          label: 'عربي ، (+966)',
          value: '966+',
        },
        {
          label: t('日本語(+81)'),
          value: '+81',
        },
      ],
    })

    const rules = reactive({
      order_id: [{required: true, trigger: 'blur', message: t('请输入订单编号')}],
      invoice_phone: [{required: true, trigger: 'blur', message: t('请输入单位电话')}],
      invoice_contact_name: [{required: true, trigger: 'blur', message: t('请输入收票人')}],
      invoice_contact_area: [{required: true, trigger: 'blur', message: t('请输入收票人地区')}],
      invoice_contact_address: [{required: true, trigger: 'blur', message: t('请输入收票详细地址')}],
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
    const initInvoice = async () => {
      const { data } = await getList({user_id: state.form.user_id, size:500,})
      state.invoiceOptions = data.items
    }

    const getOrderDetail = async () => {
      const order_id = state.form.order_id
      if (order_id) {
        const {data, status} = await getDetail({order_id: order_id})

        if (200 == status) {
          state.form.user_id = data.user_id
          state.form.invoice_content = data.order_title
          state.form.invoice_amount = data.order_payment_amount
          await initInvoice()
        } else {
          $message(t('订单不存在'), 'error')
          state.form.order_id = ''
        }
      }
    }

    const chooseInvoice = async (row) => {
      if (row) {
        state.form.invoice_title = row.invoice_title
        state.form.invoice_company_code = row.invoice_company_code
        state.form.invoice_address = row.invoice_address
        state.form.invoice_phone = row.invoice_phone
        state.form.invoice_bankname = row.invoice_bankname
        state.form.invoice_bankaccount = row.invoice_bankaccount
        state.form.invoice_contact_name = row.invoice_contact_name
        state.form.invoice_contact_area = row.invoice_contact_area
        state.form.invoice_contact_address = row.invoice_contact_address
        state.form.invoice_is_company = row.invoice_is_company
        state.form.invoice_is_electronic = row.invoice_is_electronic
        state.form.invoice_type = row.invoice_type
      }
    }

    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        invoice_is_company: true,
        invoice_is_electronic: 1,
        invoice_type: 1,
        invoice_content: '',
        invoice_status: false,
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
      rules,
      initInvoice,
      getOrderDetail,
      chooseInvoice,
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
