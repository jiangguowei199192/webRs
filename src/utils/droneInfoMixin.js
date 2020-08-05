import { EventBus } from '@/utils/eventBus.js'
const droneInfoMixin = {
  data () {
    return {
      curDevCode: null,
      droneInfo: null,
      droneMarkerLayer: null,
      droneTrailLayer: null
    }
  },

  created () {
    EventBus.$on('droneOffline', obj => {
      this.updateDroneStatus(obj)
    })
    EventBus.$on('droneRealtimeInfo', obj => {
      this.updateDroneRealtimeInfo(obj)
    })
  },

  beforeDestroy () {
    EventBus.$off('droneOffline')
    EventBus.$off('droneRealtimeInfo')
  },

  mounted () {
    // 创建飞机标记图层
    this.droneMarkerLayer = this.$refs.gduMap.map2D.droneLayerManager.add(true)
    // 创建飞机轨迹图层
    this.droneTrailLayer = this.$refs.gduMap.map2D.droneLayerManager.addTrailLayer(true)
  },

  methods: {
    // 切换飞机编码
    setDroneDevCode (devCode) {
      if (this.curDevCode !== null) {
        this.delDroneInfo(this.curDevCode)
        this.curDevCode = null
      }
      this.curDevCode = devCode
      this.droneInfo = null
    },
    // 离线状态超时回调
    checkOfflineTimeout (droneInfo) {
      if (droneInfo.offline) {
        this.delDroneInfo(droneInfo.snCode)
        clearTimeout(droneInfo.timeout)
        droneInfo.timeout = undefined
      }
    },
    // 飞机下线处理
    updateDroneStatus (obj) {
      if (obj.snCode === this.curDevCode) {
        if (this.droneInfo !== null && this.droneInfo.offline === false) {
          this.droneInfo.offline = true
          this.setOfflineStyle(this.curDevCode, true)
          const that = this
          this.droneInfo.timeOut = setTimeout(() => {
            that.checkOfflineTimeout(that.droneInfo)
          }, 1 * 60 * 1000)
        }
      }
    },
    // 飞机实时信息处理
    updateDroneRealtimeInfo (obj) {
      if (obj.snCode === this.curDevCode) {
        if (this.droneInfo === null) {
          this.droneInfo = obj
        } else {
          if (this.droneInfo.offline) {
            this.droneInfo.offline = false
            if (this.droneInfo.timeout !== undefined) {
              clearTimeout(this.droneInfo.timeout)
              this.droneInfo.timeout = undefined
            }
            this.setOfflineStyle(this.curDevCode, false)
          }
        }
        this.updateDronePosition(this.droneInfo)
      }
    },
    // 设置飞机在线、离线样式(bOffline为true时表示离线样式)
    setOfflineStyle (devCode, bOffline) {
      this.$refs.gduMap.map2D.droneLayerManager.setDroneOffline(
        devCode,
        this.droneMarkerLayer,
        bOffline
      )
      this.$refs.gduMap.map2D.droneLayerManager.setDroneOffline(
        devCode,
        this.droneTrailLayer,
        bOffline
      )
    },
    // 删除飞机标记及轨迹
    delDroneInfo (devCode) {
      this.$refs.gduMap.map2D.droneLayerManager.deleteFeature(
        devCode,
        this.droneMarkerLayer
      )
      this.$refs.gduMap.map2D.droneLayerManager.deleteFeature(
        devCode,
        this.droneTrailLayer
      )
    },
    // 更新飞机位置、轨迹航向
    updateDronePosition (droneInfo) {
      var latLng = this.$refs.gduMap.map2D._algorithm.WGS2GCJ([
        parseFloat(droneInfo.longitude),
        parseFloat(droneInfo.latitude)
      ])
      this.$refs.gduMap.map2D.droneLayerManager.updateDroneMarker(
        droneInfo.snCode,
        latLng,
        (parseFloat(droneInfo.directionAngle) * Math.PI) / 180,
        this.droneMarkerLayer
      )
      this.$refs.gduMap.map2D.droneLayerManager.updateDroneTrail(
        droneInfo.snCode,
        latLng,
        this.droneTrailLayer
      )
    }
  }
}
export default droneInfoMixin
