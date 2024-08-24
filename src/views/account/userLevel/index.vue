<template>
  <div class="user-level-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/account/userLevel/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/account/userLevel/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.user_level_name"
              clearable
              :placeholder="t('请输入等级名称')"
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
        :label="t('等级编号')"
        prop="user_level_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('等级名称')"
        prop="user_level_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('升级经验值')"
        prop="user_level_exp"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('累计消费')"
        prop="user_level_spend"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('等级图标')"
        prop="user_level_logo"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.user_level_logo]"
            preview-teleported
            :src="row.user_level_logo"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('折扣率')"
        prop="user_level_rate"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('修改时间')"
        prop="user_level_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('系统内置')"
        prop="user_level_is_buildin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.user_level_is_buildin === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.user_level_is_buildin" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('系统内置')"
        prop="user_level_is_buildin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.user_level_is_buildin ? 1 : 0]'>
            {{ ([t('否'),t('是')])[row.user_level_is_buildin ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/account/userLevel/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/account/userLevel/remove'] }" :disabled="row.user_level_is_buildin===true" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
import {doRemove, doRemoveBatch, getList} from '@/api/account/userLevel'
import Edit from './components/UserLevelEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDateTime} from "@/utils/format";

export default defineComponent({
  name: 'UserLevel',
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
        user_level_name: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.user_level_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.user_level_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({user_level_id: row.user_level_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const user_level_id = state.selectRows.map((item) => item.user_level_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({user_level_id,})
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
      formatDateTime,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.user-level';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
