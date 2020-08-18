<template>
  <div class="mapcontainer">
    <Map :url="configUrl" :widgetUrl="widgetUrl"  @onload="onMapload" />
    <div class="bottom"></div>
    <div class="tabs">
      <div
        v-for="(item,index) in 8"
        :key="index"
        :class="{active:activeIndex==index}"
        @click.stop="tabTo(index)"
      ></div>
    </div>
  </div>
</template>

<script>
import Map from './components/marsMap.vue'
import $ from 'jquery'
export default {
  data () {
    return {
      activeIndex: 0,
      configUrl: 'config/config.json',
      widgetUrl: 'config/widget.json',
      viewer: ''
    }
  },
  components: {
    Map
  },
  methods: {

    tabTo (index) {
      this.activeIndex = index
    },

    /**
     *  地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
      // 隐藏位置信息状态
      viewer.mars.location.show = false
      // 隐藏比例尺
      $('#distanceLegendDiv').hide()
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.mapcontainer {
  position: relative;
  height: 890px;
  overflow: hidden;

  .bottom {
    display: inline-block;
    position: absolute;
    bottom: 0px;
    width: 1536px;
    height: 84px;
    left: 50%;
    transform: translateX(-50%);
    background: url(../../assets/images/3d/bottom.png) no-repeat;
  }

  .tabs {
    display: flex;
    position: absolute;
    bottom: 37px;
    left: 50%;
    transform: translateX(-50%);
    div {
      width: 69px;
      height: 79px;
      cursor: pointer;
      margin-right: 39px;
    }
    .active {
      transform: scale(1.2);
    }
    div:nth-child(1) {
      background: url(../../assets/images/3d/gis.png) no-repeat;
    }
    div:nth-child(2) {
      background: url(../../assets/images/3d/water.png) no-repeat;
    }
    div:nth-child(3) {
      background: url(../../assets/images/3d/fire.png) no-repeat;
    }
    div:nth-child(4) {
      background: url(../../assets/images/3d/area.png) no-repeat;
    }
    div:nth-child(5) {
      background: url(../../assets/images/3d/draw.png) no-repeat;
    }
    div:nth-child(6) {
      background: url(../../assets/images/3d/vr.png) no-repeat;
    }
    div:nth-child(7) {
      background: url(../../assets/images/3d/paper.png) no-repeat;
    }
    div:nth-child(8) {
      background: url(../../assets/images/3d/edit.png) no-repeat;
    }
  }
}
</style>
