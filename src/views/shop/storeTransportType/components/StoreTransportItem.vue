<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="60%"
    :title="title"
    top="3%"
    :with-header="true"
    @close="close"
  >
    <div class="store-transport-item-container">
      <ms-search-box>
        <ms-search-box-left-panel :span="12">
          <el-button v-permissions="{ permission: ['/manage/shop/storeTransportType/add'] }" :icon="Plus" type="primary" @click="handleEdit">
            {{ t('添加') }}
          </el-button>
        </ms-search-box-left-panel>
      </ms-search-box>

      <el-table
        v-loading="listLoading"
        border
        :data="items"
        :height="height"
        @selection-change="setSelectRows"
      >
        <el-table-column align="center" :label="t('序号')" type="index" width="60"/>
        <el-table-column
          align="center"
          :label="t('默认数量')"
          prop="transport_item_default_num"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('默认运费')"
          prop="transport_item_default_price"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('增加数量')"
          prop="transport_item_add_num"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('增加运费')"
          prop="transport_item_add_price"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('区域省名称')"
          prop="transport_item_city_ids"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div v-if="row.transport_item_city_ids">
                <el-button type="text" @click="handleTable(row)">
                  <block v-for="(item, district_id) in row.cityIdNameList" :key="district_id">{{item.district_name}}&nbsp;</block>
                </el-button>
            </div>
            <div v-else>
              <el-button type="text" @click="handleTable(row)">
                {{ t('请选择地区')}}
              </el-button>
            </div>

          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
          <template #default="{ row }">
            <el-button v-permissions="{ permission: ['/manage/shop/storeTransportType/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
            <el-button v-permissions="{ permission: ['/manage/shop/storeTransportType/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="ms-data-empty" :description="t('暂无数据')" />
        </template>
      </el-table>
      <add ref="addRef" @fetch-data="fetchData"/>
      <transfer ref="transferRef" @fetch-data="fetchData"/>
    </div>
  </el-drawer>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {doRemove, getList} from '@/api/shop/storeTransportItem'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import Add from './StoreTransportItemEdit'
  import Transfer from './StoreTransportItemTable'
  import {getArea} from "@/api/area";

  export default defineComponent({
    name: 'StoreTransportItem',
    components: {Add ,Transfer},
    emits: [],
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        addRef: null,
        transferRef: null,
        height: $tableHeight() + 60,
        items: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        dialogFormVisible: false,
        selectedCityIds: [],
        queryForm: {
          page: 1,
          size: 500,
          transport_type_id: '',
        },
        areaList : [],
        areaData: [],
      })


      const showItems = (row) => {
        state.queryForm.transport_type_id = row.transport_type_id
        fetchData()
        state.dialogFormVisible = true
      }

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        row.transport_type_id = state.queryForm.transport_type_id
        state.addRef.addEdit(row)
      }

      const handleTable = (row) => {
        row.selectedCityIds = state.selectedCityIds
        state.transferRef.tableEdit(row)
      }

      const close = () => {
        state.selectedCityIds = []
        state.dialogFormVisible = false
      }

      const handleDelete = (row) => {
        if (row.transport_item_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({transport_item_id: row.transport_item_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const transport_item_id = state.selectRows.map((item) => item.transport_item_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({transport_item_id})
              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
              await fetchData()
            })
          } else {
            $message(t('未选中任何行'), 'error')
          }
        }
      }
      const handleState = async (row) => {
        console.info(row)
        const param = {
        }

        const {msg, status} = await editState(param)

        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }

        await fetchData()
      }
      const handleSizeChange = (val) => {
        state.queryForm.size = val
        fetchData()
      }
      const handleCurrentChange = (val) => {
        state.queryForm.page = val
        fetchData()
      }
      const queryData = () => {
        state.queryForm.page = 1
        fetchData()
      }
      const fetchData = async () => {
        state.listLoading = true
        const {
          data: {items, records},
        } = await getList(state.queryForm)
        if (items) {
          items.forEach((item) => {
            const transportItemCity = []
            if (item.transport_item_city_ids) {
              const cityIdsArray = item.transport_item_city_ids.split(',')
              cityIdsArray.forEach((cityId) => {
                state.areaList.forEach((area) => {
                  if (area.district_id == cityId) {
                    const areaItem = {
                      district_id: area.district_id,
                      district_name: area.district_name
                    }
                    transportItemCity.push(areaItem)
                  }
                })
              })
              item.cityIdNameList = transportItemCity
            }

          })
        }

        state.items = items
        state.total = records
        state.listLoading = false
        initSelectedCity(items)

      }

      const initSelectedCity = (row) => {
        if (row && row.length > 0) {
          row.forEach((item) => {
            if (item.transport_item_city_ids) {
              const cityIds = item.transport_item_city_ids.split(",")
              state.selectedCityIds = state.selectedCityIds.concat(
                cityIds
              )
            }
          })
        } else {
          state.selectedCityIds = []
        }
      }

      const getAreaOpt = async () => {
        const {
          data: data,
        } = await getArea()

        if (data) {
          const dataList = []
          data.forEach( (item) => {
            // const area = {
            //   district_id: item.district_id,
            //   district_name: item.district_name
            // }
            // dataList.push(area)

            if(item.children){
              item.children.forEach( (iChildren) => {
                const chi = {
                  district_id: iChildren.district_id,
                  district_name: iChildren.district_name
                }
                dataList.push(chi)
              })
            }

          })
          state.areaList = dataList
        }
      }

      onMounted(() => {
        getAreaOpt()
      })

      return {
        t,
        ...toRefs(state),
        setSelectRows,
        handleEdit,
        handleTable,
        handleDelete,
        handleState,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        showItems,
        close,
        fetchData,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.store-transport-item';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
