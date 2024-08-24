<template>
  <div class="product-comment-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
<!--        <el-button v-permissions="{ permission: ['/manage/pt/productComment/add'] }" :icon="Plus" type="primary" @click="handleEdit">-->
<!--          {{ t('添加') }}-->
<!--        </el-button>-->
<!--        <el-button v-permissions="{ permission: ['/manage/pt/productComment/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">-->
<!--          {{ t('批量删除') }}-->
<!--        </el-button>-->
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/pt/productComment/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model="queryForm.comment_scores"
              oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              :placeholder="t('请输入评价星级')"
              :style="{width:'140px'}"
              type="number"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.product_id"
              clearable
              filterable
              :loading="productLoading"
              :placeholder="t('请输入商品名称')"
              remote
              :remote-method="findRemoteProductList"
              reserve-keyword
              :style="{width:'140px'}"
            >
              <el-option
                v-for="item in productList"
                :key="item.product_id"
                :label="item.product_name"
                :value="item.product_id"
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
        v-if="false"
        align="center"
        fixed="left"
        :label="t('评论编号')"
        prop="comment_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('订单编号')"
        prop="order_id"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        align="center"
        :label="t('产品编号')"
        prop="product_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('产品名称')"
        prop="product_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('商品编号')"
        prop="item_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('规格名称')"
        prop="item_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('卖家店铺编号-冗余')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('店铺名称')"
        prop="store_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('买家编号')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('买家姓名')"
        prop="user_name"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('评论星级')"
        prop="comment_scores"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <div class="horizontal-stars">
            <el-icon v-for="i in row.comment_scores" :key="i">
              <Star />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('获得积分-冗余，独立表记录')"
        prop="comment_points"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('评价星级1-5积分')"
        prop="comment_scores"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('评价内容')"
        prop="comment_content"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('评论图片')"
        prop="comment_image"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            v-for="(image, index) in row.comment_images"
            :key="index"
            :preview-src-list="row.comment_images"
            preview-teleported
            :src="image"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('有帮助')"
        prop="comment_helpful"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('无帮助')"
        prop="comment_nohelpful"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('评价时间')"
        prop="comment_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('匿名评价')"
        prop="comment_is_anonymous"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否展示')"
        prop="comment_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.comment_enable === 0 ? t('点击') + t('正常显示') :  t('点击')  + t('禁止显示')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.comment_enable" active-color="#13ce66" :before-change="beforeSwitchChange" inactive-color="#ff4949" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('描述相符评分')"
        prop="comment_store_desc_credit"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('服务态度评分')"
        prop="comment_store_service_credit"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('发货速度评分')"
        prop="comment_store_delivery_credit"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('门店编号')"
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
      <el-table-column
        align="center"
        :label="t('评价回复')"
        prop="comment_reply_num"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="170">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productComment/list'] }" text @click="handleShowReply(row)">{{ t('查看') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productComment/list'] }" text @click="handleReply(row)">{{ t('回复') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productComment/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <item ref="itemRef" @fetch-data="fetchData"/>
    <reply ref="replyRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, getList, editState} from '@/api/pt/productComment'
import {getList as getProductList} from '@/api/pt/productBase'
import Edit from './components/ProductCommentEdit'
import Reply from './components/Reply'
import Item from './components/ProductCommentReply'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDateTime} from "@/utils/format";

export default defineComponent({
  name: 'ProductComment',
  components: {Edit, Item, Reply},
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
      productLoading: false,
      productList: [],
      replyRef: null,
      itemRef: null,
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
      if (row && row.comment_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.comment_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({comment_id: row.comment_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      }
    }
    const beforeSwitchChange = () => {
      state.switchStatus = true;
      return state.switchStatus;
    }
    const handleState = async (row) => {
      const param = {
        comment_id: row.comment_id,
        comment_enable: row.comment_enable,
      }

      const {msg, status} = await editState(param)

      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }

      await fetchData()
    }

    const handleShowReply = (row) => {
      state.itemRef.showItems(row)
    }

    const handleReply = (row) => {
      state.replyRef.showEdit(row.comment_id)
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

    const findRemoteProductList = (product_name) => {
      if (product_name !== '') {
        state.productLoading = true
        setTimeout(() => {
          state.productLoading = false
          getProductList({product_name: product_name}).then((res) => {
            state.productList = res.data.items
          })
        }, 200)
      } else {
        state.productList = []
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
      findRemoteProductList,
      handleEdit,
      formatDateTime,
      handleDelete,
      handleShowReply,
      handleReply,
      beforeSwitchChange,
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
$base: '.product-comment';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
.horizontal-stars {
  display: flex;
  flex-direction: row;
}
</style>
