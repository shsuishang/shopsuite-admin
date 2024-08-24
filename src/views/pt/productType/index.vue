<template>
  <div class="product-type-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="6">
        <el-button v-permissions="{ permission: ['/manage/pt/productType/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>

      <ms-search-box-right-panel :span="18">
        <el-form
          v-permissions="{ permission: ['/manage/pt/productType/list'] }" :inline="true" :model="queryForm"
          @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.type_name"
              clearable
              :placeholder="t('请输入类型名称')"
            />
          </el-form-item>
          <el-form-item>
            <el-tree-select
              v-model="queryForm.category_id"
              clearable
              :data="categoryList"
              :default-expand-all="isExpandTreeSelect"
              filterable
              highlight-current
              node-key="category_id"
              :placeholder="t('请选择关联分类')"
              :props="{ value: 'category_id', label: 'category_name'}"
              style="width: 180px;"
              value-key="category_name"
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
        :label="t('编号')"
        prop="type_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('类型名称')"
        prop="type_name"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('备注')"
        prop="type_remark"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('分类编号')"
        prop="category_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('是否草稿')"
        prop="type_is_draft"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"info","0":"success"})[row.type_is_draft ? 1 : 0]'>
            {{ ({"1":t('草稿'),"0":t('发布')})[row.type_is_draft ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('系统内置')"
        prop="type_buildin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.type_buildin === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.type_buildin" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('系统内置')"
        prop="type_buildin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"info","0":"success"})[row.type_buildin ? 1 : 0]'>
            {{ ({"1":t('是'),"0":t('否')})[row.type_buildin ? 1 : 0] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="280">
        <template #default="{ row }">
          <el-button v-if="false" v-permissions="{ permission: ['/manage/pt/productType/edit'] }" text @click="handleAssistEdit(row)">{{ t('属性管理') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productType/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productType/remove'] }" :disabled="row.type_buildin===true" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <assist-edit ref="assistEditRef" @fetch-data="fetchAssistData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList} from '@/api/pt/productType'
import Edit from './components/ProductTypeEdit'
import AssistEdit from '../productAssist/dialog'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {getTree} from "@/api/pt/productCategory";

export default defineComponent({
  name: 'ProductType',
  components: {Edit, AssistEdit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      assistEditRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
      },
      isExpandTreeSelect:true,
      categoryList: [],
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.type_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleAssistEdit = (row) => {
      if (row && row.type_id) {
        state.assistEditRef.show(row)
      } else {
        state.assistEditRef.show()
      }
    }
    const handleDelete = (row) => {
      if (row.type_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({type_id: row.type_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const type_id = state.selectRows.map((item) => item.type_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({type_id})
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
    const handleState = async (row) => {````
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
    const fetchAssistData = async () => {
      state.assistRef.fetchData(type_id)
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

    const getCategoryData = async () => {
      const {
        data: items,
      } = await getTree({})

      state.categoryList = items
    }

    onMounted(() => {
      getCategoryData()
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      handleEdit,
      handleAssistEdit,
      handleDelete,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      fetchAssistData,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-type';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
