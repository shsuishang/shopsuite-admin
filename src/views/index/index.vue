<template>
  <div>
    <div class="dashboard-container">
      <el-row :gutter="20">
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-card
            background="white"
            :bottom-text="t('本月销售额')"
            :count-config="saleConfig"
            icon="money-cny-circle-line"
            :title="t('销售额')"
            :unit-text="t('元')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-card
            background="white"
            :bottom-text="t('本月访问量')"
            :count-config="visitsUserConfig"
            icon="user-3-line"
            :title="t('访问量')"
            :unit-text="t('PV')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <ms-link :to="'/orderBase'">
            <top-card
              background="white"
              :bottom-text="t('本月订单量')"
              :count-config="orderNumConfig"
              icon="database-2-line"
              :title="t('订单量')"
              :unit-text="t('单')"
            />
          </ms-link>
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <ms-link :to="'/userInfo'">
            <top-card
              background="white"
              :bottom-text="t('本月新增用户')"
              :count-config="regUserConfig"
              icon="user-search-line"
              :title="t('新增用户')"
              :unit-text="t('人')"
            />
          </ms-link>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <nav-list />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="site_id ? 24 : 12">
        <div class="grid-content bg-purple">
          <el-card v-loading="columnLoading" class="box-card">
            <template #header>
              {{ t('最近订单增长') }}
              <el-radio-group v-model="dayTimeOne" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getDashboardTimeLineFun(7)" />
                <el-radio-button :label="t('30天')" @click="getDashboardTimeLineFun(30)" />
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="columnOptions"
              style="width: 100%"
              theme="ms-echarts-theme"
            />
          </el-card>
        </div>
      </el-col>
      <el-col v-if="!site_id" :span="12">
        <div class="grid-content bg-purple">
          <el-card v-loading="columnLoading" class="box-card">
            <template #header>
              {{ t('最近用户增长') }}
              <el-radio-group v-model="dayTimeOne" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getDashboardTimeLineFun(7)" />
                <el-radio-button :label="t('30天')" @click.prevent="getDashboardTimeLineFun(30)" />
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="columnOptionsWeek"
              style="width: 100%"
              theme="ms-echarts-theme"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card v-loading="columnLoading" class="box-card">
            <template #header>
              {{ t('最近商品增长') }}
              <el-radio-group v-model="dayTimeOne" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getDashboardTimeLineFun(7)" />
                <el-radio-button :label="t('30天')" @click.prevent="getDashboardTimeLineFun(30)" />
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="columnOptionsWeekGoods"
              style="width: 100%"
              theme="ms-echarts-theme"
            />
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card v-loading="columnLoading" class="box-card">
            <template #header>
              {{ t('最近销售额增长') }}
              <el-radio-group v-model="dayTimeOne" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getDashboardTimeLineFun(7)" />
                <el-radio-button :label="t('30天')" @click.prevent="getDashboardTimeLineFun(30)" />
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="columnOptionsMarket"
              style="width: 100%"
              theme="ms-echarts-theme"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="false" :gutter="30">
      <el-col :span="12">
        <el-card class="box-card">
          <div class="clearfix">
            <span style="font-size: 18px">{{ t('操作系统') }}</span>
          </div>
          <ms-chart
            :init-options="initOptions"
            :option="osOpt"
            style="width: 100%"
            theme="ms-echarts-theme"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="clearfix">
            <span style="font-size: 18px">{{ t('浏览器') }}</span>
          </div>
          <ms-chart
            :init-options="initOptions"
            :option="browserOpt"
            style="width: 100%"
            theme="ms-echarts-theme"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="false" :gutter="30">
      <el-col :span="12">
        <el-card class="box-card">
          <div class="clearfix">
            <span style="font-size: 18px">{{ t('访问国家') }}</span>
          </div>
          <ms-chart
            :init-options="initOptions"
            :option="countryOpt"
            style="width: 100%"
            theme="ms-echarts-theme"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="clearfix">
            <span style="font-size: 18px">{{ t('访问设备') }}</span>
          </div>
          <ms-chart
            :init-options="initOptions"
            :option="deviceOpt"
            style="width: 100%"
            theme="ms-echarts-theme"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="false" :gutter="30">
      <el-col :span="24">
        <el-card class="box-card">
          <div class="clearfix">
            <span style="font-size: 18px">{{ t('访问省份') }}</span>
          </div>
          <ms-chart
            :init-options="initOptions"
            :option="provinceOpt"
            style="width: 100%"
            theme="ms-echarts-theme"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="box-card">
          <template #header>
            {{ t('购买商品顾客统计') }}
            <el-radio-group v-model="dayTimeTwo" size="small" style="float: right;">
              <el-radio-button :label="t('7天')" @click="getOrderCustomerNumTimelineFun(7)" />
              <el-radio-button :label="t('30天')" @click="getOrderCustomerNumTimelineFun(30)" />
              <el-radio-button :label="t('3个月')" @click="getOrderCustomerNumTimelineFun(90)" />
              <el-radio-button :label="t('半年')" @click="getOrderCustomerNumTimelineFun(180)" />
            </el-radio-group>
          </template>
          <ms-chart
            :init-options="initOptions"
            :option="customerOpt"
            style="width: 100%"
            theme="ms-echarts-theme"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card v-loading="loading" class="box-card">
            <template #header>
              {{ t('订单销售金额对比图') }}
              <el-radio-group v-model="dayTimeThree" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getSaleOrderAmountFun(7)" />
                <el-radio-button :label="t('30天')" @click="getSaleOrderAmountFun(30)" />
                <el-radio-button :label="t('3个月')" @click="getSaleOrderAmountFun(90)" />
                <el-radio-button :label="t('半年')" @click="getSaleOrderAmountFun(180)" />
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="polylineOptionMake"
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


