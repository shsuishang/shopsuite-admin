<template>
  <div class="personal-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <ms-card shadow="hover">
          <div class="personal-user-info">
            <el-image
              :preview-src-list="[avatar]"
              preview-teleported
              :src="avatar"
              style="width: 100px; height: 100px; border-radius: 50%;"
            />
            <div v-if="false" class="personal-user-info-follow">
              <a href="" target="_blank">
                <el-button round type="primary">
                  <ms-icon icon="group-line" />
                  {{ t('Follow me')}}
                </el-button>
              </a>
            </div>

            <ul class="personal-user-info-list">
              <li>
                <ms-icon icon="user-3-line" />
                {{form.user_nickname}}
              </li>
              <li>
                <ms-icon icon="magic-line" />
                {{form.user_birthday}}
              </li>
              <li>
                <ms-icon icon="women-line" />
                <span :type='(["0","1","2"])[form.user_gender]'>
                  {{ ([t('保密'),t('男'),t('女')])[form.user_gender] }}
                </span>
              </li>
              <li>
                <ms-icon icon="cellphone-line" />
                {{form.user_intl}} {{form.user_mobile}}
              </li>
              <li>
                <ms-icon icon="mail-line" />
                {{ form.user_email }}
              </li>
              <li>
                <ms-icon icon="map-pin-2-line" />
                {{ form.ud_address }}
              </li>
              <li>
                <el-divider />
                <h5>{{ t('个性标签')}}</h5>
                <el-tag v-for="tag in form.tag_title_list" :key="tag">
                  {{ tag }}
                </el-tag>
              </li>
            </ul>
          </div>
        </ms-card>
      </el-col>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <ms-card shadow="hover">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="t('基本信息')" name="first">
              <el-col :lg="12" :md="16" :sm="24" :xl="12" :xs="24">
                <el-form label-width="60px" :model="form">
                  <el-form-item :label="t('账号')" prop="user_account">
                    <el-input v-model="form.user_account" clearable :disabled="true" :placeholder="t('账号')"/>
                  </el-form-item>
                  <el-form-item :label="t('昵称')" prop="user_nickname">
                    <el-input v-model="form.user_nickname" clearable :placeholder="t('昵称')"/>
                  </el-form-item>
                  <el-form-item :label="t('头像')" prop="user_avatar">
                    <pic-upload
                      ref="picUpRef"
                      v-model="form.user_avatar"
                      height="80"
                      :limit="1"
                      width="80"
                    />
                  </el-form-item>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item :label="t('手机号')" prop="user_intl">
                        <el-select v-model="form.user_intl" :style="{ width: '100%' }">
                          <el-option
                            v-for="(item, index) in intlOptions"
                            :key="index"
                            :disabled="item.disabled"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label-width="0" prop="user_mobile">
                        <el-input
                          v-model="form.user_mobile"
                          clearable
                          :placeholder="t('请输入联系手机')"
                          :style="{ width: '100%' }"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item :label="t('性别')">
                    <el-select v-model="form.user_gender" style="width: 100%">
                      <el-option :label="t('保密')" :value="0" />
                      <el-option :label="t('男')" :value="1" />
                      <el-option :label="t('女')" :value="2" />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="t('生日')" prop="user_birthday">
                    <el-date-picker
                      v-model="form.user_birthday"
                      clearable
                      :placeholder="t('生日')"
                      style="width:100%;"
                      type="date"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                  <el-form-item :label="t('邮箱')" prop="user_email">
                    <el-input v-model="form.user_email" clearable :placeholder="t('邮箱')"/>
                  </el-form-item>
                  <el-form-item :label="t('标签')" prop="tag_ids">
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
                  <el-form-item>
                    <el-button type="primary" @click="save">{{ t('保存')}}</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-tab-pane>
            <el-tab-pane v-if="false" :label="t('账号绑定')" name="second">
              <div class="personal-item">
                <ms-icon icon="qq-line" style="color: #3492ed" />
                <div class="personal-item-content">
                  <div>{{ t('绑定QQ')}}</div>
                  <div class="personal-item-content-second">
                    {{ t('当前未绑定绑定QQ账号')}}
                  </div>
                </div>
                <el-link type="primary">{{ t('更换绑定')}}</el-link>
              </div>
              <el-divider />
              <div class="personal-item">
                <ms-icon icon="wechat-line" style="color: #4daf29" />
                <div class="personal-item-content">
                  <div>{{ t('绑定微信')}}</div>
                  <div class="personal-item-content-second">
                    {{ t('当前未绑定绑定微信账号')}}
                  </div>
                </div>
                <el-link type="primary">{{ t('更换绑定')}}</el-link>
              </div>
              <el-divider />
              <div class="personal-item">
                <ms-icon icon="alipay-line" style="color: #1476fe" />
                <div class="personal-item-content">
                  <div>{{ t('绑定支付宝')}}</div>
                  <div class="personal-item-content-second">
                    {{ t('当前未绑定绑定支付宝账号')}}
                  </div>
                </div>
                <el-link type="primary">{{ t('更换绑定')}}</el-link>
              </div>
              <el-divider />
              <div class="personal-item">
                <ms-icon icon="weibo-line" style="color: #ffd440" />
                <div class="personal-item-content">
                  <div>{{ t('绑定微博')}}</div>
                  <div class="personal-item-content-second">
                    {{ t('当前未绑定绑定微博账号')}}
                  </div>
                </div>
                <el-link type="primary">{{ t('更换绑定')}}</el-link>
              </div>
              <el-divider />
              <div class="personal-item">
                <ms-icon icon="github-line" />
                <div class="personal-item-content">
                  <div>{{ t('绑定Github')}}</div>
                  <div class="personal-item-content-second">
                    {{ t('当前未绑定绑定Github账号')}}
                  </div>
                </div>
                <el-link type="primary">{{ t('更换绑定')}}</el-link>
              </div>
              <el-divider />
              <div class="personal-item">
                <ms-icon icon="paypal-line" style="color: #012e85" />
                <div class="personal-item-content">
                  <div>{{ t('绑定Paypal')}}</div>
                  <div class="personal-item-content-second">
                    {{ t('当前未绑定绑定Paypal账号')}}
                  </div>
                </div>
                <el-link type="primary">{{ t('更换绑定')}}</el-link>
              </div>
              <el-divider />
            </el-tab-pane>
          </el-tabs>
        </ms-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { translate as t } from '@/i18n'
  import { useUserStore } from '@/store/modules/user'
  import {doEdit, getUserData} from "@/api/account/userInfo";
  import {formatDateOne} from "@/utils/format";
  import PicUpload from '@/plugins/MsUpload/PicUpload'
  import {tree} from "@/api/account/userTagGroup";

  export default defineComponent({
    name: 'Personal',
    components:{PicUpload},
    setup() {
      const $message = inject('$message')
      const userStore = useUserStore()
      const { avatar } = storeToRefs(userStore)

      const state = reactive({
        vabCropperRef: null,
        activeName: 'first',
        form: {
          user_birthday: '',
        },
        intlOptions: [
          {
            label: t('简中（+86）'),
            value: '+86',
          },
          {
            label: 'U.S.A(+1)',
            value: '+1',
          },
          {
            label: 'عربي ، (+966)',
            value: '966+',
          },
          {
            label: t('日本語(+81)'),
            value: '+81',
          },
        ],
        tagGroupTreeList: [],
        isExpandTreeSelect:true,
      })

      const save = async () => {
          if (state.form) {
            const data = Object.assign({}, state.form)
            data.tag_ids = state.form.tag_ids.join()
              const { msg, status } = await doEdit(data)
              if (200 == status) {
                $message(msg, 'success')
                await getUserInfo()
              } else {
                $message(msg, 'error')
              }
          }
      }

      const getUserInfo = async () => {

        const { data } = await getUserData()
        state.form = Object.assign({}, data)
        if (state.form.user_birthday) {
          state.form.user_birthday = formatDateOne(new Date(state.form.user_birthday))
        }
        if (state.form.tag_ids) {
          state.form.tag_ids = state.form.tag_ids.split(',').map(Number)
        }
        state.dialogFormVisible = true
      }

      const getTree = async  () => {
        const { data } = await tree({size:500,})
        state.tagGroupTreeList = data
      }

      onMounted(() => {
        getUserInfo()
        getTree()
      })


      return {
        t: t,
        ...toRefs(state),
        avatar,
        save,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.personal';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;

    #{$base}-user-info {
      padding: $base-padding;
      text-align: center;

      :deep() {
        .el-avatar {
          img {
            cursor: pointer;
          }
        }
      }

      &-full-name {
        margin-top: 15px;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
      }

      &-description {
        margin-top: 8px;
      }

      &-follow {
        margin-top: 15px;
      }

      &-list {
        margin-top: 18px;
        line-height: 30px;
        text-align: left;
        list-style: none;

        h5 {
          margin: -20px 0 5px 0;
        }

        :deep() {
          .el-tag {
            margin-right: 10px !important;
          }

          .el-tag + .el-tag {
            margin-left: 0;
          }
        }
      }
    }

    #{$base}-item {
      display: flex;

      i {
        font-size: 40px;
      }

      &-content {
        box-sizing: border-box;
        flex: 1;
        margin-left: $base-margin;

        &-second {
          margin-top: 8px;
        }
      }
    }
  }
</style>
