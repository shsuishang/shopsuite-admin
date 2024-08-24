<template>
  <div class="consume-withdraw-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-if="false" v-permissions="{ permission: ['/manage/pay/consumeWithdraw/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/pay/consumeWithdraw/list'] }" :inline="true" :model="queryForm" @submit.prevent>
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
              v-model="queryForm.withdraw_state"
              clearable
              :placeholder="t('请选择提现状态')"
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
    >
      <el-table-column
        align="center"
        fixed="left"
        :label="t('编号')"
        prop="withdraw_id"
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
        :label="t('用户昵称')"
        prop="user_nickname"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属店铺')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('所属订单')"
        prop="order_id"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('退款单号')"
        prop="return_id"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('提现方式')"
        prop="withdraw_mode"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["","success"])[row.withdraw_mode]'>
            {{ ([t('余额提现'),t('佣金提现')])[row.withdraw_mode] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('提现额度')"
        prop="withdraw_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('提现状态')"
        prop="withdraw_state"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["warning","success","danger",""])[row.withdraw_state]'>
            {{ ([t('申请中'),t('提现通过'),t('驳回'),t('打款完成')])[row.withdraw_state] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('描述')"
        prop="withdraw_desc"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('银行')"
        prop="withdraw_bank"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        align="center"
        :label="t('银行账户')"
        prop="withdraw_account_no"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('开户名称')"
        prop="withdraw_account_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('提现手续费')"
        prop="withdraw_fee"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('创建时间')"
        prop="withdraw_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('银行流水账号')"
        prop="withdraw_bankflow"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('操作管理员')"
        prop="withdraw_user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('操作时间')"
        prop="withdraw_opertime"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('联系手机')"
        prop="withdraw_mobile"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('')"
        prop="withdraw_trans_state"
        show-overflow-tooltip
        width="200"
      />

      <el-table-column
        align="center"
        :label="t('绑定对应的发票号')"
        prop="withdraw_invoice_no"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属分站')"
        prop="subsite_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="100">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pay/consumeWithdraw/edit'] }" :disabled="row.withdraw_state != 0" text @click="handleEdit(row)">{{ t('审核打款') }}</el-button>
          <el-button v-if="false" v-permissions="{ permission: ['/manage/pay/consumeWithdraw/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
  import {getList} from '@/api/pay/consumeWithdraw'
  import Edit from './components/ConsumeWithdrawEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {formatDateTime} from "@/utils/format";
  import {getList as getUserList} from "@/api/account/userInfo";

  export default defineComponent({
    name: 'ConsumeWithdraw',
    components: {Edit},
    emits: [],
    setup() {
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        editRef: null,
        height: $tableHeight(),
        items: [],
        listLoading: true,
        loading: false,
        userList: [],
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        options: [
          {
            value: 0,
            label: "申请中",
          },
          {
            value: 1,
            label: "提现通过",
          },
          {
            value: 2,
            label: "驳回",
          },
          {
            value: 3,
            label: "打款完成",
          },
        ],
        queryForm: {
          page: 1,
          size: 10,
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.withdraw_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        console.info(row)
        // if (row.withdraw_id) {
        //   $confirm(t('你确定要删除当前项吗'), null, async () => {
        //     const {msg, status} = await doRemove({withdraw_id: row.withdraw_id})
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
        //     const withdraw_id = state.selectRows.map((item) => item.withdraw_id).join()
        //     $confirm(t('你确定要删除选中项吗'), null, async () => {
        //       const {msg, status} = await doRemoveBatch({withdraw_id})
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
        // const param = {
        // }
        //
        // const {msg, status} = await editState(param)
        //
        // if (200 == status) {
        //   $message(msg, 'success')
        // } else {
        //   $message(msg, 'error')
        // }
        //
        // await fetchData()
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
        findRemoteUserList,
        formatDateTime,
        fetchData,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.consume-withdraw';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
