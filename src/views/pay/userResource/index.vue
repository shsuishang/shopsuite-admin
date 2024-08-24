<template>
  <div class="user-resource-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
<!--        <el-button v-permissions="{ permission: ['/manage/pay/userResource/add'] }" :icon="Plus" type="primary" @click="handleEdit">-->
<!--          {{ t('添加') }}-->
<!--        </el-button>-->
<!--        <el-button v-permissions="{ permission: ['/manage/pay/userResource/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">-->
<!--          {{ t('批量删除') }}-->
<!--        </el-button>-->
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.prevent>
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
        :label="t('用户资金')"
        prop="user_money"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <label style="font-size: 12px;">{{ row.currency_symbol_left }}</label>{{ row.user_money }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('冻结资金')"
        prop="user_money_frozen"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('充值卡余额')"
        prop="user_recharge_card"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('冻结充值卡')"
        prop="user_recharge_card_frozen"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('积分')"
        prop="user_points"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('冻结积分')"
        prop="user_points_frozen"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('可用信用')"
        prop="user_credit"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('冻结额度')"
        prop="user_credit_frozen"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('使用信用')"
        prop="user_credit_used"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('信用额度')"
        prop="user_credit_total"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('保证金')"
        prop="user_margin"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('红包额度')"
        prop="user_redpack"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('红包冻结额度')"
        prop="user_redpack_frozen"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="180">
        <template #default="{ row }">
<!--          <el-button v-permissions="{ permission: ['/manage/pay/userResource/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>-->
          <el-button v-permissions="{ permission: ['/manage/pay/userResource/edit'] }" style="margin-right: 15px" text @click="MoneyShow(row)">{{ t('修改资金')}}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pay/userResource/edit'] }" text @click="PointsShow(row)">{{ t('修改积分') }}</el-button>
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
    <money ref="moneyRef" @fetch-data="fetchData"/>
    <points ref="pointsRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList} from '@/api/pay/userResource'
import Edit from '@/views/pay/userResource/components/UserResourceEdit.vue'
import Money from '@/views/pay/userResource/components/UserMoneyEdit'
import Points from '@/views/pay/userResource/components/PointsEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getList as getUserList} from "@/api/account/userInfo";

export default defineComponent({
  name: 'UserResource',
  components: {Edit, Money, Points},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      moneyRef: null,
      pointsRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        title: '',
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
      if (row && row.user_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }

    const MoneyShow = (row) => {
      if (row && row.user_id) {
        state.moneyRef.showEdit(row)
      }
    }

    const PointsShow = (row) => {
      if (row && row.user_id) {
        state.pointsRef.showEdit(row)
      }
    }
    const handleDelete = (row) => {
      if (row.user_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({user_id: row.user_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const user_id = state.selectRows.map((item) => item.user_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({user_id})
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
      findRemoteUserList,
      handleEdit,
      MoneyShow,
      PointsShow,
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
$base: '.user-resource';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
