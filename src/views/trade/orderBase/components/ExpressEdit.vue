<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    :title="title"
    width="30%"
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
      <el-form-item class="date-box" :label="t('发货日期')" prop="logistics_time">
        <el-date-picker
          v-model="form.logistics_time"
          clearable
          :placeholder="t('选择发货日期')"
          :style="{ width: '100%' }"
          type="datetime"
        />
      </el-form-item>
      <el-form-item :label="t('物流公司')" prop="logistics_id">
        <el-select
          v-model="form.logistics_id"
          clearable
          :placeholder="t('请选择物流公司')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in expressList"
            :key="item.logistics_id"
            :label="item.logistics_name"
            :value="item.logistics_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('发货地址')" prop="ss_id">
        <el-select
          v-model="form.ss_id"
          clearable
          :placeholder="t('请选择发货地址')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in addressList"
            :key="item.ss_id"
            :label="item.ss_address"
            :value="item.ss_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('物流单号')" prop="order_tracking_number">
        <el-input
          v-model="form.order_tracking_number"
          clearable
          :placeholder="t('请输入物流单号')"
          :style="{ width: '100%' }"
        />
      </el-form-item>
      <el-form-item :label="t('物流备注')" prop="logistics_explain">
        <el-input
          v-model="form.logistics_explain"
          clearable
          :placeholder="t('请输入物流备注')"
          :style="{ width: '100%' }"
        />
      </el-form-item>
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
import {getList as getAddressList} from '@/api/shop/storeShippingAddress'
import {getList as getExpressList } from '@/api/shop/storeExpressLogistics'
import { doAdd, doEdit } from '@/api/trade/orderLogistics'
import {shipping}  from '@/api/trade/orderBase'
import { reactive } from 'vue'

export default {
  name: 'ExpressEdit',
  props:{
    shipping: {
      type: Boolean,
      default: false
    },
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        logistics_time: null, // 默认当前时间,
      },
      rules: {
        logistics_time: [
          {
            required: true,
            message: '请选择发货日期',
            trigger: 'blur',
          },
        ],
        logistics_id: [
          {
            required: true,
            message: '请输入物流公司',
            trigger: 'blur',
          },
        ],
        ss_id: [
          {
            required: true,
            message: '请输入发货地址',
            trigger: 'blur',
          },
        ],
        order_tracking_number: [
          {
            required: true,
            message: '请输入物流单号',
            trigger: 'blur',
          },
        ],
      },
      title: t('发货确认'),
      dialogFormVisible: false,
      // 是否是修改
      isUpdate: false,
      addressList: [],
      expressList: [],
    })

    state.form.logistics_time = new Date()

    const showEdit = (row) => {
      console.info(row)
      if (row.order_logistics_id) {
        state.isUpdate = true
        state.form = {
          order_id: row.order_id,
          stock_bill_id: row.stock_bill_id,
          logistics_id: row.logistics_id,
          logistics_explain: row.logistics_explain,
          order_tracking_number: row.order_tracking_number,
          logistics_time: new Date(row.logistics_time),
          order_logistics_id: row.order_logistics_id,
          ss_id: row.ss_id,
        }
      } else {
        dispose()
        state.isUpdate = false
        state.form.order_id = row.order_id
        state.form.stock_bill_id = row.stock_bill_id
      }
      state.dialogFormVisible = true
    }

    const dispose = () => {
      const ss_is_default = state.addressList.filter((s) => 1 === s.ss_is_default)
      if (ss_is_default.length > 0) {
        state.form.ss_id = ss_is_default[0].ss_id
      }
      const logistics_is_default = state.expressList.filter(
        (s) => 1 === s.logistics_is_default
      )
      if (logistics_is_default.length > 0) {
        state.form.logistics_id = logistics_is_default[0].logistics_id
      }
    }

    const close = () => {
      state.form = { logistics_time: null, }
      state.form.logistics_time = new Date()

      state['formRef'].resetFields()
      state.dialogFormVisible = false
    }

    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          const params = Object.assign({}, state.form)
          params.logistics_time = state.form.logistics_time.getTime()
          if (state.isUpdate) {
            const { msg, status } = await doEdit(params)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            //判断是否整单发货 还是 出库单发货
            if (props.shipping) {
              const { msg, status } = await shipping(params)

              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
            } else {
              const { msg, status } = await doAdd(params)

              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
            }
          }

          emit('fetch-data')
          close()
        }
      })
    }

    const getAddress = async () => {
      const { data } = await getAddressList()
      if (data && data.items.length > 0) {
        state.addressList = data.items
      }
    }

    const getExpress = async () => {
      const { data } = await getExpressList({logistics_is_enable: 1})
      if (data && data.items.length > 0) {
        state.expressList = data.items
      }
    }

    onMounted(() => {
      getExpress()
      getAddress()
    })

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      dispose,
      close,
      save,
    }
  },
}
</script>

<style lang="scss" scoped>


:deep(.date-box) {
  .el-input__wrapper{
    width: 100%;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__wrapper {
    width: 100%;
  }
}
</style>
