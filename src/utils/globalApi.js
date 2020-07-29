
import $ from 'jquery'
let baseUrl = ''
let getMp4RecordFile = ''
let apiFiAndPtz = ''
let picUrl = ''
let imageUrl = 'http://120.24.12.64'
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
      apiFiAndPtz = res.getMp4RecordFile
      picUrl = res.picUrl
    },
    error: function (err) { // 请求失败，包含具体的错误信息
      console.log(err)
    }
  })
} else {
  baseUrl = 'http://172.16.63.148:8850'
  getMp4RecordFile = 'http://172.16.63.158:9999'
  apiFiAndPtz = 'http://172.16.63.29:8888'
  picUrl = 'http://172.16.63.158:22222'
}
export default {
  baseUrl,
  getMp4RecordFile,
  apiFiAndPtz,
  picUrl,
  imageUrl
}
