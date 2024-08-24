<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="60%"
    :title="title"
    top="1%"
    :with-header="true"
    @close="close"
  >
    <order-state-log ref="orderStateLogRef" v-model="order_id"/>
  </el-drawer>
</template>

<script>
import { translate as t } from '@/i18n'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import OrderStateLog from './OrderStateLog'

export default defineComponent({
  name: 'OrderStateLogDrawer',
  components: {OrderStateLog},
  emits: [],
  setup() {
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      height: $tableHeight(),
      dialogFormVisible: false,
      title: '',
      order_id: '',
    })

    const showEdit = async (row) => {
      state.dialogFormVisible = true
      state.order_id = row.order_id
      //alert(state.order_id)
    }

    const close = async () => {
      state.dialogFormVisible = false
    }

    onMounted(() => {
    })

    return {
      t,
      ...toRefs(state),
      showEdit,
      close,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.order-state-log';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 36px;
    }
  }
}
</style>
