<template>
  <div class="playerStyle" @dblclick="fullScreen">
    <LivePlayer
      ref="playerCtrl"
      :videoUrl="videoInfo.srcUrl"
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
        <span>发展大道黄埔大街</span>
      </div>
    </LivePlayer>
  </div>
</template>
<script>
import LivePlayer from '@liveqing/liveplayer'
var player
var that
export default {
  data () {
    return {
      curTime: 0
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
      var r = this.videoInfo.records.find(x => x.url === this.videoInfo.srcUrl)
      if (r !== undefined) {
        this.$emit('timeupdateEvent', this.curTime + r.start * 60)
      }
    }
  },

  mounted () {
    that = this
    player = this.$refs.playerCtrl.player
    // player.on('timeupdate', function () {
    //   console.log('555555555')
    // })

    // player.on('play', function () {
    //   console.log('视频开始播放')
    // }

    player.on('ended', function () {
      that.ended()
    })
  },

  methods: {
    play () {
      player.play()
    },
    stopAll () {
      var videoInfo = { srcUrl: '', isLive: true }
      this.$emit('update:videoInfo', videoInfo)
    },

    /**
     * 全屏
     */
    fullScreen () {
      if (player.isFullscreen()) {
        player.exitFullscreen()
      } else player.requestFullscreen()
    },

    /**
     * 跳转到XX秒开始播放
     * @param {Number} time xx秒
     */
    jumpToSeconds (time) {
      player.currentTime(time)
    },

    /**
     * 暂停播放
     */
    pause () {
      player.pause()
    },

    /**
     * 播放结束
     */
    ended () {
      if (this.videoInfo.isLive === false) {
        // 播放完成后，自动播放回放记录中的下一个mp4
        var r = this.videoInfo.records.find(x => x.url === this.videoInfo.srcUrl)
        if (r !== undefined) {
          var index = this.videoInfo.records.indexOf(r)
          // 如果不是最后一个回放记录，就继续播放下一个记录
          if (index !== -1 && index < this.videoInfo.records.length - 1) {
            this.videoInfo.srcUrl = this.videoInfo.records[index + 1].url
            console.log('继续播放下一个记录')
          }
        }
      }
    },

    /**
     * 更新进度
     */
    timeupdate: function () {
      if (this.videoInfo.isLive === false) {
        // console.log('111111111111')
        this.curTime = Math.floor(player.currentTime())
      }
    },

    /**
     * 订阅更新进度事件
     */
    subTimeupdate (isSub) {
      if (isSub === true) {
        player.on('timeupdate', this.timeupdate)
      } else {
        player.off('timeupdate', this.timeupdate)
      }
    }

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
</style>
