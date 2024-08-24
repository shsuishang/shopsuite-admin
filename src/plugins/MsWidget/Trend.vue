<template>
  <ms-card class="trend" shadow="hover" skeleton>
    <template #header>
      <span>
        <ms-icon icon="line-chart-fill" />
        趋势
      </span>
    </template>
    <ms-chart
      class="trend-echart"
      :init-options="initOptions"
      :option="option"
      theme="ms-echarts-theme"
    />
  </ms-card>
</template>

<script>
  import MsChart from '@/plugins/MsChart'

  export default defineComponent({
    components: {
      MsChart,
    },
    setup() {
      const state = reactive({
        initOptions: {
          renderer: 'svg',
        },
        option: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '4%',
            left: '2%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '签单',
              type: 'line',
              data: [
                1295, 3020, 1330, 512, 4463, 2214, 3330, 2412, 1205, 820, 3330,
                912,
              ],
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
              },
            },
            {
              name: '回款',
              type: 'line',
              data: [
                2905, 2020, 1730, 128, 963, 4614, 630, 1912, 1005, 1782, 1530,
                912,
              ],
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
              },
            },
          ],
        },
      })

      return {
        ...toRefs(state),
      }
    },
  })
</script>
