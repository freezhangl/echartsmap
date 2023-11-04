import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
const echarts=require('echarts')
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  // ak: '3cPbP86nIN4zcxCvGS5xOg7jhEyLN5ED',
  ak: 'hiGyjL9OZob3BKWMXHCAzkRMuAgpliCr'//我的
  
})
Vue.prototype.$echarts=echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
