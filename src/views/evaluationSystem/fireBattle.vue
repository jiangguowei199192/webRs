<template>
  <div class="battleBox" :style="'height:'+fullHeight+'px;'">
    <div
      class="marsBox mars3d"
      :class="{marsBoxSmallScreen:fullscreenMap}"
      @dblclick.capture="masDbClick"
      v-show="show3d"
    >
      <Map :url="configUrl" :showOpenAnimation="false" :showCompass="false" @onload="onMapload" />
    </div>
    <div class="mapBox" :class="{mapBoxFullScreen:fullscreenMap}">
      <div class="map" @dblclick.capture="mapDbClick">
        <gMap
          ref="gduMap"
          :baseMapIndex="0"
          :bShowSimpleSearchTools="false"
          :bShowBasic="fullscreenMap"
          :bShowSelLayer="false"
          :bShowMeasure="false"
          :bShowLonLat="false"
        ></gMap>
      </div>
    </div>
    <div class="list webFsScroll">
      <div
        v-for="(item,index) in combatEvents"
        :key="index"
        :class="{active:activeIndex==index}"
        @click="changeEvent(index,true)"
      >
        <span :style="{background: 'url('+ serverUrl + item.icon +')'}"></span>
        <span></span>
        <span>{{item.eventName}}</span>
      </div>
    </div>
    <div class="describeBox">
      <div class="title">
        <span></span>
        <span>{{curEvent.eventName}}</span>
      </div>
      <span class="txt">{{curEvent.eventDescription}}</span>
      <img class="img" :src="serverUrl + imgPath" v-show="imgPath" />
      <div class="playerBox" v-show="videoUrl">
        <LivePlayer
          :videoUrl="videoUrl"
          :show-custom-button="false"
          :muted="false"
          :controls="false"
          :autoplay="true"
          oncontextmenu="return false"
          fluent
          :stretch="true"
          :live="false"
          aspect="fullscreen"
          :poster="poster"
        ></LivePlayer>
      </div>
    </div>
    <span class="ball"></span>
    <div class="titleBox">
      <span>{{timeFormat(timeStart)}}</span>
      <span></span>
      <span>{{fireName}}</span>
    </div>
    <span class="more"></span>
    <div class="dataBox">
      <div class="total">
        <span>总用时</span>
        <span></span>
        <span>当前</span>
        <span></span>
      </div>
      <div class="time" style="margin-right:40px;">{{duration}}min</div>
      <div class="time">74min</div>
      <ul>
        <li>
          <div>
            <span class="img"></span>
            <div>
              <span>出勤车辆</span>
              <span>{{car}}辆</span>
            </div>
            <div>
              <span>未到</span>
              <span class="redTxt">{{unCar}}辆</span>
            </div>
          </div>
        </li>
        <li>
          <div>
            <span class="img fireman"></span>
            <div>
              <span>出勤人数</span>
              <span>{{people}}人</span>
            </div>
            <div>
              <span>未到</span>
              <span class="redTxt">{{unPeople}}人</span>
            </div>
          </div>
        </li>
        <li>
          <div>
            <span class="img drone"></span>
            <div>
              <span>出勤无人机</span>
              <span>{{uav}}架</span>
            </div>
            <div>
              <span>未到</span>
              <span class="redTxt">{{unUav}}架</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="title">
        <span></span>
        <span>救援物资统计</span>
      </div>
      <div class="chartBox" id="chart"></div>
    </div>
    <div class="backDiv" @click.stop="back">
      <span></span>
      <span>返回</span>
    </div>
    <div class="bar">
      <span class="play" v-show="!isPlay" @click.stop="play(true)"></span>
      <span class="play pause" v-show="isPlay" @click.stop="play(false)"></span>
      <div class="timeBox">
        <span>{{timeFormat(timeStart)}}</span>
        <span>{{timeFormat(timeEnd)}}</span>
        <span v-drag="me" id="pointer"></span>
        <transition name="fade">
          <span id="curTime" v-show="showCurTime">{{timeFormat(curTime)}}</span>
        </transition>
        <div
          class="time"
          id="timeBar"
          @click.stop="timeBarClick"
          @mouseenter="timeBarMousemove"
          @mousemove="timeBarMousemove"
          @mouseleave="showCurTime = false"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from '../decisionSystem/components/marsMap.vue'
