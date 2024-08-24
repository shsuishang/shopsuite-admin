<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('用户编号')" prop="user_id">
        <el-input v-model="form.user_id" clearable :disabled="isUpdate" :placeholder="t('用户编号')"/>
      </el-form-item>
      <el-form-item :label="t('权限角色')" prop="user_role_id">
        <el-select
          v-model="form.user_role_id"
          clearable
          :disabled="isUpdate && false"
          :placeholder="t('请选择权限角色')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in roleOptions"
            :key="index"
            :disabled="item.disabled"
            :label="item.user_role_name"
            :value="item.user_role_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item  :label="t('角色选择')" prop="role_id">
        <el-radio-group v-model="form.role_id" @change="handleRoleChange">
          <el-radio :label="9">{{ t('管理员') }}</el-radio>
          <el-radio v-if="configs.chain_enable" :label="3">{{ t('门店') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  v-if="form.role_id==3"  prop="chain_id" >
        <el-select
          v-model="form.chain_id"
          clearable
          :disabled="isUpdate && false"
          :placeholder="t('请选择门店')"
          :style="{ width: '100%' }">
          <el-option
            v-for="(item,index) in items"
            :key="index"
            :disabled="item.disabled"
            :label="item.chain_name"
            :value="item.chain_id"
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
import {doEdit, doAdd} from '@/api/admin/userAdmin'
import {getList} from '@/api/admin/userRole'
import {useSettingsStore} from "@/store/modules/settings";

export default defineComponent({
  name: 'UserAdminEdit',
  props: {},
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')
    const settingsStore = useSettingsStore()
    const state = reactive({
      formRef: null,
      form: {},
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      roleOptions: [],
      items: [],
    })

    const rules = reactive({
      //对el-input输入框的验证，trigger的值选blur，即失去焦点时进行验证。
      //trigger的值选择change，即当值发生变化时就进行验证。
      user_id: [{required: true, trigger: 'blur', message: t('请输入用户编号')}],
      user_role_id: [{required: true, trigger: 'change', message: t('请选择权限角色')}],
      chain_id: [{required: true, trigger: 'change', message: t('角色选择')}],
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
      state.form = {}
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          if(state.form.role_id == 3) {
            if(state.form.chain_id == 0) {
              $message("请选择门店",'error')
              return false;
            }
          }
          if(state.form.role_id == 9) {
            state.form.chain_id=0
          }
          if (state.isUpdate) {
            const {msg, status} = await doEdit(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const {msg, status} = await doAdd(state.form)
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

    onMounted(() => {
    })

    const initLevel = async () => {
      const {data} = await getList({size: 500,})
      state.roleOptions = data.items
    }

    onMounted(() => {
      initLevel()
    })

    return {
      t: t,
      configs: settingsStore.getConfigs,
      ...toRefs(state),
      showEdit,
      close,
      rules,
      save,
    }
  },


  methods: {
        handleRoleChange() {
          //if(this.form.role_id==9){
        //        this.form.chain_id=0;
         // }
        },
        handlechainChange() {
          if(state.form.role_id==3){
            state.form.chain_id=9
          }
          else{
            state.form.chain_id=3
          }
        }
      }
})
</script>
<style lang="scss">
.el-input__wrapper{
  width: 100%;
}
</style>
