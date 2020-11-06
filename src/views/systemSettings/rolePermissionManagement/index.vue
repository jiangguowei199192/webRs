<template>
  <div>
      <button type="button" class="back-sty" @click="back">
        <img :src="backImg" />
        角色权限管理
      </button>
      <div class="container1">
        <div class="leftBox">
          <div class="leftTitleStyle">角色列表</div>
          <div style="height: 598px; margin-left: 15px; margin-right: 15px;">
            <el-tree
              ref="roleTree"
              :data="roleList"
              :props="defaultProps"
              node-key="roleCode"
              :current-node-key="selectedRoleCode"
              @node-click="roleTreeClick"
              v-if="selectedRoleCode"
            ></el-tree>
          </div>

          <!-- <div @click="newRole"> -->
          <div>
            <el-button disabled class="newRoleStyle" icon="el-icon-circle-plus">自定义管理角色</el-button>
          </div>
        </div>

        <div class="rightBox">
          <button type="button" class="addUser" @click="addUser">添加用户</button>
          <div class="tableBox">
            <el-table
              @row-click="ClickTableRow"
              :data="userList"
              stripe
              empty-text="暂无数据"
              tooltip-effect="light"
            >
              <el-table-column label width="33" align="center" :resizable="false">
                <template slot-scope="scope">
                  <el-radio v-model="radio" :label="scope.$index">{{''}}</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" label="用户姓名" prop="username"></el-table-column>
              <el-table-column align="center" label="角色" prop="roleName"></el-table-column>
              <el-table-column align="center" label="所属组织" prop="deptName"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteClick(scope.$index, scope.row)"
                    style="width: 55px;"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              class="tablePagination"
              popper-class="pageSelect"
              :total="pageData.total"
              :page-size="pageData.pageSize"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="pageData.currentPage"
              @current-change="currentPageChange"
            ></el-pagination>
          </div>
        </div>
      </div>

    <el-dialog
      title="提示"
      :visible.sync="showDeleteTip"
      :close-on-click-modal="clickfalse"
      width="30%"
      class="dialogStyle"
    >
      <div
        style="height: 50px;"
      >是否从{{ radio >= 0 ? userList[radio].roleName : '' }}角色中移除用户{{ radio >= 0 ? userList[radio].username : '' }}</div>
      <div style="height: 30px;">
        <el-button type="primary" @click="deleteTipSave" class="trueBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加用户"
      :visible.sync="showAddUser"
      :close-on-click-modal="clickfalse"
      width="30%"
      class="dialogStyle"
    >
      <el-form ref="addUserFormRef" :model="addUserForm" label-width="80px" :rules="addUserRules">
        <el-form-item label="选择用户" prop="user">
          <el-select
            v-model="addUserForm.user"
            multiple
            :popper-append-to-body="false"
            placeholder="请选择用户"
            class="selectStyle"
            popper-class="select-popper"
          >
            <el-option
              v-for="item in addUser_userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserConfirm" class="trueBtn">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="新建角色"
      :visible.sync="showNewRole"
      :close-on-click-modal="clickfalse"
      width="30%"
      class="dialogStyle"
    >
      <el-form ref="newRoleFormRef" :model="newRoleForm" label-width="80px" :rules="newRoleRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="newRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="tag">
          <el-input v-model="newRoleForm.tag"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" prop="message">
          <el-input v-model="newRoleForm.message"></el-input>
        </el-form-item>
        <el-form-item label="初始权限" prop="permission">
          <el-cascader
            placeholder
            :options="permissionOptions"
            :props="permissionProps"
            collapse-tags
            class="cascaderStyle"
            v-model="newRoleForm.permission"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newRoleConfirm" class="trueBtn">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { settingApi } from '@/api/setting'
import { Notification } from 'element-ui'

