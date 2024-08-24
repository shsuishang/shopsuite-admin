<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('商品编号-SKU编号')" prop="item_id">
        <el-input v-model="form.item_id" clearable :disabled="isUpdate" :placeholder="t('商品编号-SKU编号')"/>
      </el-form-item>
      <el-form-item :label="t('副标题')" prop="item_name">
        <el-input v-model="form.item_name" clearable :placeholder="t('副标题')"/>
      </el-form-item>
      <el-form-item :label="t('产品编号')" prop="product_id">
        <el-input v-model="form.product_id" clearable :placeholder="t('产品编号')"/>
      </el-form-item>
      <el-form-item :label="t('颜色SKU，规格值')" prop="color_id">
        <el-input v-model="form.color_id" clearable :placeholder="t('颜色SKU，规格值')"/>
      </el-form-item>
      <el-form-item :label="t('是否为默认展示的商品，必须为item_enable')" prop="item_is_default">
        <el-input v-model="form.item_is_default" clearable :placeholder="t('是否为默认展示的商品，必须为item_enable')"/>
      </el-form-item>
      <el-form-item :label="t('SKU商家编码')" prop="item_number">
        <el-input v-model="form.item_number" clearable :placeholder="t('SKU商家编码')"/>
      </el-form-item>
      <el-form-item :label="t('条形码')" prop="item_barcode">
        <el-input v-model="form.item_barcode" clearable :placeholder="t('条形码')"/>
      </el-form-item>
      <el-form-item :label="t('成本价')" prop="item_cost_price">
        <el-input v-model="form.item_cost_price" clearable :placeholder="t('成本价')"/>
      </el-form-item>
      <el-form-item :label="t('商品价格')" prop="item_unit_price">
        <el-input v-model="form.item_unit_price" clearable :placeholder="t('商品价格')"/>
      </el-form-item>
      <el-form-item :label="t('市场价')" prop="item_market_price">
        <el-input v-model="form.item_market_price" clearable :placeholder="t('市场价')"/>
      </el-form-item>
      <el-form-item :label="t('积分价格')" prop="item_unit_points">
        <el-input v-model="form.item_unit_points" clearable :placeholder="t('积分价格')"/>
      </el-form-item>
      <el-form-item :label="t('商品库存')" prop="item_quantity">
        <el-input v-model="form.item_quantity" clearable :placeholder="t('商品库存')"/>
      </el-form-item>
      <el-form-item :label="t('商品冻结库存')" prop="item_quantity_frozen">
        <el-input v-model="form.item_quantity_frozen" clearable :placeholder="t('商品冻结库存')"/>
      </el-form-item>
      <el-form-item :label="t('库存预警值')" prop="item_warn_quantity">
        <el-input v-model="form.item_warn_quantity" clearable :placeholder="t('库存预警值')"/>
      </el-form-item>
      <el-form-item :label="t('商品规格序列化')" prop="item_spec">
        <el-input v-model="form.item_spec" clearable :placeholder="t('商品规格序列化')"/>
      </el-form-item>
      <el-form-item :label="t('商品规格值编号')" prop="spec_item_ids">
        <el-input v-model="form.spec_item_ids" clearable :placeholder="t('商品规格值编号')"/>
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="item_enable">
        <el-input v-model="form.item_enable" clearable :placeholder="t('是否启用')"/>
      </el-form-item>
      <el-form-item :label="t('被改动')" prop="item_is_change">
        <el-input v-model="form.item_is_change" clearable :placeholder="t('被改动')"/>
      </el-form-item>
      <el-form-item :label="t('商品重量')" prop="item_weight">
        <el-input v-model="form.item_weight" clearable :placeholder="t('商品重量')"/>
      </el-form-item>
      <el-form-item :label="t('商品体积')" prop="item_volume">
        <el-input v-model="form.item_volume" clearable :placeholder="t('商品体积')"/>
      </el-form-item>
      <el-form-item :label="t('微小店分销佣金')" prop="item_fx_commission">
        <el-input v-model="form.item_fx_commission" clearable :placeholder="t('微小店分销佣金')"/>
      </el-form-item>
      <el-form-item :label="t('返利额度')" prop="item_rebate">
        <el-input v-model="form.item_rebate" clearable :placeholder="t('返利额度')"/>
      </el-form-item>
      <el-form-item :label="t('供应商SKU编号')" prop="item_src_id">
        <el-input v-model="form.item_src_id" clearable :placeholder="t('供应商SKU编号')"/>
      </el-form-item>
      <el-form-item :label="t('商品分类')" prop="category_id">
        <el-input v-model="form.category_id" clearable :placeholder="t('商品分类')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('所属店铺')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('所属店铺')"/>
      </el-form-item>
      <el-form-item :label="t('版本')" prop="version">
        <el-input v-model="form.version" clearable :placeholder="t('版本')"/>
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
import {doEdit} from '@/api/pt/productItem'

export default defineComponent({
  name: 'ProductItemEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

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
