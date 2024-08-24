<template>
  <div class="page-category-nav-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
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
        prop="category_nav_id"
        show-overflow-tooltip
        width="60"
      />
      <el-table-column
        align="center"
        :label="t('分类名称')"
        prop="category_nav_name"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('分类图片')"
        prop="category_nav_image"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.category_nav_image]"
            preview-teleported
            :src="row.category_nav_image"
            style="width: 35px; height: 35px"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('推荐分类')"
        prop="category_ids"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="t('推荐商品')"
        prop="item_ids"
        show-overflow-tooltip
      />

      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="category_nav_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.category_nav_enable === 0 ? t('点击') + t('显示') :  t('点击')  + t('不显示')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.category_nav_enable" @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('模板')"
        prop="category_nav_type"
        show-overflow-tooltip
        width="80"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"","2":"success"})[row.category_nav_type]'>
            {{ ({"1":t('分类'),"2":t('商品')})[row.category_nav_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('排序')"
        prop="category_nav_order"
        show-overflow-tooltip
        width="60"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, editState, getList} from '@/api/sys/pageCategoryNav'
import Edit from './components/PageCategoryNavEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'PageCategoryNav',
  components: {Edit},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      height: $tableHeight()+50,
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 500,
        title: '',
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.category_nav_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.category_nav_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({category_nav_id: row.category_nav_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const category_nav_id = state.selectRows.map((item) => item.category_nav_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({category_nav_id})
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
        category_nav_id : row.category_nav_id,
        category_nav_enable : row.category_nav_enable
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
      handleEdit,
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
$base: '.page-category-nav';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 36px;
    }
  }
}
</style>
