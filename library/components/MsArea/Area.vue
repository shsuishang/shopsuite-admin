<!--
地区三级联动组件
v-mode 绑定的数据格式：
modelValue: {
  province: {code:'',name:''},
  city: {},
  district: {},
},
例：<area v-mode='modelValue' :clearable="true" level="city" width='300'/>
// modelValue 关联对象
// clearable 是否可清除 (默认false)
// level 显示层级: 'province':显示一级,'city':显示二级,'district':显示三级 (默认 'district')
// width 设置 组件宽度 (默认 200px)
// placeholder (默认 '所属地区, 必须市或区')
-->
<template>
  <div class="form-group">
    <div class="form-section">
      <span
        :class="[{ 'city-picker-span': true }, { focus: true }]"
        :style="setWidth"
        tabindex="1"
        @click="clkOpen"
      >
        <span v-show="Object.keys(modelValue.province).length !== 0" class="placeholder">
          <span v-for="(value, key, index) in modelValue" :key="index" class="hover" @click.stop="clkSpanAreaName(index)">
            {{ value.name }}
          </span>
        </span>
        <span v-show="Object.keys(modelValue.province).length === 0" class="placeholder">
          {{ placeholder }}
        </span>
        <span :class="[{ arrow: true }, { open: isOpen }]"></span>
      </span>
      <span v-if="showClear" class="btn-single" @click="reset"></span>
    </div>
    <div class="city-picker-dropdown" :style="{ display: isOpen ? 'block' : 'none' }">
      <div class="city-select-wrap">
        <div class="city-select-tab">
          <a :class="[{ selTab: curTabIndex === 0 }]" @click="selectTab(0)">省份</a>
          <a v-if="level === 'city' || level === 'district'" :class="[{ selTab: curTabIndex === 1 }]" @click="selectTab(1)">城市</a>
          <a v-if="level === 'district'" :class="[{ selTab: curTabIndex === 2 }]" @click="selectTab(2)">县区</a>
        </div>
        <div class="city-select-content">
          <div v-show="curTabIndex === 0" class="city-select province">
            <dl v-for="(provinces, key, index) in chineseDistricts[86]" :key="index" class="clearfix">
              <dt>{{ key }}</dt>
              <dd>
                <a v-for="province in provinces" :key="province.code" :class="[{ active: String(modelValue.province.code) === String(province.code) }]" @click="clkAreaName(0, province.code, province.address)">
                  {{ province.address }}
                </a>
              </dd>
            </dl>
          </div>
          <div v-show="curTabIndex === 1" class="city-select city">
            <dl class="clearfix">
              <dd>
                <a v-for="(cityName, cityKey) in chineseDistricts[modelValue.province.code]" :key="cityKey" :class="[{ active: String(modelValue.city.code) === String(cityKey) }]" @click="clkAreaName(1, cityKey, cityName)">
                  {{ cityName }}
                </a>
              </dd>
            </dl>
          </div>
          <div v-show="curTabIndex === 2" class="city-select district">
            <dl class="clearfix">
              <dd>
                <a v-for="(districtName, districtKey) in chineseDistricts[modelValue.city.code]" :key="districtKey" :class="[{ active: String(modelValue.district.code) === String(districtKey) }]" @click="clkAreaName(2, districtKey, districtName)">
                  {{ districtName }}
                </a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import { ChineseDistricts } from './city-picker.data'
export default defineComponent({
    name: 'Area',
    props: {
      modelValue: {
        type: Object,
        required: true,
        default: function () {
          return { province: {}, city: {}, district: {} }
        },
      },
      clearable: {
        type: Boolean,
        default: function () {
          return false
        },
      },
      level: {
        type: String, // 'province':显示一级,'city':显示二级,'district':显示三级
        default: function () {
          return 'district'
        },
      },
      width: {
        type: String,
        default: function () {
          return '166'
        },
      },
      placeholder: {
        type: String,
        default: function () {
          return '所属地区, 必须市或区'
        },
      },
    },
    emits: ['update:modelValue'],
    setup(props, {emit}) {
      const opts = JSON.parse(JSON.stringify(props));
      const state = reactive({
        active: '',
        chineseDistricts: {}, // 省份城市数据
        isOpen: false,
        curTabIndex: 0, //当前选中的tab 0:省份, 1:城市, 2:区县（默认0）
      })

      const modelValueRef = ref(opts.modelValue)

      const clkOpen = () => {
        state.isOpen = !state.isOpen
        state.curTabIndex = 0
      }

      const blurEvent = () => {
        state.isOpen = false
      }

      // tab 点击事件
      const selectTab = (tabIndex) => {
        state.curTabIndex = tabIndex
      }

      // 地区名称点击事件
      const clkAreaName = (tabIndex, code, areaName) => {
        // 给modelValue 赋值
        switch (tabIndex) {
          case 0:
            emit('update:modelValue', {
              province: {
                code: code,
                name: areaName,
              },
              city: {},
              district: {},
            })
            modelValueRef.value.province = { code, name: areaName }
            break
          case 1:
            emit('update:modelValue', {
              province: props.modelValue.province,
              city: {
                code: code,
                name: areaName,
              },
              district: {},
            })
            modelValueRef.value.city = { code, name: areaName }
            break
          case 2:
            emit('update:modelValue', {
              province: props.modelValue.province,
              city: props.modelValue.city,
              district: {
                code: code,
                name: areaName,
              },
            })
            modelValueRef.value.district = { code, name: areaName }
            break
        }
        // 如果最后的tab（index ：2） 关闭
        if (tabIndex === 2 || isCloseTab(tabIndex)) {
          state.isOpen = false
          return
        }
        // tab 切换
        tabSwitch()
      }

      const tabSwitch = () => {
        // 切换tab
        const index = state.curTabIndex
        if (index < 2) {
          state.curTabIndex++
        }
      }

      // 重置选中数据
      const reset = () => {
        const modelValue = {
          province: {},
          city: {},
          district: {},
        }
        emit('update:modelValue', modelValue)
        state.isOpen = false
      }

      const clkSpanAreaName = (tabIndex) => {
        state.isOpen = true
        state.curTabIndex = tabIndex
      }

      const isCloseTab = (tabIndex) => {
        if (state.level === 'province' && tabIndex === 0) return true
        if (state.level === 'city' && tabIndex === 1) return true
      }

      onMounted(() => {
        state.chineseDistricts = ChineseDistricts
      })

      return {
        t,
        ...toRefs(state),
        ...toRefs(props),
        clkOpen,
        blurEvent,
        selectTab,
        clkAreaName,
        tabSwitch,
        reset,
        clkSpanAreaName,
        isCloseTab,
      }
    },
  })
