import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios/axios'
import ElementUI from 'element-ui'
import gMap from '@/components/gMap'
import VueClipboard from 'vue-clipboard2'

import 'element-ui/lib/theme-chalk/index.css'
// import './style/theme/index.css'
import './style/common.less'
import './style/common.scss'
import './assets/font/iconfont.css'
import './style/element.less'

Vue.use(ElementUI)
Vue.component('gMap', gMap)
Vue.use(VueClipboard)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
