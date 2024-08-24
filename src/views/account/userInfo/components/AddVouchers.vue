<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="400"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('优惠券')" prop="activity_id">
        <el-select
          v-model="form.activity_id"
          clearable
          :placeholder="t('请选择优惠券')"
          :style="{width: '100%'}"
        >
          <el-option
            v-for="(item, index) in vouchers"
            :key="index"
            :label="item.activity_name"
            :value="item.activity_id"
          />
        </el-select>
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
  import {addVouchers} from '@/api/account/userInfo'
  import {getList as getVoucherList} from '@/api/marketing/activityBase'
  import {hasPermission} from "@/utils/permission";

  export default defineComponent({
    name: 'AddVouchers',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          activity_id: '',
          user_ids: '',
        },
        vouchers: [],
        title: '批量发放优惠券',
        dialogFormVisible: false,

      })

      const showAddVouchers = (row) => {
        if (row) {
          state.form.user_ids = row
          state.dialogFormVisible = true
        } else {
          state.dialogFormVisible = false
        }
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
            const { msg, status } = await addVouchers(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            emit('fetch-data')
            close()
          }
        })
      }

      const rules = reactive({
        activity_id: [{required: true, trigger: 'change', message: t('请选择优惠券')}],
      })

      const getVouchers = async () => {
        const params = {
          activity_type_id: 1105,
          activity_state: 1,
          size: 500,
        }
        const { data } = await getVoucherList(params)
        state.vouchers = data.items
      }

      onMounted(() => {
        if (hasPermission("/manage/shop/userVoucher/list")) {
          getVouchers()
        }
      })

      return {
        t: t,
        ...toRefs(state),
        showAddVouchers,
        close,
        rules,
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
