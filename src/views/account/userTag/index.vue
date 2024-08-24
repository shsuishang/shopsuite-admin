<template>
  <div class="user-tag-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="8" :sm="24" :xl="6" :xs="24">
        <ms-card shadow="hover">
          <user-tag-group ref="typeRef" style="height: 800px" @fetch-item-data="listUserTagData"/>
        </ms-card>
      </el-col>
      <el-col :lg="16" :md="16" :sm="24" :xl="18" :xs="24">
        <ms-card shadow="hover">
          <user-tag-base ref="baseRef"/>
        </ms-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { translate as t } from '@/i18n'
import UserTagBase from './components/UserTagBase'
import UserTagGroup from './components/UserTagGroup'

export default defineComponent({
  name: 'UserTag',
  components: {UserTagBase, UserTagGroup},
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

    const listUserTagData = (val) => {
      state.baseRef.fetchData(val.tag_group_id)
    }

    onMounted(() => {
    })

    return {
      t,
      ...toRefs(state),
      listUserTagData,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.user-tag';
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
