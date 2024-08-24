<template>
  <ms-card class="top-card" :class="'top-card-' + background" shadow="hover">
    <span>{{ title }}</span>
    <p>
      <ms-count
        :decimals="countConfig.decimals"
        :duration="countConfig.duration"
        :end-val="countConfig.today"
        :prefix="countConfig.prefix"
        :separator="countConfig.separator"
        :start-val="countConfig.startVal"
        :suffix="countConfig.suffix"
      />
    </p>
    <div class="right-icon">
      <ms-icon :icon="icon" />
    </div>

    <div class="bottom">
      {{ t("上期")}}{{countConfig.prefix}}{{ countConfig.yestoday }}
      <block style="margin-left: 5px;"><!--{{ t("环比")}}--> {{ countConfig.daym2m==null ? "—" : Number(countConfig.daym2m * 100).toFixed(0) + "%" }} </block>
      <block v-if="countConfig.daym2m!=null"><ms-icon v-if="countConfig.daym2m && countConfig.daym2m>0" icon="arrow-up-line" /><ms-icon v-else icon="arrow-down-line" /></block>
      <block v-if="countConfig.month" style="float: right;line-height:18px;">
        {{ t("本月")}} {{countConfig.prefix}}{{countConfig.month}}</block>
    </div>

    <div v-if="false" class="bottom">
      {{ bottomText }}
      <div style="float: right">{{ countConfig.month }}{{ unitText }}</div>
    </div>
  </ms-card>
</template>

<script>
import {translate as t} from '@/i18n'
  import _ from 'lodash'
  import MsCount from '@/plugins/MsCount'

  export default defineComponent({
    name: 'TopNum',
    components: {
      MsCount,
    },
    props: {
      background: {
        type: String,
        default: 'white',
      },
      title: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: 'album-line',
      },
      bottomText: {
        type: String,
        default: '',
      },
      unitText: {
        type: String,
        default: '',
      },
      countConfig: {
        type: Object,
        default: () => {
          return {
            startVal: 0,
            endVal: _.random(1000, 20000),
            decimals: 0,
            prefix: '',
            suffix: '',
            separator: ',',
            duration: 8000,
          }
        },
      },
    },
    setup() {
      const state = reactive({})

      return {
        t,
        ...toRefs(state),
      }
    },
  })
</script>

<style lang="scss" scoped>
  .top-card {
    position: relative;
    height: 158px !important;

    p {
      font-size: 28px;
    }

    .right-icon {
      position: absolute;
      top: 50%;
      right: 20px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      color: var(--el-color-primary);
      text-align: center;
      background: var(--el-color-primary-light-9);
      border-radius: 50%;
      transform: translateY(-50%);

      i {
        font-size: 30px;
      }
    }

    .bottom {
      font-size: 12px;
      margin-top: 10px;

      .ri-arrow-up-line {
        width: 18px;
        height: 18px;
        margin: 0 3px 0 2px;
        color: var(--el-color-error);
        vertical-align: -3px !important;
        background: var(--el-color-error-light);
        border-radius: 50%;
        transform: scale(0.8);
      }

      .ri-arrow-down-line {
        width: 18px;
        height: 18px;
        margin: 0 3px 0 2px;
        color: var(--el-color-success);
        vertical-align: -3px !important;
        background: var(--el-color-success-light);
        border-radius: 50%;
        transform: scale(0.8);
      }

      span {
        color: var(--el-color-success);
      }
    }

    &-blue {
      color: #fff;
      background: var(--el-color-primary);
      background: linear-gradient(
        90deg,
        var(--el-color-primary-light-4),
        var(--el-color-primary)
      );

      .bottom {
        font-size: 12px;

        .ri-arrow-up-line {
          color: #fff;
          background: transparent;
        }

        .ri-arrow-up-line {
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          transform: scale(0.8);
        }

        span {
          color: #fff;
        }
      }
    }
  }
</style>
