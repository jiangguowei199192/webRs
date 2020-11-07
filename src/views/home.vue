<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="box">
          <div
            v-for="(item, index) in systems"
            :key="index"
            class="list"
            @click.stop="jumpTo(index)"
          >
            <div class="item" :class="{ title: index == 3, active: isActive == index }">
              <span>{{ item.content }}</span>
            </div>
          </div>
        </div>
        <div class="cur">
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
        </div>
        <audio src="./audio.mp3" ref="player"></audio>
        <div class="fireNotice" :class="{curFire:realNotice}">
          <div class="title">
            <div>
              <img src="../assets/images/fire_title.png" class="fire_title" alt />
              <span>火情通知</span>
            </div>
            <img src="../assets/images/fire_close.png" alt @click.stop="realNotice=false" />
          </div>
          <div class="content">
            <div class="detail">
              <div class="info">
                <ul>
                  <li>
                    <span>时间：</span>2020-04-05 10:06:50
                  </li>
                  <li>
                    <span>报警设备：</span>高点1号
                  </li>
                </ul>
                <ul>
                  <li>
                    <span>地点：</span>湖北省武汉市江夏区郑店街道上屋许96号
                  </li>
                  <li>
                    <span>坐标：</span>
                    <span style="margin-right: 17px;">30.278766 114.2541245</span>
                    <el-button class="copy">复制坐标</el-button>
                  </li>
                </ul>
              </div>
              <div class="pics">
                <img
                  src="http://111.47.13.103:40031/cloud-video/firewarning/6C01728PA4A9A6F/20201106133140_16_bfilos.jpg"
                  alt
                />
                <img
                  src="http://111.47.13.103:40031/cloud-video/firewarning/6C01728PA4A9A6F/20201106133140_15_bfilos.jpg"
                  alt
                />
              </div>
              <div style="text-align:right;margin-top:12px;">
                <el-button class="copy" @click.stop="jumpToTodayFire">火情详情</el-button>
              </div>
              <div class="pagination">
                <el-pagination
                  :page-size="1"
                  layout="prev,next"
                  :total="10"
                  :current-page.sync="currentPage"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </el-header>
      <el-main>
        <!-- <router-view /> -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getTime } from '@/utils/date'
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
      showFireDialog: true, // 显示火情弹框
      realNotice: false,
      currentPage: 1, // 当前页
      timeObj: '', // 当前时间
      curCity: '', // 所在城市
      weatherReport: '', // 天气情况
      isActive: 1, // 默认激活视频侦查系统
      systems: [
        {
          content: '指挥决策'
        },
        {
          content: '视频侦查'
        },
        {
          content: '评战系统'
        },
        {
          content: '消防救援现场指挥系统'
        },

        {
          content: '战评系统'
        },
        {
          content: '数字化装备'
        },
        {
          content: '系统设置'
        }
      ],
      realtimeInfoTopicArray: [] // 需要监听的飞机实时信息主题
    }
  },
  created () {
    this.systems[3].content = globalApi.projectTitle
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
    // 退出时，关闭mqtt连接
    if (this.mqtt) {
      this.mqtt.needReconnect = false
      if (this.mqtt.isConnect) this.mqtt.disconnect()
    }
  },
  mounted () {
    // 火情火点
    EventBus.$on('video/deviceIid/channleID/datalink/firewarning', info => {
      // this.$notify.closeAll()
      // this.$notify.warning({ title: '警告', message: '发现火点火情！' })
      this.$nextTick(() => {
        const dom = document.querySelector('audio')
        dom && dom.play()
      })
      EventBus.$emit('getFireAlarm', info)
    })
    setInterval(() => {
      const info = {
        alarmAddress: '湖北省武汉市江夏区武汉高德红外股份有限公司(黄龙山南路)',
        alarmCity: '武汉市',
        alarmDistrict: '江夏区',
        alarmId: '2374',
        alarmLatitude: 30.466848,
        alarmLongitude: 114.425584,
        alarmPicList: [
          {
            alarmMsgId: 244,
            id: 487,
            picPath:
              '/cloud-video/firewarning/6C01728PA4A9A6F/20201106133140_15_bfilos.jpg',
            streamCode: '0',
            streamName: null
          },
          {
            alarmMsgId: 244,
            id: 488,
            picPath:
              '/cloud-video/firewarning/6C01728PA4A9A6F/20201106133140_16_bfilos.jpg',
            streamCode: '1',
            streamName: null
          }
        ],
        alarmProvince: '湖北省',
        alarmStatus: 'confirmed',
        alarmTime: 1604640698000,
        alarmTypeCode: 'HUO',
        alarmTypeName: '火情报警',
        deviceCode: '6C01728PA4A9A6F',
        deviceName: '高点监控大',
        id: 244,
        updateTime: 1604640708000
      }
      !this.realNotice && (this.realNotice = true)
      EventBus.$emit('video/deviceIid/channleID/datalink/firewarning', info)
    }, 5000)
    this.jumpTo(this.isActive)
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
    // 跳转到今日警情
    jumpToTodayFire () {
      this.$router.push({
        name: 'fireAlarm',
        query: {
          id: 244
        }
      })
    },
    // 点击激活当前系统
    jumpTo (index) {
      if (index !== 3) {
        if (index === 0) this.$router.push({ path: '/decisionSystem' })
        else if (index === 1) {
          this.$router.push({ path: '/videoSystem' })
        } else if (index === 2) {
          this.$router.push({ path: '/evaluationSystem' })
        } else if (index === 4) {
          this.$notify.closeAll()
          this.$notify.info({ title: '提示', message: '功能未开放' })
          // this.$router.push({ path: '/digitalIndividual' })
        } else if (index === 5) {
          this.$router.push({ path: '/digitalEquipment' })
        } else if (index === 6) this.$router.push({ path: '/systemSettings' })
        this.isActive = index
      }
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
            tmpAxios
              .get(loginApi.getDeptByDeptCode, {
                params: { deptCode: res.data.data.deptCode }
              })
              .then(res2 => {
                if (res2.data.code === 0) {
                  res2.data.data.forEach(deptCode => {
                    tmpThis.realtimeInfoTopicArray.push('gdu/' + deptCode)
                  })
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
      if (droneOffline === msg.topic) {
        EventBus.$emit('droneOffline', object)
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
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  background: url(../assets/images/bg.png) no-repeat;
  background-size: 100% 100%;
  .el-header {
    margin-top: 36px;
    height: auto !important;
    padding: 0 20px 0 20px;
    position: relative;
  }
  .el-main {
    padding: 0;
  }
  .box {
    display: flex;
    // 临时显示菜单
    // justify-content: space-between;
    justify-content: center;
    font-size: 24px;
    font-weight: 500;
    .list {
      position: relative;
      z-index: 1;
      .item {
        position: relative;
      }
      .status {
        position: absolute;
        z-index: 999;
        width: 300px;
        // 临时显示菜单
        // left: -40px;
        // padding-top: 30px;
        left: -75px;
        padding-top: 33px;
        display: none;
        .el-button {
          width: 140px;
          background: #082d56;
        }
        .activeStatus {
          border: 2px solid rgba(233, 226, 101, 1);
          color: #e9e265;
        }
      }
    }
    .list:not(:nth-child(4)):hover .status {
      display: block !important;
    }
    div.list:not(:nth-child(4)) .item {
      cursor: pointer;
      width: 182px;
      height: 52px;
      background: url(../assets/images/unselected.png) no-repeat;
      line-height: 52px;
      text-align: center;
    }
    div.list:nth-child(n + 5) .item {
      background: url(../assets/images/unselected-right.png) no-repeat;
    }
    .title {
      width: 540px;
      height: 66px;
      line-height: 66px;
      text-align: center;
      // 临时显示菜单 添加
      margin: 0 44px;
      font-size: 36px;
      font-weight: bold;
      margin-top: -13px;
      font-family: Source Han Sans CN;
      background: url(../assets/images/title.png) no-repeat;
      span {
        text-shadow: #000 3px 4px 5px;
      }
    }
    div.list:not(:nth-child(4)) .active {
      background: url(../assets/images/selected.png) no-repeat !important;
    }
    div.list:nth-child(n + 5) .active {
      background: url(../assets/images/selected-right.png) no-repeat !important;
    }
    div.list:nth-child(3),
    div.list:nth-child(6) {
      display: none;
    }
    div.list:nth-child(1),
    div.list:nth-child(5) {
      margin-right: 40px;
    }
  }
  .cur {
    position: relative;
    margin-top: 8px;
    margin-bottom: 25px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    height: 40px;
    line-height: 40px;
    text-align: center;
    .realTime {
      width: 936px;
      background: url(../assets/images/logo.png) no-repeat;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
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
  }
  .fireNotice {
    transition: 1s linear;
    position: fixed;
    bottom: 0px;
    right: -530px;
    width: 530px;
    height: 316px;
    background: url(../assets/images/fire_notice.png) no-repeat;
    z-index: 10000;
    box-sizing: border-box;
    padding: 14px;
    font-family: Source Han Sans CN;
    .title {
      display: flex;
      justify-content: space-between;
      img.fire_title {
        margin-right: 15px;
      }
      span {
        font-weight: 400;
        color: #ffffff;
        font-size: 18px;
      }
      div + img {
        height: 18px;
        cursor: pointer;
      }
    }
    .content {
      padding-top: 26px;
      padding-left: 18px;
      .detail {
        div.info {
          display: flex;
          justify-content: space-between;
          ul {
            li {
              font-size: 12px;
              font-weight: bold;
              color: #ffffff;
              line-height: 24px;
              line-height: 26px;
            }
          }
        }
        .copy {
          width: 80px;
          height: 24px;
          background: #1eb0fc;
          border: 1px solid #1eb0fc;
          border-radius: 4px;
          padding: 0;
          color: #fff;
        }
        div.pics {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
          img {
            width: 170px;
            height: 110px;
          }
        }
        .pagination {
          display: inline-block;
          margin-right: 5px;
          /deep/.el-pagination {
            padding: 0;
            button {
              background-color: transparent !important;
              i {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #23cefd;
                text-align: center;
                line-height: 20px;
                color: #1c638b;
              }
            }
            button.btn-next,
            button.btn-prev {
              padding: 0;
            }
            button[disabled] {
              i {
                background: #999;
                color: #2d506f;
              }
            }
          }
        }
      }
    }
  }
  .curFire {
    right: 0px;
  }
}
</style>
