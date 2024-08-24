<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="70%"
    :title="title"
    top="1%"
    :with-header="true"
    @close="close"
  >
    <div class="product-comment-reply-container">
      <ms-search-box>
        <ms-search-box-left-panel :span="4">
          <el-button v-permissions="{ permission: ['/manage/pt/productComment/list'] }" :icon="Plus" type="primary" @click="handleEdit">
            {{ t('回复评论') }}
          </el-button>
        </ms-search-box-left-panel>
        <ms-search-box-right-panel :span="20">
          <el-form v-permissions="{ permission: ['/manage/pt/productComment/list'] }" :inline="true" :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.user_name"
                clearable
                :placeholder="t('请输入用户名称')"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.user_name_to"
                clearable
                :placeholder="t('请输入被回复用户名称')"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.comment_reply_content"
                clearable
                :placeholder="t('请输入回复内容')"
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
      >
        <el-table-column
          align="center"
          fixed="left"
          :label="t('回复编号')"
          prop="comment_reply_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          v-if="false"
          align="center"
          :label="t('评论编号')"
          prop="comment_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('用户编号')"
          prop="user_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('用户名称')"
          prop="user_name"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('被回复用户')"
          prop="user_id_to"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('被回复用户名称')"
          prop="user_name_to"
          show-overflow-tooltip
          width="130"
        />
        <el-table-column
          align="center"
          :label="t('评论回复内容')"
          prop="comment_reply_content"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          :formatter="formatDateTime"
          :label="t('评论回复时间')"
          prop="comment_reply_time"
          show-overflow-tooltip
          width="160"
        />
        <el-table-column
          align="center"
          :label="t('允许显示')"
          prop="comment_reply_enable"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row.brand_enable ? t('点击') + t('不允许') :  t('点击')  + t('允许')"
              :enterable="false"
              placement="top"
            >
              <el-switch v-model="row.comment_reply_enable" @change="handleState(row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('管理员评价')"
          prop="comment_reply_isadmin"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type='(["info","success"])[row.comment_reply_isadmin ? 1 : 0]'>
              {{ ([t('否'),t('是')])[row.comment_reply_isadmin ? 1 : 0] }}
            </el-tag>
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
      <reply ref="replyRef" @fetch-data="fetchData"/>
    </div>
  </el-drawer>

</template>

<script>
  import { translate as t } from '@/i18n'
  import {getList, doRemove, editState} from '@/api/pt/productCommentReply'
  import Reply from './Reply'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {formatDateTime} from "@/utils/format";

  export default defineComponent({
    name: 'ProductCommentReply',
    components: {Reply},
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        replyRef: null,
        height: $tableHeight(),
        items: [],
        title: t('评价回复'),
        dialogFormVisible: false,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          page: 1,
          size: 10,
          comment_id: '',
        },
      })

      const handleEdit = () => {
        state.replyRef.showEdit(state.queryForm.comment_id)
      }
      const handleDelete = (row) => {
        if (row.comment_reply_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({comment_reply_id: row.comment_reply_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        }
      }

      const handleState = async (row) => {
        console.info(row)
        const param = {
          comment_reply_id: row.comment_reply_id,
          comment_reply_enable: row.comment_reply_enable
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

      const showItems = (row) => {
        if (row) {
          state.queryForm.comment_id = row.comment_id
          fetchData()
          state.dialogFormVisible = true
        }
      }

      const close = () => {
        state.queryForm = {}
        emit('fetch-data')
        state.dialogFormVisible = false
      }

      return {
        t,
        ...toRefs(state),
        handleEdit,
        handleDelete,
        close,
        showItems,
        handleState,
        formatDateTime,
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
  $base: '.product-comment-reply';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
