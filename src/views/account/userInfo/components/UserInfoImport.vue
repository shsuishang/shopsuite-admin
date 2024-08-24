<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="30%"
    @close="close"
  >
    <el-form label-width="0px">
      <el-form-item>
        <el-button type="info" @click="expPayCardExcel">
          {{ t('下载模板') }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="uploadRef"
          :action="action"
          :data="params"
          :headers="headers"
          :limit="1"
          :multiple="false"
          :on-success="handleSuccess"
        >
          <el-button type="primary">{{ t('导入模板') }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('关闭')}}</el-button>
    </template>
  </el-dialog>
</template>
<script>
  import { translate as t } from '@/i18n'
  import {exportTemp} from '@/api/account/userInfo'
  import {URL as ConfigUrl} from "@/config";
  import {useUserStore} from "@/store/modules/user";

  export default defineComponent({
    name: 'UserInfoImport',
    components:{},
    props:{
      url: {
        type: String,
        default: ConfigUrl.account.userInfo.importTemp,
        required: true,
      },
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const userStore = useUserStore()
      const $message = inject('$message')
      const token = userStore.getToken

      const state = reactive({
        formRef: null,
        uploadRef: null,
        action: ConfigUrl.account.userInfo.importTemp,
        headers: {},
        params: {
          authorization: '',
        },
        form: {
        },
        title: '导入用户信息',
        dialogFormVisible: false,
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
        tagGroupTreeList: [],
        LevelOptions:[],
        isExpandTreeSelect:true,

      })

      const showEdit = () => {
        state.dialogFormVisible = true
      }

      const close = () => {
        state.headers['Authorization'] = `Bearer ${token}`
        state.uploadRef.clearFiles()
        state.dialogFormVisible = false
      }

      const expPayCardExcel = () => {
        exportTemp({ }).then((data) => {
          const link = document.createElement('a')
          const blob = new Blob([data], {
            type: 'application/msexcel;charset=utf-8',
          })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '用户信息模版.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })

      }

      const handleSuccess = (response, file, fileList) =>  {
        console.info(file, fileList)
        const status = response.status
        const msg = response.msg
        if (status === 200) {
          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }
          emit('fetch-data')
          close()
        } else {
          state.uploadRef.clearFiles()
          $message(msg, 'error')
        }
      }

      onMounted(() => {
        state.headers['Authorization'] = `Bearer ${token}`
        state.params.authorization = token
        state.action = props.url
      })

      return {
        t: t,
        ...toRefs(state),
        showEdit,
        expPayCardExcel,
        handleSuccess,
        close,
      }
    },
  })
</script>
<style lang="scss">
  .el-input__wrapper{
    width: 100%;
  }
</style>
