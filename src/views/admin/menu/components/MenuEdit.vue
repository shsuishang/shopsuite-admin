<template>
  <el-dialog
    v-model="dialogFormVisible"
    custom-class="ele-dialog-form"
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改菜单':'添加菜单'"
    width="750px"
    @close="close">
    <el-form
      ref="formRef"
      label-width="92px"
      :model="form"
      :rules="rules">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="上级菜单:">
            <el-tree-select
              v-model="form.menu_parent_id"
              check-strictly
              :data="menuList"
              :default-expand-all="isExpandTreeSelect"
              highlight-current
              node-key="menu_id"
              placeholder="请选择上级菜单"
              :props="{ value: 'menu_id', label: 'menu_title'}"
              style="width: 100%"
              value-key="menu_title"
            />
          </el-form-item>
          <el-form-item label="菜单名称:">
            <el-input
              v-model="form.menu_title"
              clearable
              placeholder="请输入菜单名称"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="菜单类型:">
            <el-radio-group
              v-model="form.menu_type"
              @change="onMenuTypeChange">
              <el-radio :label="0">按钮</el-radio>
              <el-radio :label="1">菜单</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="菜单图标:">
            <el-popover
              popper-class="icon-selector-popper"
              trigger="click"
              :width="600"
            >
              <template #reference>
                <el-input v-model="form.menu_icon" clearable />
              </template>
              <ms-icon-selector @handle-icon="handleIcon" />
            </el-popover>
          </el-form-item>
          <el-form-item v-if="false" label="打开方式:"> <!-- 需要控制menu_path内容是否为网址 -->
            <el-radio-group
              v-model="form.menu_redirect"
              :disabled="form.menu_type === 0"
              @change="onTargetChange">
              <el-radio :label="''">组件</el-radio>
              <el-radio v-if="false" :label="1">内链</el-radio>
              <el-radio v-if="false" :label="2">外链</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin: 6px 0 28px 0;">
        <el-divider/>
      </div>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item name="path">
            <template #label>
              <el-tooltip
                v-if="form.menu_redirect === 2"
                content="需要以`http://`、`https://`、`//`开头"
                placement="top">
                <i class="el-icon-_question"></i>
              </el-tooltip>
              <span>{{ form.menu_redirect === 2 ? ' 外链地址:' : ' 路由地址:' }}</span>
            </template>
            <el-input
              v-model="form.menu_path"
              clearable
              :disabled="form.menu_type===0"
              :placeholder="form.menu_redirect === 2 ? '请输入外链地址' : '请输入路由地址'"/>
          </el-form-item>
          <el-form-item name="component">
            <template #label>
              <el-tooltip
                v-if="form.menu_redirect === 1"
                content="需要以`http://`、`https://`、`//`开头"
                placement="top">
                <i class="el-icon-_question"></i>
              </el-tooltip>
              <span>{{ form.menu_redirect === 1 ? ' 内链地址:' : ' 组件路径:' }}</span>
            </template>
            <el-input
              v-model="form.menu_component"
              clearable
              :disabled="form.menu_type === 0 || form.menu_redirect === 2"
              :placeholder="form.menu_redirect === 1 ? '请输入内链地址' : '请输入组件路径'"/>
          </el-form-item>
          <el-form-item label="菜单标签:">
            <el-input
              v-model="form.menu_bubble"
              clearable
              :disabled="form.menu_type === 0"
              placeholder="请输入菜单标签"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="组件名称:">
            <el-input
              v-model="form.menu_name"
              clearable
              :disabled="form.menu_type === 0"
              placeholder="请输入组件名称"/>
          </el-form-item>
          <el-form-item label="权限标识:">
            <el-input
              v-model="form.menu_permission"
              clearable
              :disabled="form.menu_type === 1"
              placeholder="请输入权限标识"/>
          </el-form-item>
          <el-form-item label="排序号:" prop="sort">
            <el-input-number
              v-model="form.menu_sort"
              class="ele-fluid ele-text-left"
              controls-position="right"
              :min="0"
              placeholder="请输入排序号"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :sm="6">
          <el-form-item label="显示红点:">
            <el-switch v-model="form.menu_dot" :disabled="form.menu_type === 0" />
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="是否隐藏:">
            <el-switch v-model="form.menu_hidden" :disabled="form.menu_type === 0"  />
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="允许关闭:">
            <el-switch v-model="form.menu_close" :disabled="form.menu_type === 0" />
          </el-form-item>
        </el-col>
        <el-col :sm="6"/>
      </el-row>
      <el-form-item v-if="false && form.menu_type==1" label="权限节点:">
        <el-transfer
          v-model="form.checkedList"
          :data="permissionList"
          style="height: 200px"
          :titles="['全部节点', '已赋予节点']"
        />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input
          v-model="form.menu_note"
          clearable
          :maxlength="200"
          placeholder="请输入备注"
          :rows="1"
          type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('取 消')}}</el-button>
      <el-button :loading="loading" type="primary" @click="save">{{ t('确 定')}}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { translate as t } from '@/i18n'
