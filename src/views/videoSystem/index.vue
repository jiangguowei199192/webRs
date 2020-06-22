<template>
  <div class="videoContainer">
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <div slot="left">
        <div>左</div>
      </div>
      <div slot="center">中</div>
      <div slot="right">右</div>
    </VideoMain>
  </div>
</template>
<script>
import VideoMain from './components/main'
export default {
  name: 'videoContainer',
  components: {
    VideoMain
  },
  data () {
    return {
      showLeft: true,
      showRight: true
    }
  },
  methods: {
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    closeRightInfo (type) {
      this.showRight = type !== 1
    }
  }
}
</script>
<style lang="less">
.videoContainer {
}
</style>
