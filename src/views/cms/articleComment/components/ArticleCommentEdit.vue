<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="1000px"
    @close="close"
  >
    <el-form ref="formRef" label-width="165px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('评论编号')" prop="comment_id">
        <el-input v-model="form.comment_id" clearable :disabled="isUpdate" :placeholder="t('评论编号')"/>
      </el-form-item>
      <el-form-item :label="t('文章编号')" prop="article_id">
        <el-select
          v-model="form.article_id"
          clearable
          :disabled="isUpdate && false"
          filterable
          :placeholder="t('请选择文章')"
          remote
          :remote-method="getArticleBaseList"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in articleBaseList"
            :key="index"
            :disabled="item.disabled"
            :label="item.article_title"
            :value="item.article_id"
          />
        </el-select>
      </el-form-item>
      <div style="height: 500px">
        <el-form-item :label="t('评论内容')" prop="comment_content">
          <MsRichEditor
            v-if="showRichEditor"
            ref="msRichEditorRef"
            v-model="form.comment_content"
            style="height: 400px;"
          />
        </el-form-item>
      </div>

      <el-form-item :label="t('是否显示')" prop="comment_is_show">
        <el-switch
          v-model="form.comment_is_show"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
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
import {doEdit, doAdd} from '@/api/cms/articleComment'
import {getList} from "@/api/cms/articleBase";
import MsRichEditor from "@/plugins/MsRichEditor";

export default defineComponent({
  name: 'ArticleCommentEdit',
  components: {MsRichEditor},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      form: {
        comment_is_show: true,
      },
      title: '',
      articleBaseList: [],
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      showRichEditor:true
    })

    const rules = reactive({
      article_id: [{required: true, trigger: 'change', message: t('请选择文章')}],
      comment_content: [{required: true, trigger: 'blur', message: t('请输入评论内容')}],
    })

    const getArticleBaseList = async (query) => {
      const { data } = await getList({size:500, article_title: query,})
      state.articleBaseList = data.items
    }

    const showEdit = (row) => {
      state.showRichEditor = true;
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
      state.showRichEditor = false;
      state['formRef'].resetFields()
      state.form = {
        comment_content: '',
        comment_is_show: true,
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
      getArticleBaseList()
    })

    return {
      t: t,
      ...toRefs(state),
      getArticleBaseList,
      showEdit,
      rules,
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
