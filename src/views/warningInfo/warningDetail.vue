<template>
  <div>
    <el-dialog
      class="detailInfo"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      :show-close="false"
    >
      <div class="content-title">
        告警详情
        <img :src="X" alt @click="closeDialog" />
      </div>
      <div class="info">
        <div class="leftInfo">
          <ul class="baseInfo">
            <li>
              <span class="title">事件类型：</span>
              <span>{{ info.alarmTypeName || "-" }}</span>
            </li>
            <li>
              <span class="title">告警设备：</span>
              <span>{{ info.deviceName || "-" }}</span>
            </li>
            <li>
              <span class="title">告警时间：</span>
              <span>{{ info.captureTime }}</span>
            </li>
          </ul>
          <div class="content-title">案件核实</div>
          <div class="btns">
            <div @click.stop="confirmWarn(2)">确认</div>
            <div @click.stop="confirmWarn(3)">误报</div>
          </div>
          <div class="remark">
            <div>备注：</div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model.trim="remark"
              maxlength="30"
              show-word-limit
              class="word"
            ></el-input>
            <div class="btns">
              <div @click="remark = ''">取消</div>
              <div @click="addRemark">确定</div>
            </div>
            <div class="warningBox webFsScroll">
              <div
                class="list"
                v-for="(item, index) in remarkList"
                :key="index"
              >
                <div class="circle">{{ index + 1 }}</div>
                <div class="extra">
                  <span class="descrip">{{ item.remark || "-" }}</span>
                  <div class="time">{{ item.createTime || "-" }}</div>
                </div>
              </div>
              <div class="empty" v-show="remarkList.length === 0">
                暂无备注信息
              </div>
              <!-- <div class="list">
              <div class="circle">1</div>
              <div class="extra">
                <span class="descrip">这是一条很长很长很长的内容这是一条很长很长很长的内容这是一条很长很长很长的内容</span>
                <div class="time">2021-05-16 08:21:33</div>
              </div>
            </div> -->
            </div>
          </div>
        </div>
        <div class="rightInfo">
          <div class="tabs" :class="{ hasVideo: videoUrl }">
            <span @click.stop="tabIndex = 0" :class="{ select: tabIndex === 0 }"
              >抓拍图</span
            >
            <span
              @click.stop="showVideo()"
              :class="{ select: tabIndex === 1 }"
              v-show="videoUrl"
              >抓拍视频</span
            >
          </div>
          <div class="bigImg" v-show="tabIndex === 0">
            <img :src="info.imageUrl" alt @click.stop="previewImg" />
            <!-- <span
            v-for="(list,index) in info.rect.points"
            :key="index"
            :style="
                'left:' +
                  list.left +
                  '%;' +
                  'top:' +
                  list.top +
                  '%;' +
                  'width:' +
                  list.width +
                  '%;' +
                  'height:' +
                 list.height +
                  '%;'
              "
          ></span> -->
          </div>
          <div class="videoBox" v-show="tabIndex === 1">
            <div class="video" :class="{ noVideo: !isPlay }">
              <LivePlayer
                v-show="url"
                :videoUrl="url"
                :show-custom-button="false"
                :muted="false"
                :controls="false"
                :autoplay="false"
                oncontextmenu="return false"
                fluent
                :live="false"
                aspect="fullscreen"
                :poster="poster"
                ref="player"
              ></LivePlayer>
              <div class="playBtns">
                <img
                  src="../../assets/images/warningCenter/stop.svg"
                  alt
                  @click.stop="stop()"
                />
                <img
                  v-show="!isPlay"
                  src="../../assets/images/warningCenter/play.svg"
                  alt
                  @click.stop="play()"
                />
                <img
                  v-show="isPlay"
                  src="../../assets/images/warningCenter/pause.svg"
                  alt
                  @click.stop="pause()"
                />
              </div>
            </div>
            <timeBar
              ref="timebar"
              :startTime="videoStart"
              :curTime="curTime"
              :duration="duration"
            ></timeBar>
          </div>
          <!-- <div class="tools">
          <span>区域检测</span>
          <el-switch v-model="areaWatch" active-color="#00D1FD" inactive-color="#AEAEAE"></el-switch>
          <span>事件检测</span>
          <el-switch v-model="eventWatch" active-color="#00D1FD" inactive-color="#AEAEAE"></el-switch>
        </div>-->
        </div>
      </div>
    </el-dialog>
    <!-- 预览图片弹窗 -->
    <el-dialog
      class="browserScroll"
      :visible.sync="imgDialogVisible"
      custom-class="el-dialog-custom"
      :show-close="false"
      close-on-press-escape
      type="primary"
      @click.native="imgDialogVisible = false"
      center
    >
      <img class="custom-dialog-img" :src="clickImgSrc" />
    </el-dialog>
  </div>
