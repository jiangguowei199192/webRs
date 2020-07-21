import axios from 'axios'
import qs from 'qs'

const _key = '297e195f983735cadac38437a047d703'
const _urlBase = 'https://restapi.amap.com/v3/'

// 创建client请求对象
const client = axios.create({
  baseURL: _urlBase,
  timeout: 1000 * 5,
  headers: {},
  withCredentials: false // 请求携带cookie
})

// request拦截器
client.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data.key = _key
    config.data = qs.stringify({ ...config.data })
  } else {
    config.params.key = _key
    config.params = { ...config.params }
  }

  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
client.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})

const getPOIs = params => {
  return client.get('place/text', { params: params })
}

const getPoiDetail = params => {
  return client.get('place/detail', { params: params })
}

const getTips = params => {
  return client.get('assistant/inputtips', { params: params })
}

const getLocation = params => {
  return client.get('ip', { params: params })
}

const getWeather = params => {
  return client.get('weather/weatherInfo', { params: params })
}

const getRoutes = params => {
  return client.get('direction/driving', { params: params })
}

export default { getPOIs, getPoiDetail, getTips, getLocation, getWeather, getRoutes }
