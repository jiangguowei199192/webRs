<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg">
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
              @node-click="roleTreeClick">
            </el-tree>
          </div>

          <div @click="newRole">
            <el-button class="newRoleStyle" icon="el-icon-circle-plus">自定义管理角色</el-button>
          </div>
        </div>

        <div class="rightBox">
          <button type="button" class="addUser" @click="addUser">添加用户</button>
          <div class="tableBox">

            <el-table @row-click="ClickTableRow" :data="userList" stripe empty-text="no data" tooltip-effect="light">
              <el-table-column label width="33" align="center" :resizable="false">
                <template slot-scope="scope">
                  <el-radio v-model="radio" :label="scope.$index">{{''}}</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" label="用户" prop="username"></el-table-column>
              <el-table-column align="center" label="角色" prop="roleName"></el-table-column>
              <el-table-column align="center" label="所属组织" prop="deptName"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteClick(scope.$index, scope.row)"
                    style="width: 55px;">移除</el-button>
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
            @current-change="currentPageChange">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="showDeleteTip"
      width="30%">
      是否从系统管理员角色中移除用户 {{ radio >= 0 ? tableData[radio].userName : '' }}
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDeleteTip = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加用户"
      :visible.sync="showAddUser"
      width="30%">
      <el-form ref="addUserFormRef" :model="addUserForm" label-width="80px" :rules="addUserRules">
        <el-form-item label="选择用户" prop="user">
          <el-select v-model="addUserForm.user" multiple placeholder="请添加用户">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserConfirm" style="float: right;">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="新建角色"
      :visible.sync="showNewRole"
      width="30%">
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
          <el-select v-model="newRoleForm.permission" multiple>
            <el-option v-for="item in permissionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newRoleConfirm" style="float: right;">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { settingApi } from '@/api/setting'

export default {
  created () {
    this.getRoleList()
    this.getUserList()
  },
  data () {
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
      selectedRoleCode: 2001,

      radio: -1,
      showDeleteTip: false,
      showAddUser: false,
      addUserForm: {
        user: []
      },
      addUserRules: {
        user: [
          { required: true, message: '请添加用户' }
        ]
      },
      userOptions: [
        { value: 'val1', label: 'lab1' },
        { value: 'val2', label: 'lab2' },
        { value: 'val3', label: 'lab3' },
        { value: 'val4', label: 'lab4' },
        { value: 'val5', label: 'lab5' }
      ],
      showNewRole: false,
      newRoleForm: {
        name: '',
        tag: '',
        message: '',
        permission: []
      },
      newRoleRules: {
        name: [
          { required: true, message: '请输入名称' }
        ],
        tag: [
          { required: true, message: '请输入标识' }
        ],
        message: [
          { required: true, message: '请输入角色备注' }
        ]
      },
      permissionOptions: [
        { value: 'val1', label: 'lab1' },
        { value: 'val2', label: 'lab2' },
        { value: 'val3', label: 'lab3' },
        { value: 'val4', label: 'lab4' },
        { value: 'val5', label: 'lab5' }
      ]
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
      this.$axios.post(settingApi.queryUserDeptPage, param).then(res => {
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
    // 选择角色
    roleTreeClick (item) {
      console.log(item)
      this.selectedRoleCode = item.roleCode
      this.getUserList()
    },

    // 点击添加用户
    addUser () {
      this.showAddUser = true
    },
    // 点击表格行
    ClickTableRow (row) {
      this.radio = this.tableData.indexOf(row)
    },
    // 移除用户
    deleteClick (index, row) {
      this.showDeleteTip = true
    },
    // 新建角色
    newRole () {
      this.showNewRole = true
    },
    // 添加用户-保存
    addUserConfirm () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        this.showAddUser = false
      })
    },
    // 新建角色-保存
    newRoleConfirm () {
      this.$refs.newRoleFormRef.validate(async valid => {
        if (!valid) return
        this.showNewRole = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    width: 150px;
    height: 40px;
    border: solid 1px #39a4dd;
    font-size: 18px;
    color: #ffffff;
    background-color: transparent;
    outline: none;
    display: block;
  }
  .container {
    width: 1242px;
    height: 756px;
    margin: 55px auto 0 auto;
  }
  .container1 {
    width: 1048px;
    height: 685px;
    margin: 30px auto 0 auto;
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
      .el-tree-node:focus > .el-tree-node__content {
        border: 1px solid #23cefd;
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
    background:rgba(255, 255, 255, 0.1)!important;
    color: white;
  }
</style>
