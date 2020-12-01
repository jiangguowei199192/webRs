<template>
  <div :style="'height:' + fullHeight + 'px;'" style="position: relative">
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
    <!-- 火情列表 -->
    <FireList class="fire-list" ref="fireList"></FireList>
  </div>
</template>

<script>
import videoMixin from '../videoSystem/mixins/videoMixin'
import createVueCompFunc from '@/utils/createVueComp'
import FireList from './components/fireList'
import droneInfo from './components/droneInfo'
import { EventBus } from '@/utils/eventBus.js'
import { decisionApi } from '@/api/decision'

export default {
  name: 'decision',

  components: {
    FireList
  },

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
    /**
     *  设置地图高度，避免F11全屏时，底部有空白
     */
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
    /**
     *  处理数据，便于地图组件加载显示
     */
    handerVideoDevice (dev) {
      if (dev.deviceTypeCode === 'GDJK') {
        dev.type = 'RP_Camera'
      } else if (dev.deviceTypeCode === 'WRJ') {
        dev.type = 'RP_Drone'
        dev.isOnline = dev.onlineStatus === 'online'
        if (dev.children && dev.children.length > 0) { dev.url = dev.children[0].streamUrl }
      }
      dev.name = dev.label
      dev.address = dev.deviceAddress
      dev.brand = dev.deviceBrand
      dev.longitude = dev.deviceLongitude
      dev.latitude = dev.deviceLatitude
    },
    /**
     *  新增显示高点或无人机设备
     */
    addDeviceCallback (devInfo) {
      this.handerVideoDevice(devInfo)
      this.$refs.gduMap.map2D.riverProtectionManager.addRpDatas([devInfo])
    },
    /**
     *  显示高点设备和无人机设备
     */
    getAllDeviceDoneCallback (cameraDevs, droneDevs) {
      cameraDevs.forEach((dev) => {
        this.handerVideoDevice(dev)
      })
      this.showRpDatas(cameraDevs)
      droneDevs.forEach((dev) => {
        this.handerVideoDevice(dev)
      })
      this.showRpDatas(droneDevs)
    },
    /**
     *  显示地图图层数据
     */
    showRpDatas (tmpDatas) {
      if (this.$refs.gduMap === undefined) return
      this.$refs.gduMap.map2D.riverProtectionManager.addRpDatas(tmpDatas)
      if (tmpDatas.length > 0) {
        this.$refs.gduMap.map2D.zoomToCenter(
          tmpDatas[0].longitude,
          tmpDatas[0].latitude
        )
        this.$refs.gduMap.map2D.setZoom(12)
      }
    },
    /**
     *  动态创建droneInfo组件
     */
    createDroneInfoCom (props) {
      return createVueCompFunc(droneInfo, props)
    },
    /**
     *  是否存在此飞机
     */
    hasDrone (id) {
      const d = this.droneDevArray.find(c => c.id === id)
      if (d === undefined) return false
      else return true
    },
    /**
     *  获取飞机
     */
    getDrone (id) {
      const d = this.droneDevArray.find(c => c.id === id)
      return d
    },
    /**
     *  获取消防机构列表
     */
    getDeptList () {
      this.$axios.get(decisionApi.getSimpleDeptList).then(res => {
        if (res.data.code === 0) {
          if (res.data.code === 0 && res.data.data) {
            let list = res.data.data
            list = JSON.parse(JSON.stringify(list).replace(/deptLatitude/g, 'latitude'))
            list = JSON.parse(JSON.stringify(list).replace(/deptLongitude/g, 'longitude'))
            list.forEach((m) => {
              m.type = 'RP_Institution'
            })
            if (this.$refs.gduMap === undefined) return
            this.$refs.gduMap.map2D.riverProtectionManager.addRpDatas(list)
          }
        }
      }).catch((error) => {
        console.log('decisionApi.getSimpleDeptList Err : ' + error)
      })
    },
    /**
     *  获取消防人员列表
     */
    getFireManList () {
      this.$axios.get(decisionApi.getFireManList).then(res => {
        if (res.data.code === 0 && res.data.data) {
          let list = res.data.data
          list = JSON.parse(JSON.stringify(list).replace(/policeLatitude/g, 'latitude'))
          list = JSON.parse(JSON.stringify(list).replace(/policeLongitude/g, 'longitude'))
          list.forEach((m) => {
            m.type = 'RP_Police'
          })
          if (this.$refs.gduMap === undefined) return
          this.$refs.gduMap.map2D.riverProtectionManager.addRpDatas(list)
        }
      }).catch((error) => {
        console.log('decisionApi.getFireManList Err : ' + error)
      })
    }
  },
  mounted () {
    this.$refs.gduMap.map2D.riverProtectionManager.setCreateVueCompFunc(this.createDroneInfoCom)
    EventBus.$on('droneOffline', obj => {
      if (this.hasDrone(obj.snCode) === false) return
      const d = this.getDrone(obj.snCode)
      d.isOnline = false
      this.$refs.gduMap.map2D.riverProtectionManager.updateDroneOnlineStatus(obj.snCode, false)
    })
    EventBus.$on('droneRealtimeInfo', obj => {
      if (this.hasDrone(obj.snCode) === false) return
      const d = this.getDrone(obj.snCode)
      if (d.isOnline === false) return
      // 更新飞机经纬度和方向角
      this.$refs.gduMap.map2D.riverProtectionManager.updateDroneMarker(obj.snCode, parseFloat(obj.latitude), parseFloat(obj.longitude), (parseFloat(obj.directionAngle) * Math.PI) / 180)
    })
    this.getDeptList()
    this.getFireManList()
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
    EventBus.$off('droneOffline')
    EventBus.$off('droneRealtimeInfo')
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
.fire-list {
  position: absolute;
  top: 50px;
  right: 50px;
}
</style>
