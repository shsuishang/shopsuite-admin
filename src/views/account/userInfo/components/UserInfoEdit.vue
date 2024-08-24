<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="t('用户账号')" prop="user_account">
        <el-input v-model="form.user_account" clearable :disabled="isUpdate" :placeholder="t('用户账号')"/>
      </el-form-item>
      <el-form-item :label="t('用户昵称')" prop="user_nickname">
        <el-input v-model="form.user_nickname" clearable :placeholder="t('用户昵称')"/>
      </el-form-item>
      <el-form-item :label="t('用户头像')" prop="user_avatar">
        <pic-upload
          ref="picUpRef"
          v-model="form.user_avatar"
          height="80"
          :limit="1"
          width="80"
        />
      </el-form-item>
      <el-form-item :label="t('状态')" prop="user_state">
        <el-radio-group
          v-model="form.user_state">
          <el-radio :label="1">已激活</el-radio>
          <el-radio :label="2">未激活</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row>
        <el-col :span="10">
          <el-form-item :label="t('手机号码')" prop="user_intl">
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
        <el-col :span="14">
          <el-form-item label-width="0" prop="user_mobile">
            <el-input
              v-model="form.user_mobile"
              clearable
              :placeholder="t('请输入联系手机')"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="t('性别')" prop="user_gender">
        <el-radio-group
          v-model="form.user_gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('生日')" prop="user_birthday">
        <el-date-picker
          v-model="form.user_birthday"
          clearable
          :placeholder="t('生日')"
          style="width:100%;"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item :label="t('用户邮箱')" prop="user_email">
        <el-input v-model="form.user_email" clearable :placeholder="t('用户邮箱')"/>
      </el-form-item>
      <el-form-item :label="t('会员等级')" prop="user_level_id">
        <el-select
          v-model="form.user_level_id"
          clearable
          :disabled="isUpdate && false"
          :placeholder="t('请选择会员等级')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in LevelOptions"
            :key="index"
            :disabled="item.disabled"
            :label="item.user_level_name"
            :value="item.user_level_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('用户标签')" prop="tag_ids">
        <el-tree-select
          v-model="form.tag_ids"
          :data="tagGroupTreeList"
          :default-expand-all="isExpandTreeSelect"
          highlight-current
          multiple
          node-key="tag_id"
          :placeholder="t('请选择用户标签')"
          :props="{ value: 'tag_id', label: 'tag_title'}"
          style="width: 100%"
          value-key="tag_title"
        />
      </el-form-item>
      <el-form-item v-if="false" :label="t('认证状态')" prop="user_is_authentication">
        <el-input v-model="form.user_is_authentication" clearable :placeholder="t('认证状态')"/>
      </el-form-item>
      <el-form-item :label="t('来源用户')" prop="user_parent_id">
        <el-input v-model="form.user_parent_id" clearable :placeholder="t('来源用户编号')"/>
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
import {doEdit, doAdd} from '@/api/account/userInfo'
import {getList} from "@/api/account/userLevel";
import PicUpload from '@/plugins/MsUpload/PicUpload'
import {tree} from '@/api/account/userTagGroup'
import {isPhone} from "vue-plugin-utils";

export default defineComponent({
  name: 'UserInfoEdit',
  components:{PicUpload},
  props:{
  },
  emits: ['fetch-data','fetch-info'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const validatePhone = (rule, value, callback) => {
      if (!state.form.user_mobile || !isPhone(state.form.user_mobile)) {
        callback(new Error(t('请输入正确的手机号')))
      } else {
        callback()
      }
    }

    const state = reactive({
      formRef: null,
      form: {
        tag_ids: [],
      },
      rules: {
        user_account: [{required: true, trigger: 'blur', message: t('请输入用户账号')}],
        user_nickname: [{required: true, trigger: 'blur', message: t('请输入用户昵称')}],
        user_level_id: [{required: true, trigger: 'blur', message: t('请选择会员等级')}],
        user_intl: [{required: true, trigger: 'blur', message: t('请输入手机号码')}],
        user_mobile: [{required: true, trigger: 'blur', message: t('请输入手机号码')},{ validator: validatePhone, trigger: 'blur' }],
      },
      title: '',
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
      tagGroupTreeList: [],
      LevelOptions:[],
      isExpandTreeSelect:true,

    })

    const showEdit = (row) => {

      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)

        if (row.tag_ids) {
          state.form.tag_ids = row.tag_ids.split(',').map(Number)
        }
      }
      state.dialogFormVisible = true
    }

    const initLevel = async () => {
      const { data } = await getList({size:500,})
      state.LevelOptions = data.items
    }

    const getTree = async  () => {
      const { data } = await tree({size:500,})
      state.tagGroupTreeList = data
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
          const data = Object.assign({}, state.form)

          if (state.form.tag_ids) {
            data.tag_ids = state.form.tag_ids.join()
          }

          if (state.isUpdate) {
            const { msg, status } = await doEdit(data)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const { msg, status } = await doAdd(data)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          }

          emit('fetch-info')
          emit('fetch-data')
          close()
        }
      })
    }

    onMounted(() => {
      initLevel()
      getTree()
    })

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      close,
      validatePhone,
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
