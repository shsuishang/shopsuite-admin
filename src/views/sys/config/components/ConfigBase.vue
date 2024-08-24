<template>
  <div class="config-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="8">
        <el-button
          v-permissions="{ permission: ['/manage/sys/config/add'] }"
          class="tree-button"
          :disabled="queryForm.config_type_id==0"
          :icon="Plus"
          type="primary"
          @click="handleEdit()"
        >
          添加配置
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
        :label="t('配置标题')"
        prop="config_title"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        fixed="left"
        :label="t('配置编码')"
        prop="config_key"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('配置类型')"
        prop="config_datatype"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"readonly":"","number":"success","text":"warning","textarea":"info","array":"danger","password":null,"radio":null,"checkbox":null,"select":null,"icon":null,"date":null,"datetime":null,"image":null,"images":null,"file":null,"files":null,"ueditor":null})[row.config_datatype]'>
            {{ ({"readonly":t('只读文本'),"number":t('数字'),"text":t('单行文本'),"textarea":t('多行文本'),"array":t('数组'),"password":t('密码'),"radio":t('单选框'),"checkbox":t('复选框'),"select":t('下拉框'),"icon":t('字体图标'),"date":t('日期'),"datetime":t('时间'),"image":t('单张图片'),"images":t('多张图片'),"file":t('单个文件'),"files":t('多个文件'),"ueditor":t('富文本编辑器'),"area":t('地区选择器')})[row.config_datatype] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('配置项')"
        prop="config_options"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :label="t('配置值')"
        prop="config_value"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('所属分类')"
        prop="config_type_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('配置排序')"
        prop="config_sort"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="config_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.config_enable ? t('点击') + t('禁用') :  t('点击')  + t('启用')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.config_enable" @change="handleState(row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/config/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/config/remove'] }" :disabled="row.config_buildin" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
import {doRemove, getList, editState} from '@/api/sys/config'
import Edit from './ConfigBaseEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ConfigBase',
  components: {Edit},
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      height: $tableHeight() + 28,
      items: [],
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 100,
        title: '',
        config_type_id:0
      },
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.config_key) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit({ config_type_id: state.queryForm.config_type_id })
      }
    }
    const handleDelete = (row) => {
      if (row.config_key) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({config_key: row.config_key})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const config_key = state.selectRows.map((item) => item.config_key).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemove({config_key})
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
      const param = {
        config_key : row.config_key,
        config_enable : row.config_enable
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
    const fetchData = async (config_type_id) => {
      if (typeof config_type_id != "undefined") {
        state.queryForm.config_type_id = config_type_id
      }

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
      form: state.queryForm,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.config-base';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  .el-table {
      margin-top: 6px;
  }
}
</style>
