import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
const echarts=require('echarts')
// import BaiduMap from 'vue-baidu-map'
Vue.prototype.$echarts=echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
