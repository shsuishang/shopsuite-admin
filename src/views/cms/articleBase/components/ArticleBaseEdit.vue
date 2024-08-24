<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="1000px"
    @close="close"
  >
    <el-form ref="formRef" label-width="140px" :model="form" :rules="rules">
      <el-form-item v-if="isUpdate" :label="t('编号')" prop="article_id">
        <el-input v-model="form.article_id" clearable :disabled="isUpdate" :placeholder="t('编号')"/>
      </el-form-item>
      <el-form-item :label="t('标题')" prop="article_title">
        <el-input v-model="form.article_title" clearable :placeholder="t('标题')"/>
      </el-form-item>
      <el-form-item :label="t('文章摘要')" prop="article_excerpt">
        <el-input v-model="form.article_excerpt" clearable :placeholder="t('文章摘要')"/>
      </el-form-item>

      <el-form-item :label="t('所属分类')" prop="category_id">
        <el-tree-select
          v-model="form.category_id"
          :check-strictly="true"
          :data="categoryList"
          :default-expand-all="isExpandTreeSelect"
          highlight-current
          node-key="category_id"
          :placeholder="t('请选择文章分类')"
          :props="{ value: 'category_id', label: 'category_name'}"
          style="width: 100%"
          value-key="category_name"
        />
      </el-form-item>
      <el-form-item :label="t('SEO标题')" prop="article_seo_title">
        <el-input v-model="form.article_seo_title" clearable :placeholder="t('SEO标题')"/>
      </el-form-item>
      <el-form-item :label="t('SEO关键字')" prop="article_seo_keywords">
        <el-input v-model="form.article_seo_keywords" clearable :placeholder="t('SEO关键字')"/>
      </el-form-item>
      <el-form-item :label="t('SEO描述')" prop="article_seo_description">
        <el-input v-model="form.article_seo_description" clearable :placeholder="t('SEO描述')"/>
      </el-form-item>
      <el-form-item :label="t('文章标签')" prop="article_tags">
        <el-select
          v-model.trim="form.article_tags"
          :disabled="isUpdate && false"
          filterable
          multiple
          :placeholder="t('请选择文章标签')"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in tags"
            :key="index"
            :disabled="item.disabled"
            :label="item.tag_name"
            :value="item.tag_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('文章图片')" prop="article_image">
        <pic-upload
          ref="picUpRef"
          v-model="form.article_image"
          height="178"
          :limit="1"
          width="178"
        />
      </el-form-item>
      <div style="height: 500px" >
        <el-form-item :label="t('文章内容')" prop="article_content">
          <el-col :span="24">
          <MsRichEditor
            v-if="showRichEditor"
            ref="msRicheditorRef"
            v-model="form.article_content"
            style="height: 400px"
          />
          </el-col>
        </el-form-item>
      </div>
      <el-form-item :label="t('是否启用问答留言')" prop="article_reply_flag">
        <el-switch
          v-model="form.article_reply_flag"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('文章类型')" prop="article_type">
        <el-radio-group v-model="form.article_type" size="medium">
          <el-radio
            v-for="(item, index) in article_typeOptions"
            :key="index"
            :disabled="item.disabled"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('排序')" prop="article_sort">
        <el-input v-model="form.article_sort" clearable :placeholder="t('排序')"/>
      </el-form-item>
      <el-form-item :label="t('状态')" prop="article_status">
        <el-switch
          v-model="form.article_status"
          active-color="#13ce66"
          :active-value=true
          inactive-color="#ff4949"
          :inactive-value=false
        />
      </el-form-item>
      <el-form-item :label="t('是否热门')" prop="article_is_popular">
        <el-switch
          v-model="form.article_is_popular"
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
import {doEdit, doAdd} from '@/api/cms/articleBase'
import {getTree} from "@/api/cms/articleCategory";
import {getList} from "@/api/cms/articleTag";
import PicUpload from "@/plugins/MsUpload/PicUpload";
import MsRichEditor from "@/plugins/MsRichEditor";

export default defineComponent({
  name: 'ArticleBaseEdit',
  components: {PicUpload, MsRichEditor},
  props:{
  },
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')

    const state = reactive({
      formRef: null,
      showRichEditor:false,
      form: {
        article_tags: [],
        article_reply_flag: true,
        article_type: 1,
        article_status: false,
        article_is_popular: false,
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      categoryList: [],
      tags: [],
      isExpandTreeSelect:true,
      article_typeOptions: [
        {
          label: '文章',
          value: 1,
        },
        {
          label: '公告',
          value: 2,
        },
      ],
    })

    const rules = reactive({
      article_title: [{required: true, trigger: 'blur', message: t('请输入标题')}],
      article_sort: [{required: true, trigger: 'blur', message: t('请输入排序')}],
      article_content: [{required: true, trigger: 'blur', message: t('请输入文章内容')}],
      article_type: [{required: true, trigger: 'change', message: t('请选择文章类型')}],
      category_id: [{required: true, trigger: 'change', message: t('请选择文章分类')}],
      article_status: [{required: true, trigger: 'change', message: t('请选择状态')}],
      article_reply_flag: [{required: true, trigger: 'change', message: t('请选择是否启用问答留言')}],
    })

    const getCategoryData = async () => {
      const {
        data: list,
      } = await getTree({})
      state.categoryList = list
    }
    const initTags = async () => {
      const { data } = await getList({size:500,})
      state.tags = data.items
    }

    const showEdit = (row) => {
      state.showRichEditor = true
      if (!row) {
        state.isUpdate = false
        state.title = t('添加')
      } else {
        state.isUpdate = true
        state.title = t('编辑')
        state.form = Object.assign({}, row)
        if (row.article_tags.trim()) {
          state.form.article_tags = row.article_tags.split(',').map(Number)
        }
      }
      state.dialogFormVisible = true
    }
    const close = () => {
      state.showRichEditor = false;
      state['formRef'].resetFields()
      state.form = {
        article_content: '',
        article_tags: [],
        article_reply_flag: true,
        article_type: "1",
        article_status: false,
        article_is_popular: false,
      }
      state.dialogFormVisible = false
    }
    const save = () => {
      state['formRef'].validate(async (valid) => {
        if (valid) {
          if (state.form) {
            state.form.article_tags = state.form.article_tags.toString()
          }
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
      initTags()
      getCategoryData()
    })

    return {
      t: t,
      ...toRefs(state),
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
