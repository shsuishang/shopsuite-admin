<template>
    <QuillEditor
      ref="quillRef"
      v-model:content="html"
      content-type="html"
      :options="editorOption"
      :style="{}"
      @update:content="onEditorChange($event)"
    />
  <media ref="mediaRef" />
  <material-gallery-dialog ref="galleryRef" :append-to-body="true" @get-files="handleAddImg" />
</template>
<script lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { QuillEditor } from '@vueup/vue-quill'
import MaterialGalleryDialog from "@/views/sys/gallery/dialog.vue";

// 自定义工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{header: 1}, {header: 2}],
  [{list: 'ordered'}, {list: 'bullet'}],
  [{script: 'sub'}, {script: 'super'}],
  [{indent: '-1'}, {indent: '+1'}],
  [{direction: 'rtl'}],
  [{size: ['small', false, 'large', 'huge']}],
  [{color: []}, {background: []}],
  [{font: []}],
  [{align: []}],
  ['clean'],
  ['link', 'image']
]
export default defineComponent({
  components: {
    MaterialGalleryDialog,
    QuillEditor
  },
  props: {
    defaultHeight: {
      type: String,
      default: '400px'
    },
    defaultWidth: {
      type: String,
      default: '100%'
    },
    modelValue: {
      type: String,
      default: ''
    },
  },
  emits: ['update:modelValue'],

  setup(props, {emit}) {
    const {modelValue} = {...props}

    const state = reactive({
      html: modelValue,
      galleryRef: {
        show(){}
      },
      quillRef: {
        editor: {
          __quill: {
            selection: {
              savedRange: {
                index: Number
              }
            }
          }
        }
      },
    })

    watch(
      () => state.html,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          //state.html = newVal
          emit('update:modelValue', newVal)
        }
      },
      { deep: true, immediate: true }
    )

    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          state.html = newVal
        }
      },
      { deep: true, immediate: true }
    )

    /**
     * 重写自定义配置执行逻辑
     */
    const editorOption = Object.assign(
      {},
      {
        debug: false,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': () => {
                if (state.galleryRef) {
                  state.galleryRef.show()
                }
              }
            }
          }
        },
        theme: 'snow'
      },
    )

    const handleAddImg = (images: any) => {
      if (state.quillRef && state.quillRef.editor) {
        const quill = state.quillRef.editor.__quill as any;
          // 获取光标所在位置
          let length:number = quill.selection.savedRange.index

          // 插入图片
          images.forEach((image: any) => {
            quill.insertEmbed(length, 'image', image);
            length++;
          });
          // 调整光标到最后
          quill.setSelection(length);
      }
    }

    const onEditorChange = () => {
      //TiLength.value =myQuillEditor.value.getText().length-1
      //myQuillEditor.value.setText(myQuillEditor.value.getText().slice(0,500))
    }

    return {
      ...toRefs(state),
      editorOption,
      handleAddImg,
      onEditorChange ,
    }
  }
})

</script>
<style>
.ql-container {
  height: 400px;
  width: 100%;
}
</style>
