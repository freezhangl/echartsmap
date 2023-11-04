<template>
  <div class="mapcon">
    <baidu-map
      style="height: 100%"
      class="map"
      :center="mapCenter"
      :zoom="zoom"
      @ready="handlerLoad"
      @zoomend="zoomend"
      :scroll-wheel-zoom="true"
      :min-zoom="5"
      @dragend="dragend"
      :max-zoom="18"
      >
      <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <!-- <template v-for="item in markers">
          <bm-marker :key="item.selfIndex" :position="item" @click="lookDetail(item)" animation="BMAP_ANIMATTION_DROP">
            <bm-info-window :show="item.show" @close="infoWindowClose(item)" @open="infoWindowOpen(item)">{{
              item.locationName
            }}</bm-info-window>
          </bm-marker>
        </template> -->
        <!-- <template v-for="item in overLayPosition">
          <my-overlay :position="item" :key="item.name"> </my-overlay>
        </template> -->
      </baidu-map>
  </div>
</template>
<script>
import axios from 'axios'
// import debounce from 'lodash/debounce'

export default{
  data() {
    return {
      zoom: 13,
      mapCenter: { lng: 0, lat: 0 },
      markers: [],
      BMap: null,
      map: null,
      points: [114.64, 38.04],
      overLayPosition: [], // 自定义标记
      addressOptions: [], // 省地址
      cityList: [], // 市级地址,
      districtList: [], // 区县地址
      townList: [], // 区县地址
    }
  },
  methods:{
    initMap(props){
      console.log(props,'我接受到了')
      this.mapCenter={ lng: props.lng, lat: props.lat }
    },
    handlerLoad({ BMap, map }) {
      /* eslint-disable no-undef */
      map.setMapType(BMAP_HYBRID_MAP)
      console.log(BMap, map, 'fhafds割发代首')
      this.BMap = BMap
      this.map = map
      this.map.enableScrollWheelZoom()
      this.mapCenter={ lng: 116.404, lat: 39.915 }
    },
    zoomend(val) {
      const zoom = this.map?.getZoom()
      const mapcenter = this.map?.getCenter()
      this.mapCenter = mapcenter
      if (zoom === this.zoom) {
        return
      }
      console.log(zoom, val, 'fdsjj富家大室', this.mapCenter)
      this.zoom = zoom
      if(!this.BMap) return
      const myGeo = new this.BMap.Geocoder()
      myGeo.getLocation(this.mapCenter, rs => {
        console.log('我是具体地址1', rs)
        // this.getoverLayPosition(rs)
      })
    },
    dragend(e) {
      console.log(e, '我是拖拽事件')
      // this.mapCenter = e.point
      const mapcenter = this.map?.getCenter()
      this.mapCenter = mapcenter
      const myGeo = new this.BMap.Geocoder()
      myGeo.getLocation(this.mapCenter, rs => {
        console.log('我是具体地址2', rs)
        // this.getoverLayPosition(rs)
      })
    },
    infoWindowClose(item) {
      console.log(item, this.markers, '我是点击了详情1')
      const newList = []
      this.markers.forEach(item1 => {
        if (item1.locationName === item.locationName) {
          newList.push({ ...item1, show: false })
        } else {
          newList.push(item1)
        }
      })
      this.markers = newList
    },
    infoWindowOpen(item) {
      console.log(item, this.markers, '我是点击了详情2')
      const newList = []
      this.markers.forEach(item1 => {
        if (item1.locationName === item.locationName) {
          newList.push({ ...item1, show: true })
        } else {
          newList.push(item1)
        }
      })
      this.markers = newList
      // item.show = true;
    },
    lookDetail(item) {
      console.log(item, this.markers, '我是点击了详情3')
      const newList = []
      this.markers.forEach(item1 => {
        if (item1.locationName === item.locationName) {
          newList.push({ ...item1, show: true })
        } else {
          newList.push(item1)
        }
      })
      this.markers = newList
      // item.show = true;
      this.infoWindow.info = item
    },
    getoverLayPosition() {
      console.log(this.zoom, '我是初始值')
      // 获取所有省的标记点
      if (this.zoom === 5) {
        const params = {}
        this.addressStr = `全国`
        axios('/power/opsDashboard/test.json', params).then(res => {
          console.log(res, this.alladcode, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '',
          //     locationName: '安徽省',
          //     stationCount: 2565,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   },
          //   {
          //     locationCode: '',
          //     locationName: '江苏省',
          //     stationCount: 3441,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   }
          // ]
          const provinceInfoList = []
          this.alladcode.forEach(item => {
            if (item.level === 'province') {
              provinceInfoList.push(item)
            }
          })
          provinceInfoList.forEach(item => {
            let hasOne = false
            res.data.some(item1 => {
              if (item1.locationName === item.name) {
                hasOne = true
                item.hasOne = true
                item.stationCount = item1.stationCount
                return true
              }
            })
            if (!hasOne) {
              item.hasOne = false
              item.stationCount = 0
            }
          })
          this.overLayPosition = provinceInfoList.filter(item => item.hasOne)
          this.markers = []
          console.log(this.overLayPosition, '我是所有的省标记信息')
        })
      }
      // 获取所有市的标记点
      if (this.zoom > 5 && this.zoom <= 8) {
        if (!this.formData.provinceCode) return
        const params = {
          provinceCode: this.formData.provinceCode
        }
        this.addressStr = `${this.formData.provinceName}`
        axios('/power/opsDashboard/test.json', params).then(res => {
          console.log(res, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '',
          //     locationName: '阜阳市',
          //     stationCount: 180,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   },
          //   {
          //     locationCode: '',
          //     locationName: '合肥市',
          //     stationCount: 235,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   }
          // ]
          const cityInfoList = []
          this.alladcode.forEach(item => {
            if (item.level === 'city') {
              cityInfoList.push(item)
            }
          })
          cityInfoList.forEach(item => {
            let hasOne = false
            res.data.some(item1 => {
              if (item1.locationName === item.name) {
                hasOne = true
                item.hasOne = true
                item.stationCount = item1.stationCount
                return true
              }
            })
            if (!hasOne) {
              item.hasOne = false
              item.stationCount = 0
            }
          })
          this.overLayPosition = cityInfoList.filter(item => item.hasOne)
          this.markers = []
          console.log(this.overLayPosition, '我是所有的市标记信息')
        })
      }
      // 获取所有区县的标记
      if (this.zoom >= 9 && this.zoom <= 10) {
        if (!this.formData.cityCode) return

        const params = {
          // provinceCode: this.formData.provinceCode,
          cityCode: this.formData.cityCode
        }
        this.addressStr = `${this.formData.provinceName}${this.formData.cityName}`
        axios('/power/opsDashboard/test.json', params).then(res => {
          console.log(res, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '',
          //     locationName: '临泉县',
          //     stationCount: 25,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   },
          //   {
          //     locationCode: '',
          //     locationName: '界首市',
          //     stationCount: 44,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   }
          // ]
          const districtInfoList = []
          this.alladcode.forEach(item => {
            if (item.level === 'district') {
              districtInfoList.push(item)
            }
          })
          districtInfoList.forEach(item => {
            let hasOne = false
            res.data.some(item1 => {
              if (item1.locationName === item.name) {
                hasOne = true
                item.hasOne = true
                item.stationCount = item1.stationCount
                return true
              }
            })
            if (!hasOne) {
              item.hasOne = false
              item.stationCount = 0
            }
          })
          this.overLayPosition = districtInfoList.filter(item => item.hasOne)
          this.markers = []
          console.log(this.overLayPosition, '我是所有的区县标记信息')
        })
      }
      // 获取具体的地址标记
      if (this.zoom >= 11) {
        if (!this.formData.districtCode) return
        const params = {
          // provinceCode: this.formData.provinceCode,
          // cityCode: this.formData.cityCode,
          countyCode: this.formData.districtCode
        }
        this.addressStr = `${this.formData.provinceName}${this.formData.cityName}${this.formData.districtName}`
        axios('/power/opsDashboard/test.json', params).then(res => {
          console.log(res, '就法第三季')
          res.data = [
            {
              locationCode: '341282108000',
              locationName: '阜阳市界首市前进北街砖集第二小学',
              stationCount: 5,
              longitude: 115.315579,
              latitude: 33.115349
            },
            {
              locationCode: '341282106000',
              locationName: '阜阳市界首市人民路砖集派出所东侧约150米',
              stationCount: 44,
              longitude: 115.327507,
              latitude: 33.112325
            }
          ]
          res.data.forEach((item, index) => {
            item.selfIndex = index + 1
            item.show = false
            item.lng = Number(item.longitude)
            item.lat = Number(item.latitude)
            // item.locationName = '你好啊吗' + Math.random()
          })
          this.overLayPosition = []
          this.markers = res.data
          this.townList = res.data
          console.log(this.markers, '我是所有的精确镇级标记信息')
        })
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.mapcon{
  width: 100%;
  height: 100%;
}
v::deep .BMap_cpyCtrl {
    display: none!important;
}
v::deep .anchorBL {
    display: none!important;
}

</style>