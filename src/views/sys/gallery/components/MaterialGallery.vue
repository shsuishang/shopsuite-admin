<template>
  <div class="material-gallery-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="24">
        <el-button v-permissions="{ permission: ['/manage/sys/material/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
    </ms-search-box>
    <el-menu
      :default-active="queryForm.gallery_id.toString()"
      :style="{maxHeight: height + 'px', overflowY: 'auto', overflowX:'hidden'}"
      @select="selectMenu"
    >
      <el-menu-item
        v-for="(row) in items"
        :key="row.gallery_id"
        :index="row.gallery_id.toString()"
        @mouseenter="mouseEnter(row)"
        @mouseleave="mouseLeave(row)"
      >
        <span> {{ row.gallery_name }} </span>

        <el-popover placement="top" trigger="hover" width="170">
          <template #reference>
            <el-button size="small" style="position: absolute;right: 40px"  text>
              <ms-icon v-show="hoverTagGroupId === row.gallery_id" class="rightIcon" icon="more-fill" @click.stop="showPopover(row)" @mouseenter="showPopover(row)" @mouseleave="hidePopover(row)" />
            </el-button>
          </template>
          <el-button v-permissions="{ permission: ['/manage/sys/material/edit'] }" :disabled="false" size="small" style="margin-left: 10px" type="primary" @click.stop="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/material/remove'] }" :disabled="false" size="small" style="margin-left: 20px" type="danger" @click.stop="handleDelete(row)">{{ t('删除') }}</el-button>
        </el-popover>

        <ms-icon class="rightIcon" icon="arrow-right-s-line" style="position: absolute;right: 20px" />
      </el-menu-item>
    </el-menu>
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {doRemoveGallery as doRemove, getListGallery as getList} from '@/api/sys/material'
import Edit from './MaterialGalleryEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'MaterialGallery',
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
      height: $tableHeight() + 30,
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 500,
        title: '',
        media_name: '',
        gallery_id: 0,
        gallery_type: 'image',
      },
      hoverTagGroupId: 0,
      isPopoverVisible:null,
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const selectMenu = (val) => {
      emit('fetch-item-data', JSON.parse(JSON.stringify(val)))
    }

    const queryGalleryData = async (gallery_type) => {

      state.queryForm.gallery_id = 0
      state.queryForm.gallery_type = gallery_type

      queryData()
    }

    const handleEdit = (row) => {
      if (row && row.gallery_id) {
        state.queryForm.gallery_id = row.gallery_id
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {

      if (row.gallery_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({gallery_id: row.gallery_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const gallery_id = state.selectRows.map((item) => item.gallery_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemove({gallery_id})
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
      const param = {}

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

      //第一条记录默认选中
      if (state.queryForm.gallery_id == 0) {
        if (items.length > 0) {
          state.queryForm.gallery_id = items[0].gallery_id
        }
      }

      emit('fetch-item-data', state.queryForm.gallery_id)

      state.items = items
      state.total = records
      state.listLoading = false
    }


    const mouseEnter = (row) => {
      state.hoverTagGroupId = row.gallery_id
    }

    const mouseLeave = () => {
      state.hoverTagGroupId = 0
    }

    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      selectMenu,
      queryGalleryData,
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
.el-menu-item span {
  width: 45%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
