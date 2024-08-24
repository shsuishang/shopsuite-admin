<template>
  <div class="config-container">
    <el-row :gutter="20">
      <el-col :lg="9" :md="9" :sm="24" :xl="9" :xs="24">
        <ms-card shadow="hover">
          <ms-form-table
            v-model="form"
            drag
            :height="height"
            :row-template="rowTemplate"
            style="width: 100%"
            @row-click="rowClick"
          >
            <el-table-column align="center" label="分类名称" prop="cat_name">
              <template #default="{ row }">
                <el-input v-model="row.cat_name"/>
              </template>
            </el-table-column>
          </ms-form-table>
        </ms-card>
      </el-col>
      <el-col :lg="15" :md="15" :sm="24" :xl="15" :xs="24">
        <ms-card shadow="hover">
          <ms-form-table
            v-model="formItem"
            drag
            :height="height"
            :row-template="rowTemplateItem"
            style="width: 100%"
          >
            <el-table-column align="center" label="标题" prop="title">
              <template #default="{ row }">
                <el-input v-model="row.title"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="链接" prop="link">
              <template #default="{ row }">
                <el-input v-model="row.link"/>
              </template>
            </el-table-column>
          </ms-form-table>
        </ms-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-button style="margin: auto" type="primary" @click="save">保存</el-button>
    </el-row>
  </div>
</template>


<script>
import {translate as t} from '@/i18n'
import MsFormTable from '@/plugins/MsFormTable'
import {getPcHelp, savePcHelp} from "@/api/sys/config";
import {isJson} from '@/utils/validate'

export default defineComponent({
  name: 'PcHelp',
  components: {MsFormTable},
  setup() {
    const $tableHeight = inject('$tableHeight')
    const $message = inject('$message')

    const state = reactive({
      typeRef: null,
      baseRef: null,
      height: $tableHeight(),
      rowTemplate: {
        cat_name: '',
        switch: true,
        items: []
      },
      form: [{cat_name: "帮助", switch: true, items: [{id: 1001, title: "帮助", link: '', switch: true}]}, {
        cat_name: "帮助",
        items: [{id: 1001, title: "帮助", link: '', switch: true}]
      }],
      rowTemplateItem: {
        id: '',
        title: '',
        link: '',
        switch: true
      },
      formItem: [{id: 1001, title: "帮助", link: '', switch: true}],


      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
    })
    const rowClick = (row) => {
      state.formItem = state.form[row.index].items
    }
    const listPageHelp = async () => {

      state.listLoading = true
      const {
        data
      } = await getPcHelp()

      if (isJson(data.page_pc_help)) {
        state.form = JSON.parse(data.page_pc_help)
      } else {
        state.form = [{items: []}]
      }

      state.formItem = state.form[0].items

      state.listLoading = false
    }

    const save = async () => {
      const params = JSON.stringify(state.form);
      const {msg, status} = await savePcHelp({pc_help: params})

      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }
    }

    onMounted(() => {
      listPageHelp()
    })

    return {
      t,
      ...toRefs(state),
      rowClick,
      listPageHelp,
      save,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.config';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  :deep(.el-table) {
    margin-top: 0;

    .el-button.is-text {
      width: 40px;
    }
  }

}
</style>
