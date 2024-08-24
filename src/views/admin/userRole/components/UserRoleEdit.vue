<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('角色编号')" prop="user_role_id">
        <el-input v-model="form.user_role_id" clearable :disabled="isUpdate" :placeholder="t('角色编号')"/>
      </el-form-item>
      <el-form-item :label="t('角色名称')" prop="user_role_name">
        <el-input v-model="form.user_role_name" clearable :placeholder="t('角色名称')"/>
      </el-form-item>
      <el-form-item :label="t('角色标识')" prop="user_role_code">
        <el-input v-model="form.user_role_code" clearable :placeholder="t('角色标识')"/>
      </el-form-item>

      <el-form-item label="菜单">
        <div class="ms-tree-border">
          <el-input v-model="filterText" placeholder="请输入菜单名称"/>
          <el-tree
            ref="treeRef"
            :data="list"
            :default-checked-keys="form.menu_ids ? form.menu_ids.split(',') : []"
            default-expand-all
            :default-expanded-keys="[]"
            :filter-node-method="filterNode"
            node-key="menu_id"
            show-checkbox
          >
            <template #default="{ data }">
              <span>{{ data.meta.title }}</span>
            </template>
          </el-tree>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { translate as t } from '@/i18n'
import {doEdit, doAdd} from '@/api/admin/userRole'
import {getTree} from '@/api/admin/menu'

export default defineComponent({
  name: 'UserRoleEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      treeRef: null,
      filterText: '',
      form: {
      },
      rules: {
        user_role_name: [{required: true, trigger: 'blur', message: t('请输入角色名称')}],
        user_role_code: [{required: true, trigger: 'blur', message: t('请输入角色标识')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      list: [],
    })

    const showEdit = (row) => {

      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)
      }
      state.dialogFormVisible = true
    }
    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        roles: [],
      }
      state.filterText = ''
      state.treeRef.setCheckedKeys([])
      state.dialogFormVisible = false
    }
    const fetchData = async () => {
      const {
        data: list,
      } = await getTree({
        page: 1,
        size: 10,
        type: 2,
      })
      state.list = list
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          const tree = state['treeRef'].getCheckedKeys()
          state.form.menu_ids = tree.join()

          if (state.isUpdate) {
            const { msg, status } = await doEdit(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const { msg, status } = await doAdd(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          }

          emit('fetch-data')
          close()
        }
      })
    }
    onMounted(() => {
      fetchData()
    })

    watch(
      () => state.filterText,
      (val) => {
        state.treeRef.filter(val);
      }
    );

    const filterNode = (value, data) => {
      if (!value) return true
      return data.menu_title.includes(value)
    }

    return {
      t: t,
      ...toRefs(state),
      showEdit,
      filterNode,
      close,
      fetchData,
      save,
    }
  },
})
</script>
<style lang="scss" scoped>
.el-input__wrapper{
  width: 100%;
}

.ms-tree-border {
  width: 100%;
  height: 250px;
  padding: $base-padding;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: $base-border-radius;
}
</style>