export default {
  created () {
    this.getRoleList()
  },
  data () {
    var isNumber = (rule, value, callback) => {
      if (!Number(value)) {
        callback(new Error('请输入数字'))
      }
      callback()
    }

    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),

      roleList: [],
      defaultProps: {
        label: 'roleName'
      },

      userList: [],
      pageData: {
        total: 0, // 总条目数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页
      },
      selectedRoleCode: null,

      radio: -1,
      showDeleteTip: false,

      showAddUser: false,
      addUserForm: {
        user: []
      },
      addUserRules: {
        user: [{ required: true, message: '请选择用户' }]
      },
      addUser_userList: [],

      clickfalse: false,
      permissionProps: {
        // checkStrictly: true,
        emitPath: false,
        multiple: true,
        label: 'menuName',
        value: 'id',
        children: 'children'
      },
      showNewRole: false,
      newRoleForm: {
        name: '',
        tag: null,
        message: '',
        permission: []
      },
      newRoleRules: {
        name: [{ required: true, message: '请输入名称' }],
        tag: [
          { required: true, message: '请输入标识' },
          { validator: isNumber, trigger: 'blur' }
        ],
        permission: [{ required: true, message: '请选择权限' }]
      },
      permissionOptions: []
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },
    // 获取角色列表
    async getRoleList () {
      this.$axios.post(settingApi.getRoleList).then((res) => {
        if (res.data.code === 0) {
          this.roleList = res.data.data
          this.selectedRoleCode = res.data.data[0].roleCode
          this.getUserList()
        }
      })
    },
    // 获取用户列表
    async getUserList () {
      var param = {
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        roleCode: this.selectedRoleCode
      }
      this.$axios.post(settingApi.queryUserDeptPage, param).then((res) => {
        if (res.data.code === 0) {
          this.userList = res.data.data.records
          this.pageData.total = res.data.data.total
        }
      })
    },
    // 分页页数改变
    currentPageChange () {
      this.getUserList()
    },
    // 点击表格行
    ClickTableRow (row) {
      this.radio = this.userList.indexOf(row)
    },
    // 选择角色
    roleTreeClick (item) {
      this.selectedRoleCode = item.roleCode
      this.getUserList()
    },

    // 移除用户
    deleteClick (index, row) {
      this.showDeleteTip = true
    },
    // 移除用户-确定
    deleteTipSave () {
      this.showDeleteTip = false

      var param = {
        id: this.userList[this.radio].id,
        roleCode: null
      }
      this.$axios
        .post(settingApi.updateUser, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.getUserList()
            Notification({
              title: '提示',
              message: '移除成功',
              type: 'success',
              duration: 5 * 1000
            })
            return
          }
          Notification({
            title: '提示',
            message: '移除失败',
            type: 'warning',
            duration: 5 * 1000
          })
        })
    },

    // 添加用户
    async addUser () {
      if (this.$refs.addUserFormRef) {
        this.$refs.addUserFormRef.resetFields()
      }

      var param = {}
      this.$axios.post(settingApi.queryUserList, param).then((res) => {
        if (res.data.code === 0) {
          this.addUser_userList = res.data.data
          this.showAddUser = true
        }
      })
    },
    // 添加用户-保存
    addUserConfirm () {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return
        this.showAddUser = false

        // console.log(this.addUserForm.user)
        var param = []
        this.addUserForm.user.forEach((item) => {
          var temp = {
            id: item,
            roleCode: this.selectedRoleCode
          }
          param.push(temp)
        })

        this.$axios
          .post(settingApi.batchUpdateUserRole, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.getUserList()
              Notification({
                title: '提示',
                message: '添加成功',
                type: 'success',
                duration: 5 * 1000
              })
              return
            }

            Notification({
              title: '提示',
              message: '添加失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
      })
    },

    // 新建角色
    newRole () {
      if (this.$refs.newRoleFormRef) {
        this.$refs.newRoleFormRef.resetFields()
      }

      this.$axios.post(settingApi.getMenuTree).then((res) => {
        if (res.data.code === 0) {
          var temp = res.data.data
          // 一级
          temp.forEach((item) => {
            if (item.children) {
              if (item.children.length <= 0) {
                item.children = null
              } else {
                // 二级
                var temp2 = item.children
                temp2.forEach((item2) => {
                  if (item2.children) {
                    if (item2.children.length <= 0) {
                      item2.children = null
                    } else {
                      // 三级
                      var temp3 = item2.children
                      temp3.forEach((item3) => {
                        if (item3.children) {
                          if (item3.children.length <= 0) {
                            item3.children = null
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
          this.permissionOptions = temp
          this.showNewRole = true
        }
      })
    },
    // 新建角色-保存
    async newRoleConfirm () {
      this.$refs.newRoleFormRef.validate(async (valid) => {
        if (!valid) return
        this.showNewRole = false

        var param = {
          roleName: this.newRoleForm.name,
          roleCode: this.newRoleForm.tag,
          menuIds: this.newRoleForm.permission,
          roleDescribe: this.newRoleForm.message
        }
        this.$axios
          .post(settingApi.addRole, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res.data.code === 0) {
              this.getRoleList()
              Notification({
                title: '提示',
                message: '新建角色成功',
                type: 'success',
                duration: 5 * 1000
              })
              return
            }

            Notification({
              title: '提示',
              message: '新建角色失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.back-sty {
  width: 150px;
  height: 36px;
  border: none;
  font-size: 18px;
  color: #ffffff;
  outline: none;
  display: block;
  background: url("../../../assets/images/plan/plan-back-background.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 30px;
  margin-left: 30px;
  cursor: pointer;
}

.container1 {
  width: 1048px;
  height: 685px;
  margin: 50px auto 0 auto;
}
.leftBox {
  width: 220px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  float: left;
  overflow: hidden;
  .leftTitleStyle {
    height: 42px;
    line-height: 42px;
    margin-left: 22px;
    margin-right: 22px;
    font-size: 16px;
  }
  .newRoleStyle {
    width: 100%;
    height: 42px;
    background-color: transparent;
    border: none;
    border-radius: 0;
    color: #20b1dc;
    font-size: 14px;
  }
}
.rightBox {
  width: 796px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  margin-left: 24px;
  float: left;
  .addUser {
    width: 75px;
    height: 25px;
    border: solid 1px #39a4dd;
    font-size: 12px;
    color: #ffffff;
    background-color: transparent;
    outline: none;
    display: block;
    float: right;
    margin: 21px 18px 0px 0px;
    cursor: pointer;
  }
  .tableBox {
    width: 760px;
    height: 598px;
    margin: 58px auto 20px auto;
  }
}
.el-table::before {
  height: 0px;
}
.el-table {
  color: white;
  font-size: 14px;
  background-color: transparent;
  /* 表格表头样式 */
  /deep/.el-table__header-wrapper th {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    height: 26px;
    padding: 0;
    background-color: rgba(54, 143, 187, 1);
  }
  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
  }
  /deep/.el-table__body tr {
    background-color: rgba(51, 105, 132, 1);
  }
  /* 鼠标hover每行的样式*/
  /deep/.el-table__body tr:hover > td {
    background-color: rgba(51, 105, 132, 1);
  }
  /deep/td,
  /deep/th {
    border: none;
  }
  //单选框样式
  /deep/ .el-radio__inner {
    border: 1px solid rgba(255, 255, 255, 1);
    background: transparent;
  }

  //单选框选中样式
  /deep/ .el-radio__input.is-checked .el-radio__inner::after {
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 1);
  }
}
/* 修改偶数行颜色*/
/deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(54, 143, 187, 1);
}
/* 树形列表 */
/deep/.el-tree {
  color: #23cefd;
  background-color: transparent;
  .el-tree-node {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .el-tree-node__content {
      height: 35px;
      line-height: 35px;
      border: 1px solid transparent;
    }
    .el-tree-node__content:hover,
    .el-tree-node:focus > .el-tree-node__content {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .el-tree-node__expand-icon {
      color: #23cefd;
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
}
/deep/ .el-tree-node.is-current > .el-tree-node__content {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white;
}

.dialogStyle {
  min-width: 1500px;
  /deep/.el-dialog__header {
    // 头部
    background-color: #39a4dd;
  }
  /deep/.el-dialog__title {
    // 头部-标题
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    // 内部
    background-color: #336984;
    color: white;
  }
  /deep/.el-dialog__footer {
    // 尾部
    background-color: #336984;
  }
  /deep/.el-icon-close:before {
    // 头部-关闭
    color: white;
  }
  .trueBtn {
    // 按钮
    background-color: #1eb0fc;
    font-size: 14px;
    color: white;
    width: 66px;
    height: 30px;
    padding: 0;
    float: right;
  }
  /deep/.el-input__inner {
    // 输入框
    color: white;
    background-color: #3688b1;
    border: none;
  }
  /deep/.el-form-item__label {
    // label
    color: white;
  }
  .el-radio {
    color: white;
  }
  .selectStyle {
    width: 80%;
    // 下拉框
    // /deep/.el-input__inner {
    //   font-size: 12px;
    // }
    // /deep/.select-popper {
    //   background-color: #3688b1;
    //   font-size: 12px;
    //   color: white;
    //   border: none;
    //   .el-select-dropdown__item.selected {
    //     background-color: #3688b1;
    //   }
    //   .el-select-dropdown__item {
    //     font-size: 12px;
    //     color: white;
    //   }
    //   .el-select-dropdown__item.hover {
    //     background-color: #3688b1;
    //   }
    //   .popper__arrow {
    //     border-bottom-color: #3688b1;
    //   }
    //   .popper__arrow::after {
    //     border-bottom-color: #3688b1;
    //   }
    // }
  }
}

.cascaderStyle {
  // width: 300px;
  /deep/.el-cascader__search-input {
    background: transparent;
    color: white;
  }
}
</style>
