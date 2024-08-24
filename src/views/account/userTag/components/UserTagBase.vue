<template>
  <div class="user-tag-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/account/userTagBase/add'] }" :disabled="queryForm.tag_group_id==0" :icon="Plus" type="primary" @click="handleEdit">
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
      <el-table-column
        align="center"
        fixed="left"
        :label="t('标签编码')"
        prop="tag_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('标签名称')"
        prop="tag_title"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('所属分组')"
        prop="tag_group_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="tag_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="tag_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.tag_enable === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.tag_enable"  active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/account/userTagBase/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/account/userTagBase/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
  import {doRemove, editState, doRemoveBatch, getList} from '@/api/account/userTagBase'
  import Edit from './UserTagBaseEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'UserTagBase',
    components: {Edit},
    emits: [],
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

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
          size: 10,
          tag_group_id: 0,
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.tag_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit({ tag_group_id: state.queryForm.tag_group_id })
        }
      }
      const handleDelete = (row) => {
        if (row.tag_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({tag_id: row.tag_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const tag_id = state.selectRows.map((item) => item.tag_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({tag_id})
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
            tag_id: row.tag_id,
            tag_enable: row.tag_enable
          }

          const {msg, status} = await editState(param)

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
      const fetchData = async (tag_group_id) => {
        if (typeof tag_group_id != "undefined") {
          state.queryForm.tag_group_id = tag_group_id
        }

        state.listLoading = true
        const {
          data: {items, records},
        } = await getList(state.queryForm)
        state.items = items
        state.total = records
        state.listLoading = false
      }
      onMounted(() => {
        // fetchData()
      })

      return {
        t,
        ...toRefs(state),
        setSelectRows,
        handleEdit,
        handleDelete,
        beforeSwitchChange,
        handleState,
        handleSizeChange,
        handleCurrentChange,
        queryData,
        fetchData,
        Delete,
        Plus,
        Search,
        form: state.queryForm,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.user-tag-base';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