import { getSalesAmount } from '@/api/analytics/trade'
import { getVisitor, getRegUser } from '@/api/analytics/user'
import {
  getOrderNumToday,
  getDashboardTimeLine,
  getOrderCustomerNumTimeline,
  getSaleOrderAmount,
  getOrderNumTimeline
} from '@/api/analytics/order'

import TopCard from '@/plugins/MsWidget/TopCard.vue'
import MsChart from '@/plugins/MsChart'
import NavList from './components/NavList'

import {
  getAccessBrowser as getAB,
  getAccessCountry as getAC,
  getAccessDevice as getAD,
  getAccessOs as getAO,
  getAccessProvince as getAP,
} from '@/api/analytics/access/history'
import { useSettingsStore } from '@/store/modules/settings'
import moment from "dayjs";
import {formatTimeLine} from "@/utils";

export default defineComponent({
  name: 'OverviewOrder',
  components: { MsChart, TopCard, NavList },
  setup() {
    //const $message = inject('$message')
    const settingsStore = useSettingsStore()
    const { echartsGraphic2 } = storeToRefs(settingsStore)
    const state = reactive({
      dayTimeOne: "30天",
      dayTimeTwo: "30天",
      dayTimeThree: "30天",
      saleConfig: {
        startVal: 0,
        endVal: 0,
        /*decimals: 2,*/
        prefix: '￥',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      visitsUserConfig: {
        startVal: 0,
        endVal: 0,
        /*decimals: 0,*/
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      regUserConfig: {
        startVal: 0,
        endVal: 0,
        /*decimals: 0,*/
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      orderNumConfig: {
        startVal: 0,
        endVal: 0,
        /*decimals: 0,*/
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
      topData: {
        tradeAmount: 0,
        tradeAmountIncreaseRate: 0.0,
        orderFinishNum: 0,
        orderFinishNumIncreaseRate: 0.0,
        userCertificationNum: 0,
        userCertificationNumIncreaseRate: 0.0,
        orderNum: 0,
        orderNumIncreaseRate: 0.0
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
      polylineOptionMakeLine: {
        title: {
          left: 'center',
          text: t('最近7天的消费客户数量'),
        },
        tooltip: {
          trigger: 'axis',
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
            name: t('消费客户数量'),
            type: 'line',
            data: [],
          }
        ],
      },
      polylineOptionMake: {
        /*title: {
          left: 'center',
          text: t('最近7天的订单成交金额趋势图'),
        },*/
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['订单数量', '成交金额'],
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
            name: t('订单数量'),
            type: 'line',
            data: [],
          },
          {
            name: t('成交金额'),
            type: 'line',
            data: [],
          },
        ],
      },
      osOpt: {
        title: {
          text: t('操作系统'),
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      browserOpt: {
        title: {
          text: t('浏览器'),
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      countryOpt: {
        title: {
          text: t('访问国家'),
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      deviceOpt: {
        title: {
          text: t('访问设备'),
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      provinceOpt: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1',
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 20, 33, 39, 33, 22],
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new MsChart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#88D1FF', '#1890FF'].map((color, offset) => ({
                  color,
                  offset,
                }))
              ),
            },
          },
        ],
      },
      customerOpt: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['提交订单的客户数'],
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
            name: t('提交订单的客户数'),
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
      columnOptions: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1',
        },
        grid: {
          top: '5%',
          left: '0%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              // 2011-待订单审核;2013-待财务审核;2020-待配货/待出库审核;2030-待发货;2040-已发货/待收货确认;2060-已完成/已签收;2070-已取消/已作废;
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 20, 33, 39, 33, 22],
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new MsChart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#88D1FF', '#1890FF'].map((color, offset) => ({
                  color,
                  offset,
                }))
              ),
            },
          },
        ],
      },
      columnOptionsMarket: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1',
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              // 2011-待订单审核;2013-待财务审核;2020-待配货/待出库审核;2030-待发货;2040-已发货/待收货确认;2060-已完成/已签收;2070-已取消/已作废;
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 20, 33, 39, 33, 22],
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new MsChart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#88D1FF', '#1890FF'].map((color, offset) => ({
                  color,
                  offset,
                }))
              ),
            },
          },
        ],
      },
      columnOptionsWeekGoods: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1',
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              // 2011-待订单审核;2013-待财务审核;2020-待配货/待出库审核;2030-待发货;2040-已发货/待收货确认;2060-已完成/已签收;2070-已取消/已作废;
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 20, 33, 39, 33, 22],
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new MsChart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#88D1FF', '#1890FF'].map((color, offset) => ({
                  color,
                  offset,
                }))
              ),
            },
          },
        ],
      },
      columnOptionsWeek: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1',
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              // 2011-待订单审核;2013-待财务审核;2020-待配货/待出库审核;2030-待发货;2040-已发货/待收货确认;2060-已完成/已签收;2070-已取消/已作废;
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 20, 33, 39, 33, 22],
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new MsChart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#88D1FF', '#1890FF'].map((color, offset) => ({
                  color,
                  offset,
                }))
              ),
            },
          },
        ],
      },
      polylineOption: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [],
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
            name: t('有效订单'),
            type: 'line',
            data: [],
          },
          {
            name: t('取消订单'),
            type: 'line',
            data: [],
          },
        ],
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
      state.$router.push({ path: path, query: query })
    }

    const getUserRegYestodayRate = () => {
      const num0 = state.data['user_reg_yestoday'][0]['num']
      const num1 = state.data['user_reg_yestoday'][1]['num']
      if (num0 && num1) {
        return Math.round((num0 / num1) * 10000) / 100.0 + '%'
      } else {
        return '--'
      }
    }

    const getUserPaymentYestodayRate = () => {
      const user_payment_yestoday = state.data['user_payment_yestoday']
      if (!user_payment_yestoday || user_payment_yestoday.length < 2) {
        return '--'
      }
      const user_payment_day_num = state.data['user_payment_yestoday'][1]['num']
      const user_payment_yesterday_num =
        state.data['user_payment_yestoday'][0]['num']
      if (user_payment_yesterday_num) {
        return (
          Math.round(
            (user_payment_day_num / user_payment_yesterday_num) * 10000
          ) /
          100.0 +
          '%'
        )
      } else {
        return '--'
      }
    }

    const getOrderYestodayNumRate = () => {
      const order_day_num = state.data.order_day_num
      const order_yestoday_num = state.data.order_yestoday_num
      if (order_yestoday_num) {
        return (
          Math.round((order_day_num / order_yestoday_num) * 10000) / 100.0 +
          '%'
        )
      } else {
        return '--'
      }
    }

    const getProductTodayNumRate = () => {
      const product_today_num = state.data.product_today_num
      const product_yestoday_num = state.data.product_yestoday_num
      if (product_yestoday_num) {
        return (
          Math.round(
            ((product_today_num - product_yestoday_num) /
              product_yestoday_num) *
            10000
          ) /
          100.0 +
          '%'
        )
      } else {
        return '--'
      }
    }

    const getUserRegYestoday = (index) => {
      return state.data['user_reg_yestoday'][index]['num']
    }

    const getUserPaymentYestoday = (index) => {
      return state.data['user_payment_yestoday'][index]['num']
    }

    const queryData = () => {
      fetchData()
    }

    const fetchData = () => {
      getDashboardTimeLineFun(30)
      getSalesAmountFun()
      getVisitorFun()
      getOrderNumFun()
      getRegUserFun()
      getSaleOrderAmountFun(30)
      getOrderCustomerNumTimelineFun(30)
      /*getAccessOs()
      getAccessBrowser()
      getAccessCountry()
      getAccessDevice()
      getAccessProvince()
      */
    }

    const getAccessOs = async () => {
      const { data } = await getAO()
      state.osOpt.series[0].data = data
    }

    const getAccessBrowser = async () => {
      const { data } = await getAB()
      state.browserOpt.series[0].data = data
    }

    const getAccessCountry = async () => {
      const { data } = await getAC()
      state.countryOpt.series[0].data = data
    }

    /**
     * 获取销售额
     * @returns {Promise<void>}
     */
    const getSalesAmountFun = async () => {
      const { data } = await getSalesAmount()
      state.topData = data
      state.saleConfig = Object.assign(state.saleConfig, data)
    }

    /**
     * 获取用户访问量
     * @returns {Promise<void>}
     */
    const getVisitorFun = async () => {
      const { data } = await getVisitor()
      state.topData = data
      state.visitsUserConfig = Object.assign(state.visitsUserConfig, data)
    }

    /**
     * 获取订单量
     * @returns {Promise<void>}
     */
    const getOrderNumFun = async () => {
      const { data } = await getOrderNumToday()
      state.topData = data
      state.orderNumConfig = Object.assign(state.orderNumConfig, data)
    }

    /**
     * 获取新增用户
     * @returns {Promise<void>}
     */
    const getRegUserFun = async () => {
      const { data } = await getRegUser()
      state.topData = data
      state.regUserConfig = Object.assign(state.regUserConfig, data)
    }

    /**
     * 购买商品顾客统计
     * @returns {Promise<void>}
     */
    const getOrderCustomerNumTimelineFun = async (days) => {

      //最近days天
      const start = new Date(moment(moment().subtract(days-1, "days").format("YYYY-MM-DD")));
      const end = new Date();

      const params = {stime:start.getTime(), etime:end.getTime()}

      const { data } = await getOrderCustomerNumTimeline(params)
      formatTimeLine(data, days);

      const date = data.map((item) => item.time)
      state.customerOpt.xAxis.data = date
      const nums = data.map((item) => item.num)
      state.customerOpt.series[0].data = nums
    }

    const getAccessDevice = async () => {
      const { data } = await getAD()
      state.deviceOpt.series[0].data = data
    }

    const getAccessProvince = async () => {
      const { data } = await getAP()
      const names = data.map((item) => item.name)
      state.provinceOpt.xAxis[0].data = names
      const values = data.map((item) => item.value)
      state.provinceOpt.series[0].data = values
    }

    /**
     * 获取统计数据
     * @param days
     * @returns {Promise<void>}
     */
    const getDashboardTimeLineFun = async (days) => {
      state.columnLoading = true

      //最近days天
      const start = new Date(moment(moment().subtract(days-1, "days").format("YYYY-MM-DD")));
      const end = new Date();

      const params = {stime:start.getTime(), etime:end.getTime()}
      const { data, status } = await getDashboardTimeLine(params)

      if (status == 200) {
        formatTimeLine(data.order_time_line, days);
        formatTimeLine(data.user_time_line, days);
        formatTimeLine(data.pt_time_line, days);
        formatTimeLine(data.pay_time_line, days);

        // 订单统计
        state.columnOptions.xAxis[0].data = data.order_time_line.map((item) => item.time)
        state.columnOptions.series[0].data = data.order_time_line.map((item) => item.num)
        // 用户统计
        state.columnOptionsWeek.xAxis[0].data = data.user_time_line.map((item) => item.time)
        state.columnOptionsWeek.series[0].data = data.user_time_line.map((item) => item.num)
        // 商品统计
        state.columnOptionsWeekGoods.xAxis[0].data = data.pt_time_line.map((item) => item.time)
        state.columnOptionsWeekGoods.series[0].data = data.pt_time_line.map((item) => item.num)
        // 销售额增长
        state.columnOptionsMarket.xAxis[0].data = data.pay_time_line.map((item) => item.time)
        state.columnOptionsMarket.series[0].data = data.pay_time_line.map((item) => item.num)
      }

      state.columnLoading = false
    }

    /**
     * 订单销售金额对比图
     * @param days
     * @returns {Promise<void>}
     */
    const getSaleOrderAmountFun = async (days) => {
      state.loading = true

      //最近days天
      const start = new Date(moment(moment().subtract(days-1, "days").format("YYYY-MM-DD")));
      const end = new Date();
      const params = {stime:start.getTime(), etime:end.getTime()}

      const { data } = await getSaleOrderAmount(params)
      formatTimeLine(data, days);


      const { data : dataNum } = await getOrderNumTimeline(params)
      formatTimeLine(dataNum, days);


      //state.polylineOptionMake.title.text =  s('最近' + days + '天的订单成交金额趋势图')
      state.polylineOptionMake.xAxis.data = data.map((item) => item.time)
      state.polylineOptionMake.series[0].data = dataNum.map((item) => item.num)
      state.polylineOptionMake.series[1].data = data.map((item) => item.num)
      state.loading = false
    }

    onMounted(() => {
      fetchData()
    })

    return {
      t,
      ...toRefs(state),
      close,
      goToPath,
      getUserRegYestodayRate,
      getUserPaymentYestodayRate,
      getOrderYestodayNumRate,
      getProductTodayNumRate,
      getUserRegYestoday,
      getUserPaymentYestoday,
      queryData,
      fetchData,
      getAccessOs,
      getAccessBrowser,
      getAccessCountry,
      getAccessDevice,
      getAccessProvince,
      getSalesAmountFun,
      getVisitorFun,
      getOrderNumFun,
      getRegUserFun,
      getDashboardTimeLineFun,
      getOrderCustomerNumTimelineFun,
      getSaleOrderAmountFun
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
</style>
