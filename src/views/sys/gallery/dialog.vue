<template>
  <el-dialog
    v-model="dialogFormVisible"
    fullscreen
    @close="close"
  >
    <material ref="materialRef" :url="url" @get-files="getSelectRows"/>
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules" style="display: none;">
      <el-form-item prop="material_url">
        <el-input v-model="form.material_url"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消') }}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {translate as t} from '@/i18n'
import Material from './index'

export default defineComponent({
  name: 'MaterialGalleryDialog',
  components: {Material},
  props: {
    url: {
      type: Array,
      default() {
        return []
      },
    },
  },
  emits: ['get-files'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      materialRef: null,
      form: {
        material_url: [],
      },
      rules: {
        material_url: [{required: true, trigger: 'blur', message: t('请选择素材')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const result = getCurrentInstance();

    const show = (row) => {
      state.form = Object.assign({}, row)
      state.dialogFormVisible = true
    }
    const close = () => {
      state.form = {
        material_url: [],
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      //需要通过事件获取。
      const selectRows = result.data.selectRows

      if (selectRows && selectRows.length > 0) {
        emit('get-files', selectRows)
        close()
      } else {
        $message(t('请选择素材'), 'error')
      }
    }
    const getSelectRows = (val) => {
      result.data.selectRows = val
    }

    return {
      t,
      ...toRefs(state),
      show,
      close,
      save,
      getSelectRows,
    }
  },
  data: function () {
    return {
      selectRows: [],
    };
  },
  watch: {
    url: {
      immediate: true,
      handler: function () {
        this.selectRows = JSON.parse(JSON.stringify(this.url))
      },
    },
  },
})
</script>
