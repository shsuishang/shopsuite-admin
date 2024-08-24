<template>
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="onClose"
    :close-on-click-modal="false"
    :title="title"
    width="50%"
  >
    <div class="upload">
      <el-alert
        v-if="false"
        :closable="false"
        :title="`支持jpg、jpeg、png格式，单次可最多选择${limit}张图片，每张不可大于${size}M，如果大于${size}M会自动为您过滤`"
        type="info"
      />
      <div>
        <el-radio v-model="params.material_type" label="image">{{ t('图片') }}</el-radio>
        <el-radio v-model="params.material_type" label="video">{{ t('视频') }}</el-radio>
        <el-radio v-if="false" v-model="params.material_type" label="audio">{{ t('音频') }}</el-radio>
        <el-radio v-model="params.material_type" label="document">{{ t('文档') }}</el-radio>
      </div>
      <div v-show="params.material_type === 'image'">
        <el-upload
          ref="imageUploadRef"
          accept="image/png, image/jpeg, image/gif,.png,.svg,.gif,.jpeg,.jpg"
          :action="action"
          :auto-upload="true"
          class="upload-content"
          :close-on-click-modal="false"
          :data="params"
          :file-list="fileList"
          :headers="headers"
          :limit="limit"
          list-type="picture-card"
          :multiple="true"
          :name="name"
          :on-change="handleChange"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-progress="handleProgress"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <template #trigger>
            <ms-icon icon="add-line"/>
          </template>
          <el-dialog v-model="dialogVisible" append-to-body title="查看大图">
            <div>
              <el-image :src="dialogImageUrl"/>
            </div>
          </el-dialog>
        </el-upload>
      </div>

      <div v-show="params.material_type === 'document'">
        <el-upload
          ref="fileUploadRef"
          accept=".rar,.zip,.tar,.gz,.7z,.bz2,.cab,.iso,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.md,.xml,.csv"
          :action="action"
          :auto-upload="true"
          class="upload-content"
          :close-on-click-modal="false"
          :data="params"
          :file-list="fileList"
          :headers="headers"
          :limit="limit"
          :multiple="true"
          :name="name"
          :on-change="handleChange"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-progress="handleProgress"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <el-button size="normal" type="primary">
            选取文件
          </el-button>
        </el-upload>
      </div>

      <div
        v-show="
          params.material_type === 'video'
        "
      >
        <el-upload
          ref="videoUploadRef"
          accept=".flv,.swf,.mkv,.avi,.rm,.rmvb,.mpeg,.mpg,.ogg,.ogv,.mov,.wmv,.mp4,.webm,.mp3,.wav,.mid"
          :action="action"
          :auto-upload="true"
          class="upload-content"
          :close-on-click-modal="false"
          :data="params"
          :file-list="fileList"
          :headers="headers"
          :limit="limit"
          :multiple="true"
          :name="name"
          :on-change="handleChange"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-progress="handleProgress"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <el-button size="normal" type="primary">
            选取文件
          </el-button>
        </el-upload>
      </div>


      <div
        v-show="
          params.material_type === 'audio'
        "
      >
        <el-upload
          ref="audioUploadRef"
          accept=".flv,.swf,.mkv,.avi,.rm,.rmvb,.mpeg,.mpg,.ogg,.ogv,.mov,.wmv,.mp4,.webm,.mp3,.wav,.mid"
          :action="action"
          :auto-upload="true"
          class="upload-content"
          :close-on-click-modal="false"
          :data="params"
          :file-list="fileList"
          :headers="headers"
          :limit="limit"
          :multiple="true"
          :name="name"
          :on-change="handleChange"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-progress="handleProgress"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <el-button size="normal" type="primary">
            选取文件
          </el-button>
        </el-upload>
      </div>
    </div>
    <template #footer>
      <div
        v-if="show"
        style="position: absolute; top: 10px; left: 15px; color: #999"
      >
        正在上传中... 当前上传成功数:{{ imgSuccessNum }} 当前上传失败数:{{
          imgErrorNum
        }}
      </div>
      <el-button type="primary" @click="onClose">关闭</el-button>
      <el-button
        style="margin-left: 10px"
        type="success"
        @click="onClose"
      >
        确定
      </el-button>
      <el-button
        v-if="false"
        :loading="loading"
        style="margin-left: 10px"
        type="success"
        @click="onSave"
      >
        开始上传
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import {useUserStore} from '@/store/modules/user'
import _ from 'lodash'
import {translate as t} from '@/i18n'
import {URL} from "@/config";

