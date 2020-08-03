
import $ from 'jquery'
let baseUrl = ''
let getMp4RecordFile = ''
let picUrl = ''
let mqttServer = ''
let mqttPort = ''
let imageUrl = ''
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
      getMp4RecordFile = res.getMp4RecordFile
      picUrl = res.picUrl
      mqttServer = res.mqttServer
      mqttPort = res.mqttPort
      imageUrl = res.imageUrl
    },
    error: function (err) { // 请求失败，包含具体的错误信息
      console.log(err)
    }
  })
} else {
  baseUrl = 'http://172.16.63.148:8850'
  getMp4RecordFile = 'http://172.16.63.158:8888'
  picUrl = 'http://172.16.63.158:22222'
  mqttServer = '172.16.63.148'
  mqttPort = 2883
  // imageUrl = 'http://120.24.12.64'
  imageUrl = 'http://172.16.63.148'
}
export default {
  baseUrl,
  getMp4RecordFile,
  picUrl,
  mqttServer,
  mqttPort,
  imageUrl
}
