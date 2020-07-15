<template>
  <div class="playerStyle" @dblclick="fullScreen" >
    <LivePlayer
      ref="playerCtrl"
      :videoUrl="videoInfo.streamUrl"
      :show-custom-button="false"
      :muted="false"
      :controls="false"
      :autoplay="true"
      oncontextmenu="return false"
      fluent
      :live="videoInfo.isLive"
      aspect="fullscreen"
    >
      <div class="info">
        <span></span>
        <span>{{videoInfo.parentLabel}}</span>
      </div>
      <div class="fullScreen" v-show="videoInfo.isShowOperate||false" >
        <div class="deviceInfo">
          <div class="deviceTitle">云台</div>
          <div class="operate">
            <div class="icons">
              <div
                v-for="(item,index) in 9"
                :key="index"
                @click.stop="changeCurVideo(index)"
                :class="{active:activeCurIcon===index}"
              ></div>
            </div>
            <div class="btns">
              <div>
                <span :class="{active:zoom==1}" @click="zoom=1">+</span>
                <b>变倍</b>
                <span :class="{active:zoom==2}" @click="zoom=2">-</span>
              </div>
              <div>
                <span :class="{active:zoomLens==1}" @click="zoomLens=1">+</span>
                <b>变焦</b>
                <span :class="{active:zoomLens==2}" @click="zoomLens=2">-</span>
              </div>
              <div>
                <span :class="{active:zoomGuang==1}" @click="zoomGuang=1">+</span>
                <b>光圈</b>
                <span :class="{active:zoomGuang==2}" @click="zoomGuang=2">-</span>
              </div>
            </div>
            <div class="slider">
              <span class="demonstration">步速</span>
              <el-slider
                v-model="value2"
                :min="1"
                :max="8"
                style="width:91px;margin-left:16px;margin-right:8px;"
              ></el-slider>
              <span>{{value2}}</span>
            </div>
          </div>
        </div>
      </div>
    </LivePlayer>
  </div>