import {doAdd, doEdit} from '@/api/admin/menu'
import MsIconSelector from '@/plugins/MsIconSelector'

export default defineComponent({
  name: 'MenuEdit',
  components: {MsIconSelector},
  props:{
    menuList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      formRef: null,
      form: {
        roles: [],
        menu_type: 1,
      },
      rules: {
        title: [{required: true, trigger: 'blur', message: t('请输入标题')}],
      },
      title: '',
      dialogFormVisible: false,
      permissionList: [
        {
          key: 1,
          label: `查询`,
        },
        {
          key: 5,
          label: `添加`,
        },
        {
          key: 10,
          label: `修改`,
        },
        {
          key: 15,
          label: `删除`,
        },
        {
          key: 20,
          label: `详情`,
        },
        {
          key: 25,
          label: `状态`,
        },
        {
          key: 30,
          label: `批量删除`,
        },
        {
          key: 35,
          label: `添加子级`,
        },
        {
          key: 40,
          label: `全部展开`,
        },
        {
          key: 45,
          label: `全部折叠`,
        },
        {
          key: 50,
          label: `导出数据`,
        },
        {
          key: 55,
          label: `导入数据`,
        },
        {
          key: 60,
          label: `分配权限`,
        },
        {
          key: 65,
          label: `重置密码`,
        }
      ],
      isExpandTreeSelect:true,
    })

    const showAdd = (row) => {
      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = false
        state.title = t('添加')
        state.form.menu_parent_id = row.menu_id
      }

      state.dialogFormVisible = true
    }
    const showEdit = (row) => {
      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)
        state.form.menu_path = state.form.path
        state.form.menu_name = state.form.name
        state.form.menu_title = state.form.meta.title
        state.form.menu_component = state.form.component
        state.form.menu_redirect = state.form.redirect
      }
      state.dialogFormVisible = true
    }
    const close = () => {
      state['formRef'].resetFields()
      state.form = {
        roles: [],
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          if (state.isUpdate) {
            const {msg, status} = await doEdit(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const {msg, status} = await doAdd(state.form)
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
    const handleIcon = (item) => {
      state.form.menu_icon = item
    }
    /* type选择改变 */
    const onMenuTypeChange = () => {
      console.info(state.form.menu_type);
      if (state.form.menu_type === 1) {
        state.form.menu_permission = null;
      } else {
        state.form.menu_redirect = 0;
        state.form.menu_icon = null;
        state.form.menu_path = null;
        state.form.menu_component = null;
        state.form.menu_hide = true;
      }
    }

    /* type选择改变 */
    const onTargetChange = () => {
      if (state.form.menu_redirect === 2) {
        state.form.component = null;
      }
    }

    const expand  = () => { // 展开/折叠
      //this.isExpandTreeSelect = !this.isExpandTreeSelect
      //const nodes = this.$refs.tree.store._getAllNodes()
      // 或者方法二
      // const nodes = this.$refs.tree.store.nodesMap
      // for (let i in nodes) {
      //   nodes[i].expanded = this.isExpandTreeSelect
      // }
    }

    return {
      t,
      ...toRefs(state),
      showAdd,
      showEdit,
      close,
      save,
      handleIcon,
      onMenuTypeChange,
      onTargetChange,
      expand,
    }
  },
})
</script>
