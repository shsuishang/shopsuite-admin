<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('地区编号')" prop="district_id">
        <el-input v-model="form.district_id" clearable :disabled="isUpdate" :placeholder="t('地区编号')"/>
      </el-form-item>
      <el-form-item :label="t('地区名称')" prop="district_name">
        <el-input v-model="form.district_name" clearable :placeholder="t('地区名称')"/>
      </el-form-item>
      <el-form-item :label="t('上级编号')" prop="district_parent_id">
        <el-tree-select
          v-model="form.district_parent_id"
          :data="districtList"
          :default-expand-all="isExpandTreeSelect"
          highlight-current
          node-key="district_id"
          :placeholder="t('请选择上级地区')"
          :props="{ value: 'district_id', label: 'district_name'}"
          style="width: 100%"
          value-key="district_name"
        />
      </el-form-item>
      <el-form-item :label="t('地区排序')" prop="district_sort">
        <el-input v-model="form.district_sort" clearable :placeholder="t('地区排序')"/>
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
import {doEdit, doAdd, getTree} from '@/api/sys/districtBase'

export default defineComponent({
  name: 'DistrictBaseEdit',
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
      },
      rules: {
        title: [{required: true, trigger: 'blur', message: t('请输入标题')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,

      isExpandTreeSelect:true,
      districtList: [],
    })

    const showAdd = (row) => {
      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = false
        state.title = t('添加')
        state.form.district_parent_id = row.district_id
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
      }
      state.dialogFormVisible = true
    }
    const getTreeData = async () => {
      const {
        data: items,
      } = await getTree({})

      const list = [
        {
          district_id: 0,
          district_name: t('根节点'),
          children: items,
        },
      ]

      state.districtList = list
    }

    const close = () => {
      state['formRef'].resetFields()
      state.form = {
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
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
      getTreeData()
    })

    return {
      t: t,
      ...toRefs(state),
      showAdd,
      showEdit,
      close,
      save,
    }
  },
})
</script>
<style lang="scss">
.el-input__wrapper{
  width: 100%;
}
</style>
