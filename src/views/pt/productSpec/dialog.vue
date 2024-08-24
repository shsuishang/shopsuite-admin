<template>
  <el-dialog
    v-model="dialogFormVisible"
    @close="close"
  >
    <div class="product-assist-container">
      <el-row>
        <el-col :lg="24" :md="24" :sm="10" :xl="24" :xs="10">
          <product-spec-item :id="form.spec_id" ref="specItemRef" />
        </el-col>
      </el-row>
    </div>
  </el-dialog>

</template>

<script>
import {translate as t} from '@/i18n'
import ProductSpecItem from "@/views/pt/productSpec/ProductSpecItem";

export default defineComponent({
  name: 'ProductAssistDialog',
  components: {
    ProductSpecItem
  },
  setup() {
    const state = reactive({
      specItemRef:null,
      form: {
        spec_id:0
      },
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const show = (row) => {
      const val = JSON.parse(JSON.stringify(row))
      //state.form = Object.assign({}, val)
      state.form.spec_id = val.spec_id;
      state.dialogFormVisible = true
    }

    const close = () => {
      state.dialogFormVisible = false
    }
    const save = () => {
      //emit('get-files', selectRows)
      close()
    }

    onMounted(() => {
    })

    return {
      t,
      ...toRefs(state),
      show,
      close,
      save
    }
  },
})
</script>
