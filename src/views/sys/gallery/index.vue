<template>
  <div class="material-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="8" :sm="24" :xl="4" :xs="24">
        <ms-card shadow="hover">
          <material-gallery ref="typeRef" @fetch-item-data="listMaterialBaseData"/>
        </ms-card>
      </el-col>
      <el-col :lg="18" :md="16" :sm="24" :xl="20" :xs="24">
        <ms-card shadow="hover">
          <material-base ref="baseRef" :url="url" @get-files="getSelectRows" />
        </ms-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import MaterialBase from './components/MaterialBase'
import MaterialGallery from './components/MaterialGallery'

export default defineComponent({
  name: 'Material',
  components: {MaterialBase, MaterialGallery},
  props:{
    url: {
      type: Array,
      default() {
        return []
      },
    },
  },
  emits: ['get-files'],
  setup(props, {emit}) {
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

    //state.selectRows = props.url

    const listMaterialBaseData = (val) => {
      console.info(val)
      state.baseRef.fetchData(val)
    }

    const getSelectRows = (val) => {
      const selectRows = JSON.parse(JSON.stringify(val))
      emit('get-files', selectRows)
    }

    onMounted(() => {
    })

    return {
      t,
      ...toRefs(state),
      listMaterialBaseData,
      getSelectRows,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.material';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  $base-menu-background: $base-color-background;

  @mixin container {
    color: var(--el-button-text-color) !important;
    background: $base-color-background !important;

    @include active
  }

  @mixin active {
    &:hover {
      color: var(--el-button-text-color) !important;
      background: $base-color-background !important;
    }

    &.is-active {
      color: $base-menu-color-active !important;
      background-color: var(--el-color-primary) !important;

      a {
        color: var(--el-button-text-color) !important;
      }
    }
  }

  :deep {
    .el-table {
      margin-top: 0;
    }

    .ms-card{
      .el-menu {
        @include container;

        .el-sub-menu .el-sub-menu__title,
        .el-menu-item {
          @include container;
        }
      }
    }
  }
}
</style>
