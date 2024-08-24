<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="150px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('保障编号')" prop="contract_type_id">
        <el-input v-model="form.contract_type_id" clearable :disabled="isUpdate" :placeholder="t('保障编号')"/>
      </el-form-item>
      <el-form-item :label="t('保障名称')" prop="contract_type_name">
        <el-input v-model="form.contract_type_name" clearable :placeholder="t('保障名称')"/>
      </el-form-item>
      <el-form-item :label="t('保障简写')" prop="contract_type_desc">
        <el-input v-model="form.contract_type_desc" clearable :placeholder="t('保障简写')"/>
      </el-form-item>
      <div style="height: 500px">
        <el-form-item :label="t('保障描述')" prop="contract_type_text">
          <MsRichEditor
            ref="msRicheditorRef"
            v-model="form.contract_type_text"
            style="height: 400px;width: 100%"
          />
        </el-form-item>
      </div>
<!--      <el-form-item :label="t('保证金')" prop="contract_type_deposit">-->
<!--        <el-input v-model="form.contract_type_deposit" clearable :placeholder="t('保证金')"/>-->
<!--      </el-form-item>-->
      <el-form-item :label="t('项目图标')" prop="contract_type_icon">
        <pic-upload
          ref="picUpRef"
          v-model="form.contract_type_icon"
          height="50"
          :limit="1"
          width="50"
        />
      </el-form-item>
<!--      <el-form-item :label="t('说明网址')" prop="contract_type_url">-->
<!--        <el-input v-model="form.contract_type_url" clearable :placeholder="t('说明网址')"/>-->
<!--      </el-form-item>-->
      <el-form-item :label="t('保障排序')" prop="contract_type_order">
        <el-input v-model="form.contract_type_order" clearable :placeholder="t('保障排序')"/>
      </el-form-item>
      <el-form-item :label="t('是否开启')" prop="contract_type_enable">
        <el-switch
          v-model="form.contract_type_enable"
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
  import {doEdit, doAdd} from '@/api/sys/contractType'
  import MsRichEditor from "@/plugins/MsRichEditor";
  import PicUpload from "@/plugins/MsUpload/PicUpload";

  export default defineComponent({
    name: 'ContractTypeEdit',
    components: {MsRichEditor, PicUpload},
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
