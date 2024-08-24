<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import { toLoginRoute } from '@/utils/routes'
  import { translate } from '@/i18n'
  import { ShopSuiteRoute } from '/#/router'

  const route: ShopSuiteRoute = useRoute()
  const router = useRouter()

  const userStore = useUserStore()
  const { avatar, username } = storeToRefs(userStore)
  const { logout } = userStore

  const active = ref(false)

  const handleVisibleChange = (val: boolean) => {
    active.value = val
  }
  const handleCommand = async (command: string) => {
    switch (command) {
      case 'logout':
        await logout()
        await router.push(toLoginRoute(route.fullPath))
        break
      case 'personalCenter':
        await router.push('/personal')
        break
    }
  }
</script>

<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="avatar" />
      <div class="user-name">
        <span class="hidden-xs-only" :title="username">{{ username }}</span>
        <ms-icon
          class="ms-dropdown"
          :class="{ 'ms-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <ms-icon icon="user-line" />
          <span>{{ translate('个人中心') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <ms-icon icon="logout-circle-r-line" />
          <span>{{ translate('退出登录') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;
      span {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      [class*='ri-'] {
        margin-left: 3px !important;
      }
    }
  }
</style>
