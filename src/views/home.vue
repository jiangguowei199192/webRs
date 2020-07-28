<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="box">
          <div
            v-for="(item,index) in systems"
            :key="index"
            class="list"
            @click.stop="jumpTo(index)"
          >
            <div class="item" :class="{title:index==3,active:isActive==index}">
              <span>{{item.content}}</span>
            </div>
            <template>
              <div class="status" v-if="index==1">
                <el-button
                  type="primary"
                  :class="{activeStatus:curActive==1}"
                  @click.stop="jumpToVideoUrl(1)"
                >实时视频</el-button>
                <el-button
                  type="primary"
                  :class="{activeStatus:curActive==2}"
                  @click.stop="jumpToVideoUrl(2)"
                >回放</el-button>
              </div>
            </template>
          </div>
        </div>
        <div class="cur">
          <div class="realTime">
            <span class="extra">{{timeObj.year}}</span> 年
            <span class="extra">{{timeObj.month}}</span> 月
            <span class="extra">{{timeObj.day}}</span> 日
            <span class="extra">{{timeObj.weekday}}</span>
            <span class="curCity extra">{{curCity}}</span>
            <template v-if="weatherReport">
            <span>天气：</span>
            <span class="extra">{{weatherReport.weather}}</span>
            <span class="extra">
              {{weatherReport.temperature}}
              <i>。</i>
            </span>
            </template>
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
export default {
  name: 'Home',
  data () {
    return {
      timeObj: '', // 当前时间
      curCity: '', // 所在城市
      weatherReport: '', // 天气情况
      isActive: 1, // 默认激活视频侦查系统
      systems: [
        {
          content: '智慧决策系统'
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
          content: '数字化单兵'
        },
        {
          content: '数字化装备'
        },
        {
          content: '系统设置'
        }
      ],
      curActive: 1 // 激活实时视频还是回放视频 1实时 2回放
    }
  },
  created () {
    EventBus.$on('video/realVideo/streamStart', info => {
      this.$notify.success({ title: '提示', message: '设备上线！' })
      EventBus.$emit('streamStart', info)
    })
    EventBus.$on('video/realVideo/streamEnd', info => {
      this.$notify.success({ title: '提示', message: '设备下线！' })
      EventBus.$emit('streamEnd', info)
    })
    EventBus.$on('video/deviceIid/channleID/datalink/firewarning', info => {
      this.$notify.warning({ title: '警告', message: '发现火点火情！' })
      EventBus.$emit('getFireAlarm', info)
    })
  },
  mounted () {
    this.jumpTo(this.isActive)
    setInterval(() => {
      this.timeObj = getTime()
    }, 1000)
    this.init()
    // 通过构造函数，创建mqtt连接
    // eslint-disable-next-line no-unused-vars
    var mqtt = new MqttService()
  },
  methods: {
    // 点击激活当前系统
    jumpTo (index) {
      if (index !== 3) {
        if (index === 0) this.$router.push({ path: '/decisionSystem' })
        else if (index === 1) {
          this.jumpToVideoUrl(this.curActive)
        } else if (index === 2) {
          this.$router.push({ path: '/evaluationSystem' })
        } else if (index === 4) {
          this.$router.push({ path: '/digitalIndividual' })
        } else if (index === 5) {
          this.$router.push({ path: '/digitalEquipment' })
        } else if (index === 6) this.$router.push({ path: '/systemSettings' })
        this.isActive = index
      }
    },
    // 视频侦查二级菜单跳转
    jumpToVideoUrl (type) {
      this.isActive = 1
      this.curActive = type
      if (type === 1) this.$router.push({ path: '/videoSystem' })
      else this.$router.push({ path: '/playback' })
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
        // left: -30px;
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
      margin:0 43px;
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
    // 临时显示菜单
    div.list{
      display: none;
    }
    div.list:nth-child(2),div.list:nth-child(4),div.list:nth-child(7){
      display: block;
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
}
</style>
