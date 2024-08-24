<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('')" prop="points_log_id">
        <el-input v-model="form.points_log_id" clearable :disabled="isUpdate" :placeholder="t('')"/>
      </el-form-item>
      <el-form-item :label="t('类型')" prop="points_kind_id">
        <el-select v-model="form.points_kind_id" clearable :placeholder="t('请选择类型')">
          <el-option
            v-for="(item, index) in points_kind_id_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('积分类型')" prop="points_type_id">
        <el-select v-model="form.points_type_id" :placeholder="t('请选择积分类型')">
          <el-option
            v-for="(item, index) in points_type_id_options"
            :key="index"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('会员编号')" prop="user_id">
        <el-input v-model="form.user_id" clearable :placeholder="t('会员编号')"/>
      </el-form-item>
      <el-form-item :label="t('积分变动值')" prop="points_log_points">
        <el-input v-model="form.points_log_points" clearable :placeholder="t('可用积分')"/>
      </el-form-item>
      <el-form-item :label="t('当前积分')" prop="user_points">
        <el-input v-model="form.user_points" clearable :placeholder="t('当前积分')"/>
      </el-form-item>
      <el-form-item :label="t('描述')" prop="points_log_desc">
        <el-input v-model="form.points_log_desc" clearable :placeholder="t('描述')"/>
      </el-form-item>
      <el-form-item v-if="false" :label="t('所属店铺')" prop="store_id">
        <el-input v-model="form.store_id" clearable :placeholder="t('所属店铺')"/>
      </el-form-item>
      <el-form-item :label="t('积分日期')" prop="points_log_date">
        <el-date-picker
          v-model="form.points_log_date"
          clearable
          :placeholder="t('积分日期')"
          style="width:100%;"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item :label="t('交互会员')" prop="user_id_other">
        <el-input v-model="form.user_id_other" clearable :placeholder="t('交互会员')"/>
      </el-form-item>
      <el-form-item :label="t('领取状态')" prop="points_log_state">
        <el-switch
          v-model="form.points_log_state"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('关联单号')" prop="ext_id">
        <el-input v-model="form.ext_id" clearable :placeholder="t('关联单号')"/>
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
import {doEdit, doAdd} from '@/api/pay/userPointsHistory'

export default defineComponent({
  name: 'UserPointsHistoryEdit',
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
      points_kind_id_options : [
        {
          value: 1,
          label: '获取积分'
        },
        {
          value: 2,
          label: '消费积分'
        },
      ],
      points_type_id_options : [
        {
          value: 1,
          label: '会员注册'
      },
        {
          value: 2,
          label: '会员登录'
        },
        {
          value: 3,
          label: '商品评论'
        },
        {
          value: 4,
          label: '购买商品'
        },
        {
          value: 5,
          label: '管理员操作'
        },
        {
          value: 7,
          label: '积分换购商品'
        },
        {
          value: 8,
          label: '积分兑换代金券'
        },
      ]
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
