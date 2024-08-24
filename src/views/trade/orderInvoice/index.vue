<template>
  <div class="order-invoice-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="4">
        <el-button v-if="false" v-permissions="{ permission: ['/manage/trade/orderInvoice/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="20">
        <el-form v-permissions="{ permission: ['/manage/trade/orderInvoice/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.invoice_title"
              clearable
              :placeholder="t('请输入发票抬头')"
              style="width: 160px"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.order_id"
              clearable
              :placeholder="t('请输入订单编号')"
              style="width: 160px"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.invoice_is_electronic"
              clearable
              :placeholder="t('请选择发票种类')"
              style="width: 160px"
            >
              <el-option
                v-for="(item, index) in electronicOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.invoice_type"
              clearable
              :placeholder="t('请选择发票类型')"
              style="width: 160px"
            >
              <el-option
                v-for="(item, index) in typeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.invoice_status"
              clearable
              :placeholder="t('请选择开票状态')"
              style="width: 160px"
            >
              <el-option
                v-for="(item, index) in paidOptions"
                :key="index"
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
        :label="t('发票编号')"
        prop="order_invoice_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('订单编号')"
        prop="order_id"
        show-overflow-tooltip
        width="160"
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
        :label="t('店铺编号')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('发票抬头')"
        prop="invoice_title"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('发票内容')"
        prop="invoice_content"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <span v-html="row.invoice_content"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('开票金额')"
        prop="invoice_amount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('纳税人识别号')"
        prop="invoice_company_code"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('个人/公司')"
        prop="invoice_is_company"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.invoice_is_company ? 1 : 0]'>
            {{ ([t('个人'),t('公司')])[row.invoice_is_company ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('发票种类')"
        prop="invoice_is_electronic"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["info","success"])[row.invoice_is_electronic ? 1 : 0]'>
            {{ ([t('纸质发票'),t('电子发票')])[row.invoice_is_electronic ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('发票类型')"
        prop="invoice_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.invoice_type]'>
            {{ ({"1":t('普通发票'),"2":t('增值税专用发票')})[row.invoice_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('创建时间')"
        prop="invoice_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('开票状态')"
        prop="invoice_status"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["success","info"])[row.invoice_status ? 1 : 0]'>
            {{ ([t('未开票'),t('已开票')])[row.invoice_status ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('电子发票链接')"
        prop="invoice_img"
        show-overflow-tooltip
        width="110"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('开票时间')"
        prop="invoice_datetime"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('单位地址')"
        prop="invoice_address"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('单位电话')"
        prop="invoice_phone"
        show-overflow-tooltip
        width="110"
      />
      <el-table-column
        align="center"
        :label="t('开户银行')"
        prop="invoice_bankname"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('银行账号')"
        prop="invoice_bankaccount"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('收票人')"
        prop="invoice_contact_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('收票人地区')"
        prop="invoice_contact_area"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        align="center"
        :label="t('收票详细地址')"
        prop="invoice_contact_address"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('国家编码')"
        prop="user_intl"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('手机号码')"
        prop="user_mobile"
        show-overflow-tooltip
        width="110"
      />
      <el-table-column
        align="center"
        :label="t('用户邮箱')"
        prop="user_email"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否取消')"
        prop="invoice_cancel"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='(["success","info"])[row.invoice_cancel ? 1 : 0]'>
            {{ ([t('未取消'),t('取消')])[row.invoice_cancel ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="80">
        <template #default="{ row }">
          <el-button v-if="false" v-permissions="{ permission: ['/manage/trade/orderInvoice/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-if="false" v-permissions="{ permission: ['/manage/trade/orderInvoice/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
          <el-button :disabled="row.invoice_status" text @click="handleStatus(row)">{{ t('开票') }}</el-button>
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
    <status ref="statusRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList} from '@/api/trade/orderInvoice'
import Edit from './components/OrderInvoiceEdit'
import Status from './components/OrderInvoiceStatusEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDateTime} from "@/utils/format"

export default defineComponent({
  name: 'OrderInvoice',
  components: {Edit,Status},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      statusRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      switchStatus: false,
      electronicOptions: [
        {
          value: 0,
          label: t('纸质发票'),
        },
        {
          value: 1,
          label: t('电子发票'),
        },
      ],
      typeOptions: [
        {
          value: 1,
          label: t('普通发票'),
        },
        {
          value: 2,
          label: t('增值税专用发票'),
        },
      ],
      paidOptions: [
        {
          value: 0,
          label: t('未开票'),
        },
        {
          value: 1,
          label: t('已开票'),
        },
      ],
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
      },
      loading : false,
      userList: [],
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleStatus = (row) => {
      if (row && row.order_invoice_id) {
        state.statusRef.showEdit(row)
      }
    }

    const handleEdit = (row) => {
      if (row && row.order_invoice_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.order_invoice_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({order_invoice_id: row.order_invoice_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const order_invoice_id = state.selectRows.map((item) => item.order_invoice_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({order_invoice_id})
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
      handleStatus,
      handleDelete,
      handleSizeChange,
      formatDateTime,
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
$base: '.order-invoice';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
