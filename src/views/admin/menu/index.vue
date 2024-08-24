<template>
  <div class="menu-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/admin/menu/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>

        <el-button
          v-permissions="{ permission: ['/manage/admin/menu/list'] }"
          :icon="Upload"
          type="primary"
          @click="toggleRowExpansion(true)"
        >
          {{ t('全部展开') }}
        </el-button>
        <el-button
          v-permissions="{ permission: ['/manage/admin/menu/list'] }"
          :icon="Download"
          type="primary"
          @click="toggleRowExpansion(false)"
        >
          {{ t('全部折叠') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.menu_title"
              clearable
              :placeholder="t('请输入菜单名称')"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="queryData">
              {{ t('查询') }}
            </el-button>
          </el-form-item>
        </el-form>
      </ms-search-box-right-panel>
    </ms-search-box>


    <el-table
      ref="treeRef"
      v-loading="listLoading"
      border
      :data="items"
      default-expand-all
      :height="height"
      row-key="menu_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="left"
        fixed="left"
        :label="t('菜单名称')"
        prop="menu_title"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
              <span v-if="row.meta">
                <ms-icon v-if="row.meta.icon" :icon="row.meta.icon"/>
              </span>
          {{ row.menu_title }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('菜单编号')"
        prop="menu_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('图标设置')"
        prop="menu_icon"
        show-overflow-tooltip
        width="90"
      >
        <template #default="{ row }">
              <span v-if="row.meta">
                <ms-icon v-if="row.meta.icon" :icon="row.meta.icon"/>
              </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('菜单类型')"
        prop="menu_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.menu_type]'>
            {{ ([t('按钮'), t('菜单')])[row.menu_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('组件名称')"
        prop="name"
        show-overflow-tooltip
        width="180"
      />
      <el-table-column
        align="center"
        :label="t('组件路由')"
        prop="path"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        align="center"
        :label="t('组件路径')"
        prop="component"
        show-overflow-tooltip
        width="240"
      />
      <el-table-column
        align="center"
        :label="t('权限标识')"
        prop="menu_permission"
        show-overflow-tooltip
        width="240"
      />
      <el-table-column
        align="center"
        :label="t('重定向')"
        prop="redirect"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('菜单排序')"
        prop="menu_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否隐藏')"
        prop="menu_hidden"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.menu_hidden === false ? t('点击') + t('隐藏') :  t('点击')  + t('展示')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.menu_hidden" inline-prompt @change="handleState(row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('允许关闭')"
        prop="menu_close"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.menu_close === false ? t('点击') + t('允许') :  t('点击')  + t('禁止')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.menu_close" @change="handleState(row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center" :label="t('菜单标签')"
        prop="menu_bubble" show-overflow-tooltip width="100"/>

      <el-table-column
        align="center"
        :label="t('显示红点')"
        prop="menu_dot"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.menu_dot === false ? t('点击') + t('显示') :  t('点击')  + t('隐藏')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.menu_dot" inline-prompt @change="handleState(row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="260">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/admin/menu/add'] }" text @click="handleAdd(row)">{{ t('添加') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/admin/menu/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/admin/menu/remove'] }" :disabled="row.menu_buildin" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit ref="editRef" :menu-list="menuList" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {doRemove, getTree,editState} from '@/api/admin/menu'
import Edit from './components/MenuEdit'
import {Delete, Download, Plus, Search, Upload} from '@element-plus/icons-vue'
import {filterRoutes} from '@/utils/routes'

export default defineComponent({
  name: 'Menu',
  components: {Edit},
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      treeRef: null,
      height: $tableHeight() + 55,
      items: [],
      menuList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        type: 2,
        menu_title: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }

    const handleAdd = (row) => {
      if (row.menu_id) {
        state.editRef.showAdd(row)
      } else {
        state.editRef.showAdd()
      }
    }
    const handleEdit = (row) => {
      if (row.menu_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.menu_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({menu_id: row.menu_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          //const menu_id = state.selectRows.map((item) => item.menu_id).join()
          const menu_id = state.selectRows.map((item) => item.menu_id)
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemove({menu_id})
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
        menu_id : row.menu_id,
        menu_close : row.menu_close,
        menu_hidden : row.menu_hidden,
        menu_dot : row.menu_dot,
      }
      const {msg, status} = await editState(param)
      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }
      await this.fetchData()
    }
    const handleCurrentChange = (val) => {
      state.queryForm.page = val
      fetchData()
    }

    const toggleRowExpansion = (isExpansion) => {

      toggleRowExpansionAll(state.items, isExpansion)
    }
    const toggleRowExpansionAll = (data, isExpansion) => {
      data.forEach((item) => {
        state['treeRef'].toggleRowExpansion(item, isExpansion)
        if (item.children !== undefined && item.children != null) {
          toggleRowExpansionAll(item.children, isExpansion)
        }
      })
    }

    const queryData = () => {
      state.queryForm.page = 1
      fetchData()
    }
    const fetchData = async () => {
      state.listLoading = true
      const {
        data
      } = await getTree(state.queryForm)

      state.items = filterRoutes([...data])

      state.menuList = [
        {
          menu_id: 0,
          menu_title: t('根节点'),
          children: state.items,
        },
      ]

      state.listLoading = false
    }
    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleAdd,
      handleEdit,
      handleDelete,
      handleState,
      handleCurrentChange,
      queryData,
      fetchData,
      Delete,
      Plus,
      Search, Download, Upload,
      toggleRowExpansion,
    }
  },
})
</script>
