<template>
  <div class="playerStyle">
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
    ></LivePlayer>
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
    // fullScreen () {
    //   var p = this.$refs.playerCtrl.player
    //   p.requestFullscreen()
    // }

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
}
</style>
