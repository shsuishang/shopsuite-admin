<template>
  <el-dialog
    v-model="dialogFormVisible"
    fullscreen
    @close="close"
  >
    <div class="product-assist-container">
      <el-row :gutter="20">
        <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
          <product-assist :id="form.type_id" ref="assistRef" @fetch-item-data="listAssistItemData"/>
        </el-col>
        <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
          <product-assist-item ref="itemRef"/>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import {translate as t} from '@/i18n'
import ProductAssist from "@/views/pt/productAssist/ProductAssist";
import ProductAssistItem from "@/views/pt/productAssist/ProductAssistItem";

export default defineComponent({
  name: 'ProductAssistDialog',
  components: {ProductAssist, ProductAssistItem},
  setup() {
    const state = reactive({
      assistRef:null,
      itemRef:null,
      form: {
        type_id:0
      },
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    })

    const listAssistItemData = (val) => {
      state.itemRef.fetchData(val.assist_id)
    }

    const show = (row) => {
      const val = JSON.parse(JSON.stringify(row))
      //state.form = Object.assign({}, val)
      state.form.type_id = val.type_id;
      state.dialogFormVisible = true
    }

    const close = () => {
      state.itemRef.close()
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
      listAssistItemData,
      show,
      close,
      save
    }
  },
})
</script>
