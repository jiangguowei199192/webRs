import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios/axios'
import $ from 'jquery'
import ElementUI from 'element-ui'
import gMap from '@/components/gMap'
import globalApi from '@/utils/globalApi'

import 'element-ui/lib/theme-chalk/index.css'
// import './style/theme/index.css'
import './style/common.less'
import './assets/font/iconfont.css'
import './style/element.less'
import md5 from 'js-md5'
import '../public/assets/css/gisBox.css'
import '../public/assets/css/layerStyle.css'
import '../public/assets/css/ms.css'

Vue.use(ElementUI)
Vue.component('gMap', gMap)

Vue.prototype.$axios = axios
Vue.prototype.$ = $
Vue.config.productionTip = false
Vue.prototype.$md5 = md5
Vue.prototype.$confirm = ElementUI.MessageBox.confirm

const baseDownloadUrl = globalApi.headImg
Vue.directive('download', {
  inserted: (el, binding) => {
    el.style.cssText = 'cursor: pointer;color:#fff;'
    el.addEventListener('click', () => {
      const link = document.createElement('a')
      const url = baseDownloadUrl + binding.value
      fetch(url).then(res => res.blob()).then(blob => {
        link.href = URL.createObjectURL(blob)
        link.download = ''
        document.body.appendChild(link)
        setTimeout(() => { link.click() }, 300)
      })
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
