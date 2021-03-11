export const loginApi = {
  login: '/fms-auth-center/login', // 登录
  logout: '/fms-auth-center/logout', // 登出
  getUserDetail: '/cloud-fms/userManage/getUserDetail', // 设置-登录后获取用户详细信息
  getDeptTree: '/cloud-fms/dept/getDeptTree', // 查询组织树
  getDeptByDeptCode: '/cloud-fms/dept/getDeptTreeByDeptCode', // 根据组织编号查询组织树
  updateHeadImg: '/cloud-fms/sysuser/updateHeadImg', // 上传头像
  updateUser: '/cloud-fms/sysuser/updateUser', // 设置-修改用户
  updatePass: '/cloud-fms/sysuser/updatePwd' // 修改用户密码
}
