<template>
  <div class="user-tag-group-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/account/userTagBase/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
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
        prop="tag_group_id"
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        align="center"
        :label="t('分组名称')"
        prop="tag_group_name"
        show-overflow-tooltip
      />
      <el-table-column align="center" fixed="right" :label="t('操作')"  width="100" >
        <template #default="{ row }">
          <el-popover placement="top" trigger="click" :visible="isPopoverVisible(row)"  width="170">
            <template #reference>
              <el-button size="small" text><ms-icon v-show="hoverTagGroupId === row.tag_group_id" class="rightIcon" icon="more-fill" @click.stop="showPopover(row)" /></el-button>
            </template>
            <el-button v-permissions="{ permission: ['/manage/account/userTagBase/edit'] }" type="primary" @click.stop="handleEdit(row)">{{ t('编辑') }}</el-button>
            <el-button v-permissions="{ permission: ['/manage/account/userTagBase/remove'] }" class="pop-second-btn" type="danger" @click.stop="handleDelete(row)">{{ t('删除') }}</el-button>
          </el-popover>

          <ms-icon class="rightIcon" icon="arrow-right-s-line" style="float: right;"/>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>


<script>
  import { translate as t } from '@/i18n'
  import {doRemove, doEdit, doRemoveBatch, getList} from '@/api/account/userTagGroup'
  import Edit from './UserTagGroupEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'UserTagGroup',
    components: {Edit},
    emits: ['fetch-item-data'],
    setup(props, {emit}) {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

      const popoverRow = ref(null);

      const showPopover = (row) => {
        popoverRow.value = popoverRow.value === row ? null : row;
      };

      const isPopoverVisible = (row) => {
        return popoverRow.value === row;
      };

      const state = reactive({
        editRef: null,
        height: $tableHeight() + 28,
        items: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        switchStatus: false,
        queryForm: {
          page: 1,
          size: 500,
        },


        hoverTagGroupId: 0,
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }

      const rowClick = (val) => {
        emit('fetch-item-data', JSON.parse(JSON.stringify(val)))
      }

      const mouseEnter = (row) => {
        state.hoverTagGroupId = row.tag_group_id
      }

      const mouseLeave = () => {
        state.hoverTagGroupId = 0
      }

      const handleEdit = (row) => {
        if (row && row.tag_group_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.tag_group_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({tag_group_id: row.tag_group_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const tag_group_id = state.selectRows.map((item) => item.tag_group_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({tag_group_id})
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

      const beforeSwitchChange = () => {
        state.switchStatus = true;
        return state.switchStatus;
      }


      const handleState = async (row) => {
        console.info(row)

        if (state.switchStatus) {

          const param = {
            tag_group_id: row.tag_group_id,
            tag_group_enable: row.tag_group_enable
          }

          const {msg, status} = await doEdit(param)

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()

        }
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

        //第一条记录默认选中
        if (items.length > 0) {
          rowClick(items[0])
        }

        state.items = items
        state.total = records
        state.listLoading = false
      }
      onMounted(() => {
        fetchData()
      })

      return {
        t,
        ...toRefs(state),
        setSelectRows,
        handleEdit,
        rowClick,
        handleDelete,
        handleState,
        handleSizeChange,
        beforeSwitchChange,
        handleCurrentChange,
        queryData,
        fetchData,
        Delete,
        Plus,
        Search,

        mouseEnter,
        mouseLeave,

        popoverRow,
        showPopover,
        isPopoverVisible,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.user-tag-group';
  #{$base}-container {

    .pop-second-btn {
      margin-left: 0px!important;
    }

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }

  }

  .pop-second-btn {
    margin-left: 10px!important;
  }
</style>
