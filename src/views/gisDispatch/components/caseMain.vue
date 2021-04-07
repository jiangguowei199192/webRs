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
    this.$refs.gduMap.map2D.measureTool.drawEndEvent.addEventListener(
      this.measureToolDrawEnd.bind(this)
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
     * 测量工具绘制一次完毕回调
     */
    measureToolDrawEnd () {
      this.$refs.gduMap.map2D.measureTool.stop()
    },
    /**
     * 添加线和面资源
     */
    addRouteOrLineDatas (data) {
      if (!this.$refs.gduMap) return
      this.$refs.gduMap.map2D.gisDispatchManager.addRouteOrLineDatas(data)
    },
    /**
     * 加载圆形围栏范围内的资源
     */
    addDatasInRadius (data, rCenrer, radius) {
      if (!this.$refs.gduMap) return
      return this.$refs.gduMap.map2D.gisDispatchManager.addDatasInRadius(
        data,
        rCenrer,
        radius
      )
    },
    /**
     * 加载圆形围栏范围内的线资源
     */
    addDatasInRadius2 (data, rCenrer, radius) {
      if (!this.$refs.gduMap) return
      return this.$refs.gduMap.map2D.gisDispatchManager.addDatasInRadius2(
        data,
        rCenrer,
        radius
      )
    },
    /**
     * 除去除了案件外的所有资源
     */
    clearAllOtherFeatures () {
      this.$refs.gduMap.map2D.gisDispatchManager.removeAllOtherFeatures()
    },
    /**
     * 更新案件范围
     */
    updateCaseRadius (data, radius) {
      this.$refs.gduMap.map2D.gisDispatchManager.updateCaseRadius(data, radius)
    },
    /**
     * 清屏
     */
    clearScreen () {
      this.$refs.gduMap.map2D.gisDispatchManager.removeAllOtherFeatures()
      this.$refs.gduMap.map2D.measureTool.clear()
      this.$emit('clearScreen')
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
     * 在地图上添加圆形围栏
     */
    addOrUpdateFence (data, radius) {
      this.$refs.gduMap.map2D.gisDispatchManager.addOrUpdateFence(data, radius)
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
    zoomToCenter (lon, lat, zoom) {
      this.$refs.gduMap.mapMoveTo(lon, lat, zoom)
      this.$refs.gduMap.map2D.setZoom(zoom)
    },
    /**
     * 测距
     */
    measureLenStart () {
      this.$refs.gduMap.map2D.measureTool.start()
    },
    /**
     * 更新飞机标记
     */
    updateDroneMarker (id, latitude, longitude, directionAngle) {
      this.$refs.gduMap.map2D.gisDispatchManager.updateDroneMarker(
        id,
        parseFloat(latitude),
        parseFloat(longitude),
        (parseFloat(directionAngle) * Math.PI) / 180
      )
    },
    /**
     * 隐藏/显示图层
     */
    showOrHideLayer (isShow, id) {
      switch (id) {
        case 0:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerInstitutionVisible(
            isShow
          )
          break
        case 1:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerMemberVisible(
            isShow
          )
          break
        case 2:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerDroneVisible(
            isShow
          )
          break
        case 3:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerCameraVisible(
            isShow
          )
          break
        case 4:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerAreaVisible(
            isShow
          )
          break
        case 5:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerRouteVisible(
            isShow
          )
          break
        case 6:
          this.$refs.gduMap.map2D.gisDispatchManager.setLayerPointVisible(
            isShow
          )
          break
        default:
          break
      }
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
