<template>
  <div class="videoContainer">
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <div slot="left">左</div>
      <div slot="center">
      </div>
      <div slot="right">
        <Calendar></Calendar>
      </div>
    </VideoMain>
  </div>
</template>
<script>
import VideoMain from "./components/main";
import Calendar from "./components/calendar";
export default {
  name: "videoContainer",
  components: {
    VideoMain,
    Calendar
  },
  data() {
    return {
      showLeft: true,
      showRight: true
    };
  },
  methods: {
    closeLeftNav(type) {
      this.showLeft = type !== 1;
    },
    closeRightInfo(type) {
      this.showRight = type !== 1;
    }
  }
};
</script>
<style lang="less" scoped>
</style>