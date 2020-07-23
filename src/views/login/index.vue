<template>
<div>
  <div class="login">
    <div class="content">
      <div class="title">消防救援现场指挥系统</div>
      <el-input
        placeholder="用户名"
        auto-complete="new-password"
        clearable
        prefix-icon="el-icon-user"
        v-model="loginInfo.username"
        class="username"
        size="small">
      </el-input>
      <el-input
        placeholder="密码"
        :type="passwordInputType"
        @focus="changePasswordInputType"
        @input.native="changePasswordInputType"
        auto-complete="new-password"
        clearable
        prefix-icon="el-icon-lock"
        v-model="loginInfo.password"
        class="username password"
        size="small"
        @keyup.enter.native="jumpToMain">
      </el-input>
      <div class="checkDiv">
        <el-checkbox v-model="checked" class="check">记住密码</el-checkbox>
        <el-button type="text" size="mini" class="forgot" @click="dialogVisible = true">忘记密码？</el-button>
      </div>
      <el-button class="loginBtn" @click="jumpToMain">登 录</el-button>
    </div>
    <el-dialog
      title="忘记密码"
      :visible.sync="dialogVisible"
      width="30%">
      <span>普通用户请联系管理员重置密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
import { loginApi } from '@/api/login'
import {
  Notification
} from 'element-ui'
export default {
  name: 'login',
  data () {
    return {
      passwordInputType: 'text',
      loginInfo: {
        username: '',
        password: ''
      },
      checked: true,
      dialogVisible: false
    }
  },
  methods: {
    changePasswordInputType () {
      if (this.loginInfo.password.length > 0) {
        this.passwordInputType = 'password'
      } else {
        this.passwordInputType = 'text'
      }
    },
    async jumpToMain () {
      if (this.loginInfo.username.length <= 0 || this.loginInfo.password.length <= 0) {
        // this.$message.error('请输入用户名和密码')
        Notification({
          title: '错误',
          message: '请输入用户名和密码',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      var info = {
        username: this.loginInfo.username,
        password: this.$md5(this.loginInfo.password)
      }
      this.$axios.post(loginApi.login, info).then(res => {
        if (res.data.code === 0) {
          if (this.checked) { // 记住密码
            localStorage.setItem('username', this.loginInfo.username)
            localStorage.setItem('password', this.loginInfo.password)
            localStorage.setItem('time', Math.round((new Date()) / 1000))
          } else {
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('time')
          }
          sessionStorage.setItem('token', 'Bearer ' + res.data.data.access_token)
          this.$router.push({ path: '/videoSystem' })
        }
      })
    }
  },
  created () {},
  mounted () {
    var oldTime = localStorage.getItem('time')
    if (oldTime) {
      var currentTime = Math.round((new Date()) / 1000) // 当前时间戳，单位秒
      if ((currentTime - oldTime) >= 1209600) { // 超过14天清除账号密码
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        localStorage.removeItem('time')
      } else {
        this.loginInfo.username = localStorage.getItem('username')
        this.loginInfo.password = localStorage.getItem('password')
        this.changePasswordInputType()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 1084px;
    background: url(../../assets/images/Login/login-bg.png) no-repeat;
    background-size: 100% 100%;
    .content {
      width: 500px;
      height: 502px;
      background: url(../../assets/images/Login/login-contentBg.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .title {
        height: 150px;
        text-align: center;
        line-height: 150px;
        color: white;
        font-size: 38px;
      }
      .username {
        width: 403px;
        background: url(../../assets/images/Login/login-usernameBox.png) no-repeat;
        margin: 0 auto 0 auto;
        font-size: 20px;
      }
      .password {
        margin-top: 33px;
      }
      .checkDiv {
        width: 403px;
        height: 30px;
        margin: 20px auto 0 auto;
        text-align: left;
        .check {
          margin-top: 7px;
        }
        .forgot {
          float: right;
          width: 80px;
          height: 30px;
          color: #00b8ff;
          font-size: 16px;
        }
      }
      .loginBtn {
        width: 403px;
        height: 56px;
        font-size: 26px;
        color: white;
        background-color: #00b8ff;
        border: 0;
        margin-top: 30px;
      }
    }
  }
  /deep/ .el-input--small .el-input__inner {
    height: 56px;
    line-height: 56px;
  }
  /deep/ .el-input__icon {
    margin-left: 20px;
  }
  /deep/ .el-input__inner {
    background-color: transparent;
    border: 0;
    color: white;
    width: 330px;
  }
  /deep/ input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    box-shadow: 0 0 0px 1000px transparent inset !important;
    -webkit-text-fill-color: white !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
  }

  /deep/ .el-checkbox__label {
    font-size: 16px;
  }
  /deep/ .el-checkbox {
    color: white;
  }
  /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
    color: white;
  }
</style>
