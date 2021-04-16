<template>
  <div>
    <div class="title">用户权限 / 用户管理</div>
    <div class="left-div">
      <div class="left-title">组织机构树</div>
      <el-input
        class="institution-search-input"
        suffix-icon="el-icon-search"
        v-model="institutionSearch"
        placeholder=""
      ></el-input>
      <el-tree
        ref="userDeptTreeRef"
        :data="deptTree"
        :props="{
          children: 'children',
          label: 'deptName',
          value: 'deptCode',
        }"
        default-expand-all
        @node-click="deptTreeClick"
        :expand-on-click-node="false"
        node-key="id"
        :current-node-key="selectedDept.id"
        v-if="selectedDept.id"
        class="dept-tree"
        :filter-node-method="filterNode"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="right-div">
      <div class="right-title">用户列表</div>
      <div class="search-tool">
        <div class="role-status-text" style="margin-left: 10px">用户状态</div>
        <el-select
          v-model="userStatusSearch"
          class="role-status-select"
          @change="userStatusClick"
        >
          <el-option
            v-for="item in userStatusOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          class="people-search-input"
          v-model="userNameSearch"
          placeholder="请输入用户名/账号进行搜索"
        ></el-input>
        <div class="people-search-btn" @click="userNameClick">
          <img :src="userSearchIcon" class="people-search-icon" />
          <span class="people-search-text">查询</span>
        </div>
        <div class="people-reset-btn" @click="userResetClick">
          <img :src="peopleResetIcon" class="people-reset-icon" />
          <span class="people-reset-text">重置</span>
        </div>
      </div>
      <div class="operate-table-tool">
        <span class="selected-count"
          >已选<span style="color: #1eb0fc">{{ selectedUsers.length }}</span
          >项</span
        >
        <div class="delete-btn" @click="deleteUserClick">批量删除</div>
        <div class="add-btn" @click="addUserClick">添加</div>
      </div>

      <el-table
        class="manageTable"
        :data="userList"
        empty-text="暂无数据"
        height="630"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="账号"
          prop="useraccount"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="联系方式"
          prop="mobile"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="关联角色数"
          prop="roleCode"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="绑定人员"
          prop="employeeName"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="排序"
          prop="userSort"
          align="center"
        ></el-table-column>
        <el-table-column label="账号状态" prop="" align="center">
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.enable"
                active-color="#1EB0FC"
                inactive-color="#aeaeae"
                @change="userEnableSwitch(scope.row)"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="table-btn" @click="editUserClick(scope.row)">修改</div>
            <div
              class="table-btn table-btn-see"
              @click="seeUserClick(scope.row)"
            >
              查看
            </div>
            <div
              class="table-btn table-btn-edit-password"
              @click="resetPasswordClick(scope.row)"
            >
              重置密码
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageTotal"
          :page-size="pageSize"
          :page-sizes="[15, 30, 50, 100]"
          :current-page.sync="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="currentPageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>

    <AddUserDialog
      :isShow.sync="showAddUser"
      title="新增用户"
      :deptTree="deptTree"
      :roleList="roleList"
      :selectedDept="selectedDept"
      :isAddUser="isAddUser"
      @close="showAddUser = false"
      @confirmClick="addUserConfirmClick"
      @cancelClick="showAddUser = false"
    ></AddUserDialog>

    <AddUserDialog
      :isShow.sync="showEditUser"
      title="修改用户"
      :deptTree="deptTree"
      :roleList="roleList"
      :userInfo="currentUserDetail"
      :isAddUser="isAddUser"
      @close="showEditUser = false"
      @confirmClick="editUserConfirmClick"
      @cancelClick="showEditUser = false"
    ></AddUserDialog>

    <DeleteDialog
      :isShow.sync="showDeleteUser"
      @close="showDeleteUser = false"
      @confirmClick="deleteUserConfirmClick"
      @cancelClick="showDeleteUser = false"
    ></DeleteDialog>

    <UserInfoDialog
      :isShow.sync="showUserInfo"
      :userInfo="currentUserDetail"
      @close="showUserInfo = false"
      @confirmClick="showUserInfo = false"
    ></UserInfoDialog>

    <ResetPasswordDialog
      :isShow.sync="showResetPassword"
      @close="showResetPassword = false"
      @confirmClick="resetPasswordConfirmClick"
      @cancelClick="showResetPassword = false"
    ></ResetPasswordDialog>
  </div>
</template>

<script>
import AddUserDialog from './components/addUserDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import UserInfoDialog from './components/userInfoDialog.vue'
import ResetPasswordDialog from './components/resetPasswordDialog.vue'
import { backApi } from '@/api/back'
import { Notification } from 'element-ui'

