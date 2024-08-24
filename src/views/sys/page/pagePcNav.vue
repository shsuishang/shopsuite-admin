<template>
  <div class="page-pc-nav-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/sys/diy/index'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.nav_title"
              clearable
              :placeholder="t('请输入标题')"
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
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('编号')"
        prop="nav_id"
        show-overflow-tooltip
        width="60"
      />
      <el-table-column
        align="center"
        :label="t('导航标题')"
        prop="nav_title"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('导航链接')"
        prop="nav_url"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('导航位置')"
        prop="nav_position"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["","success","warning"])[row.nav_position]'>
            {{ ([t('头部'),t('中部'),t('底部')])[row.nav_position] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('是否以新窗口打开')"
        prop="nav_target_blank"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.nav_target_blank === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.nav_target_blank" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('导航下拉内容')"
        prop="nav_dropdown_menu"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="nav_order"
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="nav_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.nav_enable === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.nav_enable" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('系统内置')"
        prop="nav_buildin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","0":"success"})[row.nav_buildin]'>
            {{ ({"1":t('是'),"0":t('否')})[row.nav_buildin] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.size"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, getList, editState} from '@/api/sys/pagePcNav'
import Edit from './components/PagePcNavEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'PagePcNav',
  components: {Edit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        nav_title: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.nav_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.nav_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({nav_id: row.nav_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const nav_id = state.selectRows.map((item) => item.nav_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({nav_id})
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
        nav_id : row.nav_id,
        nav_enable : row.nav_enable
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
      handleDelete,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.page-pc-nav';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 36px;
    }
  }
}
</style>
