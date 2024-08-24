<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('收件人')" prop="ud_name">
        <el-input v-model="form.ud_name" clearable :placeholder="t('收件人')"/>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item :label="t('手机号码')" prop="ud_intl">
            <el-select v-model="form.ud_intl" :style="{ width: '100%' }">
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
        <el-col :span="14">
          <el-form-item label-width="0" prop="ud_mobile">
            <el-input
              v-model="form.ud_mobile"
              clearable
              :placeholder="t('请输入手机号码')"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="t('发货地址')">
        <Area
          v-model="selectArea"
          :placeholder="t('请选择发货地址')"
          width="500"
        />
      </el-form-item>
      <el-form-item :label="t('详细地址')" prop="ud_address">
        <el-input v-model="form.ud_address" clearable :placeholder="t('详细地址')"/>
      </el-form-item>
      <el-form-item label="默认地址" prop="ud_is_default">
        <el-radio-group v-model="form.ud_is_default" size="medium">
          <el-radio
            v-for="(item, index) in ud_is_defaultOptions"
            :key="index"
            :disabled="item.disabled"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
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
  import {doAdd} from '@/api/account/userDeliveryAddress'
  import Area from "@sslib/components/MsArea/Area";

  export default defineComponent({
    name: 'UserDeliveryAddressEdit',
    components: { Area },
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          ud_is_default: 0,
        },
        title: '',
        dialogFormVisible: false,
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
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
        ud_is_defaultOptions: [
          {
            label: t('非默认'),
            value: 0,
          },
          {
            label: t('默认'),
            value: 1,
          }
        ],
        selectArea: {
          province: {},
          city: {},
          district: {},
        },

      })

      const rules = reactive({
        ud_name: [{required: true, trigger: 'blur', message: t('请输入收件人姓名')}],
        ud_mobile: [{required: true, trigger: 'blur', message: t('请输入手机号码')}],
        ud_address: [{required: true, trigger: 'blur', message: t('请输入详细地址')}],
      })

      const showEdit = (row) => {
        state.title = t('添加地址')
        state.form.user_id = row
        state.dialogFormVisible = true
      }
      const close = () => {
        state.selectArea = {
          province: {},
          city: {},
          district: {},
        }
        state['formRef'].resetFields()
        state.form = {
          ud_is_default: 0,
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          saveArea()
          if (valid) {
            const { msg, status } = await doAdd(state.form)
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

      const saveArea = () => {
        const province = state.selectArea.province
        const city = state.selectArea.city
        const district = state.selectArea.district
        state.form.ud_province_id = province.code
        state.form.ud_province = province.name
        state.form.ud_city_id = city.code
        state.form.ud_city = city.name
        state.form.ud_county_id = district.code
        state.form.ud_county = district.name
      }

      return {
        t: t,
        ...toRefs(state),
        showEdit,
        saveArea,
        rules,
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
  .city-picker-span {
    width: 380px;
  }
</style>
