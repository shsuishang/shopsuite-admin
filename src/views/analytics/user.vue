<template>
  <div>
    <div class="dashboard-container">
      <el-row :gutter="24">
        <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
          <ms-search-box style="float: right;">
            <ms-search-box-right-panel :span="24">
              <el-form :inline="true" :model="queryForm" @submit.prevent>
                <el-form-item class="ml10">
                  <ms-date-range-picker v-model="order_time_range"/>
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" type="primary" @click="fetchData">
                    {{ t('查询') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </ms-search-box-right-panel>
          </ms-search-box>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('累计用户')"
            :count-config="userNumConfig"
            icon="product-hunt-line"
            :title="t('累计用户')"
            :unit-text="t('个')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('访客数')"
            :count-config="visitsUserConfig"
            icon="user-3-line"
            :title="t('访客数')"
            :unit-text="t('人')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('新增用户数')"
            :count-config="regUserNumConfig"
            icon="database-2-line"
            :title="t('新增用户数')"
            :unit-text="t('个')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('浏览量')"
            :count-config="accessNumConfig"
            icon="user-search-line"
            :title="t('浏览量')"
            :unit-text="t('PV')"
          />
        </el-col>
      </el-row>

    </div>

    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card v-loading="loading" class="box-card">
            <template #header>
              {{ t('用户统计') }}
              <el-radio-group v-model="userTime" class="radio-inline" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getAccessItemUserTimeLineFun(7)"/>
                <el-radio-button :label="t('30天')" @click="getAccessItemUserTimeLineFun(30)"/>
                <el-radio-button :label="t('3个月')" @click="getAccessItemUserTimeLineFun(90)"/>
                <el-radio-button :label="t('半年')" @click="getAccessItemUserTimeLineFun(180)"/>
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="accessUserTimeLineOption"
              style="width: 100%"
              theme="ms-echarts-theme"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import TopNum from '@/plugins/MsWidget/TopNum'
import {
  getOrderCustomerNumTimeline,
} from '@/api/analytics/order'


import {
  getUserTimeLine,
  getUserNum,
  getUserNum as getRegUserNum
} from '@/api/analytics/user'


import MsChart from '@/plugins/MsChart'

import {
  getAccessVisitorTimeLine,
  getAccessVisitorNum,
  getAccessNum
} from '@/api/analytics/access/history'

import {useSettingsStore} from '@/store/modules/settings'
import moment from "dayjs";
import {formatTimeLine, formatTimeLineRange} from "@/utils";
import {getList as getUserList} from "@/api/account/userInfo";

export default defineComponent({
  name: 'AnalyticsUser',
  components: {MsChart, TopNum},
  setup() {
    const $tableHeight = inject('$tableHeight')

    const settingsStore = useSettingsStore()
    const {echartsGraphic2} = storeToRefs(settingsStore)
    const state = reactive({
      userTime: '30天',
      userNumConfig: {
        startVal: 0,
        endVal: 0,
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      visitsUserConfig: {
        startVal: 0,
        endVal: 0,
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      accessNumConfig: {
        startVal: 0,
        endVal: 0,
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      regUserNumConfig: {
        startVal: 0,
        endVal: 0,
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      form: {
        startVal: 0,
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 5000,
      },
      data: {
        order_num: 0,
        favorable_order_num: 0,
        user_reg_yestoday: [
          {
            num: 0,
          },
          {
            num: 0,
          },
        ],
        user_payment_yestoday: [
          {
            num: 0,
          },
          {
            num: 0,
          },
        ],
      },
      accessUserTimeLineOption: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['新增用户数', '访客数', '成交用户数'],
        },
        grid: {
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: t('新增用户数'),
            type: 'line',
            data: [],
          },
          {
            name: t('访客数'),
            type: 'line',
            data: [],
          },
          {
            name: t('成交用户数'),
            type: 'line',
            data: [],
          },
        ],
      },
      columnLoading: false,
      polylineLoading: false,
      loading: false,
      initOptions: {
        renderer: 'svg',
      },


      height: $tableHeight(),
      itemList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',

      order_time_range: ["", ""],
      userList: [],
      queryForm: {
        product_name: '',
        product_id: '',
        product_number: "",

        user_id: "",
        stime: "",
        etime: ""
      },
    })

    watch(
      () => echartsGraphic2.value,
      () => {
        state.option.series[0].itemStyle.color =
          new MsChart.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            echartsGraphic2.value.map((color, offset) => ({
              color,
              offset,
            }))
          )
      }
    )


    const goToPath = (path, query) => {
      state.$router.push({path: path, query: query})
    }


    const queryData = () => {
      fetchData()
    }

    const fetchData = () => {

      //
      if (state.order_time_range.length > 0) {
        if (state.order_time_range[0]) {
          state.queryForm.stime = state.order_time_range[0].getTime();
        }

        if (state.order_time_range[1]) {
          state.queryForm.etime = state.order_time_range[1].getTime();
        }
      } else {
        state.queryForm.stime = null
        state.queryForm.etime = null
      }

      const params = state.queryForm

      // 所有用户
      getUserNumFun({stime:null, etime:null})
      getAccessVisitorNumFun(params)
      getAccessNumFun(params)
      getRegUserNumFun(params)

      let days = 30
      if (state.queryForm.stime && state.queryForm.etime) {
        state.userTime = ''
        days = (state.queryForm.etime - state.queryForm.stime) / (1000 * 3600 * 24)
        const timeRange = {
          days : days,
          stime : state.queryForm.stime,
          etime : state.queryForm.etime
        }

        getAccessItemUserTimeLineFunRange(timeRange);
      } else {
        getAccessItemUserTimeLineFun(days)
      }

      //listOrderItemNumFun()
    }

    /**
     * 购买商品顾客统计范围
     * @param days
     * @returns {Promise<void>}
     */
    const getAccessItemUserTimeLineFunRange = async (timeRange) => {
      state.loading = true

      //最近days天
      const params = {stime: timeRange.stime, etime: timeRange.etime}

      const { data } = await getUserTimeLine(params)
      formatTimeLineRange(data, timeRange.days, timeRange.etime);

      const { data : visitorNum } = await getAccessVisitorTimeLine(params)
      formatTimeLineRange(visitorNum, timeRange.days, timeRange.etime);

      const { data : customerNum } = await getOrderCustomerNumTimeline(params)
      formatTimeLineRange(customerNum, timeRange.days, timeRange.etime);

      state.accessUserTimeLineOption.xAxis.data = data.map((item) => item.time)
      state.accessUserTimeLineOption.series[0].data = data.map((item) => item.num)
      state.accessUserTimeLineOption.series[1].data = visitorNum.map((item) => item.num)
      state.accessUserTimeLineOption.series[2].data = customerNum.map((item) => item.num)
      state.loading = false
    }

    /**
     * 获取用户数
     * @returns {Promise<void>}
     */
    const getUserNumFun = async (params) => {
      const {data} = await getUserNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.userNumConfig = Object.assign(state.userNumConfig, data)
    }

    /**
     * 获取用户量
     *
     * @returns {Promise<void>}
     */
    const getAccessVisitorNumFun = async (params) => {
      const {data} = await getAccessVisitorNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.visitsUserConfig = Object.assign(state.visitsUserConfig, data)
    }

    /**
     * 获取访问量
     *
     * @returns {Promise<void>}
     */
    const getAccessNumFun = async (params) => {
      const {data} = await getAccessNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.accessNumConfig = Object.assign(state.accessNumConfig, data)
    }

    /**
     * 获取新增用户数
     * @returns {Promise<void>}
     */
    const getRegUserNumFun = async (params) => {
      const {data} = await getRegUserNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.regUserNumConfig = Object.assign(state.regUserNumConfig, data)
    }

    /**
     * 购买商品顾客统计
     * @param days
     * @returns {Promise<void>}
     */
    const getAccessItemUserTimeLineFun = async (days) => {
      state.loading = true

      //最近days天
      const start = new Date(moment(moment().subtract(days-1, "days").format("YYYY-MM-DD")));
      const end = new Date();
      const params = {stime:start.getTime(), etime:end.getTime()}

      const { data } = await getUserTimeLine(params)
      formatTimeLine(data, days);

      const { data : visitorNum } = await getAccessVisitorTimeLine(params)
      formatTimeLine(visitorNum, days);

      const { data : customerNum } = await getOrderCustomerNumTimeline(params)
      formatTimeLine(customerNum, days);

      state.accessUserTimeLineOption.xAxis.data = data.map((item) => item.time)
      state.accessUserTimeLineOption.series[0].data = data.map((item) => item.num)
      state.accessUserTimeLineOption.series[1].data = visitorNum.map((item) => item.num)
      state.accessUserTimeLineOption.series[2].data = customerNum.map((item) => item.num)
      state.loading = false
    }

    const setDateSel = async () => {

    }

    /**
     * 购买商品顾客统计
     * @param days
     * @returns {Promise<void>}
     */
    const listOrderItemNumFun = async () => {

      //
      if (state.order_time_range.length > 0) {
        if (state.order_time_range[0]) {
          state.queryForm.stime = state.order_time_range[0].getTime();
        }

        if (state.order_time_range[1]) {
          state.queryForm.etime = state.order_time_range[1].getTime();
        }
      } else {
        state.queryForm.stime = null
        state.queryForm.etime = null
      }

      const params = state.queryForm

      state.listLoading = true
      const {data: itemList} = await listOrderItemNum(params)
      state.itemList = itemList
      state.listLoading = false
    }


    const findRemoteUserList = (user_nickname) => {
      if (user_nickname !== '') {
        state.loading = true
        setTimeout(() => {
          state.loading = false
          getUserList({user_nickname: user_nickname}).then((res) => {
            state.userList = res.data.items
          })
        }, 200)
      } else {
        state.userList = []
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      close,
      goToPath,
      queryData,
      fetchData,
      getAccessItemUserTimeLineFun,
      getAccessItemUserTimeLineFunRange,
      listOrderItemNumFun,
      getAccessVisitorNumFun,
      getAccessNumFun,
      getRegUserNumFun,
      setDateSel,
      findRemoteUserList
    }
  },
})
</script>
<style lang="scss" scoped>
.dashboard-container {
  padding: 0 !important;
  background: $base-color-background !important;

  :deep() {
    .el-card {
      height: 300px;

      [class*='-echart'] {
        width: 100%;
        height: 200px;
      }
    }
  }
}

.xe-icon {
  width: 80px;
  padding: 10px;

  .i-wh-workbench {
    display: block;
    color: #fff;
    text-align: center;
    font-size: 25px;
    line-height: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-clip: padding-box;
  }
}

.xe-info {
}

.xe-num {
  display: block;
  font-size: 20px;
  font-weight: 400;
  color: #3e3f3f;
  text-align: left;
}

.xe-label {
  text-align: left;
  display: block;
  font-style: normal;
  font-size: 10px;
  text-transform: uppercase;
  color: #979898;
}

.xe-todo {
  text-align: right;
  display: block;
  font-style: normal;
  font-size: 10px;
  text-transform: uppercase;
  color: #979898;
  margin-top: 5px;
}

.el-row {
  margin-bottom: 0px;
}

:deep(.product-list) {
  .el-card__header {
    padding-bottom: 0 !important;
  }
}


.ml10 {
  margin-left: 10px;
}

</style>
