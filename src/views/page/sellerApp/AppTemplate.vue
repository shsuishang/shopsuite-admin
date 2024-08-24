<template>
  <div id="app" style="height: 775px">
    <iframe
      class="placeholder"
      frameborder="0"
      scrolling="auto"
      :src="
        URL.api_url +
        '/admin/shop/shop-page-app/editApp?app_id=' +
        app_id +
        '&tpl_id=' +
        tpl_id +
        '&app_type=' +
        app_type +
        '&authorization=' +
        authorization
      "
      style="width: 100%; height: 770px"
    ></iframe>
  </div>
</template>

<script>
import { URL } from '@/config'
import { getToken } from '@/utils/token'

export default defineComponent({
  name: 'AppTemplate',
  emits: [],
  setup() {

    const state = reactive({
      URL: URL,
      app_id: '',
      tpl_id: '',
      app_type: '',
      authorization: '',
    })

    const editApp = async () => {
      // 查询 h5数据
      const { data } = await editApp()
      const html = data
      const iframe = document.getElementsByClassName('placeholder')[0]
      const iframedoc =
        iframe.contentDocument || iframe.contentWindow.document
      iframedoc.children[0].innerHTML = html // 事先拿到的html
    }

    onMounted(() => {
      // 后台获取数据方法
      // this.editApp()
      // 获取页面传递的参数
      const queryParams = state.$route.query
      state.app_id = queryParams.app_id
      state.tpl_id = queryParams.tpl_id
      state.app_type = queryParams.app_type
      state.authorization = getToken()
    })

    return {
      t,
      ...toRefs(state),
      editApp,
    }
  },
})
</script>
