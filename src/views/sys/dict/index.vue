<template>
  <div class="dict-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="8" :sm="24" :xl="4" :xs="24">
        <ms-card shadow="hover">
          <el-button
            v-permissions="{ permission: ['/manage/sys/dict/add'] }"
            class="tree-button"
            :icon="Plus"
            type="primary"
            @click="handleEdit()"
          >
            添加字典分类
          </el-button>
          <el-input v-if="false" v-model="filterText" placeholder="请输入字典名称"/>
          <el-tree
            ref="treeRef"
            :data="data"
            default-expand-all
            :default-expanded-keys="['root']"
            :filter-node-method="filterNode"
            highlight-current
            node-key="dict_id"
            :props="defaultProps"
            value-key="dict_name"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="dict-name" style="display: inline-block;padding: 8px;">{{ node.label }}</span>
              <el-button v-if="!data.children || data.children.length==0" v-permissions="{ permission: ['/manage/sys/dict/remove'] }" :disabled="data.dict_buildin" style="float: right; width:30px; margin-right: 10px" text type="primary" @click="handleDelete(data)">
                删除
              </el-button>
              <el-button v-if="data.dict_key!='root'" v-permissions="{ permission: ['/manage/sys/dict/edit'] }" style="float: right; width:30px;margin-right: 10px" text type="primary" @click="handleEdit(data)">
                修改
              </el-button>
            </template>
          </el-tree>
        </ms-card>
      </el-col>
      <el-col :lg="18" :md="16" :sm="24" :xl="20" :xs="24">
        <ms-card shadow="hover">
          <ms-search-box>
            <ms-search-box-top-panel :span="12">
              <el-button
                v-permissions="{ permission: ['/manage/sys/dict/addItem'] }"
                :disabled="isRoot"
                :icon="Plus"
                type="primary"
                @click="handleItemEdit()"
              >
                添加
              </el-button>
            </ms-search-box-top-panel>
          </ms-search-box>
          <el-table
            v-loading="listLoading" border
            :data="list" :height="height">

            <el-table-column
              align="center"
              fixed="left"
              :label="t('字典编号')"
              prop="dict_item_id"
              show-overflow-tooltip
              width="280"
            />
            <el-table-column
              align="center"
              :label="t('字典名称')"
              prop="dict_item_name"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              :label="t('字典项值')"
              prop="dict_item_code"
              show-overflow-tooltip
              width="120"
            />
            <el-table-column
              align="center"
              :label="t('字典类型')"
              prop="dict_id"
              show-overflow-tooltip
              width="120"
            />
            <el-table-column
              v-if="false"
              align="center"
              :label="t('是否使用')"
              prop="dict_item_status"
              show-overflow-tooltip
              width="100"
            >
              <template #default="{ row }">
                <el-tag :type='(["info","success"])[row.dict_item_status ? 1 : 0]'>
                  {{ ([t('未用'), t('使用')])[row.dict_item_status ? 1 : 0] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="t('显示顺序')"
              prop="dict_item_sort"
              show-overflow-tooltip
              width="100"
            />
            <el-table-column align="center" fixed="right" label="操作" show-overflow-tooltip width="200">
              <template #default="{ row }">
                <el-button v-permissions="{ permission: ['/manage/sys/dict/editItem'] }" text type="primary" @click="handleItemEdit(row)">
                  编辑
                </el-button>
                <el-button v-permissions="{ permission: ['/manage/sys/dict/removeItem'] }" :disabled="row.dict_item_buildin" text type="primary" @click="handleItemDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty class="ms-data-empty" description="暂无数据"/>
            </template>
          </el-table>
        </ms-card>
      </el-col>
    </el-row>
    <edit ref="editRef" @fetch-tree="getDictTree"/>
    <edit-item ref="editItemRef" @fetch-data="fetchItemData"/>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {getList, doRemove} from '@/api/sys/dict'
import {getListItem, doRemoveItem} from '@/api/sys/dict'
import {Plus} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Dict',
  components: {
    Edit: defineAsyncComponent(() =>
      import('./components/DictiEdit'),
    ),
    EditItem: defineAsyncComponent(() =>
      import('./components/DictiItemEdit'),
    ),
  },
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      treeRef: null,
      editRef: null,
      editItemRef: null,
      height: $tableHeight() + 30,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'dict_name',
        value: 'dict_id',
      },
      list: [],
      listLoading: true,
      isRoot: true,
      parentKey: '',
    })

    const handleEdit = (row) => {
      console.info(row)
      if (typeof row != "undefined" && row.dict_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.dict_id) {
        $confirm('你确定要删除当前项吗', null, async () => {
          const {msg} = await doRemove({dict_id: row.dict_id})
          $message(msg, 'success')
          await getDictTree()
        })
      }
    }
    //读取字典项
    const fetchItemData = async (data = {dict_id: ''}) => {
      data.dict_id !== '' ? (state.isRoot = false) : (state.isRoot = true)
      state.parentKey = data.dict_id

      state.listLoading = true
      const {
        data: {items},
      } = await getListItem(data)
      state.list = items
      state.listLoading = false
    }

    const handleNodeClick = (data) => {
      state.parentKey = data.dict_id
      fetchItemData(data)
    }
    const handleItemEdit = (row) => {

      if (typeof row != "undefined" && row.dict_item_id) {
        state.editItemRef.showEdit(row)
      } else {
        state.editItemRef.showEdit({dict_id: state.parentKey})
      }
    }
    const handleItemDelete = (row) => {
      if (row.dict_item_id) {
        $confirm('你确定要删除当前项吗', null, async () => {
          const {msg} = await doRemoveItem({dict_item_id: row.dict_item_id})
          $message(msg, 'success')
          await fetchItemData({dict_id: row.dict_id})
        })
      }
    }

    const filterText = ref('')
    watch(filterText, (value) => {
      state.treeRef.filter(value)
    })

    const filterNode = (value, data) => {
      if (!value) return true
      return data.menu_name.includes(value)
    }

    //字典分类
    const getDictTree = () => {
      getList().then(({data}) => {
        const list = [
          {
            dict_id: '',
            dict_key: 'root',
            dict_name: '全部字典',
            children: data.items,
          },
        ]

        for (const tmp in list[0].children) {
          list[0].children[tmp].children = []
        }
        console.info(list)
        state.data = list
      })
    }

    onMounted(() => {
      getDictTree(),
        fetchItemData()
    })

    return {
      t,
      ...toRefs(state),
      filterText,
      filterNode,
      handleItemEdit,
      handleItemDelete,
      handleEdit,
      handleDelete,
      getDictTree,
      fetchItemData,
      handleNodeClick,
      Plus,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.dict';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  .tree-button {
    width: 100%;
    //margin-bottom: $base-margin;
  }

  :deep(*) {
    .el-tree {
      margin-top: $base-margin;

      &-node__label {
        display: block;
        width: 100%;
      }

      &-node__content {
        height: 36px;

        font-size: 14px;

        a {
          font-size: 10px;
        }
      }
    }
  }
}
.dict-name {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
