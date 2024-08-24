<template>
  <div>
    <iframe
      ref="iframeRef"
      class="placeholder"
      frameborder="0"
      scrolling="auto"
      :src="
        'diy-mobile/index.html?page_id=' + page_id +
        '&api_url=' + encodeURIComponent(apiUrl) +
        '&authorization=' + encodeURIComponent(authorization) +
        '&uploadUrl=' + encodeURIComponent(uploadUrl)
      "
      style="width: 100%; height: 770px"
    ></iframe>
  </div>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {URL} from '@/config'
  import {useUserStore} from "@/store/modules/user";


  export default defineComponent({
    name: 'DiyMobile',
    emits: [],
    setup() {
      const userStore = useUserStore()
      const token = userStore.getToken

      const state = reactive({
        iframeRef: null,
        apiUrl: URL.apiUrl,
        page_id: '',
        authorization: token,
        uploadUrl: URL.upload,
      })

      onMounted(() => {
      })

      return {
        t,
        ...toRefs(state),
      }
    },
  })
</script>
