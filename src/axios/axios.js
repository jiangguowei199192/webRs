import axios from 'axios'
import qs from 'qs'
import globalApi from '../utils/globalApi'
import errorCode from '../utils/errorCode'
import {
  Notification
} from 'element-ui'
// 创建 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  // crossDomain: true, // 设置cross跨域
  withCredentials: true, // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// 设置 post 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器

service.interceptors.request.use((config) => {
  config.baseURL = globalApi.baseUrl
  let token = ''
  if (config.url !== '/fms-auth-center/login') {
    token = sessionStorage.getItem('token')
    config.headers.Authorization = token
  }

  if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json;charset=UTF-8' && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.data = qs.stringify({ ...config.data })
  }
  return config
},
(error) => {
  // 请求错误处理
  return Promise.reject(error)
}
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data.code !== 0) {
      var errorMsg = '网络异常'
      // 401错误码都是跟权限相关
      // if (response.data.code === 401) { errorMsg = response.data.msg } else {
      errorCode.forEach(item => {
        if (item.code === response.data.code) {
          errorMsg = item.str
          // return false
        }
      })
      // }
      Notification.closeAll()
      Notification({
        title: '错误',
        message: errorMsg,
        type: 'error',
        duration: 5 * 1000
      })

      if (response.data.code === 401 && window.location.href.indexOf('/login') === -1) {
        window.location.href = '/webRs/login'
      }
    } else {
      return response
    }
  },
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401 || error.response.data.code === 401)) {
      Notification.closeAll()
      Notification({
        title: '错误',
        message: '权限过期，请先登录后再访问！',
        type: 'error',
        duration: 5 * 1000
      })
      window.location.href = '/webRs/login'
      return
    }
    Notification.closeAll()
    Notification({
      title: '错误',
      message: error.response || '请求无响应，网络出错啦！',
      type: 'error',
      duration: 5 * 1000
    })
  }
)

/**
 * 向外抛出service
 */
export default service
