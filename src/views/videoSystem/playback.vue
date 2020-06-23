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
        <TimeBar :segments="records"></TimeBar>
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
import TimeBar from "./components/timeBar";
export default {
  name: "videoContainer",
  components: {
    VideoMain,
    Calendar,
    TimeBar
  },
  data() {
    return {
      showLeft: true,
      showRight: true,
      records: [{ start: 60, duration: 90 }]
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