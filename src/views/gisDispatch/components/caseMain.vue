<template>
  <div class="caseMain">
    <gMap
      ref="gduMap"
      handleType="devMap"
      :bShowAllTools="showTool"
      :bShowLonLat="false"
      :bShowBasic="showTool"
      :bShowSelMap="showTool"
      :baseMapIndex="2"
      :bAutoLocate="false"
    ></gMap>
    <div class="overlayer"></div>
    <div class="mainContent">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
import camerBox from '../components/camerBox'
import droneBox from '../components/droneBox'
import caseBox from '../components/caseBox'
import createVueCompFunc from '@/utils/createVueComp'
export default {
  name: 'caseMain',
  data () {
    return {}
  },
  props: {
    showTool: {
      type: Boolean,
      required: false
    }
  },
  mounted () {
    const me = this
    window.onresize = () => {
      me.mapUpdateSize()
    }
    this.$nextTick(() => {
      this.mapUpdateSize()
      this.$refs.gduMap.map2D.measureTool.setLineStringCircleStyle({
        radius: 5,
        fillStyle: {
          color: 'rgba(0, 204, 255, 1)'
        },
        strokeStyle: {
          width: 2,
          color: 'rgba(0, 204, 255, 1)'
        }
      })
      this.$refs.gduMap.map2D.measureTool.setLenColor('rgb(0, 0, 0)')
    })
    this.$refs.gduMap.map2D.gisDispatchManager.setCreateVueCompFunc(
      this.createVueCom
    )
  },
  beforeDestroy () {
    if (this.$refs.gduMap) {
      this.$refs.gduMap.map2D.gisDispatchManager.removeAll()
    }
    window.onresize = null
  },
  methods: {
    addDatas (data) {
      if (!this.$refs.gduMap) return
      this.$refs.gduMap.map2D.gisDispatchManager.addDatas(data)
    },
    /**
     * 清屏
     */
    clearScreen (data) {
      this.$refs.gduMap.map2D.gisDispatchManager.removeAllOtherFeatures()
      this.$refs.gduMap.map2D.measureTool.clear()
    },
    /**
     * 在地图上添加案件标记
     */
    addCaseMarker (data) {
      if (!this.$refs.gduMap) return
      this.$refs.gduMap.map2D.gisDispatchManager.removeAllCase()
      this.$refs.gduMap.map2D.gisDispatchManager.addDatas(data)
    },
    /**
     *  动态创建vue组件
     */
    createVueCom (props) {
      if (props.dataInfo.type === 'RP_Camera') {
        return createVueCompFunc(camerBox, props)
      } else if (props.dataInfo.type === 'RP_Case') {
        return createVueCompFunc(caseBox, props)
      } else if (props.dataInfo.type === 'RP_Drone') {
        return createVueCompFunc(droneBox, props)
      }
    },
    /**
     * 刷新地图尺寸
     */
    mapUpdateSize () {
      if (this.$refs.gduMap) {
        this.$refs.gduMap.map2D._map.updateSize()
      }
    },
    /**
     * 地图定位
     */
    zoomToCenter (lon, lat) {
      this.$refs.gduMap.mapMoveTo(lon, lat)
    },
    /**
     * 测距
     */
    measureLenStart () {
      this.$refs.gduMap.map2D.measureTool.start()
    }
  }
}
</script>

<style lang="scss" scoped>
.caseMain {
  height: 1080px;
  position: relative;
  .overlayer {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: url(../../../assets/images/gisDispatch/bg.svg) no-repeat;
    pointer-events: none;
  }
  .mainContent {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0px;
    left: 0px;
    pointer-events: none;
  }
}
</style>
