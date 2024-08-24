<template>
  <component :is="menuComponent" v-if="!item.meta.hidden" :item-or-menu="item">
    <template v-if="item.children && item.children.length">
      <ms-menu
        v-for="route in item.children"
        :key="route.path"
        :item="route"
      />
    </template>
  </component>
</template>

<script lang="ts">
  /* 防止偶发性自动导入失败 */
  import { computed, defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useSettingsStore } from '@/store/modules/settings'

  const imports = require.context('./components', true, /\.vue$/)
  const Components: {
    [key: string]: any
  } = {}
  imports.keys().forEach((key) => {
    Components[key.replace(/(\/|\.|vue)/g, '')] = imports(key).default
  })

  export default defineComponent({
    name: 'MsMenu',
    components: Components,
    props: {
      item: {
        type: Object,
        required: true,
      },
      layout: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const settingsStore = useSettingsStore()
      const { collapse } = storeToRefs(settingsStore)

      const menuComponent = computed(() =>
        props.item.children &&
        props.item.children.some((_route: any) => {
          return _route.meta.hidden !== true
        })
          ? 'MsSubMenu'
          : 'MsMenuItem'
      )

      return {
        collapse,
        menuComponent,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .ms-menu-children-height {
    height: 60vh !important;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
</style>

<!--由于element-plus
bug使用teleported=false会导致多级路由无法显示，故所有菜单必须生成至body下，样式必须放到body下-->
<style lang="scss">
  .el-popper.is-light {
    border: 0 !important;
  }
</style>
