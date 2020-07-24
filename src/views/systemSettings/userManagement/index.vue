<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg">
        用户管理
      </button>
      <div class="rightBox">
        <el-input v-model="searchInput" class="searchInput">
          <template slot="prepend">用户名：</template>
        </el-input>
        <el-popover
          placement="right"
          width="150"
          trigger="click"
          popper-class="el-popover-more"
          v-model="showMorePopover">
          <div style="text-align: center;">
            <el-button class="popoverBtn" @click="userAdd">新增用户</el-button>
            <el-button class="popoverBtn" @click="userEdit">修改用户</el-button>
            <el-button class="popoverBtn" @click="userDelete">删除用户</el-button>
          </div>
          <button slot="reference" type="button" class="more"><img :src="moreImg"></button>
        </el-popover>
        <button type="button" class="more" @click="download()">
          <img :src="downloadImg">
        </button>
        <button type="button" class="more" @click="refresh()">
          <img :src="refreshImg">
        </button>
        <button type="button" class="more" @click="search()">
          <img :src="searchImg">
        </button>
        <div class="tableBox">
          <el-table @row-click="ClickTableRow" :data="tableData" stripe empty-text="no data" tooltip-effect="light">
            <el-table-column label width="33" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index">{{''}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
            <el-table-column align="center" label="用户姓名" prop="name"></el-table-column>
            <el-table-column align="center" label="所属部门" prop="department"></el-table-column>
            <el-table-column align="center" label="职务" prop="position"></el-table-column>
            <el-table-column align="center" label="所属组织" prop="organization"></el-table-column>
            <el-table-column align="center" label="激活">
              <template slot-scope="scope">
                <el-switch v-model="tableData[scope.$index].active"></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="resetPasswordClick(scope.$index, scope.row)"
                  style="width: 80px;">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageData.total"
          :page-size="pageData.pageSize"
          layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :title="newUserTitle"
      :visible.sync="showNewUser"
      width="30%">
      <el-form ref="newUserFormRef" :model="newUserForm" label-width="80px" :rules="newUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="newUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="newUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-select v-model="newUserForm.job" placeholder="请选择职务">
            <el-option label="职务一" value="1"></el-option>
            <el-option label="职务二" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select v-model="newUserForm.organizations" multiple placeholder="请选择组织">
            <el-option v-for="item in organizationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活">
          <el-switch v-model="newUserForm.active"></el-switch>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="newUserForm.six">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="newUserForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newUserConfirm" style="float: right;">保存</el-button>
          <!-- <el-button>取消</el-button> -->
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showNewUser = false">刷 新</el-button>
      </span> -->
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="showResetPassword"
      width="30%">
      <el-form ref="resetPasswordFormRef" :model="resetPasswordForm" label-width="80px" :rules="resetPasswordRules">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetPasswordForm.password" placeholder="请输入重置密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPasswordConfirm" style="float: right;">保存</el-button>
          <!-- <el-button>取消</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  created () {
    this.pageData.total = this.tableData.length
  },
  data () {
    return {
      searchInput: '',
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      moreImg: require('../../../assets/images/Setting/setting-more.png'),
      downloadImg: require('../../../assets/images/Setting/setting-download.png'),
      searchImg: require('../../../assets/images/Setting/setting-search.png'),
      refreshImg: require('../../../assets/images/Setting/setting-refresh.png'),
      showMorePopover: false, // 展示更多弹窗
      showNewUser: false, // 新建用户弹窗
      showResetPassword: false, // 重置密码弹窗
      pageData: {
        total: 0,
        pageSize: 4
      },
      newUserTitle: '',
      newUserForm: {
        username: '',
        name: '',
        phone: '',
        email: '',
        job: '',
        active: true,
        six: '',
        password: '',
        organizations: []
      },
      organizationOptions: [
        { value: 'val1', label: 'lab1' },
        { value: 'val2', label: 'lab2' },
        { value: 'val3', label: 'lab3' },
        { value: 'val4', label: 'lab4' },
        { value: 'val5', label: 'lab5' }
      ],
      newUserRules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
        ],
        phone: [
          { required: true, message: '请输入手机号' }
        ]
      },
      resetPasswordForm: {
        password: ''
      },
      resetPasswordRules: {
        password: [
          { required: true, message: '请输入密码' }
        ]
      },
      radio: -1,
      tableData: [ // 测试数据
        {
          userName: '王小虎',
          position: '队长',
          department: '炊事班',
          active: true
        },
        {
          userName: '王小虎',
          position: '队长',
          department: '炊事班',
          active: true
        },
        {
          userName: '王小虎',
          position: '队长',
          department: '炊事班',
          active: true
        },
        {
          userName: '王小虎',
          position: '队长',
          department: '炊事班',
          active: true
        },
        {
          userName: '王小虎',
          position: '队长',
          department: '炊事班',
          active: true
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    },
    /**
     * 点击表格行
     */
    ClickTableRow (row) {
      this.radio = this.tableData.indexOf(row)
    },
    resetPasswordClick (index, row) {
      // this.tableData[index]
      this.showResetPassword = true
    },
    search () {
      console.log('search')
    },
    refresh () {
      console.log('refresh')
    },
    download () {
      console.log('download')
    },
    userAdd () {
      this.showMorePopover = false
      this.showNewUser = true
      this.newUserTitle = '新增用户'
    },
    userEdit () {
      this.showMorePopover = false
      if (this.radio < 0) {
        Notification({
          title: '提示',
          message: '请选择用户',
          type: 'warning',
          duration: 5 * 1000
        })
        return ''
      }
      this.showNewUser = true
      this.newUserTitle = '修改用户'
    },
    userDelete () {
      this.showMorePopover = false
      if (this.radio < 0) {
        Notification({
          title: '提示',
          message: '请选择用户',
          type: 'warning',
          duration: 5 * 1000
        })
        return ''
      }
    },
    newUserConfirm () {
      this.$refs.newUserFormRef.validate(async valid => {
        if (!valid) return
        this.showNewUser = false
      })
    },
    resetPasswordConfirm () {
      this.$refs.resetPasswordFormRef.validate(async valid => {
        if (!valid) return
        this.showResetPassword = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    width: 170px;
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
  .rightBox {
    width: 796px;
    height: 682px;
    border: solid 2px #39a4dd;
    border-radius: 10px;
    margin: 30px auto 0 auto;
    .searchInput {
      width: 253px;
      margin: 21px 0px 0px 20px;
      /deep/ .el-input__inner {
        background-color: transparent;
        font-size: 12px;
        color: white;
        border-radius: 0;
        border: 0;
        border-bottom: solid 1px #368fbb;
      }
      /deep/ .el-input-group__prepend {
        background-color: transparent;
        font-size: 12px;
        color: white;
        border-radius: 0;
        border: 0;
        border-bottom: solid 1px #368fbb;
      }
    }
    .more {
      width: 25px;
      height: 25px;
      background-color: transparent;
      outline: none;
      float: right;
      margin: 28px 20px 0px 0px;
      border: 0;
    }
    .tableBox {
      width: 760px;
      height: 598px;
      margin: 12px auto 20px auto;
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

  .popoverBtn {
    background: transparent;
    color: white;
    border: 0;
    margin-left: 0px;
    border-radius: 0px;
  }
</style>