</template>

<script>
import { structureApi } from '@/api/structureData.js'
import LivePlayer from '@liveqing/liveplayer'
import timeBar from './components/timeBar'
import globalApi from '../../utils/globalApi'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    }
  },

  components: {
    LivePlayer,
    timeBar
  },

  data () {
    return {
      X: require('../../assets/images/X.svg'),
      remark: '',
      remarkList: [],
      tabIndex: 0,
      url: '',
      // videoUrl: '',
      videoUrl:
        'http://119.3.108.251/videos/6C01728PA4A9A101/2021_04_13_19_45_24_955-boat-intrusion.mp4',
      imgDialogVisible: false,
      clickImgSrc: '',
      isPlay: false,
      duration: 0, // 视频长度
      poster: require('../../assets/images/loading.gif'),
      curTime: 0, // 告警视频播放时间
      timeInit: false,
      videoInit: false,
      videoStart: '2021-4-12 09:00:00' // 告警视频开始时间
    }
  },

  methods: {
    // 获取视频开始时间
    getStartTime () {
      if (!this.videoUrl) return
      const s = this.videoUrl.lastIndexOf('/')
      const str = this.videoUrl.slice(s + 1)
      const time1 = str.slice(0, 10)
      const time2 = str.slice(11, 19)
      this.videoStart =
        time1.replace(/_/g, '-') + ' ' + time2.replace(/_/g, ':')

      this.videoUrl = this.replaceUrl(this.videoUrl)
    },
    // 替换算法的图片和视频地址
    replaceUrl (srcUrl) {
      if (globalApi.viedoServer) {
        let s = srcUrl.indexOf('//')
        const str = srcUrl.slice(s + 2)
        s = str.indexOf('/')
        const url = globalApi.viedoServer + str.slice(s)
        return url
      } else return srcUrl
    },
    // 播放时间更新
    timeupdate () {
      if (this.isPlay) {
        this.curTime = Math.floor(this.$refs.player.player.currentTime())
      }
    },
    // 显示视频
    showVideo () {
      this.tabIndex = 1
      if (!this.timeInit) {
        this.timeInit = true
        this.$refs.timebar.init()
      }
    },
    // 播放完毕
    ended () {
      this.isPlay = false
    },
    // 播放
    play () {
      if (!this.videoUrl) return
      const me = this
      let isOn = false
      if (!this.url) {
        this.url = this.videoUrl
        isOn = true
      }
      this.$nextTick(() => {
        this.$refs.player.player.play()
        if (isOn) {
          this.$refs.player.player.on('timeupdate', this.timeupdate)
          this.$refs.player.player.on('ended', this.ended)
          this.$refs.player.player.on('error', function (error) {
            console.log(me.url + 'error: ' + JSON.stringify(error))
          })
          if (!this.videoInit) {
            this.$refs.player.player.on(
              'loadedmetadata',
              this.onLoadedMetadata
            )
            this.videoInit = true
          }
        }
        this.isPlay = true
      })
    },
    // 获取视频总时长
    onLoadedMetadata () {
      this.duration = this.$refs.player.player.duration()
      const me = this
      setTimeout(() => {
        me.pause()
      }, 200)
    },
    // 暂停
    pause () {
      this.$refs.player.player.pause()
      this.isPlay = false
    },
    // 停止
    stop () {
      this.isPlay = false
      this.url = ''
      this.curTime = 0
    },
    // 确认/误报
    confirmWarn (status) {
      const params = {
        id: this.info.id,
        status
      }
      this.$axios
        .post(structureApi.updateAlarm, params)
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.$message({
              message: '告警核实结果状态修改成功 !',
              type: 'success',
              duration: 3 * 1000
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 添加备注
    addRemark () {
      const params = {
        alarmId: this.info.id,
        authorId: JSON.parse(localStorage.getItem('userDetail')).customerId,
        authName: JSON.parse(localStorage.getItem('userDetail')).username,
        remark: this.remark
      }
      this.$axios
        .post(structureApi.insertAlarmRemark, params)
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.$message({
              message: '添加备注成功 !',
              type: 'success',
              duration: 3 * 1000
            })
            this.getRemarkList()
            this.remark = ''
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRemarkList () {
      const params = {
        alarmId: this.info.id,
        page: 1,
        sizeOfPage: 10000
      }
      this.$axios
        .post(structureApi.queryAlarmRemarkList, params)
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const data = res.data.data
            this.remarkList = data.data
          } else {
            this.remarkList = []
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    closeDialog () {
      this.$emit('close')
    },

    // 图片预览
    previewImg () {
      this.imgDialogVisible = true
      this.clickImgSrc = this.info.imageUrl
    }
  },

  watch: {
    dialogVisible: {
      handler (nv, ov) {
        if (nv) {
          this.info.imageUrl = this.replaceUrl(this.info.imageUrl)
          this.tabIndex = 0
          this.videoInit = false
          this.getRemarkList()
          this.duration = 0
          this.curTime = 0
          this.timeInit = false
          this.getStartTime()
          this.videoUrl = this.info.videoUrl
          if (!this.videoInit) {
            this.play()
          }
        } else if (this.url) {
          this.stop()
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-dialog-img {
  width: 130%;
  height: 116%;
  margin: -5% 0 0 -14.5%;
}
.detailInfo {
  /deep/.el-dialog {
    width: 908px;
    height: 600px;
    border: 1px solid #00a7e8;
    background: #00394c;
    .content-title {
      img {
        position: absolute;
        right: 12px;
        top: 14px;
        cursor: pointer;
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      ul.baseInfo {
        font-family: Source Han Sans CN;
        font-size: 16px;
        margin-top: 20px;
        font-weight: 500;
        color: #fff;
        li {
          margin-bottom: 12px;
          span.title {
            color: #00bde7;
          }
        }
      }
      div.btns {
        margin-top: 12px;
        div {
          display: inline-block;
          width: 88px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border: 1px solid #39a4dd;
          color: #39a4dd;
          cursor: pointer;
        }
        div:nth-child(1) {
          margin-right: 10px;
        }
        div:nth-child(2) {
          background: #39a4dd;
          color: #fff;
        }
      }
      div.remark {
        margin-top: 10px;
        .word {
          width: 337px;
          .el-textarea__inner {
            background: transparent;
            border: 1px solid #00a7e8;
            color: #00a7e8;
          }
        }
        > div:nth-child(1) {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #fefefe;
          margin-bottom: 10px;
        }
        .btns {
          width: 337px;
          text-align: right;
        }
        div.warningBox {
          box-sizing: border-box;
          width: 334px;
          background: #004157;
          padding: 9px;
          max-height: 184px;
          overflow-y: auto;
          margin-top: 10px;
          div.list {
            display: flex;
            justify-content: space-between;
            div.circle {
              width: 20px;
              height: 20px;
              text-align: center;
              line-height: 20px;
              background: #39a4dd;
              border-radius: 50%;
              font-size: 16px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #fefefe;
            }
            div.extra {
              width: 280px;
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              .descrip {
                color: #fefefe;
              }
              .time {
                color: #39a4dd;
                text-align: right;
                margin-top: 8px;
                margin-bottom: 15px;
              }
            }
          }
          div.empty {
            color: #fff;
            text-align: center;
          }
        }
      }
      div.rightInfo {
        width: 4.89rem;
        .tabs {
          width: 115px;
          height: 36px;
          background: #194a6f;
          border-radius: 2px;
          text-align: center;
          color: #fff;
          margin-bottom: 13px;
          span {
            display: inline-block;
            width: 115px;
            height: 100%;
            border-radius: 2px;
            line-height: 36px;
            cursor: pointer;
          }
          span.select {
            background: #39a4dd;
          }
        }
        .tabs.hasVideo {
          width: 230px;
        }
        .bigImg {
          width: 100%;
          height: 426px;
          position: relative;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
          span {
            position: absolute;
            border: 1px solid red;
          }
        }
        div.tools {
          padding-left: 8px;
          height: 40px;
          line-height: 40px;
          background: rgba(0, 0, 0, 0.8);
          span {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #ffffff;
            margin-right: 9px;
          }
        }
        .videoBox {
          width: 100%;
          .video {
            position: relative;
            width: 100%;
            height: 426px;
            margin-bottom: 4px;
          }
          .video.noVideo {
            background: url(../../assets/images/video.svg) no-repeat center
              center;
            background-color: #16789e;
          }
          .playBtns {
            position: absolute;
            bottom: 0px;
            height: 34px;
            width: 100%;
            background-color: rgba($color: #000000, $alpha: 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              margin-right: 19px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .el-dialog__header {
      padding: 0;
      .el-dialog__close {
        color: #fff;
        font-size: 18px;
      }
    }
    .el-dialog__body {
      padding: 22px;
    }
  }
}
</style>
