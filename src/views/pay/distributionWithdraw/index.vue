<template>
  <div class="distribution-withdraw-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-if="false" v-permissions="{ permission: ['/manage/pay/distributionWithdraw/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/pay/distributionWithdraw/list'] }" :inline="true" :model="queryForm" @submit.prevent>
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
              :style="{width:'160px'}"
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
            <el-select
              v-model="queryForm.duw_state"
              clearable
              :placeholder="t('请选择审核状态')"
              :style="{width:'160px'}"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
        :label="t('编号')"
        prop="duw_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('会员支付编号')"
        prop="user_id"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('提现额度')"
        prop="duw_amount"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('提现审核')"
        prop="duw_state"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.duw_state ? t('提现已通过') :  t('点击')  + t('提现通过')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.duw_state" :disabled="row.duw_state" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('操作管理员')"
        prop="duw_user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('创建时间')"
        prop="duw_time"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column v-if="false" align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pay/distributionWithdraw/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pay/distributionWithdraw/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
  import { getList, editState} from '@/api/pay/distributionWithdraw'
  import Edit from './components/DistributionWithdrawEdit'
  import {formatDateTime} from "@/utils/format";
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {getList as getUserList} from "@/api/account/userInfo";

  export default defineComponent({
    name: 'DistributionWithdraw',
    components: {Edit},
    emits: [],
    setup() {
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        editRef: null,
        height: $tableHeight(),
        userList: [],
        loading: false,
        items: [],
        listLoading: true,
        options: [
          {
            value: false,
            label: "申请中",
          },
          {
            value: true,
            label: "提现通过",
          },
        ],
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          page: 1,
          size: 10,
          title: '',
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.duw_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        console.info(row)
        // if (row.duw_id) {
        //   $confirm(t('你确定要删除当前项吗'), null, async () => {
        //     const {msg, status} = await doRemove({duw_id: row.duw_id})
        //
        //     if (200 == status) {
        //       $message(msg, 'success')
        //     } else {
        //       $message(msg, 'error')
        //     }
        //
        //     await fetchData()
        //   })
        // } else {
        //   if (state.selectRows.length > 0) {
        //     const duw_id = state.selectRows.map((item) => item.duw_id).join()
        //     $confirm(t('你确定要删除选中项吗'), null, async () => {
        //       const {msg, status} = await doRemoveBatch({duw_id})
        //       if (200 == status) {
        //         $message(msg, 'success')
        //       } else {
        //         $message(msg, 'error')
        //       }
        //       await fetchData()
        //     })
        //   } else {
        //     $message(t('未选中任何行'), 'error')
        //   }
        // }
      }
      const handleState = async (row) => {
        console.info(row)
        const param = {
          duw_id: row.duw_id,
          duw_state: row.duw_state
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
        formatDateTime,
        queryData,
        fetchData,
        findRemoteUserList,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.distribution-withdraw';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
