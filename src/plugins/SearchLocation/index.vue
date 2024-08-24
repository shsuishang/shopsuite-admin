<template>
  <div>
    <el-autocomplete
      v-model="key"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
      :style="{ width: '100%' }"
      @change="change"
      @select="getAddress"
    />
    <baidu-map
      :ak="configs.baidu_client_ak"
      :center="mapCenter"
      class="map"
      type="API"
      v="2.0"
      :zoom="zoom"
      @click="getClickInfo"
      @moveend="syncCenterAndZoom"
      @moving="syncCenterAndZoom" @ready="handler" @zoomend="syncCenterAndZoom">
      <bm-local-search :auto-viewport="true" :keyword="key" :location="lc" :panel="false" @searchcomplete="searchcomplete"/>
      <bm-marker
        animation="BMAP_ANIMATION_BOUNCE"
        :dragging="false"
        :position="mapCenter"
      >
        <bm-label
          content=""
          :label-style="{ color: 'red', fontSize: '24px' }"
          :offset="{ width: 6, height: 20 }"
        />
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import {ref, watch} from 'vue';
import {useSettingsStore} from "@/store/modules/settings";
import {BaiduMap, BmLocalSearch, BmMarker, BmLabel} from 'vue-baidu-map-3x'

export default {
  name: 'SearchLocation',
  components: {BaiduMap, BmLocalSearch, BmMarker, BmLabel},
  props: {
    keyword: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
  },
  emits: ['getAddress', 'change'],
  setup(props, {emit}) {
    const settingsStore = useSettingsStore()
    const state = reactive({
      configs: settingsStore.getConfigs,

      zoom: 15,
      mapCenter: {lng: 116.404, lat: 39.915},
    })

    const key = ref(props.keyword);
    const lc = ref(props.location);

    const addressList = ref([]);
    let timeout = null;

    // Watch for keyword prop changes
    watch(
      () => props.keyword,
      (newVal) => {
        key.value = newVal;
      }
    );

    // Watch for location prop changes
    watch(
      () => props.location,
      (newVal) => {
        lc.value = newVal;
      }
    );

    // Handle search complete event
    const searchcomplete = (results) => {
      if (results && results.as) {
        addressList.value = results.as;
      } else {
        addressList.value = [];
      }
    };

    // Asynchronous search function
    const querySearchAsync = (queryString, cb) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(createStateFilter());
      }, 500);
    };

    // Create filter function for addresses
    const createStateFilter = () => {
      if (addressList.value.length > 0) {
        return addressList.value.map((address) => {
          return {
            value: address.address,
            lat: address.point.lat,
            lng: address.point.lng,
          };
        });
      } else {
        return [];
      }
    };

    // Emit getAddress event
    const getAddress = (item) => {
      emit('getAddress', item);
    };

    // Emit change event
    const change = (val) => {
      emit('change', val);
    };


    const handler = ({BMap, map}) => {
      //  对地图进行自定义操作
      console.info(BMap)
      console.info(map)
    }


    /***
     * 地图点击事件。
     */
    const getClickInfo = (e) => {
      state.mapCenter.lng = e.point.lng
      state.mapCenter.lat = e.point.lat

      // state.form.chain_lat = state.mapCenter.lat
      // state.form.chain_lng = state.mapCenter.lng
    }
    const syncCenterAndZoom = (e) => {
      const {lng, lat} = e.target.getCenter()
      state.mapCenter.lng = lng
      state.mapCenter.lat = lat
      state.zoom = e.target.getZoom()

      // state.form.chain_lat = state.mapCenter.lat
      // state.form.chain_lng = state.mapCenter.lng
    }

    return {
      ...toRefs(state),
      key,
      lc,
      searchcomplete,
      querySearchAsync,
      getAddress,
      change,

      handler,
      getClickInfo,
      syncCenterAndZoom,
    };
  },
};
</script>

<style lang="scss">
.map {
  width: 100%;
  height: 150px;
}
</style>

