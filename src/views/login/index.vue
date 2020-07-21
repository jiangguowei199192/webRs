<template>
<div>
  <div class="login">
    <div class="content">
      <div class="title">消防救援现场指挥系统</div>
      <!-- <div class="username"></div> -->
      <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="username" class="username" size="small"></el-input>
      <!-- <div class="username password"></div> -->
      <el-input placeholder="密码" prefix-icon="el-icon-lock" show-password v-model="password" class="username password" size="small"></el-input>
      <div class="checkDiv">
        <el-checkbox v-model="checked" class="check">记住密码</el-checkbox>
        <el-button type="text" size="mini" class="forgot" @click="dialogVisible = true">忘记密码？</el-button>
      </div>
      <el-button class="loginBtn" @click="jumpToMain">登 录</el-button>
      <el-dialog title="忘记密码" :visible.sync="dialogVisible" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</div>
</template>

<script>
import { api } from '@/api/login'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      checked: true,
      dialogVisible: false
    }
  },
  methods: {
    jumpToMain () {
      this.$router.push({ path: '/videoSystem' })
    }
  },
  created () {
    this.$axios.post(api.getAreaAxios, { tifFileId1: 1321123 }).then(res => {
      if (res) {
        debugger
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .login {
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
