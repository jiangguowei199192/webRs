<template>
  <div>
    <div class="videoContainer">
      <LivePlayer
        ref="playerCtrl"
        :videoUrl="videoInfo.srcUrl"
        :show-custom-button="false"
        :muted="false"
        :controls="false"
        :autoplay="false"
        class="playerStyle"
        oncontextmenu="return false"
        fluent
        :live="videoInfo.isLive"
        :stretch="true"
      ></LivePlayer>
    </div>
  </div>
</template>
<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  data () {
    return {}
  },

  components: {
    LivePlayer
  },

  props: {
    videoInfo: {
      default: () => ''
    }
  },

  methods: {
    playAll () {
      var videoInfo = {
        srcUrl: 'rtmp://116.85.50.50/live/zxstream',
        isLive: true
      }

      this.$emit('update:videoInfo', videoInfo)
      this.$nextTick(() => {
        var p = this.$refs.playerCtrl.player
        p.play()
      })
    },
    stopAll () {
      var videoInfo = { srcUrl: '', isLive: true }
      this.$emit('update:videoInfo', videoInfo)
    },
    fullScreen () {
      var p = this.$refs.playerCtrl.player
      p.requestFullscreen()
    }
  }
}
</script>
<style lang="less" scoped>
.videoContainer {
  display: flex;
}

.playerStyle {
  margin-left: 10px;
  width: 48%;
  height: 360px;
}
</style>