import { timeFormat } from '@/utils/date'
import globalApi from '@/utils/globalApi'
import LivePlayer from '@liveqing/liveplayer'
import { battleApi } from '@/api/battle'
import { EventBus } from '@/utils/eventBus.js'
import { CartesianToDegrees } from '@/utils/mars3d'
var mars3d = window.mars3d
var Cesium = window.Cesium
export default {
  name: 'evaluation',
  data () {
    return {
      minHeight: 982,
      fullHeight: 0,
      configUrl: 'config/config.json',
      activeIndex: 0,
      fullscreenMap: false,
      me: '',
      minLeft: 0,
      maxLeft: 0,
      showCurTime: false,
      hideTimeout: '',
      timeStart: 0,
      timeEnd: 0,
      curTime: '',
      curTimeSpan: '',
      isPlay: false, // 播放战评
      detail: '', // 战评详情
      people: 0,
      uav: 0,
      car: 0,
      unPeople: 0, // 未到人数
      unUav: 0, // 未到无人机
      unCar: 0, // 未到车辆
      fireName: '',
      duration: 0,
      combatEvents: [],
      serverUrl: globalApi.headImg,
      show3d: true, // 是否显示三维
      curEvent: '',
      imgPath: '',
      videoUrl: '',
      poster: require('../../assets/images/loading.gif'),
      topicId: '', // 战评回放主题id
      bIsFirstLonLat: true,
      needCenter: true
    }
  },
  components: {
    Map,
    LivePlayer
  },
  // 注册局部组件指令
  directives: {
    drag: function (el, binding) {
      const me = binding.value
      const dragBox = el // 获取当前元素
      dragBox.onmousedown = e => {
        me.isDrag = true
        if (me.timeout) {
          clearTimeout(me.timeout)
          me.timeout = null
        }
        // 阻止事件冒泡
        if (e.stopPropagation) e.stopPropagation()
        else e.cancelBubble = true

        // 算出鼠标相对元素的位置
        const disX = e.clientX - dragBox.offsetLeft
        me.setCurrentTime(dragBox.offsetLeft + dragBox.clientWidth / 2)
        document.onmousemove = e => {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          // 左边界限制
          if (left < me.minLeft) {
            left = me.minLeft
          } else if (left > me.maxLeft) {
            // 右边限制
            left = me.maxLeft
          }
          // 移动当前元素
          dragBox.style.left = left + 'px'
          me.setCurrentTime(left + dragBox.clientWidth / 2)
        }
        document.onmouseup = e => {
          // 鼠标弹起来的时候不再移动
          document.onmousemove = null
          // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null
          me.hideCurrentTime()
          if (me.isPlay) { this.jumpPlayback(me.curTimeSpan) }
        }
      }
    }
  },
  mounted () {
    this.initChartData()
    this.setBattleInitData()
    this.getDragParam()
    this.setMapHeight()
    const me = this
    window.onresize = () => {
      me.setMapHeight()
      me.getDragParam()
    }
    this.setTimePointer(this.timeStart)
    this.me = this
    // 战评回放
    EventBus.$on('fireBattlePlayback', message => {
      const topic = 'gdu/one_map/onemap_path_decoer/' + this.topicId
      if (topic !== message.topic) return
      var info = JSON.parse(message.payloadString)
      // console.log(info)
      if (info.objs) {
        info.objs.forEach(o => {
          me.add2DObject(
            o.objSN,
            o.type,
            o.lan / 1e7,
            o.lon / 1e7,
            o.orientation
          )
          if (me.show3d) {
            me.add3DModel(
              o.objSN,
              o.type,
              o.lan / 1e7,
              o.lon / 1e7,
              o.orientation,
              o.nickName
            )
          }
        })
      }
      if (info.serialNum === -1) {
        // 回放完毕
        this.isPlay = false
        // console.log('全部回放完毕')
      }
      // 设置时间轴指针
      if (
        !this.isDrag &&
        info.time >= me.timeStart &&
        info.time <= me.timeEnd
      ) {
        me.setTimePointer(info.time)
      }
      // 切换事件
      if (info.events.length > 0) {
        const event = this.combatEvents.find(e => e.id === info.events[0].id)
        if (event !== undefined) {
          const index = this.combatEvents.indexOf(event)
          if (index !== -1) {
            this.changeEvent(index)
          }
        }
      }
    })
    this.getAlertTopic()

    this.$refs.gduMap.map2D.battleReviewLayerManager.setTrailVisible(false)

    /* const tmpBattleData = {
      id: 123,
      coordinate: [114.261503, 30.633130],
      _bWgs2Gcj: false,
      angle: 0 * Math.PI / 180,
      iconParams: {
        anchor: [23, 43],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: require('../../assets/images/fireBattle/1_Soldier.png'),
        rotation: 0 * Math.PI / 180
        // imgScale: 0.16 // 单位：米/Pixel    8米/500Pixel    (不存在此项时图标不随地图缩放)
      }
    }
    this.$refs.gduMap.map2D.battleReviewLayerManager.addOrUpdateMarker(tmpBattleData, { color: '#BCBCBC', width: 2 })
    this.$refs.gduMap.map2D.zoomToCenter(114.261503, 30.633130)
    this.$refs.gduMap.map2D.battleReviewLayerManager.addOrUpdateMarker({ id: 123, coordinate: [114.262503, 30.634130], angle: 90 * Math.PI / 180 })
    this.$refs.gduMap.map2D.battleReviewLayerManager.removeMarker({ id: 123 })
    this.$refs.gduMap.map2D.battleReviewLayerManager.removeAll()
    this.$refs.gduMap.map2D.battleReviewLayerManager.setVisible(true)
    this.$refs.gduMap.map2D.battleReviewLayerManager.setTrailVisible(false) */
  },
  beforeDestroy () {
    this.stopPlayback()
    window.onresize = null
    EventBus.$off('fireBattlePlayback')
  },
  methods: {
    timeFormat,
    /**
     *  获取战评回放主题id
     */
    getAlertTopic () {
      this.$axios
        .post(battleApi.readPathByAlertId, { alertId: this.detail.fireNo })
        .then(res => {
          if (res.data.code === 0) {
            this.topicId = res.data.data
            this.isPlay = true
          }
        })
        .catch(error => {
          console.log('battleApi.readPathByAlertId Err : ' + error)
        })
    },
    /**
     *  停止战评回放
     */
    stopPlayback () {
      // 查询回放工作台状态
      // 0:工作台不存在，1.工作台正常工作。2.工作台被暂停了
      this.$axios
        .post(battleApi.getWorkerStatus, { workerNO: this.topicId })
        .then(res => {
          if (res.data.code === 0) {
            const status = res.data.data
            if (status !== 0) {
              this.$axios
                .post(battleApi.stopReadPath, { workerNO: this.topicId })
                .then(res => {
                  if (res.data.code === 0) {
                  }
                })
                .catch(error => {
                  console.log('battleApi.stopReadPath Err : ' + error)
                })
            }
          }
        })
        .catch(error => {
          console.log('battleApi.getWorkerStatus Err : ' + error)
        })
    },
    /**
     *  鼠标在时间轴上移动
     */
    timeBarMousemove (event) {
      const left = event.offsetX + event.target.offsetLeft
      this.setCurrentTime(left, false)
    },
    /**
     *  跳转回放
     */
    jumpPlayback (time) {
      this.disableTimePointerMove()
      this.$axios
        .post(battleApi.setProgress, {
          workerNO: this.topicId,
          progressTime: time
        })
        .then(res => {
          if (res.data.code === 0) {
            this.isPlay = true
          }
        })
        .catch(error => {
          console.log('battleApi.setProgress Err : ' + error)
        })
    },
    /**
     *  禁止时间轴指针移到
     */
    disableTimePointerMove () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      const me = this
      this.isDrag = true
      this.timeout = setTimeout(() => {
        me.isDrag = false
      }, 2000)
    },
    /**
     *  单击时间轴
     */
    timeBarClick (event) {
      const left = event.offsetX + event.target.offsetLeft
      const dom = document.querySelector('#pointer')
      if (dom) {
        dom.style.left = left - dom.clientWidth / 2 + 'px'
      }
      const timeSpan = this.computeTime(left)
      if (timeSpan) {
        this.curTimeSpan = timeSpan
        if (this.isPlay) { this.jumpPlayback(timeSpan) }
      }
      this.hideCurrentTime()
    },
    /**
     *  根据位置计算时间
     */
    computeTime (left) {
      const d = document.querySelector('#timeBar')
      if (d) {
        const timeSpan = Math.round(
          ((this.timeEnd - this.timeStart) * (left - d.offsetLeft)) /
            d.clientWidth +
            this.timeStart
        )
        return timeSpan
      } else return ''
    },
    /**
     *  隐藏时间
     */
    hideCurrentTime (left) {
      const me = this
      this.hideTimeout = setTimeout(() => {
        me.showCurTime = false
      }, 2 * 1000)
    },
    /**
     *  根据时间设置时间轴指针
     */
    setTimePointer (time) {
      const dom = document.querySelector('#timeBar')
      if (dom) {
        const left =
          (dom.clientWidth * (time - this.timeStart)) /
            (this.timeEnd - this.timeStart) +
          dom.offsetLeft
        this.$nextTick(() => {
          const d = document.querySelector('#pointer')
          if (d) d.style.left = left - d.clientWidth / 2 + 'px'
        })
      }
    },
    /**
     *  设置当前时间
     */
    setCurrentTime (left, updateTimeSpan = true) {
      if (this.hideTimeout) clearTimeout(this.hideTimeout)
      const dom = document.querySelector('#timeBar')
      if (dom) {
        if (left < dom.offsetLeft) left = dom.offsetLeft
        else if (left > dom.offsetLeft + dom.clientWidth) {
          left = dom.offsetLeft + dom.clientWidth
        }
        const timespan = Math.round(
          ((this.timeEnd - this.timeStart) * (left - dom.offsetLeft)) /
            dom.clientWidth +
            this.timeStart
        )
        if (updateTimeSpan) { this.curTimeSpan = timespan }

        this.curTime = timeFormat(timespan)
      }
      this.showCurTime = true
      this.$nextTick(() => {
        const dom = document.querySelector('#curTime')
        if (dom) dom.style.left = left - dom.clientWidth / 2 + 'px'
      })
    },
    /**
     *  获取时间轴拖拽参数
     */
    getDragParam () {
      const dom = document.querySelector('#timeBar')
      const dom2 = document.querySelector('#pointer')
      if (dom && dom2) {
        this.minLeft = dom.offsetLeft - dom2.clientWidth / 2
        this.maxLeft = dom.offsetLeft + dom.clientWidth - dom2.clientWidth / 2
      }
    },
    // 设置地图高度，避免F11全屏时，底部有空白
    setMapHeight () {
      var h = document.documentElement.clientHeight - 96
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
    },
    /**
     *  三维地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
      if (this.show3d) {
        const url =
          globalApi.headImg +
          this.$route.query.detail.planEnterpriseInfo3d.modelPath
        var layercfg = {
          type: '3dtiles',
          name: '国博',
          url: url,
          maximumScreenSpaceError: 1,
          maximumMemoryUsage: 8192,
          offset: { z: -4 },
          dynamicScreenSpaceError: true,
          cullWithChildrenBounds: false,
          luminanceAtZenith: 0.6
        }
        layercfg.visible = true
        layercfg.flyTo = true
        this.layerModel = mars3d.layer.createLayer(layercfg, this.viewer)
        this.layerModel.centerAt()
      }
    },
    /**
     *  返回
     */
    back () {
      this.$router.go(-1)
    },
    /**
     *  暂停/恢复回放工作台
     */
    pauseOrResumeWorker (isPlay) {
      if (isPlay) {
        this.jumpPlayback(this.curTimeSpan)
      } else {
        this.$axios
          .post(battleApi.pauseWorker, { workerNO: this.topicId })
          .then(res => {
            if (res.data.code === 0) {
              this.isPlay = isPlay
            }
          })
          .catch(error => {
            console.log('battleApi.pauseWorker Err : ' + error)
          })
      }
    },
    /**
     *  暂停/恢复回放战评
     */
    play (isPlay) {
      const s = isPlay === true ? 1 : 2
      // 查询回放工作台状态
      // 0:工作台不存在，1.工作台正常工作。2.工作台被暂停了
      this.$axios
        .post(battleApi.getWorkerStatus, { workerNO: this.topicId })
        .then(res => {
          if (res.data.code === 0) {
            const status = res.data.data
            if (status === 0) {
              // 重新开始回放战评
              if (isPlay) this.getAlertTopic()
            } else if (s !== status) {
              this.pauseOrResumeWorker(isPlay)
            } else this.isPlay = isPlay
          }
        })
        .catch(error => {
          console.log('battleApi.getWorkerStatus Err : ' + error)
        })
    },
    /**
     * 二维地图、三维地图切换
     */
    changeMap () {
      this.fullscreenMap = !this.fullscreenMap
      this.$nextTick(() => {
        this.$refs.gduMap.map2D._map.updateSize()
      })
    },
    /**
     * 二维地图双击事件
     */
    mapDbClick (bFullscreenMap) {
      if (this.fullscreenMap) return
      this.changeMap()
    },
    /**
     * 三维地图双击事件
     */
    masDbClick () {
      if (!this.fullscreenMap) return
      this.changeMap()
    },
    /**
     * 切换事件
     */
    changeEvent (index, jump = false) {
      this.activeIndex = index
      const event = this.combatEvents[index]
      this.setEventData(event)
      // 如果需要跳转
      if (jump) {
        const timespan = new Date(event.eventTime).getTime()
        this.setTimePointer(timespan)
        this.curTimeSpan = timespan
        if (this.isPlay) { this.jumpPlayback(timespan) }
      }
    },
    /**
     *  更新标签位置
     */
    updateLabelPosition (id, position) {
      const t = this.labelList.find(t => t.options.name === id)
      if (t !== undefined) {
        t.position = position
      }
    },
    /**
     *  添加模型上方标签
     */
    addModelLabel (position, name, id) {
      const innerhtml =
        '<div class="model-label">' + '<span>' + name + '</span>' + '</div>'
      const label = new mars3d.DivPoint(this.viewer, {
        html: innerhtml,
        anchor: [0, 0],
        position: position,
        name: id,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500)
      })
      this.labelList.push(label)
    },
    /**
     * 添加三维模型
     */
    add3DModel (id, type, lat, lon, heading, name) {
      if (!this.viewer) return
      if (!this.mCollection) {
        this.mCollection = new Cesium.PrimitiveCollection()
        this.viewer.scene.primitives.add(this.mCollection)
      }
      if (!this.labelList) {
        this.labelList = []
      }
      const m = this.mCollection._primitives.find(i => i.id === id)
      var position = Cesium.Cartesian3.fromDegrees(lon, lat, 12)
      var hpRoll = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(heading || 0),
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(0)
      )
      var converter = Cesium.Transforms.eastNorthUpToFixedFrame
      var matrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      )
      const p = CartesianToDegrees(position)
      if (m === undefined) {
        let url = ''
        switch (type) {
          case 1:
            url = '/people/ren.glb'
            break
          case 2:
            url = '/people/gongren.glb'
            break
          case 3:
            url = '/people/xiaofangyuan.glb'
            break
          case 5:
            url = '/xiaofangche/shuiguanche.gltf'
            break
          case 6:
            url = '/xiaofangche/paomoche.gltf'
            break
          case 7:
            url = '/xiaofangche/denggaoche/gltf2.gltf'
            break
          default:
            break
        }
        if (url) {
          url = globalApi.headImg + '/cloud-video/prePlanFor3D/gltf' + url
          this.mCollection.add(
            Cesium.Model.fromGltf({
              url: url,
              modelMatrix: matrix,
              id: id
            })
          )
          this.addModelLabel(
            Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 3),
            name,
            id
          )
          if (this.needCenter && lat > 0 && lon > 0) {
            this.needCenter = false
            this.viewer.mars.centerAt({ y: lat, x: lon, z: 2000, heading: 0, pitch: -90, roll: 0 })
          }
        }
      } else {
        m.modelMatrix = matrix
        this.updateLabelPosition(
          id,
          Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 3)
        )
      }
    },
    add2DObject (id, type, lat, lon, heading) {
      if (!this.$refs.gduMap) return
      let tmpUrl = null
      let tmpScale = null
      const tmpAngle = (heading * Math.PI) / 180
      switch (type) {
        case 1:
          tmpUrl = require('../../assets/images/fireBattle/1_Soldier.png')
          tmpScale = 0.004
          break
        case 2:
          tmpUrl = require('../../assets/images/fireBattle/2_Commander.png')
          tmpScale = 0.004
          break
        case 3:
          tmpUrl = require('../../assets/images/fireBattle/3_HighCommander.png')
          tmpScale = 0.004
          break
        case 4:
          tmpUrl = require('../../assets/images/fireBattle/4_UAV.png')
          tmpScale = 0.004
          break
        case 5:
          tmpUrl = require('../../assets/images/fireBattle/5_FireCarWater.png')
          tmpScale = 0.004
          break
        case 6:
          tmpUrl = require('../../assets/images/fireBattle/6_FireCarFroth.png')
          tmpScale = 0.004
          break
        case 7:
          tmpUrl = require('../../assets/images/fireBattle/7_FireCarLadder.png')
          tmpScale = 0.004
          break
        default:
          console.log('Unknown type : ', type, tmpAngle, tmpScale)
          return
      }
      const tmpData = {
        id: id,
        coordinate: [lon, lat],
        _bWgs2Gcj: false,
        // angle: tmpAngle,
        iconParams: {
          anchor: [23, 42], // 0.5, 0.5
          anchorXUnits: 'pixels', // pixels
          anchorYUnits: 'pixels', // fraction
          src: tmpUrl
          // rotation: tmpAngle,
          // imgScale: tmpScale // 单位：米/Pixel    8米/500Pixel    (不存在此项时图标不随地图缩放)
        }
      }
      this.$refs.gduMap.map2D.battleReviewLayerManager.addOrUpdateMarker(
        tmpData,
        { color: '#BCBCBC', width: 2 }
      )
      if (this.bIsFirstLonLat) {
        this.bIsFirstLonLat = false
        this.$refs.gduMap.map2D.setZoom(16)
        this.$refs.gduMap.map2D.zoomToCenter(lon, lat)
      }
    },
    /**
     * 设置战评事件数据
     */
    setEventData (event) {
      const data = [
        event.waterSource,
        event.foam,
        event.dryPowder,
        event.fireExtinguisher
      ]
      const option = {
        series: [
          {
            name: 'pictorialBar1',
            data: data
          },
          {
            name: 'pictorialBar2',
            data: data
          },
          {
            name: 'bar',
            data: data
          }
        ]
      }
      const mainChart = this.$echarts.init(document.getElementById('chart'))
      mainChart.setOption(option)
      this.curEvent = event
      const file = event.eventFileUrl
      this.car = event.attendanceVehicle
      this.people = event.attendancePeople
      this.uav = event.attendanceUav
      this.unCar =
        this.detail.attendanceVehicle > this.car
          ? this.detail.attendanceVehicle - this.car
          : 0
      this.unPeople =
        this.detail.attendancePeople > this.people
          ? this.detail.attendancePeople - this.people
          : 0
      this.unUav =
        this.detail.attendanceUav > this.uav
          ? this.detail.attendanceUav - this.uav
          : 0
      const fileType = file
        .substring(file.lastIndexOf('.') + 1, file.length)
        .toLowerCase()
      if (fileType === 'mp4') {
        this.videoUrl = this.serverUrl + file
        this.imgPath = ''
      } else {
        this.imgPath = file
        this.videoUrl = ''
      }
    },
    /**
     * 设置战评初始数据
     */
    setBattleInitData () {
      this.detail = this.$route.query.detail
      this.fireName = this.detail.fireName
      this.timeStart = new Date(this.detail.fireTimeStart).getTime()
      this.timeEnd = new Date(this.detail.fireTimeEnd).getTime()
      this.duration = this.$route.query.duration
      if (
        this.detail.combatEventList &&
        this.detail.combatEventList.length > 0
      ) {
        this.combatEvents = this.detail.combatEventList
        this.changeEvent(0)
      }
      // 没有三维预案，只显示二维地图
      if (!this.detail.planEnterpriseInfo3d) {
        this.show3d = false
        this.changeMap()
      }
    },
    /**
     *  初始化图表数据
     */
    initChartData () {
      const lineStyle = {
        color: '#27bce5',
        width: 1,
        type: 'solid',
        opacity: 0.2
      }
      const textStyle = {
        color: '#27BCE5',
        fontSize: 14
      }
      const data = [0, 0, 0, 0]
      const mainChart = this.$echarts.init(document.getElementById('chart'))
      const option = {
        tooltip: {},
        grid: {
          top: 15,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          data: ['水源', '泡沫', '干粉', '灭火器'],
          // 坐标轴刻度
          axisTick: {
            show: false
          },
          // 坐标轴线
          axisLine: {
            lineStyle: lineStyle
          },
          // 坐标轴文本标签
          axisLabel: {
            margin: 12,
            textStyle: textStyle
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 20,
          interval: 20,
          // 分隔线
          splitLine: {
            show: true,
            lineStyle: lineStyle
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: lineStyle
          },
          axisLabel: {
            textStyle: textStyle
          },
          // 分隔区域
          splitArea: {
            show: true,
            areaStyle: {
              color: 'rgba(39, 188, 229, 0.2)'
            }
          }
        },
        series: [
          {
            type: 'pictorialBar',
            symbolSize: [23, 12],
            symbolOffset: [0, -6],
            z: 12,
            itemStyle: {
              normal: {
                color: '#62d8f9',
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#fff',
                    fontSize: 14
                  }
                }
              },
              // 高亮样式
              emphasis: {
                color: '#62d8f9'
              }
            },
            symbolPosition: 'end',
            data: data,
            name: 'pictorialBar1',
            barMinHeight: 12
          },
          {
            type: 'pictorialBar',
            symbolSize: [23, 12],
            symbolOffset: [0, 6],
            z: 12,
            itemStyle: {
              normal: {
                color: '#289bba'
              },
              // 高亮样式
              emphasis: {
                color: '#289bba'
              }
            },
            data: data,
            name: 'pictorialBar2'
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#27BCE5'
              },
              // 高亮样式
              emphasis: {
                color: '#27BCE5'
              }
            },
            // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件
            silent: false,
            barWidth: 23,
            barMinHeight: 12,
            data: [0, 0, 0, 0],
            name: 'bar'
          }
        ]
      }
      mainChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.battleBox {
  position: relative;
  .list {
    position: absolute;
    box-sizing: border-box;
    height: 414px;
    top: 70px;
    left: 37px;
    overflow-y: auto;
    > div {
      width: 229px;
      height: 44px;
      box-sizing: border-box;
      border: 1px solid #00ccff;
      opacity: 0.85;
      background: #0a2549;
      border-radius: 6px;
      margin-bottom: 9px;
      display: flex;
      align-items: center;
      padding: 5px 12px;
      cursor: pointer;
      span:nth-child(1) {
        display: inline-block;
        width: 28px;
        height: 28px;
      }
      span:nth-child(2) {
        margin-left: 12px;
        display: inline-block;
        width: 2px;
        height: 42px;
        background: url(../../assets/images/3d/rect.png) no-repeat;
      }
      span:nth-child(3) {
        display: inline-block;
        font-size: 16px;
        color: #aeaeae;
        flex-grow: 1;
        text-align: center;
      }
    }
    > div.active {
      opacity: 1;
      span:nth-child(3) {
        color: #00ccff;
      }
    }
  }
  .describeBox {
    display: flex;
    flex-direction: column;
    position: absolute;
    box-sizing: border-box;
    width: 363px;
    height: 359px;
    top: 544px;
    left: 37px;
    background: url(../../assets/images/fireBattle/box.png) no-repeat;
    padding: 0px 30px;
    .txt {
      font-size: 14px;
      line-height: 24px;
      height: 72px;
    }
    .img {
      margin-top: 10px;
      display: inline-block;
      width: 293px;
      height: 170px;
    }
    .playerBox {
      margin-top: 10px;
      width: 293px;
      height: 170px;
      position: relative;
    }
  }
  .ball {
    position: absolute;
    width: 122px;
    height: 121px;
    top: 23px;
    right: 283px;
    background: url(../../assets/images/fireBattle/ball.png) no-repeat;
  }
  .titleBox {
    position: absolute;
    width: 239px;
    height: 95px;
    top: 37px;
    right: 46px;
    background: url(../../assets/images/fireBattle/title-box.png) no-repeat;
    display: flex;
    flex-direction: column;
    color: #00ccff;
    text-align: center;
    span:nth-child(1) {
      font-size: 14px;
      margin-top: 19px;
    }
    span:nth-child(2) {
      margin-top: 9px;
      margin-left: 44px;
      display: inline-block;
      width: 156px;
      height: 1px;
      background: #00ccff;
    }
    span:nth-child(3) {
      margin-top: 6px;
      font-size: 18px;
    }
  }
  .more {
    position: absolute;
    width: 15px;
    height: 12px;
    top: 44px;
    right: 53px;
    background: url(../../assets/images/fireBattle/more.png) no-repeat;
  }
  .dataBox {
    box-sizing: border-box;
    padding: 30px 25px;
    position: absolute;
    width: 361px;
    height: 730px;
    top: 169px;
    right: 41px;
    background: url(../../assets/images/fireBattle/data-box.png) no-repeat;
    .total {
      font-size: 16px;
      color: #00cff9;
      span:nth-child(1) {
        margin-right: 10px;
      }
      span:nth-child(3) {
        margin-right: 20px;
        margin-left: 50px;
      }
      span:nth-child(2),
      span:nth-child(4) {
        display: inline-block;
        width: 48px;
        height: 2px;
        background: #00cff9;
      }
    }
    .time {
      margin-top: 3px;
      display: inline-block;
      font-size: 26px;
      color: #aef0f4;
      height: 35px;
      width: 110px;
      border-bottom: 2px solid #00cff9;
      text-shadow: #00cff9 1px 1px 4px;
    }
    ul {
      margin-top: 30px;
      margin-bottom: 30px;
      li {
        margin-bottom: 38px;
        .img {
          display: inline-block;
          width: 74px;
          height: 75px;
          background-image: url("../../assets/images/fireBattle/car.png");
        }
        .fireman {
          background-image: url("../../assets/images/fireBattle/fireman.png");
        }
        .drone {
          background-image: url("../../assets/images/fireBattle/drone.png");
        }
      }
      li > div {
        display: flex;
        > div {
          min-width: 70px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 14px;
          color: #999999;
          margin-left: 33px;
          margin-right: 20px;
          span:nth-child(2) {
            margin-top: 8px;
            font-size: 20px;
            color: #dfdfdf;
          }
        }
        .redTxt {
          font-size: 14px !important;
          color: #ff0000 !important;
          margin-top: 15px !important;
          position: relative;
          top: -3px;
        }
      }
    }
  }
  .marsBox {
    height: 100%;
    background: none;
  }
  .marsBoxSmallScreen,
  .mapBox {
    position: absolute;
    box-sizing: border-box;
    right: 425px;
    top: 721px;
    width: 283px;
    height: 183px;
    background: url("../../assets/images/drone/map-box.png") no-repeat;
    padding: 17px 17px;
  }
  .marsBoxSmallScreen {
    z-index: 10;
  }
  .mapBox {
    .map {
      height: 100%;
    }
  }
  .mapBoxFullScreen {
    right: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    background: none;
  }
  .title {
    width: 100%;
    height: 21px;
    box-sizing: border-box;
    margin-top: 22px;
    margin-bottom: 10px;
    span:nth-child(1) {
      display: inline-block;
      width: 21px;
      height: 16px;
      background-image: url("../../assets/images/fire_title.png");
      margin-right: 18px;
      position: relative;
      top: 2px;
    }
    span:nth-child(2) {
      line-height: 21px;
    }
  }
  .chartBox {
    position: relative;
    top: 10px;
    width: 312px;
    height: 163px;
    box-sizing: border-box;
  }
  .bar {
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
    width: 1304px;
    height: 61px;
    position: absolute;
    background: url("../../assets/images/fireBattle/time-box.png") no-repeat;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    .play {
      display: inline-block;
      width: 99px;
      height: 42px;
      position: absolute;
      background: url("../../assets/images/fireBattle/play2.png") no-repeat;
      left: -55px;
      cursor: pointer;
    }
    .pause {
      background: url("../../assets/images/fireBattle/pause.png") no-repeat;
    }
    .timeBox {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      .time {
        position: absolute;
        left: 90px;
        top: 15px;
        width: 1124px;
        height: 14px;
        background: url("../../assets/images/fireBattle/time.png") no-repeat;
      }
      span:nth-child(1),
      span:nth-child(2) {
        font-size: 13px;
        color: #d2d2d2;
        position: absolute;
        top: 33px;
        display: inline-block;
        width: 130px;
        pointer-events: none;
      }
      span:nth-child(1) {
        left: 46px;
      }
      span:nth-child(2) {
        right: 46px;
      }
      span:nth-child(3) {
        display: inline-block;
        height: 17px;
        width: 19px;
        background: url("../../assets/images/fireBattle/pointer.png") no-repeat;
        position: absolute;
        top: 3px;
        //left: 177px;
        cursor: pointer;
      }
      span:nth-child(4) {
        display: inline-block;
        color: #f5fafd;
        background: #00ccff;
        border-radius: 2px;
        position: absolute;
        top: -16px;
        left: 0px;
        font-size: 12px;
        padding: 0px 2px;
      }
    }
  }
  .fade-leave-to {
    opacity: 0;
  }
  .fade-leave-active {
    transition: opacity 1s;
  }
}
</style>
