export const settingApi = {
  queryUserPage: '/cloud-fms/sysuser/queryUserPage', // 设置：用户管理-用户列表
  getRoleList: '/cloud-fms/role/getRoleList', // 查询角色列表
  addUser: '/cloud-fms/sysuser/addUser', // 设置：用户管理-新增用户
  delUser: '/cloud-fms/sysuser/del', // 设置：用户管理-删除用户
  updateUser: '/cloud-fms/sysuser/updateUser', // 设置：用户管理-修改用户
  queryUserDeptPage: '/cloud-fms/sysuser/queryUserDeptPage', // 设置：角色管理-查询用户列表
  getUserDetailById: '/cloud-fms/sysuser/getUserDetailById', // 设置：用户管理-根据id查询用户详细信息
  queryUserList: '/cloud-fms/sysuser/queryUserList', // 设置：角色管理-添加用户-用户列表
  batchUpdateUserRole: '/cloud-fms/sysuser/batchUpdateUserRole', // 设置：角色管理-批量添加用户
  getMenuTree: '/cloud-fms/menu/getMenuTree', // 设置：角色管理-新建角色-菜单列表
  addRole: '/cloud-fms/role/add', // 设置：角色管理-新建角色
  batchUpdateUserDeptCode: '/cloud-fms/sysuser/batchUpdateUserDeptCode', // 设置：组织管理-添加用户
  queryByTypeCode: '/cloud-fms/dict/queryByTypeCode', // 设置：组织管理-获取组织类型
  addDept: '/cloud-fms/dept/add', // 设置：组织管理-新增组织
  updateDept: '/cloud-fms/dept/update', // 设置：组织管理-修改组织
  countDeptUser: '/cloud-fms/sysuser/countDeptUser', // 设置：组织管理-获取未分配组织的用户数量
  queryDevicePage: '/cloud-video/device/queryPage', // 设置：设备接入-分页查询设备列表
  getDistrictList: '/cloud-video/deptAndDevice/getDistrictList', // 设置：设备接入-查询行政区列表
  changeDeviceStatus: '/cloud-video/device/changeDeviceStatus', // 设置：设备接入-修改启用状态
  addGDJK: '/cloud-video/device/addGDJK', // 设置：设备接入-添加高点
  addWRJ: '/cloud-video/device/addWRJ', // 设置：设备接入-添加无人机
  deleteDevice: '/cloud-video/device/delete', // 设置：设备接入-删除设备
  getUsedDeviceCount: '/cloud-video/device/getUsedDeviceCount', //
  getDeviceTree: '/cloud-video/device/getDeviceTree', // 设置：绑定设备-查询组织机构已绑定设备列表和可绑定设备列表
  updateDevice: '/cloud-video/device/updateDevice', // 修改无人机、高点监控设备
  deleteDeviceList: '/cloud-video/device/deleteList', // 批量删除设备
  updateWRJ: '/cloud-video/device/updateWRJ', // 设置：设备接入-修改无人机设备
  updateGDJK: '/cloud-video/device/updateGDJK', // 设置：设备接入-修改高点监控
  deptBandDevice: '/cloud-video/deptAndDevice/deptBandDevice', // 设置：组织绑定设备
  updateUserRole: '/cloud-fms/sysuser/updateUserRole', // 设置：修改用户角色
  deleteDept: '/cloud-fms/dept/del', // 设置：删除组织
  updateUserDept: '/cloud-fms/sysuser/updateUserDept', // 设置：修改用户组织

  baseInfoPicUpload: '/cloud-video/prePlan/enterprise/baseInfoPicUpload', // 预案：上传基本情况说明图片材料
  jzpmtPicUpload: '/cloud-video/prePlan/enterprise/jzpmtPicUpload', // 预案：上传建筑平面图
  addEnterprise: '/cloud-video/prePlan/enterprise/add', // 预案：增加单位
  updateEnterprise: '/cloud-video/prePlan/enterprise/update', // 预案：修改预案
  enterpriseTypeList: '/cloud-video/prePlan/enterprise/typeList', // 预案：获取单位类型集合
  enterpriseList: '/cloud-video/prePlan/list', // 预案：查询预案设置记录列表
  getFullInfoById: '/cloud-video/prePlan/getFullInfoById' // 预案：根据id查询预案完整信息
}
