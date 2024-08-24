<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('')" prop="comment_id">
        <el-input v-model="form.comment_id" clearable :disabled="isUpdate" :placeholder="t('')"/>
      </el-form-item>
      <el-form-item :label="t('订单编号')" prop="order_id">
        <el-input v-model="form.order_id" clearable :placeholder="t('订单编号')"/>
      </el-form-item>
      <el-form-item :label="t('产品编号')" prop="product_id">
        <el-input v-model="form.product_id" clearable :placeholder="t('产品编号')"/>
      </el-form-item>
      <el-form-item :label="t('商品编号')" prop="item_id">
        <el-input v-model="form.item_id" clearable :placeholder="t('商品编号')"/>
      </el-form-item>
      <el-form-item :label="t('商品规格')" prop="item_name">
        <el-input v-model="form.item_name" clearable :placeholder="t('商品规格')"/>
      </el-form-item>
      <el-form-item :label="t('卖家店铺编号-冗余')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('卖家店铺编号-冗余')"/>
      </el-form-item>
      <el-form-item :label="t('店铺名称')" prop="store_name">
        <el-input v-model="form.store_name" clearable :placeholder="t('店铺名称')"/>
      </el-form-item>
      <el-form-item :label="t('买家编号')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('买家编号')"/>
      </el-form-item>
      <el-form-item :label="t('买家姓名')" prop="user_name">
        <el-input v-model="form.user_name" clearable :placeholder="t('买家姓名')"/>
      </el-form-item>
      <el-form-item :label="t('获得积分-冗余，独立表记录')" prop="comment_points">
        <el-input v-model="form.comment_points" clearable :placeholder="t('获得积分-冗余，独立表记录')"/>
      </el-form-item>
      <el-form-item :label="t('评价星级1-5积分')" prop="comment_scores">
        <el-input v-model="form.comment_scores" clearable :placeholder="t('评价星级1-5积分')"/>
      </el-form-item>
      <el-form-item :label="t('评价内容')" prop="comment_content">
        <el-input v-model="form.comment_content" clearable :placeholder="t('评价内容')"/>
      </el-form-item>
      <el-form-item :label="t('评论上传的图片')" prop="comment_image">
        <el-input v-model="form.comment_image" clearable :placeholder="t('评论上传的图片')"/>
      </el-form-item>
      <el-form-item :label="t('有帮助')" prop="comment_helpful">
        <el-input v-model="form.comment_helpful" clearable :placeholder="t('有帮助')"/>
      </el-form-item>
      <el-form-item :label="t('无帮助')" prop="comment_nohelpful">
        <el-input v-model="form.comment_nohelpful" clearable :placeholder="t('无帮助')"/>
      </el-form-item>
      <el-form-item :label="t('评价时间')" prop="comment_time">
        <el-date-picker
          v-model="form.comment_time"
          clearable
          :placeholder="t('评价时间')"
          style="width:100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="t('匿名评价')" prop="comment_is_anonymous">
        <el-input v-model="form.comment_is_anonymous" clearable :placeholder="t('匿名评价')"/>
      </el-form-item>
      <el-form-item :label="t('评价信息的状态')" prop="comment_enable">
        <el-input v-model="form.comment_enable" clearable :placeholder="t('评价信息的状态')"/>
      </el-form-item>
      <el-form-item :label="t('描述相符评分 - order_buyer_evaluation_status , 评价状态改变后不需要再次评论，根据订单走')" prop="comment_store_desc_credit">
        <el-input v-model="form.comment_store_desc_credit" clearable :placeholder="t('描述相符评分 - order_buyer_evaluation_status , 评价状态改变后不需要再次评论，根据订单走')"/>
      </el-form-item>
      <el-form-item :label="t('服务态度评分 - order_buyer_evaluation_status')" prop="comment_store_service_credit">
        <el-input v-model="form.comment_store_service_credit" clearable :placeholder="t('服务态度评分 - order_buyer_evaluation_status')"/>
      </el-form-item>
      <el-form-item :label="t('发货速度评分 - order_buyer_evaluation_status')" prop="comment_store_delivery_credit">
        <el-input v-model="form.comment_store_delivery_credit" clearable :placeholder="t('发货速度评分 - order_buyer_evaluation_status')"/>
      </el-form-item>
      <el-form-item :label="t('门店编号')" prop="chain_id">
        <el-input v-model="form.chain_id" clearable :placeholder="t('门店编号')"/>
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
import {doEdit, doAdd} from '@/api/pt/productComment'

export default defineComponent({
  name: 'ProductCommentEdit',
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
