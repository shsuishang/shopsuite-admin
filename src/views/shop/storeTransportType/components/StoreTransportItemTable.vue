<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="400px"
    @close="close"
  >
    <div style="max-height: 400px; overflow: auto;">
      <el-tree
        ref="treeRef"
        :data="dataTree"
        :default-checked-keys="transport_item_city_ids ? transport_item_city_ids.split(',') : []"
        default-expand-all
        :default-expanded-keys="[]"
        node-key="district_id"
        :props="{ label: 'district_name', children: 'children'}"
        show-checkbox
      />
    </div>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {doEdit} from '@/api/shop/storeTransportItem'
  import {getArea} from "@/api/area";

  export default defineComponent({
    name: 'StoreTransportItemEdit',
    components: { },
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        treeRef: null,
        title: '',
        dialogFormVisible: false,
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
        transport_item_id: undefined,
        transport_item_city_ids: '',
        dataTree: [],

      })

      const tableEdit = (row) => {
        state.transport_item_id = row.transport_item_id
        state.transport_item_city_ids = row.transport_item_city_ids
        initFromData(row)
        state.title = t('添加区域')
        state.dialogFormVisible = true
      }
      const close = () => {
        state.transport_item_id = undefined
        state.dialogFormVisible = false
        state.dataTree = undefined
        state.transport_item_city_ids = undefined

      }
      const save = async () => {
        const tree = state['treeRef'].getCheckedKeys()
        state.transport_item_city_ids = tree.join()

        if (state.transport_item_city_ids.length > 0) {
          const param = {
            transport_item_id : state.transport_item_id,
            transport_item_city_ids : state.transport_item_city_ids
          }

          const {msg, status} = await doEdit(param)
          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }
          emit('fetch-data')
          close()
        } else {
          $message('请选择地区！', 'error')
        }
      }

      const getAreaOpt = async () => {
        const {
          data: data,
        } = await getArea()

        if (data) {
          state.areaData = data
        }
      }

      const initFromData = (row) => {
        const cityIdsArray = row.transport_item_city_ids.split(',')

        //过滤出本身已选的城市，得到需要过滤出其他已选的城市
        const filterCityIds = row.selectedCityIds.filter(item => !cityIdsArray.includes(item));

        const areaData = state.areaData
        const dataTree = []

        areaData.forEach( (item) => {
          if (filterCityIds && filterCityIds.indexOf(item.district_id.toString()) === -1) {
            const area = {
              district_id: item.district_id,
              district_name: item.district_name
            }
            const children = []

            if(item.children){
              item.children.forEach( (iChildren) => {
                if (filterCityIds && filterCityIds.indexOf(iChildren.district_id.toString()) === -1) {
                  const chi = {
                    district_id: iChildren.district_id,
                    district_name: iChildren.district_name
                  }
                  children.push(chi)
                }
              })
            }

            area.children = children
            dataTree.push(area)
            state.dataTree = dataTree
          }
        })
      }

      onMounted(() => {
        getAreaOpt()
      })

      return {
        t: t,
        ...toRefs(state),
        tableEdit,
        initFromData,
        close,
        save,
      }
    },
  })
</script>
<style lang="scss">
  .el-input__wrapper{
    width: 100%;
  }
  #tree-transfer .transfer-main {
    height: calc(100% - 60px);
  }
</style>
