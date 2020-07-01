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
export default {
  data () {
    return {}
  },

  components: {
    LivePlayer
  },

  props: {
    videoInfo: {
      default: () => {}
    }
  },

  mounted () {
    player = this.$refs.playerCtrl.player
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
      if (player.isFullscreen()) { player.exitFullscreen() } else player.requestFullscreen()
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
