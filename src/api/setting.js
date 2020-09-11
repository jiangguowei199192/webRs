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

  baseInfoPicUpload: '/cloud-video/prePlan/enterprise/baseInfoPicUpload', // 预案：上传基本情况说明图片材料
  jzpmtPicUpload: '/cloud-video/prePlan/enterprise/jzpmtPicUpload', // 预案：上传建筑平面图
  addEnterprise: '/cloud-video/prePlan/enterprise/add', // 预案：增加单位
  enterpriseTypeList: '/cloud-video/prePlan/enterprise/typeList', // 预案：获取单位类型集合
  enterpriseList: '/cloud-video/prePlan/list', // 预案：查询预案设置记录列表
  getFullInfoById: '/cloud-video/prePlan/getFullInfoById' // 预案：根据id查询预案完整信息
}
