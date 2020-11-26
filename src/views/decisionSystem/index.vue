<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_2.0
 * @Author: liangkaiLee
 * @Date: 2020-11-03 14:44:56
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2020-11-25 10:04:18
-->
<template>
  <div :style="'height:' + fullHeight + 'px;'">
    <gMap
      ref="gduMap"
      handleType="search_route"
      :bShowSearchTools="true"
      :bShowBasic="true"
      :bShowSelLayer="false"
      :bShowLonLat="false"
      :bShowMeasure="false"
      :bShowBottomMenu="true"
    ></gMap>
  </div>
</template>

<script>
import videoMixin from '../videoSystem/mixins/videoMixin'
export default {
  name: 'decision',
  watch: {
    $route: 'refresh'
  },
  data () {
    return {
      minHeight: 900,
      fullHeight: 0
    }
  },
  mixins: [videoMixin],
  methods: {
    // 设置地图高度，避免F11全屏时，底部有空白
    setMapHeight () {
      const tmpMap = this.$refs.gduMap.map2D
      var h = document.documentElement.clientHeight - 96
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
      setTimeout(() => {
        tmpMap._map.updateSize()
      }, 200)
    },
    refresh () {
      this.$refs.gduMap.routeOrCloseFunc()
    },
    refreshWinSize () {
      if (document.createEvent) {
        var event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, true)
        window.dispatchEvent(event)
      } else if (document.createEventObject) {
        window.fireEvent('onresize')
      }
    },
    // 处理数据，便于地图组件加载显示
    handerVideoDevice (dev) {
      if (dev.deviceTypeCode === 'GDJK') {
        dev.type = 'RP_Camera'
      } else if (dev.deviceTypeCode === 'WRJ') {
        dev.type = 'RP_Drone'
      }
      dev.name = dev.label
      dev.address = dev.deviceAddress
      dev.brand = dev.deviceBrand
      dev.longitude = dev.deviceLongitude
      dev.latitude = dev.deviceLatitude
    },
    // 新增显示高点或无人机设备
    addDeviceCallback (devInfo) {
      this.handerVideoDevice(devInfo)
      this.$refs.gduMap.map2D.riverProtectionManager.addRpDatas([devInfo])
    },
    // 显示高点设备和无人机设备
    getAllDeviceDoneCallback (cameraDevs, droneDevs) {
      cameraDevs.forEach(dev => {
        this.handerVideoDevice(dev)
      })
      this.showRpDatas(cameraDevs)
      droneDevs.forEach(dev => {
        this.handerVideoDevice(dev)
      })
      this.showRpDatas(droneDevs)
    },
    // 显示长江大保护数据层信息
    showRpDatas (tmpDatas) {
      if (this.$refs.gduMap === undefined) return
      this.$refs.gduMap.map2D.riverProtectionManager.addRpDatas(tmpDatas)
      if (tmpDatas.length > 0) {
        this.$refs.gduMap.map2D.zoomToCenter(tmpDatas[0].longitude, tmpDatas[0].latitude)
        this.$refs.gduMap.map2D.setZoom(12)
      }
    }
  },
  activated () {
    this.refreshWinSize()
    this.setMapHeight()
    const me = this
    window.onresize = () => {
      me.setMapHeight()
    }
  },
  deactivated () {
    window.onresize = null
  },

  beforeDestroy () {
    this.$refs.gduMap.map2D.riverProtectionManager.removeAll()
  },

  beforeRouteLeave (to, from, next) {
    if (to.name === 'fightDeploy') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
</style>
