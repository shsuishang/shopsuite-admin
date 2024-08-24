<template>
  <div class="user-message-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/account/userMessage/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/account/userMessage/list'] }" :inline="true" :model="queryForm" @submit.prevent>
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
              :style="{width:'140px'}"
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
        :label="t('消息编号')"
        prop="message_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('上级编号')"
        prop="message_parent_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('所属用户')"
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
        :label="t('消息种类')"
        prop="message_kind"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.message_kind]'>
            {{ ({"1":t('发送消息'),"2":t('接收消息')})[row.message_kind] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('相关用户')"
        prop="user_other_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('相关昵称')"
        prop="user_other_nickname"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('消息标题')"
        prop="message_title"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('消息内容')"
        prop="message_content"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatStartTime "
        :label="t('发送时间')"
        prop="message_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('是否读取')"
        prop="message_is_read"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.message_is_read === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.message_is_read"  active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否删除')"
        prop="message_is_delete"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.message_is_delete === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.message_is_delete"  active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('消息类型')"
        prop="message_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.message_type]'>
            {{ ({"1":t('系统消息'),"2":t('用户消息')})[row.message_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('消息类型')"
        prop="message_cat"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"text":"","img":"success","video":"warning","file":"info","location":"info","redpack":"info"})[row.message_cat]'>
            {{ ({"text":t('文本消息'),"img":t('图片消息'),"video":t('视频消息'),"file":t('文件'),"location":t('位置'),"redpack":t('红包')})[row.message_cat] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('消息分类')"
        prop="message_data_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["","success","warning","info","",""])[row.message_data_type]'>
            {{ ([t('默认消息'),t('公告消息'),t('订单消息'),t('商品消息'),t('余额卡券'),t('服务消息')])[row.message_data_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('消息数据')"
        prop="message_data_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('消息长度')"
        prop="message_length"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('图片宽度')"
        prop="message_w"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('图片高度')"
        prop="message_h"
        show-overflow-tooltip
        width="100"
      />
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
import {doRemove, doRemoveBatch, getList , editState} from '@/api/account/userMessage'
import Edit from './components/UserMessageEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getList as getUserList} from "@/api/account/userInfo";

export default defineComponent({
  name: 'UserMessage',
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
      },
      loading: false,
      userList: [],
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
      if (row && row.message_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.message_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({message_id: row.message_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const message_id = state.selectRows.map((item) => item.message_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({message_id})
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
            message_id : row.message_id,
            message_is_read : row.message_is_read,
            message_is_delete : row.message_is_delete
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

    // 格式化时间戳为可读时间格式的计算属性
    const formatStartTime  = computed(() => {
      return (row) => {
        const timestamp = row.message_time;
        const dateObj = new Date(timestamp);
        const formattedTime = formatDate(dateObj); // 调用自定义函数格式化时间
        return formattedTime;
      };
    });

    // 自定义函数，将Date对象格式化为时间字符串
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      formatStartTime,
      handleEdit,
      handleDelete,
      handleState,
      beforeSwitchChange,
      findRemoteUserList,
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
$base: '.user-message';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