</template>
<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  data () {
    return {
      curTime: 0,
      curUrl: '',
      value2: 4, // 步速值
      activeCurIcon: '', // 默认选中云台的图标
      zoom: 0, // 变倍
      zoomLens: 0, // 变焦
      zoomGuang: 0 // 变光

    }
  },

  components: {
    LivePlayer
  },

  props: {
    videoInfo: {
      default: () => {}
    }
  },

  watch: {
    curTime (val) {
      var r = this.videoInfo.records.find(x => x.url === this.curUrl)
      if (r !== undefined) {
        this.$emit('timeupdateEvent', this.curTime + r.start * 60)
      }
    }
  },

  mounted () {
    if (this.videoInfo.isLive === false) {
      this.subEnded()
      this.subTimeupdate(this.videoInfo.timeupdate)
      this.curUrl = this.videoInfo.streamUrl
    }
  },

  methods: {
    play () {
      this.$refs.playerCtrl.player.play()
    },
    stopAll () {
      var videoInfo = { srcUrl: '', isLive: true }
      this.$emit('update:videoInfo', videoInfo)
    },

    /**
     * 跳转回放记录
     * @param {String} url 跳转记录的url
     * @param {Boolean} jump 是否需要快进
     * @param {jumpSeconds} url 快进的秒数
     */
    jumpRecord (url, jump, jumpSeconds) {
      this.pause()
      this.changeVideoUrl(url)
      if (jump === true) {
        setTimeout(() => {
          this.jumpToSeconds(jumpSeconds)
        }, 2000)
      }
    },

    /**
     * 全屏
     */
    fullScreen () {
      // 防止弹出全屏视频对话框后，player为null
      var player = this.$refs.playerCtrl.player
      if (player.isFullscreen()) {
        player.exitFullscreen()
      } else player.requestFullscreen()
      this.$emit('fullScreen', this.videoInfo)
    },

    /**
     * 跳转到XX秒开始播放
     * @param {Number} time xx秒
     */
    jumpToSeconds (time) {
      this.$refs.playerCtrl.player.currentTime(time)
    },

    /**
     * 暂停播放
     */
    pause () {
      this.$refs.playerCtrl.player.pause()
    },

    /**
     * 播放结束
     */
    ended: function () {
      if (this.videoInfo.isLive === false) {
        // 播放完成后，自动播放回放记录中的下一个mp4
        var r = this.videoInfo.records.find(x => x.url === this.curUrl)
        if (r !== undefined) {
          var index = this.videoInfo.records.indexOf(r)
          // 如果不是最后一个回放记录，就继续播放下一个记录
          if (index !== -1 && index < this.videoInfo.records.length - 1) {
            var url = this.videoInfo.records[index + 1].url
            console.log('继续播放下一个记录:' + url)
            this.changeVideoUrl(url)
          } else console.log(this.curUrl + '----最后一个回放记录播放完毕')
        }
      }
    },

    /**
     * 改变播放地址
     * @param {String} url 播放地址
     */
    changeVideoUrl (url) {
      this.$refs.playerCtrl.player.src([{ src: url }])
      this.curUrl = url
    },

    /**
     * 更新进度
     */
    timeupdate: function () {
      if (this.videoInfo.isLive === false) {
        this.curTime = Math.floor(this.$refs.playerCtrl.player.currentTime())
      }
    },

    /**
     * 订阅更新进度事件
     */
    subTimeupdate (isSub) {
      if (isSub === true) {
        // 防止回放视频已经播放完毕，没有触发timeupdate事件，而导致时间没有更新
        this.curTime = Math.floor(this.$refs.playerCtrl.player.currentTime())
        this.$refs.playerCtrl.player.on('timeupdate', this.timeupdate)
      } else {
        this.$refs.playerCtrl.player.off('timeupdate', this.timeupdate)
      }
    },

    /**
     * 订阅播放结束事件
     */
    subEnded () {
      this.$refs.playerCtrl.player.on('ended', this.ended)
    },
    // 检查全屏
    checkFull () {
      let isFull =
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },
    // 点击云台图标按钮，控制当前视频
    changeCurVideo (index) {
      console.log('当前选中' + this.curSelectedVideo)
      debugger
      this.activeCurIcon = index
      const params = {}
      switch (index) {
        case 0:
          params.leftRight = 1
          params.upDown = 1
          this.changeViewVideo(params)
          break
        case 1:
          params.upDown = 1
          break
        case 2:
          params.leftRight = 2
          params.upDown = 1
          break
        case 3:
          params.leftRight = 1
          break
        case 4:
          params.leftRight = 1
          break
        case 5:
          params.leftRight = 2
          break
        case 6:
          params.leftRight = 1
          params.upDown = 2
          break
        case 7:
          params.upDown = 2
          break
        case 8:
          params.leftRight = 2
          params.upDown = 2
          break
        default:
          break
      }
    },
    // 点击云台操作按钮
    changeViewVideo (params) {
      debugger
      this.$axios
        .get(
          'api/ptz/' +
            this.curSelectedVideo.deviceCode +
            '/' +
            this.curSelectedVideo.id
        )
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            debugger
          }
        })
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.playerStyle {
  position: relative;
  width: 100%;
  height: 100%;
  :focus {
    outline: none;
  }
}

