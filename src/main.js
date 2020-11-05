import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios/axios'
import $ from 'jquery'
import ElementUI from 'element-ui'
import gMap from '@/components/gMap'
import VueClipboard from 'vue-clipboard2'
import VueDragResize from '@/views/decisionSystem/utils/index'

import 'element-ui/lib/theme-chalk/index.css'
// import './style/theme/index.css'
import './style/common.less'
import './style/mars3d.scss'
import './assets/font/iconfont.css'
import './style/element.less'

import md5 from 'js-md5'
// 去掉mars3d控制台版本输出
console.clear()
VueDragResize.name = 'vdr'
Vue.use(ElementUI)
Vue.component('gMap', gMap)
Vue.use(VueClipboard)
Vue.use(VueDragResize)

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
