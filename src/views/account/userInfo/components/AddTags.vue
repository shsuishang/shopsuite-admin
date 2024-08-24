<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules" style="height: 300px">
      <el-form-item :label="t('用户标签')" prop="tag_ids">
        <el-tree-select
          v-model="form.tag_ids"
          :data="tagGroupTreeList"
          :default-expand-all="isExpandTreeSelect"
          highlight-current
          multiple
          node-key="tag_id"
          :placeholder="t('请选择用户标签')"
          :props="{ value: 'tag_id', label: 'tag_title'}"
          style="width: 100%"
          value-key="tag_title"
        />
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
  import {addTags} from '@/api/account/userInfo'
  import {tree} from "@/api/account/userTagGroup";

  export default defineComponent({
    name: 'AddTags',
    props:{
    },
    emits: ['fetch-data'],
    setup(props, {emit}) {
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        form: {
          tag_ids: [],
          user_ids: '',
        },
        title: '批量设置标签',
        dialogFormVisible: false,
        tagGroupTreeList: [],
        isExpandTreeSelect: true,

      })

      const showAddTags = (row) => {
        if (row) {
          state.form.user_ids = row

          state.dialogFormVisible = true
        } else {
          state.dialogFormVisible = false
        }
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
            if (state.form) {
              state.form.tag_ids = state.form.tag_ids.join()
            }
            const { msg, status } = await addTags(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
            emit('fetch-data')
            close()
          }
        })
      }

      const rules = reactive({
        tag_ids: [{required: true, trigger: 'change', message: t('请选择用户标签')}],
      })

      const getTree = async  () => {
        const { data } = await tree({size:500,})
        state.tagGroupTreeList = data
      }

      onMounted(() => {
        getTree()
      })

      return {
        t: t,
        ...toRefs(state),
        showAddTags,
        close,
        rules,
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
