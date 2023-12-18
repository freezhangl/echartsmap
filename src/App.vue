<template>
  <div id="app">
    <!-- <router-view/> -->
    <div style="color:#fff;position: absolute;font-size: 20px; color: purple;font-weight: bold; cursor: pointer;z-index: 9999;top: 20px;right: 20px;" @click="goback" v-if="mapShow">
        返回
    </div>
    <div @click="test" style="color:#fff;position: absolute;font-size: 20px; cursor: pointer;color: purple;font-weight: bold;z-index: 9999;right: 20px;">
        {{addressStr}}
    </div>
    <yyCenterTopVue
      v-if="!mapShow"
      :centerTopInfo="centerTopInfo"
      :regionGeoJson="regionGeoJson"
      @updateEchartsInfo="updateEchartsInfo"
    />
    <bdMap v-if="bdmapShow" ref="bdMap"></bdMap>
  </div>
</template>
<script>
import axios from 'axios'
import alljson from './assets/alljson'
import chinaJson from  './assets/china'
import yyCenterTopVue from './components/yyCenterTop.vue'
import bdMap from './components/bdMap.vue'
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
    yyCenterTopVue,
    bdMap
  },
  data(){
    return{
      bdmapShow:false,
      addressStr: '全国',
      mapShow:false,
      // origin: window.location.origin.indexOf('localhost') > 0 ? '' : window.location.origin + '/areas_v3/bound',
      origin: window.location.origin.indexOf('localhost') > 0 ? '' : '',
      origin1:window.location.origin.indexOf('localhost') > 0 ? false : true,
      formData: {
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
        districtCode: '',
        districtName: ''
      },
      centerTopInfo: {},
      alladcode: [],
      chinaJson: {},
      regionGeoJson: {}

    }
  },
  mounted(){
    console.log(alljson, '我是地图数据啊')
    this.alladcode = alljson
    chinaJson.features.forEach(item => {
      item.properties.name = item.properties.fullname
    })
    this.chinaJson = chinaJson
    this.init()
    this.bdmapShow=true
  },
  methods:{
    test(){
      console.log('我执行了')
      //测试连接线上服务器接口
      axios({ 
          url:'/apiTest/api/login',
          method:"post",
          headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          "tenant-id":"1"
         },
          data:{
            username:'1',
            password:'123456'
          }
        }).then(res => {
          console.log(res, '我是所有省的离线数量')
        })
        let url = ''
        if (this.origin1) {
          url = `http://116.198.18.192/szyw/api/power/powerArea/queryProvinceList`
        } else {
          url = `/szyw/api/power/powerArea/queryProvinceList`
        }
        axios({
          url,
          method:'get',
          headers:{
            Authorization:'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIzOTUzODMyMzMzMTk0MDM1MywiYWNjb3VudCI6ImNvbW1hbmRlcjEwMCIsInRlbmFudENvZGUiOiJzcGljIiwidXVpZCI6IjFkMWYyYmRiLTFlNmUtNDkwOC04ZmVlLTg1ZTA0ZjJjNjcwYyIsInN1YiI6IjIzOTUzODMyMzMzMTk0MDM1MyIsImlhdCI6MTcwMjg2Mzc5NCwiZXhwIjoxNzAyOTM1Nzk0fQ.3Gf9cRgBYaBRCQ9eaFaLp1pKJG2779gFzVnAeRLfDz4'
          },
          params: {
            parentCode: 0
          }
        }).then(res=>[
          console.log(res,'我是啥1')
        ]).catch(err=>{
          console.log(err,'我是啥2')
        })
    },
    goback(){
      this.formData.districtCode = ''
      this.formData.provinceCode = ''
      this.formData.provinceName = ''
      this.formData.districtName = ''
      this.formData.cityCode = ''
      this.formData.cityName = ''
      this.mapShow=false
      this.init()
      // console.log('我是谁阿凡达',fileRename)
    },
    init(addressCode = [], clickRegionCode,clickInfo) {
      // 默认获取全国的信息
      if (addressCode.length) {
        this.addressStr = `${this.formData.provinceName}${this.formData.cityName}${this.formData.districtName}`
      } else {
        this.addressStr = `全国`
      }
      if(this.formData.districtName) {
        this.mapShow=true
        this.$refs.bdMap.initMap(clickInfo)
        return
      }
      this.getCenterCenterData(addressCode, clickRegionCode)
    },
    async getCenterCenterData(addressCode = [], clickRegionCode) {
      // 获取中间地图信息,去请求当前所有省的离线数量,或者省下所有市的离线数量
      console.log(addressCode, '我是选择的地址')
      let lxList = []
      if (addressCode.length === 0) {
        // 去根据所有的省获取离线数量
        const params = {}
        await axios({
          url:'/power/opsDashboard/test.json',
          method:"get",
          params
        }).then(res => {
          console.log(res, '我是所有省的离线数量')
          lxList = res.data
        })
      }
      if (addressCode.length === 1) {
        // 去根据所有的市获取离线数量
        const params = {
          provinceCode: this.formData.provinceCode
        }
        await axios('/power/opsDashboard/test1.json', params).then(res => {
        // await axios('/power/opsDashboard/test2.json', params).then(res => {
          console.log(res, '我是所有市的离线数量')
          lxList = res.data
        })
      }
      if (addressCode.length === 2) {
        // 去根据所有的区县获取离线数量
        const params = {
          // provinceCode: this.formData.provinceCode,
          cityCode: this.formData.cityCode
        }
        await axios('/power/opsDashboard/test4.json', params).then(res => {
          console.log(res, '我是所有市的离线数量')
          lxList = res.data
        })
      }
      console.log(addressCode.length, '我是多少阿阿凡达')
      if (clickRegionCode && (addressCode.length === 1 || addressCode.length === 2)) {
        let url = ''
        if (this.origin) {
          url = `${this.origin}/${clickRegionCode}.json`
        } else {
          url = `${this.origin}/aliyun/${clickRegionCode}.json`
        }
        axios(url)
          .then(res => {
            console.log(res, '我说放大')
            this.setRegionGeoJson(res.data, lxList)
          })
          .catch(err => {
            console.log(err, '我是错误')
            let url = ''
            if (this.origin) {
              url = `${this.origin}/100000.json`
            } else {
              url = `${this.origin}/aliyun/100000.json`
            }
            axios(url).then(res => {
              console.log(res, '我说放大')
              res.data = this.chinaJson
              this.setRegionGeoJson(res.data, lxList,'1')
              // this.rightTopInfo = res.data
            })
          })
        console.log(lxList)
      } else {
        let url = ''
        if (this.origin) {
          url = `${this.origin}/100000.json`
        } else {
          url = `${this.origin}/aliyun/100000.json`
        }
        axios(url).then(res => {
          console.log(res, '我说放大')
          res.data = this.chinaJson
          this.setRegionGeoJson(res.data, lxList,'1')
        })
      }
    },
    setRegionGeoJson(res, lxList, type) {
      console.log(res, lxList, '我是哈哈哈')
      res.features.forEach(item => {
        let hasOne = false
        lxList.some(item1 => {
          if (item.properties.name === item1.areaName) {
            hasOne = true
            item.hasOne = true
            item.areaCode = item1.areaCode
            item.areaStationCount = item1.areaStationCount
            item.offLineAreaStationCount = item1.offlineAreaStationCount
            item.wIcon = item1.weatherInfo?.iconCode || '100'
            item.wText = item1.weatherInfo?.weatherInfo || '晴'
            return true
          }
        })
        if (!hasOne) {
          item.hasOne = false
          item.offLineAreaStationCount = 0
          item.areaStationCount = 0
        }
      })
      res.provinceName = this.formData.provinceName
      res.cityName = this.formData.cityName
      if (type === '1') {
        res.isChinaInfo = true
      } else {
        res.isChinaInfo = false
      }
      this.regionGeoJson = res
    },
    async updateEchartsInfo(params) {
      // console.log(params, '我是父组件获取到了数据')
      const clickRegionCode = this.alladcode.filter(item => item.name === params.name)[0].adcode
      const clickLevel = this.alladcode.filter(item => item.name === params.name)[0].level
      const clickInfo = this.alladcode.filter(item => item.name === params.name)[0]
      console.log(params,clickInfo, '我是父组件获取到了数据')
      if (clickLevel === 'province') {
        // 点击的是省
        this.formData.provinceName = params.name
        this.formData.provinceCode = clickRegionCode
      }
      if (clickLevel === 'city') {
        // 点击的是市
        this.formData.cityName = params.name
        this.formData.cityCode = clickRegionCode
      }
      if (clickLevel === 'district') {
        // 点击的是县或区 这个时候没有下一级应该去请求全国的数据
        console.log('我是点击了区县')
        this.formData.districtName = params.name
        this.formData.districtCode = clickRegionCode
        // this.formData.provinceId = ''
        // this.formData.provinceCode = ''
        // this.formData.provinceName = ''
        // this.formData.cityId = ''
        // this.formData.cityCode = ''
        // this.formData.cityName = ''
      }
      // 重新渲染数据
      const addressCode = []
      if (this.formData.provinceCode) {
        addressCode.push(this.formData.provinceCode)
      }
      if (this.formData.cityCode) {
        addressCode.push(this.formData.cityCode)
      }
      if (this.formData.districtCode) {
        addressCode.push(this.formData.districtCode)
      }
      this.init(addressCode, clickRegionCode,clickInfo)
    },
  }
}
</script>
<style lang="scss">
#app {
  position: relative;
  box-sizing: border-box;
  background-image: url('./assets/imgs_jby_screen_bg.png');
    width: 100%;
   height: 100%;
   overflow:hidden;
}
html,body{
  height: 100%;
  margin:0;
  padding:0;
  width: 100%;
  // overflow: hidden;
}
</style>
