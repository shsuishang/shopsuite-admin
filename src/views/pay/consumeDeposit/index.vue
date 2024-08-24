<template>
  <div class="consume-deposit-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="4">
<!--        <el-button v-permissions="{ permission: ['/manage/pay/consumeDeposit/add'] }" :icon="Plus" type="primary" @click="handleEdit">-->
<!--          {{ t('添加') }}-->
<!--        </el-button>-->
<!--        <el-button v-permissions="{ permission: ['/manage/pay/consumeDeposit/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">-->
<!--          {{ t('批量删除') }}-->
<!--        </el-button>-->
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="20">
        <el-form v-permissions="{ permission: ['/manage/pay/consumeDeposit/list'] }" :inline="true" :model="queryForm" @submit.prevent>
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
            <el-input
              v-model.trim="queryForm.deposit_subject"
              clearable
              :placeholder="t('请输入商品名称')"
              style="margin-left: 10px"
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
        :label="t('流水号')"
        prop="deposit_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('支付编号')"
        prop="deposit_no"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('交易号')"
        prop="deposit_trade_no"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('订单号')"
        prop="order_id"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        align="center"
        :label="t('支付渠道')"
        prop="payment_channel_id"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <div v-for="(item, index) in paymentChannelList" :key="index">
            <el-tag v-if="item.value == row.payment_channel_id">
              {{ item.label }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('商品名称')"
        prop="deposit_subject"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('支付方式')"
        prop="deposit_payment_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1301":"","1302":"success","1303":"warning","1304":"info","1305":"danger"})[row.deposit_payment_type]'>
            {{ ({"1301":t('货到付款'),"1302":t('在线支付'),"1303":t('白条支付'),"1304":t('现金支付'),"1305":t('线下支付')})[row.deposit_payment_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('交易状态')"
        prop="deposit_trade_status"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('卖家户号')"
        prop="deposit_seller_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('卖家支付账号')"
        prop="deposit_seller_email"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('买家支付用户号')"
        prop="deposit_buyer_id"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('买家支付账号')"
        prop="deposit_buyer_email"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('货币编号')"
        prop="currency_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('左符号')"
        prop="currency_symbol_left"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('交易金额')"
        prop="deposit_total_fee"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('购买数量')"
        prop="deposit_quantity"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('商品单价')"
        prop="deposit_price"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('商品描述')"
        prop="deposit_body"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('创建时间')"
        prop="deposit_gmt_create"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('付款时间')"
        prop="deposit_gmt_payment"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('调整总价')"
        prop="deposit_is_total_fee_adjust"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.deposit_is_total_fee_adjust ? 1 : 0]'>
            {{ ([t('否'),t('是')])[row.deposit_is_total_fee_adjust ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('使用红包')"
        prop="deposit_use_coupon"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.deposit_use_coupon ? 1 : 0]'>
            {{ ([t('否'),t('是')])[row.deposit_use_coupon ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('折扣')"
        prop="deposit_discount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('通知时间')"
        prop="deposit_notify_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('支付时间')"
        prop="deposit_time"
        show-overflow-tooltip
        width="160"
      />

      <el-table-column
        v-if="false"
        align="center"
        :label="t('通知类型')"
        prop="deposit_notify_type"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('校验编号')"
        prop="deposit_notify_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('签名方式')"
        prop="deposit_sign_type"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('签名')"
        prop="deposit_sign"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('额外参数')"
        prop="deposit_extra_param"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('支付')"
        prop="deposit_service"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('支付状态')"
        prop="deposit_state"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"0":"info","1":"success","9":"danger"})[row.deposit_state]'>
            {{ ({"0":t('默认'),"1":t('正常'),"9":t('异常订单')})[row.deposit_state] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('是否同步')"
        prop="deposit_async"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.deposit_async ? 1 : 0]'>
            {{ ([t('同步'),t('异步回调使用')])[row.deposit_async ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('收款确认')"
        prop="deposit_review"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.deposit_review ? t('点击') + t('未确认') :  t('点击')  + t('已确认')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.deposit_review" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否作废')"
        prop="deposit_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"success","2":"info"})[row.deposit_enable ? 1 : 0]'>
            {{ ({"1":t('正常'),"2":t('作废')})[row.deposit_enable ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
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
        :label="t('所属用户')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属门店')"
        prop="chain_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属分站')"
        prop="subsite_id"
        show-overflow-tooltip
        width="100"
      />
<!--      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">-->
<!--        <template #default="{ row }">-->
<!--          <el-button v-permissions="{ permission: ['/manage/pay/consumeDeposit/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>-->
<!--          <el-button v-permissions="{ permission: ['/manage/pay/consumeDeposit/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
  import {doRemove, doRemoveBatch, getList, editReview} from '@/api/pay/consumeDeposit'
  import Edit from './components/ConsumeDepositEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {getList as getUserList} from "@/api/account/userInfo";
  import {useSettingsStore} from "@/store/modules/settings";
  import {formatDateTime} from "@/utils/format";

  export default defineComponent({
    name: 'ConsumeDeposit',
    components: {Edit},
    emits: [],
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')
      const settingsStore = useSettingsStore()

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
          deposit_subject: '',
        },
        loading: false,
        userList: [],
        paymentChannelList: settingsStore.getConfigs.payment_channel_list,
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
        if (row && row.deposit_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.deposit_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({deposit_id: row.deposit_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const deposit_id = state.selectRows.map((item) => item.deposit_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({deposit_id})
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
          deposit_id: row.deposit_id,
          deposit_review: row.deposit_review,
        }

        const {msg, status} = await editReview(param)

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
        formatDateTime,
        queryData,
        findRemoteUserList,
        fetchData,
        Delete,
        Plus,
        Search,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.consume-deposit';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
