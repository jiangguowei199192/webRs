
import $ from 'jquery'
let baseUrl = ''
let mqttServer = ''
let mqttPort = ''
let projectTitle = ''
let headImg = ''
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
      headImg = res.headImg
      projectTitle = res.projectTitle
    },
    error: function (err) { // 请求失败，包含具体的错误信息
      console.log(err)
    }
  })
} else {
  // 消防测试环境
  baseUrl = 'http://111.47.13.103:40025'
  mqttServer = '111.47.13.103'
  mqttPort = 40027
  headImg = 'http://111.47.13.103:40031'

  // 消防开发环境
  // baseUrl = 'http://112.74.104.62:8850'
  // mqttServer = '112.74.104.62'
  // mqttPort = 2883
  // headImg = 'http://112.74.104.62:81'

  // 长江大保护
  // baseUrl = 'http://111.47.13.103:40009'
  // mqttServer = '111.47.13.103'
  // mqttPort = 40011
  // headImg = 'http://111.47.13.103:40015'

  // baseUrl = 'http://172.16.63.148:8850'
  // mqttServer = '172.16.63.148'
  // mqttPort = 2883
  // headImg = 'http://172.16.63.148'
  projectTitle = '天地一体化预警侦查系统'
}
export default {
  baseUrl,
  mqttServer,
  mqttPort,
  headImg,
  projectTitle
}
