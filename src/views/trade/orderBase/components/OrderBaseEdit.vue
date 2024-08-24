<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    :top=" '5vh' "
    width="60%"
    @close="close"
  >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <el-form-item>
          <el-button
            :icon="Plus"
            type="info"
            @click="showItemTable"
          >
            {{ t('添加行')}}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-table
            border
            :data="itemList"
            :height="height"
            :loading="listLoading"
            @cell-click="tabClick"
          >
            <el-table-column
              align="center"
              :label="t('商品SKU')"
              prop="item_id"
              show-overflow-tooltip
              width="90"
            />
            <el-table-column
              align="center"
              :label="t('产品名称')"
              prop="product_name"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              :label="t('SKU名称')"
              prop="item_name"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              :label="t('数量')"
              prop="cart_quantity"
              show-overflow-tooltip
              width="100"
            >
              <template #header="scope">
              <span>
                {{ t('数量') }}
                <el-tooltip
                  :aa="scope"
                  class="item"
                  :content="t('点击数字，更改数量')"
                  effect="dark"
                  placement="top-start"
                >
                  <ms-icon icon="question-line" style="cursor:pointer;"/>
                </el-tooltip>
              </span>
              </template>
              <template #default="scope">
            <span
              v-if="
                scope.row.item_id === tabClickIndex &&
                scope.column.id === columnId
              "
            >
              <el-input
                ref="editInputRef"
                v-model="scope.row.cart_quantity"
                @blur.stop="inputBlur(scope.row)"
                @keyup.enter.stop="inputBlur(scope.row)"
              />
            </span>
                <span v-else>{{ scope.row.cart_quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="t('单价')"
              prop="item_unit_price"
              show-overflow-tooltip
              width="100"
            />
            <el-table-column
              align="center"
              :label="t('操作')"
              show-overflow-tooltip
              width="80"
            >
              <template #default="scope">
                <el-button type="text" @click="deleteRow(scope.$index)">
                  {{ t('删除') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item prop="buyer_user_id">
          <el-select
            v-model="form.buyer_user_id"
            class="ml10"
            clearable
            filterable
            :loading="loading"
            :placeholder="t('请输入买家用户名称')"
            remote
            :remote-method="findRemoteUserList"
            reserve-keyword
            :style="{width:'200px'}"
            @change="changeUser(form.buyer_user_id)"
          >
            <el-option
              v-for="item in userList"
              :key="item.user_id"
              :label="item.user_nickname"
              :value="item.user_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="ud_id">
          <el-select
            v-model="form.ud_id"
            clearable
            :placeholder="t('请选择收货地址')"
            :style="{width:'200px'}"
          >
            <el-option
              v-for="item in addressList"
              :key="item.ud_id"
              :label="item.ud_address"
              :value="item.ud_id"
            />
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :icon="Plus"
          type="info"
          @click="showAddressEdit"
        >
          {{ t('添加新地址')}}
        </el-button>
      </el-form-item>
    </el-form>
    <ProductItemTable ref="productItemTableRef" @check-item="addListItem" />
    <AddressEdit ref="addressRef" @fetch-data="getAddressList" />
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import {translate as t} from "@/i18n";
import {Delete, Plus, Search} from "@element-plus/icons-vue";
import ProductItemTable from '@/plugins/ProductTable/BaseDialogTable';
import AddressEdit from './DeliveryAddressEdit'
import {getProductItems} from "@/api/pt/productBase";
import {isNumbers} from "vue-plugin-utils";
import {getList as getUserList} from "@/api/account/userInfo";
import {getList as getDeliveryAddress} from '@/api/account/userDeliveryAddress'
import {doAdd} from '@/api/trade/orderBase'

export default defineComponent({
  name: 'OrderBaseEdit',
  components: { ProductItemTable, AddressEdit },
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')
    const $confirm = inject('$confirm')

    const state = reactive({
      formRef: null,
      addressRef: null,
      productItemTableRef: null,
      height: $tableHeight() - 150,
      itemList: [],
      itemIdList: [],
      editInputRef: null,
      tabClickIndex: null, // 点击的行
      columnId: null, // 点击的列
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 100,
      },
      addressList: [],
      form: {},
      userList: [],
      dialogFormVisible: false,
      title: '',
      loading: false,
    })

    const changeUser = (user_id) => {
      if (user_id) {
        getAddressList(user_id)
      } else {
        state.addressList = []
      }
    }

    const rules = reactive({
      buyer_user_id: [{required: true, trigger: 'change', message: t('请选择买家用户名称')}],
      // ud_id: [{required: true, trigger: 'change', message: t('请选择收货地址')}],
    })

    const getAddressList = async (user_id) => {
      if (!user_id) {
        user_id = state.form.buyer_user_id
      }

      if (user_id) {
        const { data } = await getDeliveryAddress({
          user_id: user_id,
          page: 1,
          size: 200,
        })
        state.addressList = data.items
      }
    }

    const showEdit = () => {
      state.dialogFormVisible = true
    }
    const close = () => {
      state.itemList = []
      state.itemIdList = []
      state.addressList = []
      state.userList = []
      state['formRef'].resetFields()
      state.form = {
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      if (state.itemList.length === 0) {
        $message('请先添加商品', 'warning')
        return
      }
        state['formRef'].validate(async (valid) => {
        if (valid) {
          state.listLoading = true
          const { msg, status } = await doAdd(getParam())
          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }
          emit('fetch-data')
          close()
          state.listLoading = false
        } else {
          state.listLoading = false
          return false
        }
      })
    }
    const getParam = () => {
      const obj = {
        user_id: state.form.buyer_user_id,
        ud_id: state.form.ud_id,
        product_items: JSON.stringify(state.itemList),
      }
      return obj
    }
    const showItemTable = () => {
      state.productItemTableRef.showTable()
    }
    const deleteRow = (index) => {
      $confirm(t('你确定要删除当前项吗'), null, async () => {
        state.itemList.splice(index, 1)
        state.itemIdList.splice(index, 1)
      })
    }
    const showAddressEdit = () => {
      if (state.form.buyer_user_id) {
        state.addressRef.showEdit(state.form.buyer_user_id)
      } else {
        $message('请先选择买家用户名称', 'warning')
      }
    }

    const addListItem = async (e) => {
      const itemIds = []
      if (e) {
        e.forEach((item) => {
          if (state.itemIdList && state.itemIdList.length > 0) {
            if (!state.itemIdList.includes(item.item_id)) {
              state.itemIdList.push(item.item_id)
              itemIds.push(item.item_id)
            }
          }else {
            state.itemIdList.push(item.item_id)
            itemIds.push(item.item_id)
          }
        })
        await fetchData(itemIds)
      }
    }

    const fetchData = async (itemIds) => {
      state.listLoading = true
      if (itemIds.length > 0) {
        state.queryForm.item_id = itemIds.toString()
        const { data } = await getProductItems(state.queryForm)

        if (data.items && data.items.length > 0 ) {
          data.items.forEach((item) => {
            const obj = {
              item_id: item.item_id,
              product_name: item.product_name,
              item_name: item.item_name,
              item_unit_price: item.item_unit_price,
              cart_quantity: 1,
              kind_id: item.kind_id,
            }
            state.itemList.push(obj)
          })
        }

        state.listLoading = false
      }
    }

    const tabClick = (row, column) => {
      state.tabClickIndex = row.item_id
      state.columnId = column.id
      // inout 获取焦点
      nextTick(() => {
        if (!state.editInputRef) return
        state.editInputRef.focus()
      })
    }

    // 失去焦点初始化
    const inputBlur = async (row) => {
      if (state.tabClickIndex != null && state.columnId != null) {
        state.tabClickIndex = null
        state.columnId = null

        if (!isNumbers(row.cart_quantity)) {
          row.cart_quantity = 1
          $message('数量不能为负数且不能输入中文', 'warning')
          return
        }
      }
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

    return {
      t,
      ...toRefs(state),
      rules,
      changeUser,
      getAddressList,
      findRemoteUserList,
      tabClick,
      inputBlur,
      addListItem,
      fetchData,
      showEdit,
      close,
      save,
      getParam,
      showItemTable,
      deleteRow,
      showAddressEdit,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>
