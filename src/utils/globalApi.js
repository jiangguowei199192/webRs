let baseUrl = ''
let getMp4RecordFile = ''
let apiFiAndPtz = ''
let picUrl = ''
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  this.$http.get('serverconfig.json').then((result) => {
    baseUrl = result.body.baseUrl
    getMp4RecordFile = result.body.getMp4RecordFile
    apiFiAndPtz = result.body.apiFiAndPtz
    picUrl = result.body.picUrl
  }).catch((error) => { console.log(error) })
} else {
  baseUrl = 'http://172.16.63.148:8850'
  getMp4RecordFile = 'http://172.16.63.29:9999'
  apiFiAndPtz = 'http://172.16.63.29:8888'
  picUrl = 'http://172.16.63.158:22222'
}
export default {
  baseUrl,
  getMp4RecordFile,
  apiFiAndPtz,
  picUrl
}
