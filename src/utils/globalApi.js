
import $ from 'jquery'
let baseUrl = ''
let mqttServer = ''
let mqttPort = ''
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  $.ajax({
    async: false, // fasle表示同步请求，true表示异步请求
    type: 'get',
    dataType: 'json',
    url: '/webFs/serverconfig.json', // 请求地址
    success: function (res) { // 请求成功
      console.log(res)
      baseUrl = res.baseUrl
      mqttServer = res.mqttServer
      mqttPort = res.mqttPort
    },
    error: function (err) { // 请求失败，包含具体的错误信息
      console.log(err)
    }
  })
} else {
  baseUrl = 'http://172.16.63.148:8850'
  mqttServer = '172.16.63.148'
  mqttPort = 2883
}
export default {
  baseUrl,
  mqttServer,
  mqttPort
}
