// 后台管理系统
export const backApi = {
  getDeptTree: '/cloud-fms/dept/getDeptTree', // 查询组织树
  getPeoplePage: '/cloud-fms/employee/selectPage', // 查询人员列表
  addPeople: '/cloud-fms/employee/add', // 新增人员
  peopleInfo: '/cloud-fms/employee/selectDetail', // 查看人员信息
  deletePeople: '/cloud-fms/employee/del', // 批量删除人员
  editPeople: '/cloud-fms/employee/update', // 编辑人员信息
  deleteDept: '/cloud-fms/dept/del', // 删除组织
  addDept: '/cloud-fms/dept/add',
  deptInfo: '/cloud-fms/dept/selectDetail',
  editDept: '/cloud-fms/dept/update',
  getUserList: '/cloud-fms/userManage/selectPage',
  addUser: '/cloud-fms/userManage/add',
  deleteUser: '/cloud-fms/userManage/batchDel',
  resetPassword: '/cloud-fms/userManage/restPassword',
  userInfo: '/cloud-fms/userManage/selectDetail',
  getPermissionTree: '/cloud-fms/role/queryUserRoleTree',
  getRoleList: '/cloud-fms/role/selectPage',
  editUser: '/cloud-fms/userManage/update',
  updateUserStatus: '/cloud-fms/userManage/updateStatus',
  deleteRole: '/cloud-fms/role/batchDel',
  roleInfo: '/cloud-fms/role/queryRoleDetail',
  roleAuth: '/cloud-fms/role/addRoleMenuAuth',
  addRole: '/cloud-fms/role/add',
  editRole: '/cloud-fms/role/update',
  getMenuTree: '/cloud-fms/menu/getMenuTree',
  getMenuTreeByRole: '/cloud-fms/role/queryRoleTreeByCode',
  getTypeDict: '/cloud-fms/dict/queryDictTypeList',
  getResourceListByType: '/cloud-fms/resourcesInfo/selectPage',
  getVideoListByType: '/cloud-video/device/queryPage',
  resourcesAuth: '/cloud-fms/resourcesAuth/add',
  authDetail: '/cloud-fms/resourcesAuth/selectDetail'
}
