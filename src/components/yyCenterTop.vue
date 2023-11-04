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
          this.setData()
        })
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      myChartPieLeftNew: null
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
      mapFeatures.forEach(function(v, index) {
        console.log(v, '我是v')
        // 地区名称
        mapData.push({
          name: v.properties.name,
          value: Math.random() * 100,
          hasOne: v.hasOne,
          offLineAreaStationCount: v.offLineAreaStationCount,
          areaCode: v.areaCode,
          areaStationCount: v.areaStationCount
        })
        var name = v.properties.name
        geoCoordMap[name] = v.properties.center
        var data = {
          coordinateSystem: 'geo',
          value: v.properties.center,
          id: index,
          name: name,
          hasOne: v.hasOne,
          offLineAreaStationCount: v.offLineAreaStationCount,
          areaCode: v.areaCode,
          areaStationCount: v.areaStationCount,
          symbol:
            v.offLineAreaStationCount > 0
              ? 'image://https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/map_error.png'
              : 'image://https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/map_success.png'
        }
        if (data.hasOne) {
          iconData.push(data)
        }
      })
      // const points = []
      var serverdata = [
        {
          // tooltip: {
          //   trigger: 'item',
          //   show: false
          // },
          type: 'map',
          map: nameMap,
          zoom: this.regionGeoJson.isChinaInfo ? 1.2 : 1,
          roam: false,
          z: 1,
          // aspectScale: 0.75,
          layoutCenter: this.regionGeoJson.provinceName === '海南省' ? ['35%', '50%'] : ['50%', '50%'],
          layoutSize: this.regionGeoJson.provinceName === '海南省' ? '500%' : '100%',
          center: this.regionGeoJson.provinceName === '海南省' ? [109.844902, 19.0392] : undefined,
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
              areaColor: '##5CA7F7',
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
        {
          tooltip: {
            trigger: 'item',
            show: false
          },
          // type: 'effectScatter',
          type: 'scatter',
          coordinateSystem: 'geo',
          // geoIndex: 2,
          showEffectOn: 'render',
          zlevel: 1,
          // rippleEffect: {
          //     period: 15,
          //     scale: 4,
          //     brushType: 'fill'
          // },
          hoverAnimation: true,
          itemStyle: {
            normal: {
              color: '#1DE9B6',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          symbolSize: 35,
          data: iconData
        }
      ]
      const optionMap = {
        tooltip: {
          //   position: ['50%', '50%'],
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, 0);',
          //   zIndex: 400,
          trigger: 'item', // 鼠标划过时饼状图上显示的数据
          formatter: item => {
            // console.log(item, '加肥加大')
            const aaa = require('../assets/infinity-2128861.jpg')
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
          layoutCenter: ['50%', '51.5%'],
          layoutSize: '100%',
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
              show: true
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
    }
  },
  destroyed() {
    window.onresize = null
  }
}
</script>

<style lang="less" scoped></style>
