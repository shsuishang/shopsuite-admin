<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    :title="title"
    width="40%"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item :label="t('运费金额')" prop="fee_amount">
        <el-input
          v-model="form.fee_amount"
          clearable
          :placeholder="t('请输入运费金额')"
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
import {translate as t} from '@/i18n'
import { editShoppingFee } from '@/api/trade/orderBase';

export default {
  name: 'ShippingFeeEdit',
  setup() {
    const state = reactive({
      formRef: null,
      loading: false,
      form: { fee_amount: 0 },
      dialogFormVisible: false,
      rules: {
        fee_amount: [
          {
            required: true,
            message: '请输入运费金额',
            trigger: 'blur',
          },
        ],
      }
    });

    const showEdit = (order_id, fee_amount) => {
      state.title = t('修改邮费');
      state.form = {
        order_id: order_id,
        fee_amount: fee_amount,
      };
      state.dialogFormVisible = true;
    };

    const close = () => {
      state.form = { fee_amount: 0 };
      state.dialogFormVisible = false;
    };

    const save = async () => {
      state.loading = true;
      const valid = await state.formRef.validate();
      if (valid) {
        const { msg, status } = await editShoppingFee(state.form);
        if (status === 200) {
          $message(msg, 'success');
        } else {
          $message(msg, 'error');
        }
        $emit('fetch-data');
        state.loading = false;
        close();
      } else {
        state.loading = false;
        return false;
      }
    };

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      close,
      save,
    };
  },
};
</script>
