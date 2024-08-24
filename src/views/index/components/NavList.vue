<template>
  <el-col
    v-for="(item, index) in iconList"
    :key="index"
    :lg="3"
    :md="3"
    :sm="6"
    :xl="3"
    :xs="12"
  >
    <ms-card
      v-if="item.click && item.click === 'changeTheme'"
      class="icon-panel"
      shadow="hover"
      @click="changeTheme"
    >
      <ms-icon :icon="item.icon" :style="{ color: item.color }" />
      <p>{{ item.title }}</p>
    </ms-card>
    <ms-link v-else :to="item.link">
      <ms-card class="icon-panel" shadow="hover">
        <ms-icon :icon="item.icon" :style="{ color: item.color }" />
        <p>{{ item.title }}</p>
      </ms-card>
    </ms-link>
  </el-col>
</template>

<script>
  import {translate as t} from '@/i18n'

  export default defineComponent({
    setup() {
      const $pub = inject('$pub')
      const router = useRouter()

      // 卡片图标
      const iconList = [
        {
          icon: 'user-3-line',
          title: t('用户管理'),
          link: '/userInfo',
          color: '#95de64',
        },
        {
          icon: 'settings-4-line',
          title: t('系统设置'),
          link: '/site/1001',
          color: '#69c0ff',
        },
        {
          icon: 'product-hunt-line',
          title: t('商品'),
          link: '/productBase',
          color: '#ffd666',
        },
        {
          icon: 'list-unordered',
          title: t('订单管理'),
          link: '/orderBase',
          color: '#1890FF',
        },
        {
          icon: 'message-line',
          title: t('消息配置'),
          link: '/messageTemplate',
          color: '#ffc069',
        },
        {
          icon: 'table-line',
          title: t('文章管理'),
          link: '/articleBase',
          color: '#5cdbd3',
        },
        {
          icon: 'code-box-line',
          title: t('首页装修'),
          link: '/diy-mobile',
          color: '#b37feb',
        },
        {
          icon: 'file-paper-line',
          title: t('优惠券'),
          link: '/activityBase/voucher',
          color: '#ff85c0',
        },
      ]

      const changeTheme = () => {
        $pub('theme')
      }

      const goToPath = (path, query) => {
        router.push({ path: path, query: query })
      }

      return {
        iconList,
        changeTheme,
        goToPath
      }
    },
  })
</script>

<style lang="scss" scoped>
  .icon-panel {
    margin-bottom: 20px;
    text-align: center;
    cursor: pointer;

    .el-card__body {
      height: 120px;

      &:hover {
        i {
          transform: scale(1.15);
        }
      }

      i {
        display: block;
        width: 50px;
        height: 50px;
        margin: auto;
        font-size: 40px;
        transition: all ease-in-out 0.3s;
      }

      p {
        margin-top: 10px;
        text-align: center;
      }
    }
  }
</style>
