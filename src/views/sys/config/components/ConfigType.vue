<template>
  <div class="config-type-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="8">
        <el-button
          v-permissions="{ permission: ['/manage/sys/config/add'] }"
          class="tree-button"
          :icon="Plus"
          type="primary"
          @click="handleEdit()"
        >
          {{ t('添加分组')}}
        </el-button>
      </ms-search-box-left-panel>
    </ms-search-box>

    <el-table
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      highlight-current-row
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @row-click="rowClick"
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('编号')"
        prop="config_type_id"
        width="60"
      />
      <el-table-column
        align="center"
        :label="t('分组名称')"
        prop="config_type_name"
      />
      <el-table-column
        align="center"
        :formatter="formatTagGroupModule"
        :label="t('所属模块')"
        prop="config_type_module"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="110">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover" width="170">
            <template #reference>
              <el-button size="small" text>
                <ms-icon v-show="hoverTagGroupId === row.config_type_id" class="rightIcon" icon="more-fill" @click.stop="showPopover(row)" @mouseenter="showPopover(row)" @mouseleave="hidePopover(row)" />
              </el-button>
            </template>
            <el-button v-permissions="{ permission: ['/manage/sys/config/edit'] }" :disabled="row.config_type_buildin" size="small" style="margin-left: 10px" type="primary" @click.stop="handleEdit(row)">{{ t('编辑') }}</el-button>
            <el-button v-permissions="{ permission: ['/manage/sys/config/remove'] }" :disabled="row.config_type_buildin" size="small" style="margin-left: 20px" type="danger" @click.stop="handleDelete(row)">{{ t('删除') }}</el-button>
          </el-popover>

          <ms-icon class="rightIcon" icon="arrow-right-s-line" style="float: right;"/>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <edit ref="editRef" :tag-group-module="tagGroupModule" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemoveType, getListType} from '@/api/sys/config'
import Edit from './ConfigTypeEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ConfigType',
  components: {Edit},
  emits: ['fetch-item-data'],
  setup(props, {emit}) {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')
    const popoverRow = ref(null);

    const showPopover = (row) => {
      popoverRow.value = popoverRow.value === row ? null : row;
      state.isPopoverVisible =  popoverRow.value === row;
    };

    const hidePopover = (row) => {
      popoverRow.value = popoverRow.value === row ? null : row;
      state.isPopoverVisible =  popoverRow.value === row;
    };


    const state = reactive({
      editRef: null,
      height: $tableHeight() + 28,
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 500,
        title: '',
      },
      hoverTagGroupId: 0,
      tagGroupModule: {
        0 : '-',
        1001 : t('站点设置'),
        1002 : t('上传设置'),
        1003 : t('运营设置'),
        1004 : t('支付设置'),
        1005 : t('协议管理'),
        5001 : t('订单流程'),
        6001 : t('服务设置'),
        7001 : t('短信设置'),
        8001 : t('微信设置'),
        9001 : t('--'),
        1101 : t('财务设置'),
        1102 : t('功能设置'),
        1103 : t('直播设置'),
      },
      isPopoverVisible:null,
    })
    const mouseEnter = (row) => {
      state.hoverTagGroupId = row.config_type_id

      console.info(state.hoverTagGroupId)
    }

    const mouseLeave = () => {
      state.hoverTagGroupId = 0
    }
    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const rowClick = (val) => {
      emit('fetch-item-data', JSON.parse(JSON.stringify(val)))
    }

    const handleEdit = (row) => {
      if (row && row.config_type_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.config_type_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemoveType({config_type_id: row.config_type_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const config_type_id = state.selectRows.map((item) => item.config_type_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveType({config_type_id})
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
      } = await getListType(state.queryForm)
      state.items = items
      state.total = records
      state.listLoading = false
    }
    onMounted(() => {
      fetchData()
    })

    const formatTagGroupModule = (row) => {
      //const tmp = JSON.parse(JSON.stringify(row))
      const config_type_module = row.config_type_module

      if (config_type_module in state.tagGroupModule) {
        return state.tagGroupModule[config_type_module]
      } else {
        return ''
      }
    }

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      rowClick,
      handleEdit,
      handleDelete,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      Delete,
      Plus,
      Search,
      formatTagGroupModule,

      mouseEnter,
      mouseLeave,
      popoverRow,
      showPopover,
      hidePopover,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.config-type';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  .el-table {
    margin-top: 6px;
    //margin-top: $base-margin;
  }

}
</style>