</script>
<style>
  .form-group {
    position: relative;
    background-color: #fff;
    display: inline-block;
  }
  .city-picker-span {
    /*width: 200px;*/
    height: 34px;
    line-height: 33px;
    display: inline-block;
    padding: 0 10px;
    position: relative;
    background-color: #fff;
    color: #ccc;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: top;
  }
  .form-section {
    display: inline-block;
    border: 1px solid #dcdfe6;
  }
  .btn-single {
    height: 34px;
    cursor: pointer;
    display: inline-block;
    line-height: 33px;
    padding: 0 15px;
    border-left: 1px solid #dcdfe6;
  }
  div .btn-single::before {
    content: '\2716';
  }

  .arrow {
    position: absolute;
    top: 50%;
    right: 8px;
    width: 10px;
    margin-top: -3px;
    height: 5px;
    background: url(./image/drop-arrow.png) -10px -25px no-repeat;
  }
  .focus:focus {
    border-bottom: 1px solid #46a4ff;
  }
  span .open {
    background: url(./image/drop-arrow.png) -10px -10px no-repeat;
  }
  .city-select-wrap .city-select-tab > a {
    color: #4c4c4c;
    display: inline-block;
    padding: 8px 22px;
    border-left: 1px solid #ccc;
    /*border-bottom: 1px solid transparent;*/
    text-align: center;
    outline: 0;
    text-decoration: none;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: -1px;
  }
  .city-select-tab {
    /*border-bottom: 1px solid #ccc;*/
    background: #f0f0f0;
    font-size: 13px;
  }

  .city-picker-dropdown {
    top: 40px;
    position: absolute;
    width: 315px;
    outline: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    z-index: 2100;
    min-width: 330px;
    margin-bottom: 20px;
  }
  .city-select-content {
    width: 100%;
    min-height: 10px;
    background-color: #fff;
    padding: 10px 15px;
    box-sizing: border-box;
  }
  .city-select-tab a.selTab {
    color: #1890ff;
    background-color: #fff;
  }
  .city-select-wrap {
    line-height: 20px;
    box-shadow: 0 1px 5px rgb(0 0 0 / 50%);
  }
  .city-select {
    font-size: 13px;
  }
  .city-select dl {
    line-height: 2;
    clear: both;
    padding: 3px 0;
    margin: 0;
  }
  .city-select dt {
    position: absolute;
    width: 2.5em;
    font-weight: 500;
    text-align: right;
    line-height: 2;
  }
  .city-select a {
    display: inline-block;
    padding: 0 10px;
    outline: 0;
    text-decoration: none;
    white-space: nowrap;
    margin-right: 2px;
    color: #333 !important;
    cursor: pointer;
  }
  dd {
    display: block;
  }
  dt {
    display: inline-block;
  }
  .placeholder > span {
    color: #333;
  }
  .placeholder > span:hover,
  .city-select a:hover {
    background-color: #46a4ff;
    border-radius: 2px;
    color: #fff !important;
  }
  .clearfix .active {
    background-color: #46a4ff;
    color: #fff !important;
    border-radius: 2px;
  }
  .city-select {
    font-size: 13px;
  }
  .form-group .btn {
  }
  .btn-single:hover {
    background-color: #e6e6e6;
  }
  .btn-single:active {
    box-shadow: inset 0 0 5px 2px rgb(0 0 0 / 8%);
  }
  .province dd {
    margin-inline-start: 40px;
  }
  .city dd,
  .district dd {
    margin-inline-start: 20px;
  }
</style>
