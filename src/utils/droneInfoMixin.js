import { EventBus } from '@/utils/eventBus.js'
const droneInfoMixin = {
  data () {
    return {
      curDevCode: null,
      droneInfo: null,
      latestDronesInfo: {},
      bSaveMultiDroneInfos: false,
      dronesInfos: {},
      droneMarkerLayer: null,
      droneTrailLayer: null,
      bDetectStatus: false,
      bPuzzlingStatus: false,
      bSetPointStatus: false,
      bShowRouteStatus: true
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

  mounted () {
    // 创建飞机轨迹图层
    this.droneTrailLayer = this.$refs.gduMap.map2D.droneLayerManager.addTrailLayer(true)
    // 创建飞机标记图层
    this.droneMarkerLayer = this.$refs.gduMap.map2D.droneLayerManager.add(true)
    this.$refs.gduMap.map2D.setZoom(10)
  },

  methods: {
    // 切换飞机编码
    setDroneDevCode (devCode) {
      if (this.curDevCode !== null) {
        if (this.curDevCode === devCode) return
        this.delDroneInfo(this.curDevCode)
      }
      this.curDevCode = devCode
      this.droneInfo = null
      if (this.dronesInfos[this.curDevCode] !== undefined) {
        this.showDroneRecordsInMap(this.curDevCode, this.dronesInfos[this.curDevCode])
      }
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
      if (this.$refs.gduMap === undefined || this.$refs.gduMap.map2D === undefined) {
        return
      }

      if (obj.snCode === this.curDevCode) {
        if (this.droneInfo === null && this.dronesInfos[obj.snCode] === undefined) {
          this.droneInfo = obj
          this.mapMoveToDronePosition(obj)
        } else {
          let tmpOffline = false
          let tmpTimeout
          if (this.droneInfo !== null) {
            tmpOffline = this.droneInfo.offline
            tmpTimeout = this.droneInfo.timeout
          }
          this.droneInfo = obj
          this.droneInfo.offline = tmpOffline
          this.droneInfo.timeout = tmpTimeout
          this.latestDronesInfo[this.droneInfo.snCode] = this.droneInfo
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

      if (this.bSaveMultiDroneInfos) {
        var lonLat = this.$refs.gduMap.map2D._algorithm.WGS2GCJ([
          parseFloat(obj.longitude),
          parseFloat(obj.latitude)
        ])
        if (this.dronesInfos[obj.snCode] === undefined) {
          this.dronesInfos[obj.snCode] = []
        }
        const tmpInfo = {}
        tmpInfo.lonLat = lonLat
        tmpInfo.angle = (parseFloat(obj.directionAngle) * Math.PI) / 180
        this.dronesInfos[obj.snCode].push(tmpInfo)
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
    // 地图移动到飞机初始位置，调整地图层级
    mapMoveToDronePosition (droneInfo) {
      var lonLat = this.$refs.gduMap.map2D._algorithm.WGS2GCJ([
        parseFloat(droneInfo.longitude),
        parseFloat(droneInfo.latitude)
      ])
      this.$refs.gduMap.map2D.zoomToCenter(lonLat[0], lonLat[1])
    },
    // 更新飞机位置、轨迹航向
    updateDronePosition (droneInfo) {
      var lonLat = this.$refs.gduMap.map2D._algorithm.WGS2GCJ([
        parseFloat(droneInfo.longitude),
        parseFloat(droneInfo.latitude)
      ])
      this.$refs.gduMap.map2D.droneLayerManager.updateDroneMarker(
        droneInfo.snCode,
        lonLat,
        (parseFloat(droneInfo.directionAngle) * Math.PI) / 180,
        this.droneMarkerLayer
      )
      this.$refs.gduMap.map2D.droneLayerManager.updateDroneTrail(
        droneInfo.snCode,
        lonLat,
        this.droneTrailLayer
      )
    },
    // 显示保存的飞机轨迹
    showDroneRecordsInMap (devCode, oldRecords) {
      const pointsNum = oldRecords.length
      const tmpMgr = this.$refs.gduMap.map2D.droneLayerManager
      for (let i = 0; i < pointsNum; i++) {
        tmpMgr.updateDroneMarker(
          devCode,
          oldRecords[i].lonLat,
          oldRecords[i].angle,
          this.droneMarkerLayer
        )
        tmpMgr.updateDroneTrail(
          devCode,
          oldRecords[i].lonLat,
          this.droneTrailLayer
        )
      }
      if (pointsNum > 0) {
        this.$refs.gduMap.map2D.zoomToCenter(oldRecords[pointsNum - 1].lonLat[0],
          oldRecords[pointsNum - 1].lonLat[1])
      }
    },
    // 设置无人机是否开启检测算法
    switchDetectStatus () {
      this.bDetectStatus = !this.bDetectStatus
    },
    // 设置无人机是否开启检测算法
    switchPuzzlingStatus () {
      this.bPuzzlingStatus = !this.bPuzzlingStatus
    },
    // 设置是否可以选定目标点
    switchSetPointStatus () {
      this.bSetPointStatus = !this.bSetPointStatus
    },
    // 设置是否显示无人机飞行轨迹
    switchShowRouteStatus () {
      this.bShowRouteStatus = !this.bShowRouteStatus
      this.droneTrailLayer.setVisible(this.bShowRouteStatus)
    }
  }
}
export default droneInfoMixin
