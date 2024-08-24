<template>
    <div class="config-container">
    <el-row>
      <el-col :span="24">
        <div>
          <el-card class="box-card">
            <div>
              <el-button
                icon="el-icon-s-tools"
                :loading="buttonLoading"
                type="danger"
                @click="cleanCache()"
              >
                {{ buttonLoading ? `请等待 ${countdown} 秒` : t('清理缓存') }}
              </el-button>
              <span class="text">
                {{ t('谨慎操作：此缓存接口为系统性能提供重要支持，请确保在清理前已确认无误，以避免不必要的数据丢失和性能下降') }}
              </span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    </div>
  </template>


  <script>
  import { translate as t } from '@/i18n'
  import { cacheClean } from '@/api/sys/config'

  export default defineComponent({
    name: 'Config',
    components: { },
    setup() {
      const $tableHeight = inject('$tableHeight')
      const $message = inject('$message')

      const state = reactive({
        height: $tableHeight(),
        buttonLoading: false,
        countdown: 10,
      })

      const cleanCache = async () => {
         // 如果按钮已禁用，直接返回
         if (state.buttonLoading) {
          return;
        }
        state.buttonLoading = true;
        // 启动倒计时
        startCountdown();
        const {msg, status} = await cacheClean()
        if (200 == status) {
            $message(msg, 'success')
        } else {
            $message(msg, 'error')
        }
      }

      const startCountdown = () => {
        const timer = setInterval(() => {
            state.countdown--;
          if (state.countdown === 0) {
            clearInterval(timer);
            state.buttonLoading = false; // 倒计时结束后恢复按钮可点击
            state.countdown = 10; // 重置倒计时
          }
        }, 1000);
      }

      onMounted(() => {
      })

      return {
        t,
        startCountdown,
        cleanCache,
        ...toRefs(state),
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
      .el-button.is-text{
        width: 40px;
      }
    }
    .text {
        margin: 10px;
    }
  }
  </style>
