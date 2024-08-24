<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'
  import { translate } from '@/i18n'
  import { getNotice, clearNotice } from '@/api/account/userMessage'

  const $message: any = inject('$message')

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)

  const activeName = ref('notice')
  const notices: any = ref([])
  const badge = ref(undefined)

  const fetchData = async () => {
    const {
      data: { items, total },
    } = await getNotice({})
    notices.value = items
    badge.value = total === 0 ? undefined : total
  }

  nextTick(() => {
    if (theme.value.showNotice) fetchData()
  })

  const handleClick = () => {
    fetchData()
  }

  const handleClearNotice = async () => {
    badge.value = undefined
    notices.value = []
    const { msg, status } = await clearNotice()
    if (200 == status) {
      $message('清空消息成功', 'success')
    } else {
      $message(msg, 'error')
    }
  }
</script>

<template>
  <el-badge v-if="theme.showNotice" type="danger" :value="badge">
    <el-popover placement="bottom" trigger="hover" :width="300">
      <template #reference>
        <ms-icon icon="notification-line" />
      </template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="translate('通知')" name="notice">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li v-for="(item, index) in notices" :key="index">
                  <el-avatar :size="45" :src="item.user_avatar" />
                  <span v-html="item.message_content" />
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane :label="translate('邮件')" name="email">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li v-for="(item, index) in notices" :key="index">
                  <el-avatar :size="45" :src="item.user_avatar" />
                  <span>{{ item.email }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane> -->
      </el-tabs>
      <div v-if="notices && notices.length > 0" class="notice-clear" @click="handleClearNotice">
        <el-button text type="primary">
          <ms-icon icon="close-circle-line" />
          <span>{{ translate('清空消息') }}</span>
        </el-button>
      </div>
    </el-popover>
  </el-badge>
</template>

<style lang="scss" scoped>
  :deep() {
    .el-tabs__active-bar {
      min-width: 28px;
    }
  }

  .notice-list {
    height: 29vh;

    ul {
      padding: 0 15px 0 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 0;

        :deep() {
          .el-avatar {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        span {
          margin-left: 10px;
        }
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0 0 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #e8eaec;

    i {
      margin-right: 3px;
    }
  }
</style>
