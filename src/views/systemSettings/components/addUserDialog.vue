<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="add-people-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
    </div>
    <el-form
      ref="adduserRef"
      :model="addUserForm"
      :rules="addUserRules"
      :inline="true"
      class="add-people-form"
    >
      <el-form-item label="用户名 :" prop="username">
        <el-input
          v-model="addUserForm.username"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号 :" prop="account">
        <el-input
          v-model="addUserForm.account"
          placeholder="请输入"
          :disabled="accountDisable"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式 :" prop="phone">
        <el-input v-model="addUserForm.phone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="用户层级 :" prop="dept">
        <el-cascader
          v-model="addUserForm.dept"
          :options="deptTree"
          :props="{
            expandTrigger: 'hover',
            label: 'deptName',
            value: 'deptCode',
            checkStrictly: true,
            emitPath: false
          }"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="关联角色 :" prop="roles">
        <el-select
          v-model="addUserForm.roles"
          :popper-append-to-body="false"
          placeholder="请选择"
          multiple
          class="role-sel"
        >
          <el-option
            v-for="item in roleList"
            :key="item.roleCode"
            :label="item.roleName"
            :value="item.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态 :" prop="status">
        <el-select
          v-model="addUserForm.status"
          :popper-append-to-body="false"
          placeholder="请选择"
        >
          <el-option
            v-for="item in userStatusTypes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="到期时间 :" prop="dueToTime">
        <el-date-picker
          v-model="addUserForm.dueToTime"
          type="date"
          placeholder="请选择"
          value-format="timestamp"
          style="width: 150px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排序 :" prop="num">
        <el-input v-model="addUserForm.num" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="绑定人员 :" prop="people">
        <el-select
          v-model="addUserForm.people"
          :popper-append-to-body="false"
          placeholder="请选择"
        >
          <el-option
            v-for="item in unbindPeopleList"
            :key="item.id"
            :label="item.employeeName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">确定</div>
      <div class="cancel-btn" @click="cancelClick">取消</div>
    </div>
  </el-dialog>
</template>

<script>
import { numberValidate, checkPhone } from '@/utils/formRules'

export default {
  props: [
    'isShow',
    'title',
    'deptTree',
    'unbindPeopleList',
    'roleList',
    'userInfo',
    'selectedDept'
  ],
  watch: {
    isShow (newS) {
      if (!newS) {
        if (this.$refs.adduserRef) {
          this.$refs.adduserRef.resetFields()
        }
      } else if (this.selectedDept) {
        this.addUserForm.dept = this.selectedDept.deptCode
      }
    },

    userInfo (newUserInfo) {
      if (newUserInfo) {
        this.addUserForm.username = newUserInfo.username
        this.addUserForm.account = newUserInfo.useraccount
        this.addUserForm.phone = newUserInfo.mobile
        this.addUserForm.dept = newUserInfo.deptCode

        if (newUserInfo.roles) {
          var roleArr = []
          newUserInfo.roles.forEach(role => {
            roleArr.push(role.roleCode)
          })
          this.addUserForm.roles = roleArr
        }

        this.addUserForm.status = newUserInfo.status
        this.addUserForm.dueToTime = newUserInfo.expireTime
        this.addUserForm.num = newUserInfo.userSort
        this.addUserForm.people = newUserInfo.employeeId
      }
    }
  },
  data () {
    return {
      accountDisable: false,
      addUserForm: {
        username: '',
        account: '',
        phone: '',
        dept: '',
        roles: '',
        status: '',
        dueToTime: '',
        num: '',
        people: ''
      },
      addUserRules: {
        username: [{ required: true, message: '请输入' }],
        account: [{ required: true, message: '请输入' }],
        status: [{ required: true, message: '请选择' }],
        dept: [{ required: true, message: '请选择' }],
        num: numberValidate('请输入数字'),
        phone: [checkPhone()]
      },
      userStatusTypes: [
        { id: 0, label: '无效' },
        { id: 1, label: '有效' }
      ],
      userLevel: []
    }
  },
  created () {
    if (this.title === '修改用户') {
      this.accountDisable = true
    }
    if (this.title === '新增用户') {
      this.accountDisable = false
    }
  },
  methods: {
    confirmClick () {
      this.$refs.adduserRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.$emit('confirmClick', this.addUserForm, this.userInfo)
      })
    },

    cancelClick () {
      this.$emit('cancelClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-people-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 520px;
    background-color: transparent;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: rgba(0, 65, 87, 0.85);
      .add-people-header {
        height: 40px;
        border-bottom: 1px solid #1eb0fc;
        .header-icon {
          display: inline-block;
          width: 19px;
          height: 16px;
          background-image: url("../../../assets/images/fire_title.png");
          background-size: 100% 100%;
          margin-top: 15px;
        }
        .header-text {
          display: inline-block;
          vertical-align: top;
          margin-top: 13px;
          margin-left: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
    .add-people-form {
      margin-top: 35px;
      .el-input__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 150px;
        height: 24px;
        color: #fff;
        font-size: 12px;
      }
      .role-sel {
        .el-input__inner {
          width: 408px;
          height: 24px !important;
        }
      }
      .el-form-item {
        margin-top: -20px;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
        width: 100px;
      }
      .el-form-item__error {
        margin-top: -10px;
      }
    }
    .note {
      margin-top: 20px;
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.6);
    }
    .confirm-tool {
      height: 50px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
