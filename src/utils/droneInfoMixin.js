import { EventBus } from '@/utils/eventBus.js'
import MqttService from '@/utils/mqttService'
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
      bShowRouteStatus: true,
      bShowPuzzlingBox: false,
      tmpPuzzleLayers: [],
      lastPuzzleLayer: null,
      bShowPuzzleInMap: false,
      di_height: '',
      di_hSpeed: '',
      di_vSpeed: '',
      di_battery: '',
      di_longitude: '',
      di_latitude: ''
    }
  },

  created () {
    EventBus.$on('droneOffline', obj => {
      this.updateDroneStatus(obj)
    })
    EventBus.$on('droneCmdReq', obj => {
      this.handleDroneCmdReq(obj)
    })
    EventBus.$on('droneRealtimeInfo', obj => {
      this.updateDroneRealtimeInfo(obj)
    })
  },

  beforeDestroy () {
    EventBus.$off('droneOffline')
    EventBus.$off('droneCmdReq')
    EventBus.$off('droneCmdReq')
  },

  mounted () {
    // 创建飞机轨迹图层
    this.droneTrailLayer = this.$refs.gduMap.map2D.droneLayerManager.addTrailLayer(true)
    // 创建飞机标记图层
    this.droneMarkerLayer = this.$refs.gduMap.map2D.droneLayerManager.add(true)
    this.$refs.gduMap.map2D.setZoom(10)

    this.$refs.gduMap.map2D.droneDestinationManager.confirmDestinationClickEvent.addEventListener(this.confirmDestinationCB)
    this.$refs.gduMap.map2D.droneDestinationManager.cancelDestinationClickEvent.addEventListener(this.cancelDestinationCB)
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
        this.updataDIparams(null)
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
    updataDIparams (obj) {
      if (obj !== null) {
        this.di_height = obj.height
        this.di_hSpeed = obj.hSpeed
        this.di_vSpeed = obj.vSpeed
        this.di_battery = obj.batteryLeft
        this.di_longitude = parseFloat(obj.longitude).toFixed(7)
        this.di_latitude = parseFloat(obj.latitude).toFixed(7)

        if (obj.discern === '0') {
          this.bDetectStatus = false
        } else if (obj.discern === '1') {
          this.bDetectStatus = true
        }

        if (obj.mappingByRealTime === '0') {
          this.bPuzzlingStatus = false
        } else if (obj.mappingByRealTime === '1') {
          this.bPuzzlingStatus = true
        }
      } else {
        this.di_height = ''
        this.di_hSpeed = ''
        this.di_vSpeed = ''
        this.di_battery = ''
        this.di_longitude = ''
        this.di_latitude = ''
      }
    },
    // 飞机实时信息处理
    updateDroneRealtimeInfo (obj) {
      if (this.$refs.gduMap === undefined || this.$refs.gduMap.map2D === undefined) {
        return
      }

      if (obj.snCode === this.curDevCode) {
        this.updataDIparams(obj)
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
        try {
          this.updateDronePosition(this.droneInfo)
        } catch (error) {
          // console.log('updateDronePosition error:', error)
        }
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
      this.$refs.gduMap.map2D.droneDestinationManager.updateDronePosition(lonLat)
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
      const tmpMgr2 = this.$refs.gduMap.map2D.droneDestinationManager
      for (let i = 0; i < pointsNum; i++) {
        tmpMgr.updateDroneMarker(
          devCode,
          oldRecords[i].lonLat,
          oldRecords[i].angle,
          this.droneMarkerLayer
        )
        tmpMgr2.updateDronePosition(oldRecords[i].lonLat)
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
      let tmpStatus = this.bDetectStatus
      tmpStatus = !tmpStatus
      const tmpParams = { discern_open: 0 }
      if (tmpStatus) {
        tmpParams.discern_open = 1
      }
      const tmpTopic = 'gdu/discernControl/-1/' + this.curDevCode
      const tmpStr = JSON.stringify(tmpParams)
      // console.log('switchDetectStatus ... ' + tmpTopic + ':' + tmpStr)
      new MqttService().client.send(tmpTopic, tmpStr, 2)
    },
    // 设置无人机是否开启检测算法
    switchPuzzlingStatus () {
      // this.bPuzzlingStatus = !this.bPuzzlingStatus
      // this.bShowPuzzlingBox = !this.bShowPuzzlingBox
    },
    // 设置是否可以选定目标点
    switchSetPointStatus () {
      this.bSetPointStatus = !this.bSetPointStatus
      this.$refs.gduMap.map2D.droneDestinationManager.setDestEnable(this.bSetPointStatus)
      if (this._changeVideoAndMap && this.bSetPointStatus) {
        this._changeVideoAndMap(this.bSetPointStatus)
      }
    },
    // 设置是否显示无人机飞行轨迹
    switchShowRouteStatus () {
      this.bShowRouteStatus = !this.bShowRouteStatus
      this.droneTrailLayer.setVisible(this.bShowRouteStatus)
    },
    // 确认设置无人机目标点事件回调
    confirmDestinationCB (lonLat) {
      const tmpParams = { gps: [lonLat] }
      const tmpTopic = 'gdu/commandControl/-1/' + this.curDevCode
      const tmpStr = JSON.stringify(tmpParams)
      // console.log('confirmDestinationCB ... ' + tmpTopic + ':' + tmpStr)
      new MqttService().client.send(tmpTopic, tmpStr, 2)
    },
    // 取消无人机目标点事件回调
    cancelDestinationCB () {
      const tmpParams = { gps_cancel: 1 }
      const tmpTopic = 'gdu/commandControl/-1/' + this.curDevCode
      const tmpStr = JSON.stringify(tmpParams)
      // console.log('cancelDestinationCB ... ' + tmpTopic + ':' + tmpStr)
      new MqttService().client.send(tmpTopic, tmpStr, 2)
    },
    // 处理无人机指令响应回复
    handleDroneCmdReq (reqInfo) {
      if (this.$refs.gduMap === undefined || this.$refs.gduMap.map2D === undefined) {
        return
      }

      if (reqInfo.snCode === this.curDevCode) {
        if (reqInfo.cmdReq === 'gps_set') {
          console.log('handleDroneCmdReq : reqInfo.cmdReq === "gps_set"')
          this.$refs.gduMap.map2D.droneDestinationManager.destinationConfirmed()
        } else if (reqInfo.cmdReq === 'gps_cancel') {
          console.log('handleDroneCmdReq : reqInfo.cmdReq === "gps_cancel"')
        } else if (reqInfo.cmdReq === 'discern_set') {
          console.log('handleDroneCmdReq : reqInfo.cmdReq === "discern_set"')
        }
      }
    }
  }
}
export default droneInfoMixin
