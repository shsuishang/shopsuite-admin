<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('物流名称')" prop="logistics_name">
        <el-input v-model="form.logistics_name" clearable :placeholder="t('请输入物流名称')"/>
      </el-form-item>
      <el-form-item :label="t('快递公司')" prop="express_id">
        <el-select
          v-model="form.express_id"
          class="filter-item"
          clearable
          :placeholder="t('请选择快递公司')"
          @change="handleExpressChange"
        >
          <el-option
            v-for="item in expressList"
            :key="item"
            :label="item.express_name"
            :value="item.express_id"
          />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item :label="t('联系手机')" prop="logistics_intl">
            <el-select v-model="form.logistics_intl" :style="{ width: '100%' }">
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
          <el-form-item label-width="0" prop="logistics_mobile">
            <el-input
              v-model="form.logistics_mobile"
              clearable
              :placeholder="t('请输入联系手机')"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="t('联系人')" prop="logistics_contacter">
        <el-input v-model="form.logistics_contacter" clearable :placeholder="t('请输入联系人')"/>
      </el-form-item>
      <el-form-item :label="t('联系地址')" prop="logistics_address">
        <el-input v-model="form.logistics_address" clearable :placeholder="t('请输入联系地址')"/>
      </el-form-item>
      <el-form-item :label="t('是否为默认')" prop="logistics_is_default">
        <el-switch
          v-model="form.logistics_is_default"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('是否启用')" prop="logistics_is_enable">
        <el-switch
          v-model="form.logistics_is_enable"
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
  import {doEdit, doAdd} from '@/api/shop/storeExpressLogistics'
  import {getExpressList} from '@/api/sys/expressBase'

  export default defineComponent({
    name: 'StoreExpressLogisticsEdit',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          logistics_number: 0,
          logistics_fee: null,
          logistics_is_default: false,
          logistics_is_enable: false,
        },
        title: '',
        expressList: [],
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
        dialogFormVisible: false,
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
      })

      const rules = reactive({
        logistics_name: [{required: true, trigger: 'blur', message: t('请输入物流名称')}],
        express_id: [{required: true, trigger: 'change', message: t('请选择快递公司')}],
        logistics_intl: [{required: true, trigger: 'change', message: t('请选择国家编码')}],
        logistics_mobile: [{required: true, trigger: 'blur', message: t('请输入联系手机')}],
        logistics_contacter: [{required: true, trigger: 'blur', message: t('请输入联系人')}],
        logistics_address: [{required: true, trigger: 'blur', message: t('请输入联系地址')}],
      })


      const getExpressIdList = async () => {
        const { data } = await getExpressList({size:500,})
        state.expressList = data.items
      }

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
          logistics_number: 0,
          logistics_fee: null,
          logistics_is_default: false,
          logistics_is_enable: false,
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

      const handleExpressChange = (value) => {
        const selectedExpress = state.expressList.find((item) => item.express_id === value);
        if (selectedExpress) {
          state.form.express_name = selectedExpress.express_name;
        }
      };

      onMounted(() => {
        getExpressIdList()
      })

      return {
        t: t,
        ...toRefs(state),
        showEdit,
        close,
        rules,
        save,
        handleExpressChange,
      }
    },
  })
</script>
<style lang="scss">
  .el-input__wrapper{
    width: 100%;
  }
</style>
