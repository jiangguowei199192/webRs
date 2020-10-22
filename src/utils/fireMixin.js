import { fireApi } from '@/api/videoSystem/fireAlarm'
import { EventBus } from '@/utils/eventBus.js'
import { Message } from 'element-ui'
import { timeFormat } from '@/utils/date'
import globalApi from '../utils/globalApi'
const fireMixin = {
  data () {
    return {
      fireWarningArray: [], // 今日火情列表
      fireConfirmedNum: 0,
      fireTotalNum: 0,
      bAutoMove: true,
      copyCoordinate: '',
      imgDialogVisible: false,
      imgSrc: ''
    }
  },

  created () {
    if (this.bShowMarkersInMap) {
      // 监控获取火情报警信息完毕事件
      EventBus.$on('getFireAlarmInfos_Done', bFlag => {
        this.markFireWarnings()
      })
    }
    // 实时监控火情火点
    EventBus.$on('getFireAlarm', info => {
      if (info.alarmStatus !== 'mistaken') {
        info.bConfirmed = false
        info.alarmTime = timeFormat(info.alarmTime)
        this.handlingAlarmImgUrl(info)
        this.fireWarningArray.push(info)
        this.fireTotalNum = this.fireWarningArray.length
        if (this.bShowMarkersInMap) {
          this.addNewFireWarning(info)
        }
      }
    })
    // 获取火情报警信息
    this.getTodayFireAlarmInfos()
  },

  beforeDestroy () {
    if (this.bShowMarkersInMap) {
      EventBus.$off('getFireAlarmInfos_Done')
    }
    if (this.bRealTimeFireWarning) {
      EventBus.$off('getFireAlarm')
    }
  },

  mounted () {
    if (this.bShowMarkersInMap) {
      // 火情详情中点击复制经纬度按钮事件监听
      this.$refs.gduMap.map2D.devFireWarningLayerManager.popupCopyBtnClickEvent.addEventListener(
        this.copyCoordinateCB
      )
      // 火情详情中点击左侧火情图片事件监听
      this.$refs.gduMap.map2D.devFireWarningLayerManager.popupLeftImgClickEvent.addEventListener(
        this.callbackLeftImg
      )
      // 火情详情中点击居中火情图片事件监听
      this.$refs.gduMap.map2D.devFireWarningLayerManager.popupOneImgClickEvent.addEventListener(
        this.callbackMidImg
      )
      // 火情详情中点击右侧火情图片事件监听
      this.$refs.gduMap.map2D.devFireWarningLayerManager.popupRightImgClickEvent.addEventListener(
        this.callbackRightImg
      )
      // 火情详情中点击误报按钮事件监听
      this.$refs.gduMap.map2D.devFireWarningLayerManager.popupMisreportBtnClickEvent.addEventListener(
        this.callbackMistaken
      )
      // 火情详情中点击确认按钮事件监听
      this.$refs.gduMap.map2D.devFireWarningLayerManager.popupConfirmBtnClickEvent.addEventListener(
        this.callbackConfirmed
      )
    }
  },

  methods: {
    // 拼接火情报警图片Url
    handlingAlarmImgUrl (fire) {
      if (fire.alarmPicList && fire.alarmPicList.length > 0) {
        fire.alarmPicList.forEach(img => {
          // img.picPath = globalApi.baseUrl + '/video-service2' + img.picPath
          img.picPath = globalApi.headImg + img.picPath
        })
      }
    },
    // 火情结果数据处理
    handlingFireWarningData (fireDatas) {
      fireDatas.forEach(fire => {
        if (fire.alarmStatus !== 'mistaken') {
          fire.bConfirmed = false
          if (fire.alarmStatus === 'confirmed') {
            fire.bConfirmed = true
            this.fireConfirmedNum++
          }
          fire.alarmTime = timeFormat(fire.alarmTime)
          this.handlingAlarmImgUrl(fire)
          this.fireWarningArray.push(fire)
        }
      })
      this.fireTotalNum = this.fireWarningArray.length
      EventBus.$emit('getFireAlarmInfos_Done', true)
    },
    /** 获取今日火情警报信息 */
    getTodayFireAlarmInfos () {
      this.fireWarningArray = []
      this.$axios.get(fireApi.getTodayFireAlarmInfos).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.handlingFireWarningData(res.data.data)
        }
      })
    },
    /** 获取指定时间段内火情警报信息 */
    getDurationFireAlarmInfos (begin, end) {
      this.fireWarningArray = []
      const tmpDuration = { timeBegin: begin, timeEnd: end }
      this.$axios.get(fireApi.getDurationFireAlarmInfos, { params: tmpDuration }).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.handlingFireWarningData(res.data.data)
        }
      })
    },

    // 加载火情警报位置标记
    markFireWarnings () {
      if (
        this.$refs.gduMap !== undefined &&
        this.$refs.gduMap.map2D !== undefined
      ) {
        this.$refs.gduMap.map2D.devFireWarningLayerManager.clear()
        this.$refs.gduMap.map2D.devFireWarningLayerManager.addFireWarnings(
          this.fireWarningArray
        )
      }
    },
    // 新增火情警报
    addNewFireWarning (fire) {
      if (
        this.$refs.gduMap !== undefined &&
        this.$refs.gduMap.map2D !== undefined
      ) {
        this.$refs.gduMap.map2D.devFireWarningLayerManager.addOrUpdateFireWarning(
          fire
        )
      }
    },
    // 点击火情报警列表处理事件
    selectFireWarningHandler (item, index) {
      this.$refs.gduMap.showLayer('fire', true)
      this.$refs.gduMap.map2D.devCameraLayerManager.resetSelectedFeature()
      this.$refs.gduMap.map2D.devDroneLayerManager.resetSelectedFeature()
      const tmpMap = this.$refs.gduMap.map2D
      tmpMap.devFireWarningLayerManager.selectFeatureByID(item)
      if (this.bAutoMove) {
        tmpMap.setZoom(16)
        setTimeout(() => {
          tmpMap.zoomToCenter(item.alarmLongitude, item.alarmLatitude)
          const mapCenter = tmpMap._map.getView().getCenter()
          const tmpCenter = tmpMap._map.getPixelFromCoordinate(mapCenter)
          const newx = tmpCenter[0] - 100
          const newy = tmpCenter[1] - 120
          const newCenter = tmpMap._map.getCoordinateFromPixel([newx, newy])
          tmpMap.zoomToCenter(newCenter[0], newCenter[1])
        }, 10)
      }
    },
    // 火情报警弹窗中点击复制坐标回调函数
    copyCoordinateCB (info) {
      this.copyCoordinate = info.alarmLongitude + ',' + info.alarmLatitude
      this.$nextTick(() => {
        this.$refs.copyText.click()
        Message({
          message: '坐标已复制!',
          type: 'info',
          duration: 3 * 1000
        })
      })
    },
    // 复制坐标成功回调
    onCopyOK (e) {
      console.log(e)
    },
    // 复制坐标异常回调
    onCopyErr (e) {
      console.log(e)
    },
    // 关闭图片展示窗口
    closeImgDialog () {
      this.imgDialogVisible = false
    },
    // 点击详情中的图片后详情会关闭，使用此延迟将其再显示出来。
    delayShowFireDetailInfo (info) {
      setTimeout(() => {
        this.selectFireWarningHandler(info)
      }, 500)
    },
    // 火情报警弹窗中点击左侧图片(火情图片数组中第一张图片)回调事件
    callbackLeftImg (info) {
      this.imgSrc = info.alarmPicList[0].picPath
      this.imgDialogVisible = true
      this.delayShowFireDetailInfo(info)
    },
    // 火情报警弹窗中点击中间图片(火情图片数组中第一张图片)回调事件
    callbackMidImg (info) {
      this.imgSrc = info.alarmPicList[0].picPath
      this.imgDialogVisible = true
      this.delayShowFireDetailInfo(info)
    },
    // 火情报警弹窗中点击右侧图片(火情图片数组中第二张图片)回调事件
    callbackRightImg (info) {
      this.imgSrc = info.alarmPicList[1].picPath
      this.imgDialogVisible = true
      this.delayShowFireDetailInfo(info)
    },
    // 火情报警弹窗中点击误报按钮回调事件
    callbackMistaken (info) {
      const tmpPost =
        fireApi.confirmFireAlarmInfo + '/' + info.id + '/' + info.alarmStatus
      this.$axios.post(tmpPost).then(res => {
        if (res && res.data && res.data.code === 0) {
          var fire = this.fireWarningArray.find(c => c.id === info.id)
          if (fire !== undefined) {
            var index = this.fireWarningArray.indexOf(fire)
            this.fireWarningArray.splice(index, 1)
            this.fireTotalNum--
          }
        }
      })
    },
    // 火情报警弹窗中点击确认按钮回调事件
    callbackConfirmed (info) {
      const tmpPost =
        fireApi.confirmFireAlarmInfo + '/' + info.id + '/' + info.alarmStatus
      this.$axios.post(tmpPost).then(res => {
        if (res && res.data && res.data.code === 0) {
          var fire = this.fireWarningArray.find(c => c.id === info.id)
          if (fire !== undefined) {
            fire.bConfirmed = true
            fire.alarmStatus = info.alarmStatus
            this.fireConfirmedNum++
          }
        }
      })
    }
  }
}
export default fireMixin
