import $ from 'jquery'
var baseUrl = ''
var mqttServer = ''
var mqttPort = ''
var projectTitle = ''
var headImg = ''
var configJson = ''
console.log(process.env.NODE_ENV)

$.ajax({
  async: false, // fasle表示同步请求，true表示异步请求
  type: 'get',
  dataType: 'json',
  url: '/webFs/serverconfig.json', // 请求地址
  success: function (res) {
    // 请求成功
    configJson = res
  },
  error: function (err) {
    // 请求失败，包含具体的错误信息
    console.log(err)
  }
})

// 没走登录页时，读取本地保存的selectedServerIndex来配置baseUrl
var selectedServerIndex = localStorage.getItem('selectedServerIndex')
if (selectedServerIndex !== null) {
  var selectedData = configJson.baseUrlList[selectedServerIndex]
  baseUrl = selectedData.baseUrl
  mqttServer = selectedData.mqttServer
  mqttPort = selectedData.mqttPort
  headImg = selectedData.headImg
  projectTitle = configJson.projectTitle
}

// if (process.env.NODE_ENV === 'production') {
//   $.ajax({
//     async: false, // fasle表示同步请求，true表示异步请求
//     type: 'get',
//     dataType: 'json',
//     url: '/webFs/serverconfig.json', // 请求地址
//     success: function (res) { // 请求成功
//       console.log(res)
//       baseUrl = res.baseUrl
//       mqttServer = res.mqttServer
//       mqttPort = res.mqttPort
//       headImg = res.headImg
//       projectTitle = res.projectTitle
//     },
//     error: function (err) { // 请求失败，包含具体的错误信息
//       console.log(err)
//     }
//   })
// } else {
//   // 来消防办公，内网地址改外网
//   baseUrl = 'http://111.47.13.103:40009'
//   mqttServer = '111.47.13.103'
//   mqttPort = 40011
//   headImg = 'http://111.47.13.103:40015'
//   // baseUrl = 'http://172.16.63.148:8850'
//   // mqttServer = '172.16.63.148'
//   // mqttPort = 2883
//   // headImg = 'http://172.16.63.148'
//   projectTitle = '武汉市公安局安保防控系统'
// }
export default {
  baseUrl,
  mqttServer,
  mqttPort,
  headImg,
  projectTitle,
  configJson
}
