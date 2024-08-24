<template>
  <div class="config-container">
    <el-row :gutter="20">
      <el-col :lg="9" :md="9" :sm="24" :xl="6" :xs="24">
        <ms-card shadow="hover">
          <config-type ref="typeRef" @fetch-item-data="listConfigBaseData"/>
        </ms-card>
      </el-col>
      <el-col :lg="15" :md="15" :sm="24" :xl="18" :xs="24">
        <ms-card shadow="hover">
          <config-base ref="baseRef"/>
        </ms-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { translate as t } from '@/i18n'
import ConfigBase from './components/ConfigBase'
import ConfigType from './components/ConfigType'

export default defineComponent({
  name: 'Config',
  components: {ConfigBase, ConfigType},
  setup() {
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      typeRef: null,
      baseRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        title: '',
      },
    })

    const listConfigBaseData = (val) => {
      state.baseRef.fetchData(val.config_type_id)
    }

    onMounted(() => {
    })

    return {
      t,
      ...toRefs(state),
      listConfigBaseData,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.config';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  :deep(.el-table) {
    margin-top: 0;
    .el-button.is-text{
      width: 40px;
    }
  }

}
</style>
