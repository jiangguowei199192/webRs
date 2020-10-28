<template>
  <div>
    <div class="login">
      <div class="content">
        <div class="title">{{ configJson.projectTitle }}</div>
        <el-input
          placeholder="用户名"
          auto-complete="new-password"
          clearable
          prefix-icon="el-icon-user"
          v-model="loginInfo.username"
          class="username"
          size="small"
        ></el-input>
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
          @keyup.enter.native="jumpToMain"
        ></el-input>
        <div class="checkDiv">
          <el-checkbox v-model="checked" class="check">记住密码</el-checkbox>
          <el-button
            type="text"
            size="mini"
            class="forgot"
            @click="dialogVisible = true"
            >忘记密码？</el-button
          >
        </div>
        <el-button class="loginBtn" @click="jumpToMain">登 录</el-button>

        <div class="settingBoxStyle">
          <div class="settingStyle" @click="settingClick">
            <div class="settingIconSty">
              <i class="el-icon-setting"></i>
            </div>
            <div class="settingTitleStyle">高级设置</div>
          </div>
        </div>

        <div class="serverAddressBoxSty" v-show="showServer">
          <div class="serverTitleSty">服务器：</div>
          <el-select v-model="selectedServerIndex" class="serverSelectSty">
            <el-option
              v-for="(item, index) in configJson.baseUrlList"
              :key="index"
              :label="item.baseUrl"
              :value="index"
            ></el-option>
          </el-select>
        </div>
      </div>

      <el-dialog
        title="忘记密码"
        :visible.sync="dialogVisible"
        width="30%"
        class="dialogStyle"
      >
        <p>
          <span>普通用户请联系管理员重置密码。</span>
        </p>
        <!-- <p>
        <span>管理员请登录系统所在的服务器，创建 'c:\zhc\tmp\reset_5f0d6451c203f.txt' 文件。</span>
      </p>
      <p>
        <span>注意：</span>
      </p>
        <p><span>文件内容为新密码。密码6-16个字符，区分大小写。</span></p>-->
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogVisible = false"
            class="trueBtn"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/api/login'
import { Notification } from 'element-ui'
import globalApi from '../../utils/globalApi'
import AMapHelper from '../../axios/amapapis'
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
      dialogVisible: false,

      showServer: false,
      configJson: globalApi.configJson,
      selectedServerIndex: 0
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
      // 登录前，配置baseUrl
      var selectedAddr = this.configJson.baseUrlList[this.selectedServerIndex]
      globalApi.baseUrl = selectedAddr.baseUrl
      globalApi.mqttServer = selectedAddr.mqttServer
      globalApi.mqttPort = selectedAddr.mqttPort
      globalApi.headImg = selectedAddr.headImg
      globalApi.projectTitle = this.configJson.projectTitle
      // 将selectedServerIndex保存至本地，当没走登录页时，读取本地selectedServerIndex来配置baseUrl
      localStorage.setItem('selectedServerIndex', this.selectedServerIndex)

      if (
        this.loginInfo.username.length <= 0 ||
        this.loginInfo.password.length <= 0
      ) {
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
      this.$axios.post(loginApi.login, info).then((res) => {
        if (res.data.code === 0) {
          this.checkMapNetwork()
          if (this.checked) {
            // 记住密码
            localStorage.setItem('username', this.loginInfo.username)
            localStorage.setItem('password', this.loginInfo.password)
            localStorage.setItem('time', Math.round(new Date() / 1000))
          } else {
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('time')
          }
          localStorage.setItem('token', 'Bearer ' + res.data.data.access_token)
          sessionStorage.setItem(
            'token',
            'Bearer ' + res.data.data.access_token
          )
          this.$router.push({ path: '/videoSystem' })
        }
      })
    },
    async checkMapNetwork () {
      await AMapHelper.getLocation({})
        .then(res => {
          if (res.data.status === '1') {
            localStorage.bNetWorkConn = 'true'
          }
        })
        .catch(err => {
          localStorage.bNetWorkConn = 'false'
          console.log('AMapHelper.getLocation Err : ' + err)
        })
    },
    settingClick () {
      this.showServer = !this.showServer
    }

  },
  created () {},
  mounted () {
    var oldTime = localStorage.getItem('time')
    if (oldTime) {
      var currentTime = Math.round(new Date() / 1000) // 当前时间戳，单位秒
      if (currentTime - oldTime >= 1209600) {
        // 超过14天清除账号密码
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
  position: relative;
  width: 100%;
  height: 1084px;
  background: url(../../assets/images/Login/login-bg.png) no-repeat;
  background-size: 100% 100%;
  .content {
    width: 500px;
    // height: 502px;
    // height: 534px;
    padding-bottom: 30px;
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
      font-size: 34px;
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
    .settingBoxStyle {
      width: 403px;
      height: 20px;
      margin: 20px auto;
      .settingStyle {
        cursor: pointer;
        width: 100px;
        height: 20px;
        .settingIconSty {
          width: 20px;
          height: 20px;
          float: left;
          margin-left: -10;
        }
        .settingTitleStyle {
          height: 20px;
          float: right;
          line-height: 20px;
          vertical-align: top;
          font-size: 19px;
        }
      }
    }
    .serverAddressBoxSty {
      width: 403px;
      height: 36px;
      margin: 20px auto;
      .serverTitleSty {
        font-size: 16px;
        line-height: 36px;
        float: left;
      }
      .serverSelectSty {
        /deep/ .el-input__inner {
          background: url(../../assets/images/Login/login-usernameBox.png)
            no-repeat;
          background-size: 100% 100%;
          color: white;
        }
      }
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
// /deep/ input:-webkit-autofill, select:-webkit-autofill {
//   box-shadow: 0 0 0px 1000px transparent inset !important;
//   background-color: transparent;
// }
// /deep/ input:-internal-autofill-selected {
//   box-shadow: 0 0 0px 1000px transparent inset !important;
//   background-color: transparent;
// }
/deep/ input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
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
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: white;
}

.dialogStyle {
  min-width: 1500px;
  /deep/.el-dialog__header {
    background-color: #39a4dd;
  }
  /deep/.el-dialog__title {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    background-color: #336984;
  }
  /deep/.el-dialog__footer {
    background-color: #336984;
  }
  /deep/.el-icon-close:before {
    color: white;
  }
  .trueBtn {
    background-color: #1eb0fc;
    font-size: 14px;
    color: white;
    width: 66px;
    height: 30px;
    padding: 0;
  }
  span {
    color: white;
  }
}
</style>