export default defineComponent({
  name: 'MsUpload',
  components: {},
  props: {
    url: {
      type: String,
      default: URL.upload,
      required: true,
    },
    name: {
      type: String,
      default: 'upfile',
      required: true,
    },
    limit: {
      type: Number,
      default: 50,
      required: true,
    },
    size: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const userStore = useUserStore()
    //const {token} = storeToRefs(userStore)
    const token = userStore.getToken
    const $message = inject('$message')

    const state = reactive({
      imageUploadRef: null,
      videoUploadRef: null,
      audioUploadRef: null,
      fileUploadRef: null,
      show: false,
      loading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      action: URL.upload,
      headers: {},
      fileList: [],
      picture: 'picture',
      imgNum: 0,
      imgSuccessNum: 0,
      imgErrorNum: 0,
      typeList: null,
      title: '上传',
      dialogFormVisible: false,
      params: {
        gallery_id: 0,
        material_type: 'image',
      },
    })

    const onSave = () => {
      if (state.params.material_type === 'image') {
        state.imageUploadRef.submit()
      }
      else if (state.params.material_type === 'video') {
        state.videoUploadRef.submit()
      }
      else if (state.params.material_type === 'audio') {
        state.audioUploadRef.submit()
      }
      else {
        state.fileUploadRef.submit()
      }
    }
    const handleProgress = () => {
      state.loading = true
      state.show = true
    }
    const handleChange = (file, fileList) => {
      if (fileList && fileList.length > 0) {
        if (file.size > 1048576 * state.size) {
          fileList.filter((item) => item !== file)
          state.fileList = fileList
        } else {
          state.allImgNum = fileList.length
        }
      }
    }
    const handleSuccess = (response, file, fileList) => {
      if (200 == response.status) {
        state.imgNum = state.imgNum + 1
        state.imgSuccessNum = state.imgSuccessNum + 1
        if (fileList.length === state.imgNum) {
          setTimeout(() => {
            $message(
              `上传完成! 共上传 ${fileList.length}`,
              'success',
              'ms-hey-message-success'
            )
          }, 1000)
        }

        setTimeout(() => {
          state.loading = false
          state.show = false
        }, 1000)
      }
      else
      {
        state.imgNum = state.imgNum + 1
        state.imgErrorNum = state.imgErrorNum + 1
        $message(
          `文件[${file.raw.name}]上传失败,文件大小为${_.round(
            file.raw.size / 1024,
            0
          )}KB`,
          'error',
          'ms-hey-message-error'
        )
        setTimeout(() => {
          state.loading = false
          state.show = false
        }, 1000)}
    }
    const handleError = (err, file) => {
      $message(
        `${err}`,
        'error'
      )
      state.imgNum = state.imgNum + 1
      state.imgErrorNum = state.imgErrorNum + 1
      $message(
        `文件[${file.raw.name}]上传失败,文件大小为${_.round(
          file.raw.size / 1024,
          0
        )}KB`,
        'error',
        'ms-hey-message-error'
      )
      setTimeout(() => {
        state.loading = false
        state.show = false
      }, 1000)
    }
    const handleRemove = () => {
      state.imgNum = state.imgNum - 1
      state.allNum = state.allNum - 1
    }
    const handlePreview = (file) => {
      state.dialogImageUrl = file.url
      state.dialogVisible = true
    }
    const handleExceed = (files) => {
      $message(
        `当前限制选择 ${state.limit} 个文件，本次选择了
                  ${files.length}
                  个文件`,
        'error',
        'ms-hey-message-error'
      )
    }
    const handleShow = (data) => {
      state.title = '上传'
      state.data = data
      state.dialogFormVisible = true
    }
    const onClose = () => {
      emit('fetch-data')
      state.fileList = []
      state.picture = 'picture'
      state.allImgNum = 0
      state.imgNum = 0
      state.imgSuccessNum = 0
      state.imgErrorNum = 0
      state.headers['Authorization'] = `Bearer ${token}`
      state.dialogFormVisible = false
    }


    const showEdit = (gallery_id) => {
      state.params.gallery_id = gallery_id
      state.dialogFormVisible = true
    }

    onMounted(() => {
      state.headers['Authorization'] = `Bearer ${token}`
      state.action = props.url
    })

    const percentage = computed(() => {
      if (state.allImgNum === 0) return 0
      return _.round(state.imgNum / state.allImgNum, 2) * 100
    })

    return {
      t,
      ...toRefs(state),
      showEdit,
      onSave,
      handleProgress,
      handleChange,
      handleSuccess,
      handleError,
      handleRemove,
      handlePreview,
      handleExceed,
      handleShow,
      onClose,
      percentage,
    }
  },
})
</script>

<style lang="scss" scoped>
.upload {
  height: 200px;

  .upload-content {
    height: 190px;
    overflow: auto;
    margin-top:10px;

    .el-upload__tip {
      display: block;
      height: 30px;
      line-height: 30px;
    }

    :deep(*) {
      .el-upload--picture-card {
        width: 128px;
        height: 128px;
        margin: 3px 8px 8px 8px;
        border: 2px dashed #c0ccda;

        .ri-add-line {
          font-size: 24px;
        }
      }

      .el-upload-list--picture {
        margin-bottom: 20px;
      }

      .el-upload-list--picture-card {
        .el-upload-list__item {
          width: 128px;
          height: 128px;
          margin: 3px 8px 8px 8px;
        }
      }
    }
  }
}
</style>
