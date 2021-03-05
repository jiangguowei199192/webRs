import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios/axios'
import $ from 'jquery'
import ElementUI from 'element-ui'
import gMap from '@/components/gMap'

import 'element-ui/lib/theme-chalk/index.css'
// import './style/theme/index.css'
import './style/common.less'
import './assets/font/iconfont.css'
import './style/element.less'

import md5 from 'js-md5'

Vue.use(ElementUI)
Vue.component('gMap', gMap)

Vue.prototype.$axios = axios
Vue.prototype.$ = $
Vue.config.productionTip = false
Vue.prototype.$md5 = md5
Vue.prototype.$confirm = ElementUI.MessageBox.confirm

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
