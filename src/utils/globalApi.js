// import Vue from 'vue'
import axios from 'axios'
let baseUrl = ''
let getMp4RecordFile = ''
let apiFiAndPtz = ''
let picUrl = ''
async function getApi () {
  const result = await axios.get('/webFs/serverconfig.json')
  baseUrl = result.data.baseUrl
  getMp4RecordFile = result.data.getMp4RecordFile
  apiFiAndPtz = result.data.apiFiAndPtz
  picUrl = result.data.picUrl
}
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  getApi()
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
  picUrl
}
