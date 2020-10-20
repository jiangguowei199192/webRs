export const api = {
  getDeptsAndDevicesAxios: '/cloud-video/deptAndDevice/all', // 左侧获取设备列表
  deviceSnap: '/cloud-video/deviceSnap/snap', // 抓拍
  deviceUpdate: '/cloud-video/deviceSnap/update', // 添加抓拍说明文字
  getSnapList: '/cloud-video/deviceSnap/listVr', // 抓拍列表
  deleteSnapList: '/cloud-video/deviceSnap/delete', // 删除图片
  todayAlarm: '/cloud-video/deviceAlarm/list', // 查询今日警情
  getPtzInfo: '/cloud-video/vr/getDevicePtzInfo'
}
