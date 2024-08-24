<template>
  <div class="product-spec-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="4">
        <el-button v-permissions="{ permission: ['/manage/pt/productSpec/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="20">
        <el-form v-permissions="{ permission: ['/manage/pt/productSpec/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.spec_name"
              clearable
              :placeholder="t('请输入规格名称')"
              style="width:180px;"
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
        :label="t('规格编号')"
        prop="spec_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('规格名称')"
        prop="spec_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('显示类型')"
        prop="spec_format"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <el-tag :type='({"text":"","image":"success"})[row.spec_format]'>
            {{ ({"text":t('文字'),"image":t('图片')})[row.spec_format] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="spec_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('分类编号')"
        prop="category_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('系统内置')"
        prop="spec_buildin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"success","0":"info"})[row.spec_buildin ? 1 : 0]'>
            {{ ({"1":t('是'),"0":t('否')})[row.spec_buildin ? 1 : 0] }}
          </el-tag>
        </template>

      </el-table-column>


      <el-table-column align="center" fixed="right" :label="t('操作')" width="280">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/pt/productSpec/edit'] }" text @click="handleSpecItemEdit(row)">{{ t('规格选项') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productSpec/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/pt/productSpec/remove'] }"  :disabled="row.spec_buildin===true" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <spec-item-edit ref="specItemEditRef" @fetch-data="fetchSpecItemData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList} from '@/api/pt/productSpec'
import Edit from './components/ProductSpecEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import specItemEdit from "../productSpec/dialog";
import {getTree} from "@/api/pt/productCategory";

export default defineComponent({
  name: 'ProductSpec',
  components: {specItemEdit, Edit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      specItemEditRef:null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        spec_name:'',
      },


      isExpandTreeSelect:true,
      categoryList: [],
    })
    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.spec_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleSpecItemEdit = (row) => {
      if (row && row.spec_id) {
        state.specItemEditRef.show(row)
      } else {
        state.specItemEditRef.show()
      }
    }
    const handleDelete = (row) => {
      if (row.spec_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({spec_id: row.spec_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const spec_id = state.selectRows.map((item) => item.spec_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({spec_id})
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
    const fetchSpecItemData = async () => {
      state.specItemRef.fetchData(spec_id)
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
      handleSpecItemEdit,
      handleDelete,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      fetchSpecItemData,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.product-spec';
#{$base}-container {
  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
