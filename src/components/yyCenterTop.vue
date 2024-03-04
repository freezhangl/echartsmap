<template>
  <div id="yycenter__top1" style="width:100%;height:100%;position:relatvie"></div>
</template>

<script>
export default {
  props: {
    regionGeoJson: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    regionGeoJson: {
      handler(val) {
        console.log(val, '我接受到了地图的数据')
        this.$nextTick(() => {
          if (this.myChartPieLeftNew) {
            this.myChartPieLeftNew.clear()
          }
          this.firstShow = true
          this.setData()
        })
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      myChartPieLeftNew: null,
      firstShow: true,
      timeId: ''
    }
  },
  mounted() {
    // setTimeout(() => {
    this.drawPie()
    // }, 100)
  },
  methods: {
    drawPie() {
      this.myChartPieLeftNew = this.$echarts.init(document.getElementById('yycenter__top1'))
      // 响应式变化
      window.addEventListener('resize', () => this.myChartPieLeftNew.resize(), false)
      this.myChartPieLeftNew.on('click', params => {
        console.log(params, '我是echarts点击了')
        this.$emit('updateEchartsInfo', params)
      })
    },
    // 渲染echarts
    setData() {
      const nameMap = '地图数据'
      const geoCoordMap = {}
      const mapData = []
      const iconData = []
      this.$echarts.registerMap(nameMap, this.regionGeoJson)
      /* 获取地图数据 */
      this.myChartPieLeftNew.showLoading()
      console.log(
        this.$echarts.getMap(nameMap),
        '饭点击事件',
        this.$echarts.getMap(nameMap).geoJson,
        this.$echarts.getMap(nameMap).geoJson.features
      )
      const mapFeatures = this.$echarts.getMap(nameMap)?.geoJson?.features
      this.myChartPieLeftNew.hideLoading()
      if (!mapFeatures?.length) return
      mapFeatures.forEach((v, index) => {
        console.log(v, '我是v')
        // 地区名称
        mapData.push({
          name: v.properties.name,
          value: v.properties.name=='安徽省'||v.properties.name=='河南省'? Math.random() * 1500:0,
          hasOne: v.hasOne,
          offLineAreaStationCount: v.offLineAreaStationCount,
          areaCode: v.areaCode,
          areaStationCount: v.areaStationCount,
          wIcon: v.wIcon,
          wText: v.wText,
        })
        var name = v.properties.name
        geoCoordMap[name] = v.properties.center
        if (v.hasOne) {
            var data = {
              coordinateSystem: 'geo',
              value: v.properties.center,
              id: index,
              name: name,
              hasOne: v.hasOne,
              offLineAreaStationCount: v.offLineAreaStationCount,
              areaCode: v.areaCode,
              areaStationCount: v.areaStationCount,
              wIcon: v.wIcon,
              wText: v.wText
              // symbolSize: 25
            }
            console.log('火锅试试', v.wIcon)
            // const svgPath = `http://116.198.18.192/gfkj-files/imgs/weather/${v.wIcon}.png`
            const svgPath = `https://a.hecdn.net/img/common/icon/202106d/${v.wIcon}.png`
            if (this.firstShow) {
              data.symbol = v.offLineAreaStationCount > 0
                  ? 'image://http://116.198.18.192/gfkj-files/imgs/jby/screen/map_error.png'
                  : `image://${svgPath}`
                  // : `path://${svgPath}`
                  if (v.offLineAreaStationCount <= 0) {
                    data.symbolSize = 25
                  }
            } else {
              data.symbolSize = 25
              data.symbol = `image://${svgPath}`
            }
            console.log(this.firstShow, data.symbol, v.offLineAreaStationCount > 0, '减肥的设计规范')
            if (this.regionGeoJson?.addressCodeLength === 2) { // 判断是县级
              if (v.offLineAreaStationCount > 0) {
                iconData.push(data)
              }
            } else {
              iconData.push(data)
            }
        }
      })
      // const svgPath = `http://116.198.18.192/gfkj-files/imgs/weather/100.png`
      // const points = []
      var serverdata = [
        {
          tooltip: {
            trigger: 'item',
            show: false
          },
          type: 'map',
          map: nameMap,
          zoom: this.regionGeoJson.isChinaInfo ? 1.2 : 1,
          roam: false,
          z: 1,
          // aspectScale: 0.75,
          layoutCenter: this.regionGeoJson.provinceName === '海南省' && !this.regionGeoJson.cityName ? ['35%', '50%'] : ['50%', '50%'],
          layoutSize: this.regionGeoJson.provinceName === '海南省' && !this.regionGeoJson.cityName ? '500%' : '100%',
          center: this.regionGeoJson.provinceName === '海南省' && !this.regionGeoJson.cityName ? [109.844902, 19.0392] : undefined,
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
              opacity: 1,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.9,
                colorStops: [
                  {
                    offset: 0,
                    color: '#051C71' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#114790' // 50% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            emphasis: {
              // areaColor: '#ffffff00',
              areaColor: null,
              label: {
                show: true,
                color: 'rgba(255, 255, 255, 1)',
                fontSize: 14
              }
            }
          },
          label: {
            show: true,
            normal: {
              show: true,
              textStyle: {
                fontSize: 12,
                fontWeight: 400,
                color: 'rgba(65,155,255,1)'
              }
            }
          },
          selectedMode: false,
          data: mapData
        },
        // {
        //   // tooltip: {
        //   //   trigger: 'item',
        //   //   show: false
        //   // },
        //   // type: 'effectScatter',
        //   type: 'scatter',
        //   coordinateSystem: 'geo',
        //   // geoIndex: 2,
        //   showEffectOn: 'render',
        //   zlevel: 1,
        //   // rippleEffect: {
        //   //     period: 15,
        //   //     scale: 4,
        //   //     brushType: 'fill'
        //   // },
        //   hoverAnimation: true,
        //   itemStyle: {
        //     normal: {
        //       color: '#1DE9B6',
        //       shadowBlur: 10,
        //       shadowColor: '#333'
        //     }
        //   },
        //   symbolSize: 35,
        //   data: iconData
        // }
      ]
      const optionMap = {
        visualMap: {
        min: 0,
        max: 1500,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#114790', '#d08a00', '#c23c33']
        }
      },
        tooltip: {
          //   position: ['50%', '50%'],
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, 0);',
          //   zIndex: 400,
          trigger: 'item', // 鼠标划过时饼状图上显示的数据
          formatter: item => {
            // console.log(item, '加肥加大')
            const aaa = require('../assets/bg1.png')
            var str = `<div style = "background:url(${aaa}) no-repeat 100% 100% ;height:90px;min-width:130px;color:#FFFFFF;">
                    <div style="padding-left:11px;padding-top:4px;">${item?.data?.name}:<br/>离线数量: ${item?.data?.offLineAreaStationCount}</div>
                </div>`
            return str
          }
        },
        geo: {
          map: nameMap,
          show: true,
          aspectScale: 0.75,
          zoom: this.regionGeoJson.isChinaInfo ? 1.2 : 1,
          // layoutCenter: ['50%', '51.5%'],
          // layoutSize: '100%',
          layoutCenter: this.regionGeoJson.provinceName === '海南省' && !this.regionGeoJson.cityName ? ['35%', '50%'] : ['50%', '51.5%'],
          layoutSize: this.regionGeoJson.provinceName === '海南省' && !this.regionGeoJson.cityName ? '500%' : '100%',
          center: this.regionGeoJson.provinceName === '海南省' && !this.regionGeoJson.cityName ? [109.844902, 19.0392] : undefined,
          roam: false,
          itemStyle: {
            normal: {
              borderColor: 'rgba(147, 235, 248, 1)',
              borderWidth: 0.5,
              color: {
                type: 'linear-gradient',
                x: 0,
                y: 1500,
                x2: 2500,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#0FAAE5' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0FAAE5' // 50% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              },
              opacity: 0.8
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          },
          z: 0,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          }
        },
        series: serverdata
      }
      console.log(optionMap, '我是配防静电')
      this.myChartPieLeftNew.setOption(optionMap, { lazyMode: true })
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.firstShow = !this.firstShow
        this.setData()
      }, 3000)
    }
  },
  destroyed() {
    window.onresize = null
    clearInterval(this.timeId)
  }
}
</script>

<style lang="less" scoped></style>
