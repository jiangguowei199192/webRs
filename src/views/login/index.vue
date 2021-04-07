<template>
  <div class="login">
    <div class="content">
      <div class="title">{{ configJson.projectTitle }}</div>
      <img class="logo" :src="logoPic" alt />
      <br />
      <b class="label">账号：</b>
      <el-input
        placeholder="请输入账号"
        auto-complete="new-password"
        clearable
        maxlength="20"
        v-model.trim="loginInfo.username"
        name="userName"
        class="username"
      ></el-input>
      <br />
      <b class="label">密码：</b>
      <el-input
        placeholder="请输入密码"
        :type="passwordInputType"
        @focus="changePasswordInputType"
        @input.native="changePasswordInputType"
        auto-complete="new-password"
        clearable
        maxlength="20"
        v-model.trim="loginInfo.password"
        class="username password"
        name="passWord"
        @keyup.enter.native="jumpToMain"
      ></el-input>
      <div class="checkDiv pd76">
        <el-checkbox v-model="checked" class="check">记住密码</el-checkbox>
        <el-button type="text" size="mini" class="forgot" @click="dialogVisible = true">忘记密码？</el-button>
      </div>
      <div class="pd76">
        <el-button class="loginBtn" @click="jumpToMain">登 录</el-button>
      </div>

      <div class="settingBoxStyle pd76">
        <div class="settingStyle" @click="settingClick">
          <div class="settingIconSty">
            <i class="el-icon-setting"></i>
          </div>
          <div class="settingTitleStyle">高级设置</div>
        </div>
      </div>

      <div class="serverAddressBoxSty" v-show="showServer">
        <b class="label">服务器：</b>
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

    <el-dialog title="忘记密码" :visible.sync="dialogVisible" width="30%" class="passDialog">
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
        <el-button type="primary" @click="dialogVisible = false" class="trueBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 粒子漂浮物 -->
    <!-- <vue-particles
      style="height: 1084px"
      color="#01A9DB"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="star"
      :particleSize="7"
      linesColor="#58D3F7"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>-->
  </div>
</template>

<script>
import { loginApi } from '@/api/login'
import { Notification } from 'element-ui'
import globalApi from '../../utils/globalApi'
import AMapHelper from '../../axios/amapapis'
// import VueParticles from 'vue-particles'
// import Vue from 'vue'
// Vue.use(VueParticles)

export default {
  name: 'login',
  data () {
    return {
      logoPic: require('../../assets/images/Login/logo.svg'),
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
      this.$axios
        .post(loginApi.login, info)
        .then(res => {
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
            // localStorage.setItem(
            //   'token',
            //   'Bearer ' + res.data.data.access_token
            // )
            sessionStorage.setItem(
              'token',
              'Bearer ' + res.data.data.access_token
            )
            this.$router.push({ path: '/gisDispatch' })
          }
        })
        .catch(() => {})
    },
    async checkMapNetwork () {
      await AMapHelper.getLocation({})
        .then(res => {
          if (res.data.status === '1') {
            localStorage.location_city_adcode = res.data.adcode
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
  b.label {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #00bcff;
    display: inline-block;
    width: 76px;
    font-weight: normal;
    text-align: left;
  }
  .pd76 {
    padding-left: 76px;
  }
  position: relative;
  width: 100%;
  height: 1080px;
  background: url(../../assets/images/Login/bg.png) no-repeat;
  background-size: 100% 100%;
  .content {
    font-size: 16px;
    width: 781px;
    height: 486px;
    padding-bottom: 30px;
    background: url(../../assets/images/Login/contentBox.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding-top: 32px;
    box-sizing: border-box;
    .title {
      font-size: 20px;
      font-family: HuXiaoBo-NanShen;
      font-weight: 400;
      color: #ffffff;
      width: 320px;
      height: 32px;
      line-height: 32px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -26px);
      background: url(../../assets/images/Login/title-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }
    img.logo {
      margin-top: 20px;
      margin-bottom: 10px;
    }
    /deep/ .username {
      width: 272px;
      font-size: 20px;
      .el-input__inner {
        width: 272px;
        height: 37px;
        line-height: 37px;
        border: 1px solid #00bbff;
        background: transparent;
        color: #00bbff;
      }
      input::-webkit-input-placeholder {
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #01bcff;
      }
      input:-webkit-autofill,
      select:-webkit-autofill {
        box-shadow: 0 0 0px 1000px rgb(3, 12, 23) inset !important;
        -webkit-text-fill-color: #00bbff !important;
      }
      input:-webkit-autofill:focus {
        box-shadow: 0 0 0px 1000px rgb(3, 12, 23) inset !important;
        -webkit-text-fill-color: #00bbff !important;
      }
    }
    .password {
      margin-top: 23px;
    }
    .checkDiv {
      width: 272px;
      height: 30px;
      margin: 18px auto 0 auto;
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
      width: 272px;
      height: 40px;
      font-size: 18px;
      color: #fff;
      background-color: #00b8ff;
      border: 0;
      margin-top: 25px;
      padding: 0;
      line-height: 40px;
    }
    .settingBoxStyle {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      width: 272px;
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
      height: 36px;
      margin: 20px auto;
      .serverTitleSty {
        font-size: 16px;
        line-height: 36px;
      }
      .serverSelectSty {
        /deep/ .el-input__inner {
          width: 272px;
          background-color: transparent;
          border: 1px solid #00bbff;
          color: #01bcff;
        }
      }
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #00bbff;
      border-color: #00bbff;
    }
  }
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

// .dialogStyle {
//   font-size: 16px;
//   min-width: 1500px;
//   /deep/.el-dialog__header {
//     background-color: #39a4dd;
//   }
//   /deep/.el-dialog__title {
//     color: white;
//     font-size: 18px;
//     font-weight: bold;
//   }
//   /deep/.el-dialog__body {
//     background-color: #336984;
//   }
//   /deep/.el-dialog__footer {
//     background-color: #336984;
//   }
//   /deep/.el-icon-close:before {
//     color: white;
//   }
//   .trueBtn {
//     background-color: #1eb0fc;
//     font-size: 14px;
//     color: white;
//     width: 66px;
//     height: 30px;
//     padding: 0;
//   }
//   span {
//     color: white;
//   }
// }
.passDialog {
  border: 1px solid #00a7e8;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  background: rgba(0, 0, 0, 0.7);

  /deep/.el-dialog__title {
    display: inline-block;
    width: 218px;
    height: 30px;
    padding-left: 17px;
    line-height: 30px;
    background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #fefefe;
  }
  /deep/.el-dialog {
    background: rgba(0, 65, 87, 0.85);
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: #fff;
    }
    /deep/.el-dialog__body {
      color: #fff;
    }
    .trueBtn {
      width: 87px;
      height: 32px;
      border: 1px solid #1eb0fc;
      border-radius: 2px;
      background: #043c4f;
      font-size: 18px;
      font-family: Source Han Sans CN;
      padding: 0;
      background: #00a7e8;
      color: #fff;
    }
  }
}
</style>