.info {
  position: absolute;
  left: 10px;
  top: 10px;
  :nth-child(1) {
    position: relative;
    top: -2px;
    display: inline-block;
    width: 17px;
    height: 10px;
    background: url(../../../assets/images/videowall-play.png) no-repeat;
  }

  :nth-child(2) {
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    margin-left: 8px;
  }
}
.fullScreen {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 293px;
  height: 509px;
  background: url(../../../assets/images/full-screen-operate.png) no-repeat;
  .deviceInfo {
    .deviceTitle {
      box-sizing: border-box;
      width: 202px;
      height: 45px;
      padding-left: 50px;
      background: url(../../../assets/images/device/info-title.png) no-repeat;
      line-height: 45px;
      padding-left: 35px;
    }
    .operate {
      margin-top: 20px;
      .icons {
        display: flex;
        flex-wrap: wrap;
        padding-left: 48px;
        div {
          width: 48px;
          height: 48px;
          margin-right: 19px;
          margin-bottom: 19px;
          cursor: pointer;
        }
        div:nth-child(1) {
          background: url(../../../assets/images/device/7.png) no-repeat;
        }
        div:nth-child(1).active {
          background: url(../../../assets/images/device/7_selected.png)
            no-repeat;
        }
        div:nth-child(2) {
          background: url(../../../assets/images/device/8.png) no-repeat;
        }
        div:nth-child(2).active {
          background: url(../../../assets/images/device/8_selected.png)
            no-repeat;
        }
        div:nth-child(3) {
          background: url(../../../assets/images/device/9.png) no-repeat;
        }
        div:nth-child(3).active {
          background: url(../../../assets/images/device/9_selected.png)
            no-repeat;
        }
        div:nth-child(4) {
          margin-right: 10px;
          background: url(../../../assets/images/device/4.png) no-repeat;
        }
        div:nth-child(4).active {
          background: url(../../../assets/images/device/4_selected.png)
            no-repeat;
        }
        div:nth-child(5) {
          width: 64px;
          height: 64px;
          position: relative;
          top: -7px;
          // left: -5px;
          margin-right: 10px;
          background: url(../../../assets/images/device/5.png) no-repeat;
        }
        div:nth-child(5).active {
          background: url(../../../assets/images/device/5_selected.png)
            no-repeat;
        }
        div:nth-child(6) {
          background: url(../../../assets/images/device/6.png) no-repeat;
        }
        div:nth-child(6).active {
          background: url(../../../assets/images/device/6_selected.png)
            no-repeat;
        }
        div:nth-child(7) {
          background: url(../../../assets/images/device/1.png) no-repeat;
        }
        div:nth-child(7).active {
          background: url(../../../assets/images/device/1_selected.png)
            no-repeat;
        }
        div:nth-child(8) {
          background: url(../../../assets/images/device/2.png) no-repeat;
        }
        div:nth-child(8).active {
          background: url(../../../assets/images/device/2_selected.png)
            no-repeat;
        }
        div:nth-child(9) {
          background: url(../../../assets/images/device/3.png) no-repeat;
        }
        div:nth-child(9).active {
          background: url(../../../assets/images/device/3_selected.png)
            no-repeat;
        }
      }
      .btns {
        box-sizing: border-box;
        font-family: Source Han Sans CN;
        font-weight: 400;
        font-size: 18px;
        > div {
          width: 201px;
          height: 37px;
          line-height: 37px;
          text-align: center;
          margin-left: 39px;
          background: rgba(46, 108, 147, 1);
          border: 1px solid rgba(28, 161, 220, 1);
          color: #84ddff;
          display: flex;
          justify-content: space-between;
          margin-bottom: 13px;
          span {
            display: inline-block;
            width: 48px;
            font-size: 24px;
            cursor: pointer;
          }
          span:nth-child(1):after {
            content: "|";
            position: relative;
            left: 15px;
            color: #1ca1dc;
          }
          span:nth-child(3):before {
            content: "|";
            position: relative;
            left: -15px;
            color: #1ca1dc;
          }
          span.active {
            background: linear-gradient(
              90deg,
              rgb(32, 72, 105) 0%,
              rgb(32, 72, 105) 100%
            );
          }
          span:nth-child(1).active:after {
            content: "";
          }
          span:nth-child(3).active:before {
            content: "";
          }
        }
      }
      .slider {
        display: flex;
        padding-left: 39px;

        span {
          line-height: 38px;
        }
        span.demonstration {
          font-weight: bold;
          color: rgba(132, 221, 255, 1);
        }
        span:nth-child(3) {
          display: inline-block;
          width: 38px;
          height: 24px;
          background: rgba(46, 108, 147, 1);
          border: 1px solid rgba(28, 161, 220, 1);
          border-radius: 10px;
          text-align: center;
          position: relative;
          top: 5px;
          line-height: 24px;
        }
        /deep/.el-slider__bar {
          background-color: #84ddff;
        }
        /deep/.el-slider__button {
          background-color: #84ddff;
        }
      }
    }
  }
}
</style>
