<template>
  <div class="select-category-container">
    <ms-search-box v-if="false">
      <ms-search-box-left-panel :span="12">
        <el-button
          :icon="Upload"
          type="primary"
          @click="toggleRowExpansion(true)"
        >
          {{ t('全部展开') }}
        </el-button>
        <el-button
          :icon="Download"
          type="primary"
          @click="toggleRowExpansion(false)"
        >
          {{ t('全部折叠') }}
        </el-button>
      </ms-search-box-left-panel>
    </ms-search-box>
    <el-table
      v-if="false"
      ref="treeRef"
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      row-key="category_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        align="center"
        :label="t('商品分类名称')"
        prop="category_name"
      />
      <el-table-column align="center" :label="t('操作')">
        <template #default="{ row }">
          <el-button
            v-if="checkAdd(row)"
            class="el-icon-edit"
            type="text"
            @click="handleEdit(row)"
          >
            {{ t('添加此分类下商品') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="container" style="">
      <div class="centered">
        <!-- 这里是你的内容 -->
        <div style="width: 700px;height: 260px;">
          <el-cascader
            ref="cascader"
            v-model="categoryId"
            clearable
            filterable
            :options="items"
            :placeholder="t('请选择需要发布商品的所属分类')"
            :props="{ label: 'category_name', value: 'category_id', children:'children' }"
            size="medium"
            :style="{ width: '490px' }"
            @change="onCategoryChange"
          />
          <el-button
size="medium"
                     style="margin-left: 10px;"
                     :style="{ width: '200px' }" type="primary" @click="submit">{{ t("确认发布")}}</el-button>
        </div>
      </div>
    </div>
    <product-edit ref="editRef" />
  </div>
</template>


<script>
  import {getTree} from "@/api/pt/productCategory";
  import { translate as t } from '@/i18n'
  import ProductEdit from './components/ProductBaseEdit'

  export default defineComponent({
    name: 'SelectCategory',
    components: { ProductEdit },
    setup() {
      const $tableHeight = inject('$tableHeight')
      const $message = inject('$message')

      const state = reactive({
        categoryId: [],
        category_id: null,

        treeRef: null,
        editRef: null,
        height: $tableHeight() - 105,
        items: [],
        expandKeys: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
      })

      const checkAdd = (row) => {
        const sub = row.children
        if (sub && sub.length > 0) return false
        return true
      }

      const handleEdit = (row) => {
        if (row && row.category_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }

      const  fetchData = async () => {
        state.listLoading = true
        const {
          data: data,
        } = await getTree(state.queryForm)
        //state.items = data

        state.items = tree(data);
        //:expand-row-keys="expandKeys"
        //state.expandKeys = []
        //expandKeysAll(state.items, true)

        state.listLoading = false

      }

      /*
      const expandKeysAll = (data, isExpansion) => {
        data.forEach((item) => {
          state.expandKeys.push(item.category_id + "")
          if (item.children !== undefined && item.children != null) {
            expandKeysAll(item.children, isExpansion)
          }
        })
      }
       */

      const toggleRowExpansion = (isExpansion) => {
        toggleRowExpansionAll(state.items, isExpansion)
      }

      const toggleRowExpansionAll = (data, isExpansion) => {
        data.forEach((item) => {
          state['treeRef'].toggleRowExpansion(item, isExpansion)
          if (item.children !== undefined && item.children != null) {
            toggleRowExpansionAll(item.children, isExpansion)
          }
        })
      }


      const onCategoryChange = async (row)  => {
        if (row.length > 0) {
          state.category_id = row[row.length-1];
        } else {
          state.category_id = null;
        }
      }

      const tree = (data) =>  {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];

          // item.children 不等于 undefined && item.children.length 大于 0 时
          if (item.children && item.children.length > 0) {
            item.children = tree(item.children);
          } else {
            delete item.children;
          }
        }

        return data
      }

      const findTree = (data, idx)  => {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];

          if (item.category_id == idx) {
            return item
          }

          // item.children 不等于 undefined && item.children.length 大于 0 时
          if (item.children && item.children.length > 0) {
            const tmp =  findTree(item.children, idx);
            if (tmp != null) {
              return tmp;
            }
          }
        }

        return null
      }

      const submit = ()  => {
        const category = findTree(state.items, state.category_id)

        if (category != null) {
          handleEdit(category)
        } else {
          $message("请选择商品分类", 'error')
        }
      }

      onMounted(() => {
        fetchData()
      })

      return {
        t,
        ...toRefs(state),
        checkAdd,
        handleEdit,
        toggleRowExpansion,
        toggleRowExpansionAll,
        onCategoryChange,
        submit,
      }
    },
    methods: {
    },
  })
</script>


<style lang="scss" scoped>
$base: '.select-category';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}


.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 80vh; /* 100%视窗高度 */
}

.centered {
  /* 可以添加其他样式 */
}

</style>
