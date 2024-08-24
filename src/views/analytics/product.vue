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
            :bottom-text="t('商品数量')"
            :count-config="productNumConfig"
            icon="product-hunt-line"
            :title="t('商品数量')"
            :unit-text="t('个')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('商品访客数')"
            :count-config="visitsUserConfig"
            icon="user-3-line"
            :title="t('商品访客数')"
            :unit-text="t('人')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('商品销量')"
            :count-config="orderItemNumConfig"
            icon="database-2-line"
            :title="t('商品销量')"
            :unit-text="t('个')"
          />
        </el-col>
        <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
          <top-num
            background="white"
            :bottom-text="t('商品浏览量')"
            :count-config="accessItemNumConfig"
            icon="user-search-line"
            :title="t('商品浏览量')"
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
              {{ t('商品访问量') }}
              <el-radio-group v-model="interviewTime" class="radio-inline" size="small" style="float: right;">
                <el-radio-button :label="t('7天')" @click="getAccessItemUserTimeLineFun(7)"/>
                <el-radio-button :label="t('30天')" @click="getAccessItemUserTimeLineFun(30)"/>
                <el-radio-button :label="t('3个月')" @click="getAccessItemUserTimeLineFun(90)"/>
                <el-radio-button :label="t('半年')" @click="getAccessItemUserTimeLineFun(180)"/>
              </el-radio-group>
            </template>
            <ms-chart
              :init-options="initOptions"
              :option="accessItemUserTimeLineOption"
              style="width: 100%"
              theme="ms-echarts-theme"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card v-loading="loading" class="box-card product-list">
            <template #header>
              <ms-search-box>
                <ms-search-box-left-panel :span="2">
                  {{ t('商品销量排行') }}
                </ms-search-box-left-panel>
                <ms-search-box-right-panel :span="22">
                  <el-form :inline="true" :model="queryForm" @submit.prevent>
                    <el-form-item>
                      <el-select
                        v-model="queryForm.user_id"
                        class="ml10"
                        clearable
                        filterable
                        :loading="loading"
                        :placeholder="t('买家昵称')"
                        remote
                        :remote-method="findRemoteUserList"
                        reserve-keyword
                        :style="{width:'140px',marginRight: '10px'}"
                      >
                        <el-option
                          v-for="item in userList"
                          :key="item.user_id"
                          :label="item.user_nickname"
                          :value="item.user_id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model.trim="queryForm.product_name"
                        clearable
                        :placeholder="t('请输入产品名称')"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model.trim="queryForm.product_id"
                        clearable
                        :placeholder="t('请输入商品编码')"
                        style="margin-left: 12px;margin-right: 10px;"
                      />
                    </el-form-item>
                    <el-form-item v-if="false">
                      <el-input
                        v-model.trim="queryForm.product_number"
                        clearable
                        :placeholder="t('请输入商品货号')"
                        style="margin-left: 12px"
                      />
                    </el-form-item>
                    <el-form-item class="ml10">
                      <ms-date-range-picker v-model="order_time_range"/>
                    </el-form-item>
                    <el-form-item>
                      <el-button :icon="Search" type="primary" @click="listOrderItemNumFun">
                        {{ t('查询') }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </ms-search-box-right-panel>
              </ms-search-box>
            </template>
            <el-table
              ref="itemTable"
              border
              :data="itemList"
              :height="height"
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column align="center" type="index" width="50"/>
              <el-table-column
                align="center"
                :label="t('图片')"
                prop="order_item_image"
                width="70"
              >
                <template #default="scope">
                  <el-image
                    fit="fit"
                    :src="scope.row.order_item_image"
                    style="width: 35px; height: 35px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('SPU编号')"
                prop="product_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('SKU编号')"
                prop="item_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="left"
                :formatter="(row)=>{return row.product_name + ' ' +  row.item_name}"
                :label="t('商品名称')"
                prop="item_name"
                show-overflow-tooltip
              />
              <el-table-column
                align="center"
                :formatter="(row)=>{return t('￥') + mf(row.order_item_amount_sum / row.num)}"
                :label="t('成交单价')"
                prop="order_item_sale_price"
                width="120"
              />
              <el-table-column
                align="center"
                :formatter="(row)=>{return t('￥') + mf(row.order_item_amount_sum)}"
                :label="t('金额小计')"
                prop="order_item_amount_sum"
                width="120"
              />
              <el-table-column
                align="center"
                :label="t('合计销量')"
                prop="num"
                width="120"
              />
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card v-loading="listAccessLoading" class="box-card product-list">
            <template #header>
              <ms-search-box>
                <ms-search-box-left-panel :span="2">
                  {{ t('商品浏览排行') }}
                </ms-search-box-left-panel>
                <ms-search-box-right-panel :span="22">
                  <el-form :inline="true" :model="queryAccessForm" @submit.prevent>
                    <el-form-item>
                      <el-input
                        v-model.trim="queryAccessForm.item_id"
                        clearable
                        :placeholder="t('请输入货品编号')"
                      />
                    </el-form-item>
                    <el-form-item class="ml10">
                      <ms-date-range-picker v-model="order_time_range"/>
                    </el-form-item>
                    <el-form-item>
                      <el-button :icon="Search" type="primary" @click="getListAccessItem">
                        {{ t('查询') }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </ms-search-box-right-panel>
              </ms-search-box>
            </template>
            <el-table
              border
              :data="itemAccessList"
              :height="height"
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column align="center" type="index" width="50"/>
              <el-table-column
                align="center"
                :label="t('SPU编号')"
                prop="product_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('SKU编号')"
                prop="item_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="left"
                :formatter="(row)=>{return row.product_name + ' ' +  row.item_name}"
                :label="t('商品名称')"
                prop="item_name"
                show-overflow-tooltip
              />
              <el-table-column
                align="center"
                :label="t('商品价格')"
                prop="item_unit_price"
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('浏览量')"
                prop="num"
                width="100"
              />
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import {mf} from '@/utils/format'

import TopNum from '@/plugins/MsWidget/TopNum'
import MsChart from '@/plugins/MsChart'

import {
  getAccessItemTimeLine,
  getAccessItemUserTimeLine,
  getAccessItemNum,
  getAccessItemUserNum,
  listAccessItem
} from '@/api/analytics/access/history'

import {getOrderItemNumTimeLine, listOrderItemNum, getOrderItemNum} from '@/api/analytics/order'
import {getProductNum} from '@/api/analytics/product'

import {useSettingsStore} from '@/store/modules/settings'
import moment from "dayjs";
import {formatTimeLine, formatTimeLineRange} from "@/utils";
import {getList as getUserList} from "@/api/account/userInfo";

export default defineComponent({
  name: 'AnalyticsProduct',
  components: {MsChart, TopNum},
  setup() {
    const settingsStore = useSettingsStore()
    const {echartsGraphic2} = storeToRefs(settingsStore)
    const state = reactive({
      interviewTime: '30天',
      productNumConfig: {
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
      accessItemNumConfig: {
        startVal: 0,
        endVal: 0,
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      },
      orderItemNumConfig: {
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
      accessItemUserTimeLineOption: {

        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['商品浏览量', '商品访客数', '商品销量'],
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
            name: t('商品浏览量'),
            type: 'line',
            data: [],
          },
          {
            name: t('商品访客数'),
            type: 'line',
            data: [],
          },
          {
            name: t('商品销量'),
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


      height: 600,
      itemList: [],
      itemAccessList: [],
      listLoading: true,
      listAccessLoading: true,
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
      queryAccessForm: {
        item_id: '',
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

      getProductNumFun(params)
      getAccessItemNumFun(params)
      getAccessItemUserNumFun(params)
      getOrderItemNumFun(params)

      let days = 30
      if (state.queryForm.stime && state.queryForm.etime) {
        state.interviewTime = ''
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

      listOrderItemNumFun()
      getListAccessItem()
    }

    const getAccessItemUserTimeLineFunRange = async (timeRange) => {
      state.loading = true

      //最近days天
      const params = {stime: timeRange.stime, etime: timeRange.etime}

      const {data} = await getAccessItemUserTimeLine(params)
      formatTimeLineRange(data, timeRange.days, timeRange.etime);

      const {data: accessData} = await getAccessItemTimeLine(params)
      formatTimeLineRange(accessData, timeRange.days, timeRange.etime);

      const {data: itemData} = await getOrderItemNumTimeLine(params)
      formatTimeLineRange(itemData, timeRange.days, timeRange.etime);

      //state.accessItemUserTimeLineOption.title.text =  s('最近' + days + '天商品访问量')
      state.accessItemUserTimeLineOption.xAxis.data = data.map((item) => item.time)
      state.accessItemUserTimeLineOption.series[0].data = accessData.map((item) => item.num)
      state.accessItemUserTimeLineOption.series[1].data = data.map((item) => item.num)
      state.accessItemUserTimeLineOption.series[2].data = itemData.map((item) => item.num)
      state.loading = false
    }

    /**
     * 获取商品数量
     * @returns {Promise<void>}
     */
    const getProductNumFun = async (params) => {
      const {data} = await getProductNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.productNumConfig = Object.assign(state.productNumConfig, data)
    }

    /**
     * 获取商品访问数量
     * @returns {Promise<void>}
     */
    const getAccessItemNumFun = async (params) => {
      const {data} = await getAccessItemNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.accessItemNumConfig = Object.assign(state.accessItemNumConfig, data)
    }

    /**
     * 获取商品用户访问数量
     * @returns {Promise<void>}
     */
    const getAccessItemUserNumFun = async (params) => {
      const {data} = await getAccessItemUserNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.visitsUserConfig = Object.assign(state.visitsUserConfig, data)
    }

    /**
     * 获取商品销量
     * @returns {Promise<void>}
     */
    const getOrderItemNumFun = async (params) => {
      const {data} = await getOrderItemNum(params)
      data.today = data.current;
      data.yestoday = data.pre;
      state.orderItemNumConfig = Object.assign(state.orderItemNumConfig, data)
    }

    /**
     * 购买商品顾客统计
     * @param days
     * @returns {Promise<void>}
     */
    const getAccessItemUserTimeLineFun = async (days) => {
      state.loading = true

      //最近days天
      const start = new Date(moment(moment().subtract(days - 1, "days").format("YYYY-MM-DD")));
      const end = new Date();
      const params = {stime: start.getTime(), etime: end.getTime()}

      const {data} = await getAccessItemUserTimeLine(params)
      formatTimeLine(data, days);

      const {data: accessData} = await getAccessItemTimeLine(params)
      formatTimeLine(accessData, days);

      const {data: itemData} = await getOrderItemNumTimeLine(params)
      formatTimeLine(itemData, days);

      //state.accessItemUserTimeLineOption.title.text =  s('最近' + days + '天商品访问量')
      state.accessItemUserTimeLineOption.xAxis.data = data.map((item) => item.time)
      state.accessItemUserTimeLineOption.series[0].data = accessData.map((item) => item.num)
      state.accessItemUserTimeLineOption.series[1].data = data.map((item) => item.num)
      state.accessItemUserTimeLineOption.series[2].data = itemData.map((item) => item.num)
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

    /**
     * 商品浏览排行
     */
    const getListAccessItem = async () => {

      if (state.order_time_range.length > 0) {
        if (state.order_time_range[0]) {
          state.queryAccessForm.stime = state.order_time_range[0].getTime();
        }

        if (state.order_time_range[1]) {
          state.queryAccessForm.etime = state.order_time_range[1].getTime();
        }
      } else {
        state.queryAccessForm.stime = null
        state.queryAccessForm.etime = null
      }
      const params = state.queryAccessForm

      state.listAccessLoading = true
      const {data: itemList} = await listAccessItem(params)
      state.itemAccessList = itemList
      state.listAccessLoading = false
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
      mf,
      ...toRefs(state),
      close,
      goToPath,
      queryData,
      fetchData,
      getListAccessItem,
      getAccessItemUserTimeLineFun,
      getAccessItemUserTimeLineFunRange,
      listOrderItemNumFun,
      getAccessItemNumFun,
      getAccessItemUserNumFun,
      getOrderItemNumFun,
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
