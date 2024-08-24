<template>
  <div class="product-ask-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/pt/productAskBase/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
        <el-button v-permissions="{ permission: ['/manage/pt/productAskBase/remove'] }" :icon="Delete" type="danger" @click="handleDelete">
          {{ t('批量删除') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/pt/productAskBase/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.product_id"
              clearable
              :placeholder="t('请输入商品编号')"
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
      <el-table-column align="center" show-overflow-tooltip type="selection"/>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('咨询编号')"
        prop="ask_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('商品编号')"
        prop="product_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('用户名称')"
        prop="user_nickname"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('咨询内容')"
        prop="ask_question"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <span v-html="row.ask_question"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('提问时间')"
        prop="ask_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('答案')"
        prop="ask_answer"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <span v-html="row.ask_answer"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('回答时间')"
        prop="ask_answer_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('回复人')"
        prop="ask_answer_user_nickname"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('是否回复')"
        prop="ask_status"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.ask_status ? 1 : 0]'>
            {{ ([t('未回复'),t('已回复')])[row.ask_status ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否展示')"
        prop="ask_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.ask_enable === 0 ? t('点击') + t('展示') :  t('点击')  + t('不展示')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.ask_enable"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('点赞数量')"
        prop="ask_helpful"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productAskBase/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productAskBase/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
import {doRemove, doRemoveBatch, doEdit, getList} from '@/api/pt/productAskBase'
import Edit from './components/ProductAskBaseEdit.vue'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ProductAskBase',
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
      switchStatus: false,
      queryForm: {
        page: 1,
        size: 10,
        product_id: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.ask_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.ask_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({ask_id: row.ask_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const ask_id = state.selectRows.map((item) => item.ask_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({ask_id})
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
          ask_id: row.ask_id,
          ask_enable: row.ask_enable
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
      beforeSwitchChange,
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
$base: '.product-ask-base';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
