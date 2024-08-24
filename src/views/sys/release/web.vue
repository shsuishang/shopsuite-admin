<template>
  <div class="page-base-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <ms-card class="page-header" shadow="never">
          <div class="page-header-tip">
            <p class="page-header-tip-title">
              {{ t("授权信息")}}
            </p>
            <div v-if="isAuthorized">
              <p class="page-header-tip-description">
                {{ t("授权对象")}} ： {{licence[0]}}
              </p>
              <p class="page-header-tip-description">
                {{ t("授权域名")}} ： {{licence[1]}}
              </p>
            </div>
            <div v-else>
              {{ t("未授权")}}
            </div>
          </div>
          <div v-if="!isAuthorized" class="page-header-avatar-list">
            <el-button :loading="loading" type="primary" @click="getAuthorize">{{ t("获取授权")}}</el-button>
          </div>
        </ms-card>
      </el-col>

      <el-col :span="24">
        <ms-card class="page-header" shadow="never">
          <el-form ref="formRef" :inline="true" label-width="150px" :model="form" :rules="rules">
            <el-form-item :label="t('接口网址')" prop="url_api" style="width: 100%">
              <el-input v-model="form.url_api" clearable :placeholder="t('后端API访问网址域名')" style="width: 100%"/>
            </el-form-item>
            <el-form-item :label="t('配色参考')" prop="primary_color">
              <el-radio-group
                v-model="form.primary_color">
                <el-radio border class="blue" label="#1db0fc">{{ t("天空蓝")}}</el-radio>
                <el-radio border class="green"  label="#42ca4d">{{ t("生鲜绿")}}</el-radio>
                <el-radio border class="red"  label="#e93323">{{ t("热情红")}}</el-radio>
                <el-radio border class="pink"  label="#ff448f">{{ t("魅力粉")}}</el-radio>
                <el-radio border class="orange"  label="#ff6700">{{ t("活力橙")}}</el-radio>
                <el-radio border class="gold"  label="#e0a558">{{ t("高端金")}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="t('配色方案')" prop="primary_color">
              <el-input v-model="form.primary_color" clearable :placeholder="t('请选择前端主色调')" style="width: 80%"/>
              <p class="help-block">{{ t("下载小程序及web代码前，请先选择配色方案。")}}</p>
            </el-form-item>
          </el-form>
        </ms-card>
      </el-col>

      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <ms-card class="page-box" shadow="never">
          <template #header>
            <ms-icon icon="information-line" />
            {{ t("小程序")}}
          </template>
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
              <el-button :loading="loading" type="primary" @click="getMp">{{ t("小程序")}} {{ t("源码包下载")}}</el-button>
            </div>
          </div>
        </ms-card>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <ms-card class="page-box" shadow="never">
          <template #header>
            <ms-icon icon="information-line" />
            {{ t("Web")}}
          </template>
          <div style="margin-left: 150px;">
            <el-button :loading="loading" type="primary" @click="getWeb">{{ t("手机Web")}} {{ t("源码包下载")}}</el-button>
          </div>
        </ms-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {getMpUrl, getLicence} from "@/api/sys/release";
import { isJson } from '@/utils/validate'
import {
  apiUrl
} from '@/config'

export default defineComponent({
  name: 'ReleaseWeb',
  components: {
  },
  emits: [],
  setup: function () {
    const $tableHeight = inject('$tableHeight')
    const $alert = inject('$alert')

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
        live_enabel: 0,
        url_api: apiUrl,
        primary_color: "#ff6700",
        secondary_color: "#ff6700",
      },
      licence: {},
      isAuthorized: false,
      rules: {},
    })

    const getAuthorize = async () => {
      state.listLoading = true
      window.open(`https://www.shopsuite.cn`)
      state.listLoading = false
    }
    const getWeb = async () => {
      state.listLoading = true
      const {data, msg, status} = await getMpUrl({release_type: "web", url_api:state.form.url_api, primary_color:state.form.primary_color})

      if (status == 200) {
        window.open(data)
      } else {
        $alert(msg)
      }

      state.listLoading = false
    }

    const getMp = async () => {
      state.listLoading = true

      const {data, msg, status} = await getMpUrl({release_type: "mp", url_api:state.form.url_api, primary_color:state.form.primary_color})

      if (status == 200) {
        window.open(data)
      } else {
        $alert(msg)
      }

      state.listLoading = false
    }

    const fetchData = async () => {
      state.listLoading = true
      const {data, status} = await getLicence({})
      if (status == 200) {
        if (data && isJson(data.licence_str)) {
          state.licence = JSON.parse(data.licence_str)
          console.info(state.licence)

          const host = window.location.host.split(":")[0]
          const hostList = host.split(".")
          let domain = ""

          if (hostList.length > 1) {
            domain = hostList[hostList.length-2] + "." + hostList[hostList.length-1];
          } else {
            domain = host;
          }

          if (state.licence[1].includes(domain)) {
            state.isAuthorized = true
          } else {
            state.isAuthorized = false
          }
        }
      }

      state.listLoading = false
    }
    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      getAuthorize,
      getWeb,
      getMp
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

  :deep(.page-box) {
    .el-card__body{
      height: 200px;
    }
  }

  .help-block{
    color: #979898;
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
  }


  .page-header {
    min-height: 145px;
    transition: none;

    :deep() {
      * {
        transition: none;
      }

      .el-card__body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    &-avatar {
      width: 60px;
      height: 60px;
      margin-right: 20px;
      border-radius: 50%;
    }

    &-tip {
      flex: auto;
      width: calc(100% - 200px);
      min-width: 300px;

      &-title {
        font-size: 20px;
        font-weight: bold;
        color: #3c4a54;
      }

      &-description {
        min-height: 20px;
        font-size: $base-font-size-default;
        color: #808695;
      }
    }
  }



  .xe-body {
    //border-bottom: 1px solid #eee
  }

  .xe-body .xe-user-img {
    float: left;
    display: block;
    padding-right: 10px
  }

  .xe-body .xe-comment-entry {
    display: table;
    width: 100%
  }

  .xe-body .xe-comment-entry .xe-comment,.xe-body .xe-comment-entry .xe-user-img {
    display: table-cell;
    vertical-align: top;
    padding-top: 10px;
    padding-bottom: 10px
  }

  .xe-body .xe-comment-entry .xe-user-img img {
    display: block
  }

  .xe-body .xe-comment-entry .xe-comment {
    width: 99%;
    padding-left: 10px
  }

  .xe-body .xe-comment-entry .xe-comment .xe-user-name {
    display: block;
    margin-bottom: 5px
  }

  .xe-body .xe-comment-entry .xe-comment .xe-user-name:hover strong {
    color: #7d7f7f
  }

  .xe-body .xe-comment-entry .xe-comment p {
    font-size: 12px
  }

  .xe-body ul>li {
    margin: 10px 0;
    border-bottom: 1px solid #eee
  }

  .xe-body ul>li:last-child {
    border-bottom: 0
  }

  .list-inline,.list-unstyled {
    padding-left: 0;
    list-style: none
  }

  :deep(.blue){
    .el-radio__label {
      color: #1db0fc;
    }
    .el-radio__inner {
      border: 1px solid #1db0fc;
    }

    &.is-checked {
      &.is-bordered {
        border: 1px solid #1db0fc;
      }
      .el-radio__label {
        color: #1db0fc;
      }
      .el-radio__inner {
        background-color: #1db0fc;
        border: 1px solid #1db0fc;
      }
    }
  }

:deep(.green){
  .el-radio__label {
    color: #42ca4d;
  }
  .el-radio__inner {
    border: 1px solid #42ca4d;
  }

  &.is-checked {
    &.is-bordered {
      border: 1px solid #42ca4d;
    }
    .el-radio__label {
      color: #42ca4d;
    }
    .el-radio__inner {
      background-color: #42ca4d;
      border: 1px solid #42ca4d;
    }
  }
}

  :deep(.red){
    .el-radio__label {
      color: #e93323;
    }
    .el-radio__inner {
      border: 1px solid #e93323;
    }

    &.is-checked {
      &.is-bordered {
        border: 1px solid #e93323;
      }
      .el-radio__label {
        color: #e93323;
      }
      .el-radio__inner {
        background-color: #e93323;
        border: 1px solid #e93323;
      }
    }
  }

  :deep(.pink){
    .el-radio__label {
      color: #ff448f;
    }
    .el-radio__inner {
      border: 1px solid #ff448f;
    }

    &.is-checked {
      &.is-bordered {
        border: 1px solid #ff448f;
      }
      .el-radio__label {
        color: #ff448f;
      }
      .el-radio__inner {
        background-color: #ff448f;
        border: 1px solid #ff448f;
      }
    }
  }

  :deep(.orange){
    .el-radio__label {
      color: #ff6700;
    }
    .el-radio__inner {
      border: 1px solid #ff6700;
    }

    &.is-checked {
      &.is-bordered {
        border: 1px solid #ff6700;
      }
      .el-radio__label {
        color: #ff6700;
      }
      .el-radio__inner {
        background-color: #ff6700;
        border: 1px solid #ff6700;
      }
    }
  }

  :deep(.gold){
    .el-radio__label {
      color: #e0a558;
    }
    .el-radio__inner {
      border: 1px solid #e0a558;
    }

    &.is-checked {
      &.is-bordered {
        border: 1px solid #e0a558;
      }
      .el-radio__label {
        color: #e0a558;
      }
      .el-radio__inner {
        background-color: #e0a558;
        border: 1px solid #e0a558;
      }
    }
  }

}


</style>