export default {
  components: {
    AddUserDialog,
    DeleteDialog,
    UserInfoDialog,
    ResetPasswordDialog
  },
  watch: {
    institutionSearch (val) {
      this.$refs.userDeptTreeRef.filter(val)
    }
  },
  data () {
    return {
      userSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),

      institutionSearch: '',
      deptTree: [],
      selectedDept: '',

      userStatusOptions: [
        { id: 2, label: '全部' },
        { id: 1, label: '有效' },
        { id: 0, label: '无效' }
      ],
      userStatusSearch: '',

      userNameSearch: '',
      userList: [],
      selectedUsers: [],

      pageTotal: 0,
      pageSize: 15,
      currentPage: 1,

      showAddUser: false,
      showDeleteUser: false,
      showEditUser: false,
      showUserInfo: false,
      showResetPassword: false,

      currentUser: '',
      currentUserDetail: '',
      roleList: '',
      isAddUser: false // 是否是新增用户
    }
  },
  created () {
    this.getDeptTree()
    this.getRoleList()
  },
  methods: {
    async getDeptTree () {
      const _this = this
      this.$axios.post(backApi.getDeptTree).then((res) => {
        if (res && res.data && res.data.code === 0) {
          _this.deptTree = this.handleDeptTree(res.data.data)
          if (_this.deptTree.length > 0) {
            _this.selectedDept = _this.deptTree[0]
            _this.getUserList()
          }
        }
      })
    },
    // children为" "时置为null
    handleDeptTree (tree) {
      tree.forEach((item) => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return tree
    },

    // 获取用户列表
    async getUserList () {
      var param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: this.userStatusSearch === 2 ? '' : this.userStatusSearch,
        searchContent: this.userNameSearch,
        deptCode: this.selectedDept.deptCode
      }
      const _this = this
      this.$axios
        .post(backApi.getUserList, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            res.data.data.records.forEach((item) => {
              if (item.status === 0) {
                item.enable = false
              } else {
                item.enable = true
              }
            })
            _this.userList = res.data.data.records
            _this.pageTotal = res.data.data.total
          }
        })
    },

    // 搜索机构时触发
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.deptName.indexOf(value) !== -1
    },

    deptTreeClick (item) {
      this.selectedDept = item
      this.currentPage = 1
      this.userNameSearch = ''
      this.getUserList()
    },

    userStatusClick () {
      this.currentPage = 1
      this.getUserList()
    },

    // 根据姓名、身份证号查询
    userNameClick () {
      this.currentPage = 1
      this.getUserList()
    },

    // 重置搜索项时触发
    userResetClick () {
      this.currentPage = 1
      this.userStatusSearch = ''
      this.userNameSearch = ''
      this.getUserList()
    },

    // 多选时触发
    handleSelectionChange (items) {
      this.selectedUsers = items
    },

    // 查看用户详情时触发
    async seeUserClick (row) {
      const param = { id: row.id }
      const _this = this
      this.$axios
        .post(backApi.userInfo, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.currentUserDetail = res.data.data
            _this.showUserInfo = true
          }
        })
    },

    // 重置密码时触发
    resetPasswordClick (row) {
      this.currentUser = row
      this.showResetPassword = true
    },

    // 重置密码确认时触发
    async resetPasswordConfirmClick () {
      this.showResetPassword = false
      const param = { id: this.currentUser.id }
      this.$axios.post(backApi.resetPassword, param).then((res) => {
        if (res && res.data && res.data.code === 0) {
          Notification({
            title: '提示',
            message: '操作成功',
            type: 'success',
            duration: 2 * 1000
          })
        }
      })
    },

    // 切换分页时触发
    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getUserList()
    },

    sizeChange (size) {
      this.pageSize = size
      this.getUserList()
    },

    async getRoleList () {
      const param = {
        currentPage: 1,
        pageSize: 10000
      }
      const _this = this
      this.$axios
        .post(backApi.getRoleList, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.roleList = res.data.data.records
          }
        })
    },

    // 添加用户时触发
    addUserClick () {
      this.isAddUser = true
      this.showAddUser = true
    },

    // 添加用户确认时触发
    async addUserConfirmClick (form) {
      this.showAddUser = false
      // console.log(form)
      const param = {
        deptCode: form.dept,
        status: form.status,
        useraccount: form.account,
        username: form.username,
        employeeId: form.people,
        expireTime: form.dueToTime,
        mobile: form.phone,
        roleCode: form.roles.length ? form.roles.join() : null,
        userSort: form.num
      }
      const _this = this
      this.$axios
        .post(backApi.addUser, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.currentPage = 1
            _this.getUserList()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 删除用户时触发
    deleteUserClick () {
      if (this.selectedUsers.length <= 0) {
        Notification({
          title: '提示',
          message: '请选择人员',
          type: 'warning',
          duration: 2 * 1000
        })
        return
      }
      this.showDeleteUser = true
    },

    // 删除用户确认时触发
    async deleteUserConfirmClick () {
      this.showDeleteUser = false
      var userIds = []
      this.selectedUsers.forEach((item) => {
        userIds.push(item.id)
      })
      const param = { ids: userIds }
      const _this = this
      this.$axios
        .post(backApi.deleteUser, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.getUserList()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    async userEnableSwitch (row) {
      // console.log(row)
      const param = {
        id: row.id,
        status: row.enable ? 1 : 0
      }
      this.$axios
        .post(backApi.updateUserStatus, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    },

    // 修改用户时触发
    async editUserClick (row) {
      const param = { id: row.id }
      const _this = this
      this.$axios
        .post(backApi.userInfo, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.currentUserDetail = res.data.data
            _this.isAddUser = false
            _this.showEditUser = true
          }
        })
    },

    // 修改用户确认时触发
    async editUserConfirmClick (form, userInfo) {
      this.showEditUser = false
      // console.log(form)
      const param = {
        username: form.username,
        mobile: form.phone,
        deptCode: form.dept,
        roleCode: form.roles.join(),
        status: form.status,
        expireTime: form.dueToTime,
        employeeId: form.people,
        id: userInfo.id,
        userSort: form.num
      }
      const _this = this
      this.$axios
        .post(backApi.editUser, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            _this.getUserList()
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 2 * 1000
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title {
  height: 54px;
  font-size: 16px;
  line-height: 54px;
  margin: 0 30px;
}
.left-div {
  float: left;
  width: 280px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  margin-left: 30px;
  padding: 0 10px;
  .left-title {
    color: #fff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .institution-search-input {
    width: 278px;
    margin-top: 4px;
    display: block;
    /deep/.el-input__inner {
      background: #09546d;
      border-color: #1eb0fc;
      border-radius: 0;
      color: white;
    }
    /deep/.el-icon-search {
      color: #c5f3ff;
    }
  }
  .dept-tree {
    height: 696px;
    overflow: auto;
    margin-top: 15px;
    background-color: transparent;
    color: #ffffff;
    /deep/.el-tree-node {
      .el-tree-node__content {
        // display: block !important;
        height: 30px;
        line-height: 30px;
        border: 1px solid transparent;
        background-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-tree-node__label {
        font-size: 13px;
      }
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(15, 95, 134, 0.5) !important;
      }

      // 展开折叠图标
      .el-tree-node__expand-icon.expanded {
        // 动画取消
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      .el-icon-caret-right:before {
        // 收起
        content: url("../../assets/images/backgroundManagement/deptTreeUnfold.png");
      }
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        // 展开
        content: url("../../assets/images/backgroundManagement/deptTreeFold.png");
      }
      .el-tree-node__expand-icon.is-leaf::before {
        display: none;
      }
    }
    /deep/ .el-tree-node.is-current > .el-tree-node__content {
      background: rgba(15, 95, 134, 0.5) !important;
      color: #1eb0fc;
    }
  }
}

.right-div {
  min-width: 900px;
  height: 804px;
  background-color: rgba(0, 65, 87, 0.85);
  margin: 0 30px 0 360px;
  padding: 0 14px;
  position: relative;
  .right-title {
    color: #fff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .search-tool {
    height: 34px;
    margin-top: 4px;
    display: flex;
    justify-content: flex-start;
    .role-status-text {
      color: #fff;
      font-size: 16px;
    }
    .role-status-select {
      width: 150px;
      margin-left: 17px;
      vertical-align: top;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-input {
      width: 450px;
      vertical-align: top;
      margin-left: 10px;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-btn {
      width: 80px;
      height: 34px;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      .people-search-icon {
        margin-top: 5px;
      }
      .people-search-text {
        vertical-align: top;
        margin-left: 5px;
      }
    }
    .people-reset-btn {
      width: 80px;
      height: 34px;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      cursor: pointer;
      .people-reset-icon {
        margin-top: 8px;
      }
      .people-reset-text {
        vertical-align: top;
        margin-left: 5px;
      }
    }
  }
  .operate-table-tool {
    height: 53px;
    .selected-count {
      float: left;
      margin: 18px 0 0 10px;
      font-size: 16px;
    }
    .delete-btn {
      float: right;
      width: 96px;
      height: 30px;
      margin-top: 10px;
      background-color: #ff0000;
      color: #fff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
    .add-btn {
      float: right;
      margin-right: 12px;
      margin-top: 10px;
      width: 54px;
      height: 30px;
      background-color: #1eb0fc;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .pagination-wrap {
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, 0%);
    .tablePagination {
      height: 35px;
      line-height: 35px;
      // margin-top: 35px;
    }
  }
  .manageTable.el-table {
    height: 670px !important;
    /deep/.el-table__body-wrapper {
      height: 550px !important;
    }
  }
}
/deep/::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
.table-btn {
  width: 40px;
  height: 26px;
  background-color: #0b779e;
  color: #fefefe;
  font-size: 14px;
  line-height: 26px;
  display: inline-block;
  cursor: pointer;
}
.table-btn-see {
  margin-left: 10px;
}
.table-btn-edit-password {
  margin-left: 10px;
  width: 66px;
}
</style>
