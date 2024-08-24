<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    :title="title"
    width="40%"
    @close="close"
  >
    <div class="div-bg bg-white">
      <div style="padding-bottom: 0.5rem">
        <div
          class="bg-white"
          style="
            width: 92%;
            margin-left: 4%;
            margin: auto;
            padding-left: 15px;
            padding-right: 15px;
          "
        >
          <div>
            <div class="track-rcol">
              <div class="track-list">
                <ul>
                  <div v-for="(item, index) in logisticsList" :key="index">
                    <li v-if="index === 0" class="first">
                      <div></div>
                      <i class="node-icon"></i>
                      <span class="txt">{{ item.AcceptStation }}</span>
                      <span class="time">{{ item.AcceptTime }}</span>
                    </li>
                    <li v-if="index > 0 && index !== logisticsList.length - 1">
                      <i class="node-icon"></i>
                      <span class="txt">{{ item.AcceptStation }}</span>
                      <span class="time">{{ item.AcceptTime }}</span>
                    </li>
                    <li
                      v-if="index === logisticsList.length - 1"
                      class="finall"
                    >
                      <i class="div-spilander"></i>
                      <i class="node-icon"></i>
                      <span class="txt">{{ item.AcceptStation }}</span>
                      <span class="time">{{ item.AcceptTime }}</span>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {returnLogistics} from '@/api/shop/storeExpressLogistics'

  export default defineComponent({
    name: "OrderReturnTracking",
    emits: ['fetch-data'],
    setup() {
      const $message = inject('$message')
      const state = reactive({
        title: '',
        dialogFormVisible: false,
        logisticsList: [],
        returnForm: {},

      })

      const viewLogistics = async() => {
        const { msg, data, status } = await returnLogistics(state.returnForm)

        if (200 == status) {
          state.logisticsList = data.traces
        } else {
          $message(msg, 'error')
        }
      }

      const showEdit = (params) => {
        state.title = t('物流详情')
        state.returnForm = {
          return_tracking_name: params.return_tracking_name,
          return_tracking_number: params.return_tracking_number,
        }
        viewLogistics()
        state.dialogFormVisible = true
      }

      const close = () => {
        state.dialogFormVisible = false
      }



      return {
        t: t,
        showEdit,
        viewLogistics,
        close,
        ...toRefs(state),
      }
    }
  })
</script>

<style scoped>

</style>
