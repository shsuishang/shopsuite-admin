<template>
  <div class="page-base-container">
    <div>
      <el-form ref="formRef" :inline="true" label-width="150px" :model="form" :rules="rules">
        <el-form-item :label="t('小程序源码包')" prop="live_enabel">
          <el-radio-group
            v-model="form.live_enabel">
            <el-radio :label="0">{{ t("未开通直播")}}</el-radio>
            <el-radio :label="1">{{ t("已开通直播")}}</el-radio>
          </el-radio-group>
          <p class="help-block">{{ t("请谨慎选择是否有开通小程序直播功能，否则将影响小程序的发布 可前往 帮助文档 查看如何开通直播功能")}}</p>
        </el-form-item>
      </el-form>
      <div style="margin-left: 150px;">
        <el-button :loading="loading" type="primary" @click="save">{{ t("源码包下载")}}</el-button>
      </div>
    </div>
    <div>
      <el-form ref="formRef" :inline="true" label-width="150px" :model="form" :rules="rules">
        <el-form-item :label="t('小程序源码包')" prop="live_enabel">
          <el-radio-group
            v-model="form.live_enabel">
            <el-radio :label="0">{{ t("未开通直播")}}</el-radio>
            <el-radio :label="1">{{ t("已开通直播")}}</el-radio>
          </el-radio-group>
          <p class="help-block">{{ t("请谨慎选择是否有开通小程序直播功能，否则将影响小程序的发布 可前往 帮助文档 查看如何开通直播功能")}}</p>
        </el-form-item>
      </el-form>
      <div style="margin-left: 150px;">
        <el-button :loading="loading" type="primary" @click="save">{{ t("源码包下载")}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'

export default defineComponent({
  name: 'ReleaseMp',
  components: {},
  emits: [],
  setup() {
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      diyRef: null,
      height: $tableHeight(),
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        page_name: '',
        page_type: 2,
      },
      loading: false,
      form: {
        live_enabel:0
      },
      rules: {
      },
    })
    const fetchData = async () => {
      state.listLoading = true

      state.listLoading = false
    }
    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.page-base';
#{$base}-container {

  :deep(.el-table) {
    .el.is-text {
      width: 36px;
    }
  }


  .help-block{
    color: #979898;
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
    width: -webkit-fill-available;
  }
}
</style>
