<template>
  <div class="home">
    <el-container>
      <el-header :class="{fixed:isFixed}">
        <div class="headerTitle">
          <div class="realTime">
            <span class="extra">{{ timeObj.year }}</span> 年
            <span class="extra">{{ timeObj.month }}</span> 月
            <span class="extra">{{ timeObj.day }}</span> 日
            <span class="extra">{{ timeObj.weekday }}</span>
            <span class="curCity extra">{{ curCity }}</span>
            <template v-if="weatherReport">
              <span>天气：</span>
              <span class="extra">{{ weatherReport.weather }}</span>
              <span class="extra">
                {{ weatherReport.temperature }}
                <i>。</i>
              </span>
            </template>
          </div>
          <div class="content">
            <div class="title">{{projectTitle}}</div>
            <div class="container">
              <div class="box">
                <div
                  v-for="(item, index) in systems"
                  :key="index"
                  class="list"
                  :class="{ active: isActive == index }"
                  @click.stop="jumpTo(index)"
                >
                  <span>{{ item.content }}</span>
                </div>
              </div>
              <div class="settings">
                <div class="info">
                  <div class="person">
                    <img :src="perSonPic" alt />
                    <span class="uName">{{userName||'-'}}</span>

                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        <img :src="settingPic" alt />
                      </span>
                      <el-dropdown-menu slot="dropdown" :append-to-body="false" class="settingDrop">
                        <el-dropdown-item command="0">修改密码</el-dropdown-item>
                        <el-dropdown-item command="1">退出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-header>
      <el-main class="webFsScroll">
        <!-- <router-view /> -->
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <router-view v-else />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getTime, timeFormat } from '@/utils/date'
import amapApi from '@/axios/amapapis'
import MqttService from '@/utils/mqttService'
import { EventBus } from '@/utils/eventBus.js'
import { loginApi } from '@/api/login'
import globalApi from '../utils/globalApi'
const droneOffline = 'gdu/appOutLine'
const droneCmdReq = 'gdu/commandCtrlReq'
export default {
  name: 'Home',
  data () {
    return {
      userName: '',
      isFixed: false,
      projectTitle: '',
      timeObj: '', // 当前时间
      curCity: '', // 所在城市
      weatherReport: '', // 天气情况
      perSonPic: require('../assets/images/home/person.svg'),
      settingPic: require('../assets/images/home/setting.svg'),
      isActive: 0, // GIS调度平台
      systems: [
        {
          content: 'GIS调度平台'
        },
        {
          content: '案件中心'
        },
        {
          content: '视频侦查'
        },
        {
          content: '系统管理'
        }
      ],
      todayEndTime: new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      ), // 今日23:59分时间戳
      realtimeInfoTopicArray: [] // 需要监听的飞机实时信息主题
    }
  },
  created () {
    this.projectTitle = globalApi.projectTitle || '智慧农业实战应用平台'
    // 设备上线
    EventBus.$on('video/device/online', info => {
      EventBus.$emit('UpdateDeviceOnlineStatus', info)
      // this.$notify.success({ title: '提示', message: '设备上线！' })
    })
    // 设备下线
    EventBus.$on('video/device/offline', info => {
      EventBus.$emit('UpdateDeviceOnlineStatus', info)
      // this.$notify.success({ title: '提示', message: '设备下线！' })
    })
    // 通道上线
    EventBus.$on('video/realVideo/streamStart', info => {
      EventBus.$emit('streamStart', info)
    })
    // 通道下线
    EventBus.$on('video/realVideo/streamEnd', info => {
      EventBus.$emit('streamEnd', info)
    })
    // 飞机实时信息
    EventBus.$on('droneInfos', info => {
      this.parseDroneRealtimeInfo(info)
    })
    // 人员识别提示
    EventBus.$on('video/people/found', info => {
      this.$notify.closeAll()
      this.$notify.warning({ title: '提示', message: '发现可疑人员!' })
    })
    // 人员显示
    EventBus.$on('video/people/real', info => {
      EventBus.$emit('peopleRealChange', info)
    })
    // AR显示
    EventBus.$on('video/aRAiResult', info => {
      EventBus.$emit('getArChange', info)
    })
    // 云台角度信息
    EventBus.$on('video/webControlPztNotice', info => {
      EventBus.$emit('video/webControlPztChange', info)
    })
  },
  destroyed () {
    EventBus.$off('video/device/online')
    EventBus.$off('video/device/offline')
    EventBus.$off('video/realVideo/streamStart')
    EventBus.$off('video/realVideo/streamEnd')
    EventBus.$off('droneInfos')
    EventBus.$off('video/people/found')
    EventBus.$off('video/people/real')
    EventBus.$off('video/aRAiResult')
    EventBus.$off('video/deviceIid/channleID/datalink/firewarning')
    EventBus.$off('video/webControlPztNotice')
    // 退出时，关闭mqtt连接
    if (this.mqtt) {
      this.mqtt.needReconnect = false
      if (this.mqtt.isConnect) this.mqtt.disconnect()
    }
    clearInterval(this.timer)
    this.timer = null
  },
  mounted () {
    this.getPath()
    setInterval(() => {
      this.timeObj = getTime()
    }, 1000)
    this.init()
    // 通过构造函数，创建mqtt连接
    // eslint-disable-next-line no-unused-vars
    this.mqtt = new MqttService()
    // 如果mqtt已经创建过
    if (this.mqtt.created) {
      this.mqtt.mqttConnect()
    }
    // 获取飞机实时信息所需订阅主题
    this.getRealtimeInfoTopics()
  },
  methods: {
    timeFormat,
    // 点击激活当前系统
    jumpTo (index) {
      if (index === 0) this.$router.push({ path: '/gisDispatch' })
      else if (index === 1) {
        this.$router.push({ path: '/caseCenter' })
      } else if (index === 2) {
        this.$router.push({ path: '/videoSystem' })
      } else if (index === 3) {
        this.$router.push({ path: '/systemSettings' })
      }
      this.getPath()
    },
    init () {
      amapApi.getLocation({}).then(res => {
        if (res) {
          if (res && res.data && res.data.info === 'OK') {
            this.curCity = res.data.city || ''
            const cityCode = res.data.adcode
            amapApi.getWeather({ city: cityCode }).then(res => {
              if (res && res.data && res.data.info === 'OK') {
                this.weatherReport = res.data.lives[0]
              }
            })
          }
        }
      })
    },
    // 获取飞机实时信息所需订阅主题
    getRealtimeInfoTopics () {
      this.realtimeInfoTopicArray = []
      const tmpThis = this
      const tmpAxios = this.$axios
      this.$axios
        .get(loginApi.getUserDetail)
        .then(res => {
          if (res.data.code === 0) {
            const data = res.data.data
            this.userName = data.username
            tmpAxios
              .get(loginApi.getDeptByDeptCode, {
                params: { deptCode: res.data.data.deptCode }
              })
              .then(res2 => {
                if (res2.data.code === 0) {
                  res2.data.data.forEach(deptCode => {
                    tmpThis.realtimeInfoTopicArray.push('gdu/' + deptCode)
                  })
                  tmpThis.realtimeInfoTopicArray.unshift(
                    'gdu/' + res.data.data.deptCode
                  )
                }
              })
              .catch(err2 => {
                console.log('loginApi.getDeptByDeptCode Err : ' + err2)
              })
          }
        })
        .catch(err => {
          console.log('loginApi.getUserDetail Err : ' + err)
        })
    },
    // 解析飞机实时信息(根据主题进行分发)
    parseDroneRealtimeInfo (msg) {
      const object = JSON.parse(msg.payloadString)
      if (droneOffline === msg.topic || msg.topic === 'gdu/device/offline') {
        EventBus.$emit('droneOffline', object)
      } else if (msg.topic === 'gdu/device/online') {
        EventBus.$emit('droneOnline', object)
      } else if (droneCmdReq === msg.topic) {
        EventBus.$emit('droneCmdReq', object)
      } else {
        const tmpArray = this.realtimeInfoTopicArray
        for (let i = 0; i < tmpArray.length; i++) {
          if (msg.topic.indexOf(tmpArray[i]) === 0) {
            EventBus.$emit('droneRealtimeInfo', object)
            break
          }
        }
      }
    },
    getPath () {
      const path = this.$route.path
      this.isFixed = false
      if (path === '/gisDispatch') {
        this.isFixed = true
        this.isActive = 0
      } else if (path === '/caseCenter') {
        this.isActive = 1
      } else if (
        path === '/videoSystem' ||
        path === '/deviceMap' ||
        path === '/playback'
      ) {
        this.isActive = 2
      } else if (path === '/systemSettings') {
        this.isActive = 3
      }
    },
    handleCommand (command) {
      switch (command) {
        case '0':
          break
        case '1':
          this.$router.push({ path: '/login' })
          break

        default:
          break
      }
    }
  },
  watch: {
    $route: 'getPath'
  }
}
</script>
<style lang="less" scoped>
.home {
  background: url(../assets/images/home/bg.svg) no-repeat;
  background-size: 100% 100%;
  .el-header {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ::selection {
      background: transparent;
    }
    padding: 20px;
    height: auto !important;
    .headerTitle {
      position: relative;
      .realTime {
        font-size: 17px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #fff;
        line-height: 14px;
        span.extra {
          color: #fff45c;
          i {
            font-style: normal;
            position: relative;
            top: -10px;
          }
        }
        span.extra:last-child {
          margin-left: 4px;
        }
        span.curCity {
          margin-left: 30px;
          margin-right: 25px;
        }
      }
      .content {
        display: flex;
        font-size: 28px;
        font-family: HuXiaoBo-NanShen;
        font-weight: 400;
        color: #ffffff;
        // width: 1749px;
        height: 74px;
        margin-top: 16px;
        background: url(../assets/images/home/title_bg.svg) no-repeat;
        background-size: 100% 100%;
        div.title {
          // line-height: 74px;
          padding-top: 10px;
          padding-left: 67px;
          width: 448px;
          box-sizing: border-box;
          text-align: center;
        }
        div.container {
          flex: 1;
          display: flex;
          justify-content: space-between;
          margin-top: -17px;
          div.box {
            display: flex;
            flex: 1;
            justify-content: space-between;
            font-size: 24px;
            font-weight: 500;
            margin-left: 136px;
            margin-right: 66px;
            .list {
              width: 176px;
              height: 47px;
              background: url(../assets/images/home/normal.png) no-repeat;
              background-size: 100% 100%;
              line-height: 40px;
              text-align: center;
              cursor: pointer;
            }
            .list.active {
              background: url(../assets/images/home/active.png) no-repeat;
              background-size: 100% 100%;
            }
          }
          .el-dropdown > .el-dropdown-link:focus {
            outline: 0;
          }
          .el-dropdown > .el-dropdown-link {
            outline: 0;
          }
          div.settings {
            position: relative;
            width: 348px;
            background: url(../assets/images/home/setting_bg.svg) no-repeat;
            background-size: 100% 100%;
            div.info {
              position: absolute;
              top: -12px;
              right: 18px;
              div.person {
                img {
                  width: 26px;
                  height: 26px;
                }
                img:last-child {
                  cursor: pointer;
                }
                span.uName {
                  font-size: 16px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #0fbfe0;
                  margin: 0 32px 0 18px;
                  position: relative;
                  top: -6px;
                }
                /deep/ ul.settingDrop {
                  box-sizing: border-box;
                  width: 82px;
                  // height: 50px;
                  background: #022d42;
                  border: none;
                  padding: 8px 0;
                  border: 1px solid #01759d;
                  li.el-dropdown-menu__item {
                    font-family: Source Han Sans CN;
                    font-size: 12px;
                    font-weight: bold;
                    color: #00b8ff;
                    padding: 0;
                    text-align: center;
                    line-height: normal;
                    // padding: 0 16px;
                  }
                  li:nth-child(2) {
                    margin-top: 8px;
                  }
                  li:hover {
                    background: transparent;
                  }
                  .popper__arrow {
                    display: none;
                  }
                }
                /deep/ ul.el-popper {
                  margin: 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .el-header.fixed {
    position: fixed;
    z-index: 1000;
    width: 100%;
  }
  .el-main {
    padding: 0;
  }
}
</style>
