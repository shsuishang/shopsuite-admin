<template>
  <div class="feedback-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="6">
<!--        <el-button v-permissions="{ permission: ['/manage/sys/feedbackBase/add'] }" :icon="Plus" type="primary" @click="handleEdit">-->
<!--          {{ t('添加') }}-->
<!--        </el-button>-->
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="18">
        <el-form v-permissions="{ permission: ['/manage/sys/feedbackBase/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-select
              v-model="queryForm.feedback_category_id"
              clearable
              :placeholder="t('请选择反馈分类')"
              :style="{width:'150px'}"
            >
              <el-option
                v-for="item in feedbackCategoryList"
                :key="item.feedback_category_id"
                :label="item.feedback_category_name"
                :value="item.feedback_category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.user_id"
              class="ml10"
              clearable
              filterable
              :loading="loading"
              :placeholder="t('请输入用户昵称')"
              remote
              :remote-method="findRemoteUserList"
              reserve-keyword
              :style="{width:'150px'}"
            >
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.user_nickname"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.feedback_question"
              clearable
              :placeholder="t('请输入反馈问题')"
              :style="{width:'150px'}"
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
        :label="t('反馈编号')"
        prop="feedback_id"
        show-overflow-tooltip
        width="100"
      />
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('分类编号')"-->
<!--        prop="feedback_category_id"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      />-->
      <el-table-column
        align="center"
        :label="t('分类名称')"
        prop="feedback_category_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <div v-for="(item, index) in feedbackCategoryList" :key="index">
            <div v-if="item.feedback_category_id == row.feedback_category_id">
              {{item.feedback_category_name}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('用户编号')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('用户昵称')"
        prop="user_nickname"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('反馈问题')"
        prop="feedback_question"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('页面链接')"
        prop="feedback_question_url"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('回复')"
        prop="feedback_question_answer"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('反馈时间')"
        prop="feedback_question_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('回复时间')"
        prop="feedback_question_answer_time"
        show-overflow-tooltip
        width="160"
      />
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('举报状态')"-->
<!--        prop="feedback_question_status"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      >-->
<!--        <template #default="{ row }">-->
<!--          <el-tag :type='(["info","success"])[row.feedback_question_status ? 1 : 0]'>-->
<!--            {{ ([t('未处理'),t('已处理')])[row.feedback_question_status ? 1 : 0] }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('处理结果')"-->
<!--        prop="feedback_question_result"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      >-->
<!--        <template #default="{ row }">-->
<!--          <el-tag :type='({"1":"info","2":"warning","3":"success"})[row.feedback_question_result]'>-->
<!--            {{ ({"1":t('无效举报'),"2":t('恶意举报'),"3":t('有效举报')})[row.feedback_question_result] }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('产品编号')"-->
<!--        prop="item_id"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      />-->
<!--      <el-table-column-->
<!--        align="center"-->
<!--        :label="t('回复人员')"-->
<!--        prop="admin_id"-->
<!--        show-overflow-tooltip-->
<!--        width="100"-->
<!--      />-->
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/feedbackBase/edit'] }" text @click="handleEdit(row)">{{ t('回复') }}</el-button>
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
import {doRemove, doRemoveBatch, getList, doEdit} from '@/api/sys/feedbackBase'
import Edit from './components/FeedbackBaseEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getList as getUserList} from "@/api/account/userInfo";
import {formatDate, formatDateTime} from "@/utils/format";
import {getList as getFeedbackCategorys} from '@/api/sys/feedbackCategory'

export default defineComponent({
  name: 'FeedbackBase',
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
        feedback_question: '',
      },
      loading: false,
      userList: [],
      switchStatus: false,
      feedbackCategoryList: [],
    })

    const findRemoteUserList = (user_nickname) => {
      if (user_nickname !== '') {
        state.loading = true
        setTimeout(() => {
          state.loading = false
          getUserList({user_nickname: user_nickname}).then((res) => {
            state.userList = res.data.items
          })
        }, 200)
      } else {
        state.userList = []
      }
    }

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.feedback_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.feedback_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({feedback_id: row.feedback_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const feedback_id = state.selectRows.map((item) => item.feedback_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({feedback_id})
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
            feedback_id : row.feedback_id,
            feedback_question_status : row.feedback_question_status
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
      getFeedbackCategoryList()
    })

    const getFeedbackCategoryList = async (query) => {
      const { data } = await getFeedbackCategorys({size:500, feedback_category_name: query,})
      state.feedbackCategoryList = data.items
    }


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
      formatDate,
      formatDateTime,
      findRemoteUserList,
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
$base: '.feedback-base';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
