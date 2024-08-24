<template>
  <div class="pic-upload-source">
    <div style="display: block;line-height: 10px">
      <ul
        v-show="uploadFiles.length > 0"
        class="pic-upload-list pic-upload-list--picture-card"
      >
        <li
          v-for="(picture, index) in uploadFiles"
          :key="index"
          class="pic-upload-list--item"
          :style="picCardWhStyle"
        >
          <div style="display: block">
            <img
              v-if="ifImage(picture)"
              alt=""
              class="pic-upload-list--item-thumbnail"
              :src="picture"
            />
            <video
              v-else
              alt=""
              class="pic-upload-list--item-thumbnail"
              :src="picture"
            />
            <span class="pic-upload-list--item-actions">
              <span class="pic-upload-list--item-delete">
                <el-icon class="el-icon-delete" @click="delImg(picture)"><Delete /></el-icon>
              </span>
            </span>
          </div>
        </li>
      </ul>
      <div
        v-show="(mulFile && uploadFiles.length<limit) || (!mulFile && uploadFiles.length === 0)"
        class="pic-upload pic-upload--picture-card"
        :style="picCardWhStyle"
        @click="show"
      >
        <el-icon class="el-icon-plus" :style="picCardIFontSize"><Plus /></el-icon>
      </div>
    </div>
    <material-gallery-dialog ref="galleryRef" :append-to-body="true" :url="modelValue"  @get-files="saveFile"/>
  </div>
</template>

<script>

import { translate as t } from '@/i18n'

import MaterialGalleryDialog from '@/views/sys/gallery/dialog'
import {Delete, Plus} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'PicUpload',
  components: {MaterialGalleryDialog, Delete, Plus},
  props: {
    width: {
      type: Number,
      default: 148,
    },
    height: {
      type: Number,
      default: 148,
    },
    limit: {
      type: Number,
      default: 50,
      required: true,
    },
    modelValue: {
      type: [String, Array],
      default() {
        return []
      },
    },
  },
  emits: ['get-files', 'remove-file', 'update:modelValue', 'update:url'],
  setup(props) {

    const state = reactive({
      galleryRef: null,
    })

    const show = () => {
      state.galleryRef.show()
    }

    onMounted(() => {
    })

    const picCardWhStyle = computed(() => {
      return {
        width: props.width + 'px',
        height: props.height + 'px',
        lineHeight: props.height - 2 + 'px',
      }
    })

    const picCardIFontSize = computed(() => {
      if (props.width <= 148) {
        return {
          fontSize: props.height * 0.2 + 'px',
        }
      }
      return {
        fontSize: '40px',
      }
    })

    // 多图片上传/单图片上传
    const mulFile = computed(() => {
      return props.limit > 1
    })

    const ifImage = (picture) => {
      const imagePattern = /\.(jpeg|jpg|png|webp|bmp|svg|gif|ico)$/i;
      return imagePattern.test(picture);
    }

    return {
      t,
      ...toRefs(state),
      show,
      picCardWhStyle,
      ifImage,
      picCardIFontSize,
      mulFile,
    }
  },
  data: function () {
    return {
      uploadFiles: [],
      loading: false,
    };
  },
  watch: {
    uploadFiles() {
      /*
      console.info("++++++++ change uploadFiles ++++=")
      console.info(this.uploadFiles)
      if (this.uploadFiles.length > 0) {
        if (this.limit == 1) {
          this.$emit("update:modelValue", this.uploadFiles[0]);
        } else {
          this.$emit("update:modelValue", this.uploadFiles);
        }
      }
       */
    },
    modelValue: {
      immediate: true,
      handler: function () {
        if (typeof this.modelValue == "string") {
          if (this.modelValue == "") {
            this.uploadFiles = [];
          } else {
            this.uploadFiles = [this.modelValue];
          }
        } else if (this.modelValue instanceof Array) {
          this.uploadFiles = JSON.parse(JSON.stringify(this.modelValue));
        }
        else {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(this.modelValue);
            fileReader.onload = (e) => {
              this.uploadFiles = [e.target.result];
            };
          } catch (e){
            console.log(e.message)
          }
        }
      },
    },
  },
  methods: {
    saveFile(files) {
      if (this.limit <= 1) {
        //this.uploadFiles = [files[0].material_url]
        this.uploadFiles = files
        //this.$emit('get-files', files[0].material_url)

        this.uploadFiles.splice(1, 100)
        this.$emit('get-files', this.uploadFiles)

        this.$emit('update:modelValue', this.uploadFiles[0])
      } else {
        //this.uploadFiles = files.map((item) => item.material_url)
        this.uploadFiles = files

        this.uploadFiles.splice(this.limit, 100)
        this.$emit('get-files', this.uploadFiles)
        this.$emit('update:modelValue', this.uploadFiles)
      }
    },
    delImg(img) {
      const index = this.uploadFiles.indexOf(img)
      if (index > -1) {
        this.uploadFiles.splice(index, 1)
        if (this.limit <= 1) {
          //this.$emit('get-files', '')
          this.$emit('get-files', this.uploadFiles)

          this.$emit('update:modelValue', this.uploadFiles[0])
        } else {
          this.$emit('get-files', this.uploadFiles)

          this.$emit('update:modelValue', this.uploadFiles)
        }
      }
    },
  }
})
</script>

<style lang="scss" scoped>
  .pic-upload-source {
    display: block;
    padding: 0px;
  }

  .pic-upload:hover {
    border-color: #3f9eff;
  }

  .pic-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
  }

  .pic-upload-source ul {
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  .pic-upload-source li {
    display: list-item;
    text-align: -webkit-match-parent;
  }

  .pic-upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .pic-upload-list--picture-card {
    margin: 0;
    display: inline;
    vertical-align: top;
  }

  .pic-upload-list--item {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    color: #606266;
    line-height: 1.8;
    margin-top: 5px;
    position: relative;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
  }

  .pic-upload-list--picture-card .pic-upload-list--item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    margin: 0 18px 0px 0;
    display: inline-block;
  }

  .pic-upload-list--item-thumbnail {
    width: 100%;
    height: 100%;
  }

  .pic-upload-list--picture-card .pic-upload-list--item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
  }

  .pic-upload-list--picture-card .pic-upload-list--item-actions:hover {
    opacity: 1;
  }

  .pic-upload-list--picture-card .pic-upload-list--item-actions:hover span {
    display: inline-block;
  }

  .pic-upload-list--picture-card .pic-upload-list--item-actions span {
    display: none;
    cursor: pointer;
  }

  .pic-upload-list--picture-card .pic-upload-list--item-actions span + span {
    margin-left: 15px;
  }

  .pic-upload-list--picture-card
    .pic-upload-list--item-actions
    .pic-upload-list--item-delete {
    position: static;
    font-size: inherit;
    color: inherit;
  }

  .pic-upload-list--item-delete {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 12px;
    color: #606266;
    display: none;
  }

  .pic-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    vertical-align: top;
  }

  .pic-upload--picture-card i {
    color: #8c939d;
    vertical-align: middle;
  }

  .el-icon-delete, .el-icon-plus{
    vertical-align: middle;
  }
</style>
