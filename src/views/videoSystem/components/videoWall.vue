<template>
  <div>
    <div class="videoContainer" ref="mainCtrl">
      <LivePlayer
        v-for="(player,index) in videoList"
        :key="index"
        :videoUrl="player.srcUrl"
        :show-custom-button="false"
        :muted="false"
        :controls="false"
        :autoplay="false"
        class="playerStyle"
        oncontextmenu="return false"
        fluent
        :live="player.isLive"
        :stretch="true"
      ></LivePlayer>
    </div>
    <div>
      <el-button @click="playAll">全部播放</el-button>
      <el-button @click="stopAll">全部停止</el-button>
      <el-button @click="fullScreen">全屏</el-button>
    </div>
  </div>
</template>
<script>
import LivePlayer from "@liveqing/liveplayer";
export default {
  data() {
    return {};
  },

  components: {
    LivePlayer
  },

  props: {
    videoList: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    playAll() {
      var list = [
        { srcUrl: "rtmp://116.85.50.50/live/zxstream", isLive: true },
        { srcUrl: "rtmp://116.85.50.50/live/zxstream", isLive: true }
      ];
      this.$emit("update:videoList", list);
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.mainCtrl.childNodes.length; i++) {
          var p = this.$refs.mainCtrl.childNodes[i].__vue__;
          p.play();
        }
      });
    },
    stopAll() {
      var list = [
        { srcUrl: "", isLive: true },
        { srcUrl: "", isLive: true }
      ];
      this.$emit("update:videoList", list);
    },
    fullScreen() {
      var p = this.$refs.mainCtrl.childNodes[0].__vue__;
      p.requestFullscreen();
    }
  }
};
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