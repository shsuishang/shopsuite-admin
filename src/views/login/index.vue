<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="formRef"
          class="login-form"
          label-position="left"
          :model="form"
          :rules="rules"
        >
          <div class="title">hello !</div>
          <div class="title-tips">
            {{ t('欢迎来到') }}{{ title }}！
          </div>
          <el-form-item prop="username">
            <el-input
              v-model.trim="form.username"
              v-focus
              :placeholder="t('请输入用户名')"
              tabindex="1"
              type="text"
            >
              <template #prefix>
                <ms-icon icon="user-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="passwordRef"
              v-model.trim="form.password"
              :placeholder="t('请输入密码')"
              tabindex="2"
              :type="passwordType"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <ms-icon icon="lock-line" />
              </template>
              <template v-if="passwordType === 'password'" #suffix>
                <ms-icon
                  class="show-password"
                  icon="eye-off-line"
                  @click="handlePassword"
                />
              </template>
              <template v-else #suffix>
                <ms-icon
                  class="show-password"
                  icon="eye-line"
                  @click="handlePassword"
                />
              </template>
            </el-input>
          </el-form-item>
          <!-- 验证码验证逻辑 -->
          <el-form-item prop="verify_code">
            <el-input
              v-model.trim="form.verify_code"
              :placeholder="t('验证码')"
              tabindex="3"
              type="text"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <ms-icon icon="barcode-box-line" />
              </template>
            </el-input>
            <el-image class="code" :src="captchaUrl" @click="changeCode" />
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              :loading="loading"
              type="primary"
              @click="handleLogin"
            >
              {{ t('登录') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { useSettingsStore } from '@/store/modules/settings'
  import { useUserStore } from '@/store/modules/user'
  import { translate as t } from '@/i18n'
  import { onBeforeRouteLeave } from 'vue-router'
  import { URL, httpCode } from '@/config'
  import {uuid} from "@/utils";

  export default defineComponent({
    name: 'Login',
    directives: {
      focus: {
        mounted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    setup() {
      const route = useRoute()
      const router = useRouter()

      const userStore = useUserStore()
      const settingsStore = useSettingsStore()

      const login = (form) => userStore.login(form)

      const validateUsername = (rule, value, callback) => {
        if ('' === value) callback(new Error(t('用户名不能为空')))
        else callback()
      }
      const validatePassword = (rule, value, callback) => {
        callback()
      }

      const state = reactive({
        formRef: null,
        passwordRef: null,
        form: {
          username: '',
          password: '',
          verify_code: '',
          verify_key: '',
        },
        rules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
          verify_code: [
          {
            required: true,
            trigger: 'blur',
            message: '验证码不能空',
          },
        ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        timer: 0,
        captchaUrl: '',
        previewText: '',
      })

      state.form.verify_key =  uuid()
      state.captchaUrl = `${URL.verifyCode}?verify_key=${state.form.verify_key}&timestamp=${new Date().getTime()}`

      const handleRoute = () => {
        return state.redirect === '/404' || state.redirect === '/403'
          ? '/'
          : state.redirect
      }
      const handlePassword = () => {
        state.passwordType === 'password'
          ? (state.passwordType = '')
          : (state.passwordType = 'password')
        nextTick(() => {
          state['passwordRef'].focus()
        })
      }
      const handleLogin = async () => {
        state['formRef'].validate(async (valid) => {
          if (valid)
            try {
              state.loading = true
              await login(state.form).catch(({code}) => {
                if (httpCode.CodeBusinessValidationFailed == code) {
                  changeCode()
                }
              })

              await router.push(handleRoute())
            } finally {
              state.loading = false
            }
        })
      }
      const changeCode = () => {
        state.form.verify_key =  uuid()
        state.captchaUrl = `${URL.verifyCode}?verify_key=${state.form.verify_key}&timestamp=${new Date().getTime()}`
        state.form.verify_code = ""
      }

      onBeforeMount(() => {
        if (URL.apiUrl == "https://demo.modulithshop.cn") {
          state.form.username = 'demoadmin'
          state.form.password = '111111'
        }

        // state.timer = setTimeout(() => {
        //   handleLogin()
        // }, 5000)
      })

      watchEffect(() => {
        state.redirect = (route.query && route.query.redirect) || '/'
      })

      onBeforeRouteLeave((to, from, next) => {
        clearInterval(state.timer)
        next()
      })

      onMounted(() => {
        //changeCode();
      })

      return {
        t,
        ...toRefs(state),
        title: settingsStore.getTitle,
        handlePassword,
        handleLogin,
        changeCode,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url('~@/assets/images/login/background.jpg') center center fixed
      no-repeat;
    background-size: cover;


    .login-form {
      position: relative;
      max-width: 100%;
      padding: 4.5vh;
      margin: calc((100vh - 500px) / 2) 5vw 5vw;
      overflow: hidden;
      background: url('~@/assets/images/login/login_form.png');
      background-size: 100% 100%;
      background-color: #3144ace3;
      border-radius: 17px;

      .title {
        font-size: 54px;
        font-weight: 500;
        color: var(--el-color-white);
      }

      .title-tips {
        margin-top: 29px;
        font-size: 26px;
        font-weight: 400;
        color: var(--el-color-white);
      }

      .login-btn {
        display: inherit;
        width: 100%;
        height: 50px;
        margin-top: 5px;
        background: var(--el-color-primary);
        border: 0;

        &:hover {
          opacity: 0.9;
        }
      }

      .tips {
        margin-bottom: 10px;
        font-size: $base-font-size-default;
        color: var(--el-color-white);

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .title-container {
        position: relative;

        .title {
          margin: 0 auto 40px auto;
          font-size: 34px;
          font-weight: bold;
          color: var(--el-color-primary);
          text-align: center;
        }
      }

      i {
        position: absolute;
        top: 8px;
        left: 15px;
        font-size: 16px;
      }

      .show-password {
        float: right;
        width: 32px;
        height: 32px;
        font-size: 16px;
      }

      :deep() {
        .el-form-item {
          padding-right: 0;
          margin: 20px 0;
          color: #454545;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 2px;
          margin: 20px 0;

          &__content {
            min-height: $base-input-height;
            line-height: $base-input-height;
          }

          &__error {
            position: absolute;
            top: 100%;
            left: 18px;
            font-size: $base-font-size-small;
            line-height: 18px;
            color: var(--el-color-error);
          }
        }

        .el-input {
          box-sizing: border-box;

          input {
            height: 48px;
            padding-left: 30px;
            line-height: 48px;
            border: 0;
          }

          &__suffix-inner {
            position: absolute;
            right: 65px;
            cursor: pointer;
          }
        }

        .code {
          position: absolute;
          top: 4px;
          right: 4px;
          cursor: pointer;
          border-radius: $base-border-radius;
        }
      }
    }
  }
</style>
