<template>
  <div class="pic-upload-source">
    <div style="display: block">
      <ul
        v-show="photo.length > 0"
        class="pic-upload-list pic-upload-list--picture-card"
      >
        <li
          v-for="(picture, index) in photo"
          :key="index"
          class="pic-upload-list--item"
          :style="picCardWhStyle"
        >
          <div style="display: block">
            <img
              alt=""
              class="pic-upload-list--item-thumbnail"
              :src="picture"
            />
            <span class="pic-upload-list--item-actions">
              <span class="pic-upload-list--item-delete">
                <el-icon class="el-icon-delete" @click="deleteImg(index)"><Delete /></el-icon>
              </span>
            </span>
          </div>
        </li>
      </ul>
      <div
        v-show="(mulFile && photo.length<limit) || (!mulFile && photo.length === 0)"
        v-loading="loading"
        class="pic-upload pic-upload--picture-card"
        :style="picCardWhStyle"
      >
        <el-icon class="el-icon-plus" :style="picCardIFontSize"><Plus /></el-icon>
        <input :disabled="disabled" type="file" @change="addImg" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Plus} from '@element-plus/icons-vue'
import {translate as t} from "@/i18n";
import {useUserStore} from "@/store/modules/user";
import {URL} from "@/config";


export default {
  name: 'ImgUpload',
  components: {Plus},
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
      default() {
        return 1;
      },
    },
    fileExt: {
      type: String,
      default() {
        return "gif|jpg|jpeg|png|GIF|JPG|PNG";
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isCompress: {
      type: Boolean,
      default() {
        return false;
      },
    },
    modelValue: {
      type: [String, Array ,File, Blob],
      default() {
        return [];
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {

    const userStore = useUserStore()
    const token = userStore.getToken
    const $message = inject('$message')

    const state = reactive({
      loading: false,
    })

    const photo = ref([]) // 编辑器数据

    watch(
      () => photo.value,
      (data) => {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++")
        console.log(data)

        if (data.length > 0) {
          setImg(data)
        }
      }
    ) // 监听modelValue输入值变动


    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        console.log('监听基本类型数据modelValue')
        console.log('new', newVal)
        console.log('old', oldVal)


        if (typeof newVal == "string") {
          if (newVal == "") {
            photo.value = [];
          } else {
            photo.value = [newVal];
          }
        } else if (newVal instanceof Array) {
          photo.value = JSON.parse(JSON.stringify(newVal));
        }
        else {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(newVal);
            fileReader.onload = (e) => {
              photo.value = [e.target.result]
            };
          } catch (e){
            console.log(e.message)
          }
        }
      }
    )


    if (typeof props.modelValue == "string") {
      if (props.modelValue == "") {
        photo.value = [];
      } else {
        photo.value = [props.modelValue];
      }
    } else if (props.modelValue instanceof Array) {
      photo.value = [props.modelValue];
    }
    else {
      try {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(props.modelValue);
        fileReader.onload = (e) => {
          photo.value = [e.target.result]
        };
      } catch (e){
        console.log(e.message)
      }
    }

    const setImg = (data) => {
      if (props.limit == 1) {
        emit("update:modelValue", data[0]);
      } else {
        emit("update:modelValue", data);
      }
    }

    const deleteImg = (index) => {
      photo.value.splice(index, 1);

      setImg(photo.value)
    }

    const compress = (img) => {
      let url = null;
      const canvas = document.createElement("canvas");
      const scale = img.height / img.width;
      canvas.width = 720;
      canvas.height = 720 * scale;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      url = canvas.toDataURL("image/jpeg");
      return url;
    }

    const dataURItoBlob = (dataURI) => {
      const byteString = window.atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new window.Blob([ab], { type: mimeString });
    }

    const addImg = (event) => {
      const file = event.target.files[0];

      const regStr = ".(" + props.fileExt + ")$";
      const re = new RegExp(regStr);

      if (re.test(event.target.value)) {
        const MAXSIZE = 10 * 1024 * 1024;
        const size = file.size;
        if (size > MAXSIZE) {
          event.target.value = "";
          $message("上传图片不能超过10M", "error")
          return;
        }
        state.loading = true;
        const reader = new FileReader();

        reader.readAsDataURL(file);
        const img = new Image();
        reader.onload = function (e) {
          img.src = this.result;
          img.onload = function () {
            let base = e.target.result;
            let fileItem = file;
            if (props.isCompress) {
              base = compress(img);
              fileItem = dataURItoBlob(base);
            }
            const formdata = new window.FormData();
            formdata.append("upfile", fileItem);
            formdata.append("gallery_id", 1024);
            formdata.append("material_type", "image");

            axios({
              method: "POST",
              url: URL.upload,
              data: formdata,
              timeout: 1000000,
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
              },
            })
              .then((res) => {
                event.target.value = "";
                photo.value.push(res.data.data.file_url);
                setImg(photo.value)
                state.loading = false;
              })
              .catch((e) => {
                event.target.value = "";
                state.loading = false;
                $message(e.message, "error")
              });
          };
        };
      } else {
        event.target.value = "";
        $message("请上传" + props.fileExt + "格式图片", "error")
      }
    }

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

    return {
      t,
      ...toRefs(state),
      picCardWhStyle,
      picCardIFontSize,
      mulFile,
      photo,
      deleteImg,
      addImg,
    }
  },
  data: function () {
    return {
    };
  },
  methods: {
  },
};
</script>

<style>
.pic-upload-source {
  display: block;
  padding: 0px;
}

.pic-upload:hover {
  border-color: #3f9eff;
}

.pic-upload {
  position: relative;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
}

.pic-upload input {
  cursor: pointer;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 99999;
  opacity: 0;
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
