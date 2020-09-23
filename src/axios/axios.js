import axios from 'axios'
import qs from 'qs'
import globalApi from '../utils/globalApi'
import {
  Notification
} from 'element-ui'
// 创建 axios 实例
const service = axios.create({
  baseURL: globalApi.baseUrl, // 请求前缀
  timeout: 10000, // 请求超时时间
  // crossDomain: true, // 设置cross跨域
  withCredentials: true // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
})

// 设置 post 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器

service.interceptors.request.use((config) => {
  let token = ''
  if (config.url !== '/fms-auth-center/login') {
    token = sessionStorage.getItem('token')
    config.headers.Authorization = token
  }
  if (config.url !== '/cloud-fms/sysuser/updateHeadImg' &&
    config.url !== '/cloud-fms/sysuser/updateUser' &&
    config.url !== '/cloud-fms/sysuser/addUser' &&
    config.url !== '/cloud-video/prePlan/enterprise/baseInfoPicUpload' &&
    config.url !== '/cloud-video/prePlan/enterprise/jzpmtPicUpload' &&
    config.url !== '/cloud-fms/sysuser/batchUpdateUserRole' &&
    config.url !== '/cloud-fms/role/add' &&
    config.url !== '/cloud-fms/sysuser/batchUpdateUserDeptCode' &&
    config.url !== '/cloud-video/prePlan/enterprise/add' &&
    config.url !== '/cloud-fms/dept/add' &&
    config.url !== '/cloud-fms/dept/update') {
    // 判断请求方式是否为POST，进行转换格式
    config.method === 'post' ? config.data = qs.stringify({ ...config.data }) : config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }// 请求发送前进行处理
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
      Notification({
        title: '错误',
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
      if (response.data.code === 401) {
        window.location.href = '/webFs/login'
      }
    } else {
      return response
    }
  },
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401 || error.response.data.code === 401)) {
      Notification({
        title: '错误',
        message: '权限过期，请先登录后再访问！',
        type: 'error',
        duration: 5 * 1000
      })
      window.location.href = '/webFs/login'
      return
    }
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
