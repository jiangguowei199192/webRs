<template>
  <div class="mapcontainer mars3d">
    <Map :url="configUrl" :widgetUrl="widgetUrl" @onload="onMapload" />
    <div class="bottom"></div>
    <div class="tabs">
      <div
        v-for="(item,index) in 8"
        :key="index"
        :class="{active:activeIndex==index}"
        @click.stop="tabTo(index)"
      ></div>
    </div>
    <div class="plotBox" v-show="showPlotBox">
      <el-select v-model="plotType" placeholder="请选择" class="select" :popper-append-to-body="false">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div class="models">
        <div v-for="(item,index) in curModels" :key="index" class="outer" @click="startPlot(item)">
          <div :style="{background: 'url('+ item.image +') no-repeat'}"></div>
        </div>
      </div>
    </div>
    <div class="infoBox" v-show="showInfoBox" ref="infobox">
      <div class="close" @click="showInfoBox = false" />
      <img class="img" :src="infoBox.imgSrc" />
      <span class="title">{{infoBox.label}}</span>
      <div class="decorate"></div>
      <div class="detail">
        <ul>
          <li>
            <span>文案：</span>
            <div></div>
          </li>
          <li>
            <span>文案：</span>
            <div></div>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="editBox"
      v-show="showEditBox"
      :style="'top:' + boxTop + 'px;' + 'left:' + boxLeft + 'px;'"
    >
      <div class="close" @click="showEditBox = false" />
      <div class="first">
        <span>单位：</span>
        <el-input v-model="editBox.department"></el-input>
        <span>编号：</span>
        <el-input class="input" v-model="editBox.number"></el-input>
        <div class="num">
          <span @click="numberAdd(true)"></span>
          <span @click="numberAdd(false)"></span>
        </div>
      </div>
      <div class="first second">
        <span>任务：</span>
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
          popper-class="taskPopover"
          v-model="showPopover"
        >
          <div class="taskList webFsScroll">
            <span v-for="(item,index) in taskList" :key="index" @click="selectTask(item)">{{item}}</span>
          </div>
          <div slot="reference" class="task">
            <span>{{editBox.task}}</span>
            <span></span>
          </div>
        </el-popover>
      </div>
      <span class="btn confirm" @click="setModelTask">确定</span>
    </div>
    <FloorGuide ref="floorGuide" v-bind:title="buildingTitle" v-bind:info="buildingInfos"></FloorGuide>
    <div class="rightTool">
      <div class="move">
        <span></span>
        <span class="left" @mousedown="moveCamera(2)" @mouseup="stopMoveCamera"></span>
        <span class="left" @mousedown="moveCamera(3)" @mouseup="stopMoveCamera"></span>
        <span class="up" @mousedown="moveCamera(4)" @mouseup="stopMoveCamera"></span>
        <span class="up" @mousedown="moveCamera(5)" @mouseup="stopMoveCamera"></span>
      </div>
      <span class="zoom" @click="ZoomIn(true)"></span>
      <span class="zoom" @click="ZoomIn(false)"></span>
    </div>
  </div>
</template>

<script>
import Map from './components/marsMap.vue'
import FloorGuide from './components/FloorGuide.vue'
import $ from 'jquery'
import emergency from '@/assets/images/3d/emergencyshelters.png'
import xfs from '@/assets/images/3d/xfs.jpg'
import bf from '@/assets/images/3d/bf.jpg'
import exit from '@/assets/images/3d/exit.png'
import axios from 'axios'
var Cesium = window.Cesium
var mars3d = window.mars3d
var gltfEdit = window.gltfEdit
const serverUrl = 'http://172.16.63.195:9000/mapdata'
let me
export default {
  // 所有cesium和mars3d对象 都不要绑定到data
  data () {
    return {
      num: 1, // 编号
      activeIndex: 0,
      configUrl: 'config/config.json',
      widgetUrl: 'config/widget.json',
      showPlotBox: false,
      isPlot: false, // 是否是沙盘绘制
      plotType: '',
      options: [], // 沙盘绘制选项
      curModels: [],
      showInfoBox: false,
      showEditBox: false,
      boxLeft: 0, // 任务编辑弹窗left
      boxTop: 0, // 任务编辑弹窗top
      showPopover: false,
      infoBox: { imgSrc: '' },
      editBox: { department: '天门敦', number: '1', task: '供水' },
      taskList: [
        '内政',
        '出枪掩护',
        '出枪冷却',
        '出枪灭火',
        '供水',
        '供泡沫',
        '连接消火栓',
        '遥控水炮冷却',
        '遥控水炮灭火'
      ],
      buildingTitle: '黄鹤楼',
      buildingInfos: [
        // 测试数据
        {
          title: '1层',
          image:
            'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1021768252,432753213&fm=26&gp=0.jpg'
        },
        {
          title: '2层',
          image:
            'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2915512436,1541993188&fm=26&gp=0.jpg'
        },
        {
          title: '3层',
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598501231760&di=b46ffef3711bfd0beb0e5528f5f02b5f&imgtype=0&src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2F201503%2F19%2F211608ztcq7higicydxhsy.jpg'
        },
        {
          title: '4层',
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598501231760&di=53d424fa23d284b221d6f262e8ed821e&imgtype=0&src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201111%2F21%2F205700txzuacubbcy91u99.jpg'
        },
        {
          title: '5层',
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598501231760&di=c720648eb47f6d0cb35a13196da77dad&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F587c7e395b9a0.jpg'
        }
      ]
    }
  },
  components: {
    Map,
    FloorGuide
  },

  mounted () {
    this.getPlotData()
    document.addEventListener('click', this.closeInfoBox)
  },

  beforeDestroy () {
    if (this.drawControl) {
      this.endPlot()
    }
    document.removeEventListener('click', this.closeInfoBox)
  },

  watch: {
    plotType (val) {
      if (this.options.length > 0 && val >= 0 && val < this.options.length) {
        this.curModels = this.options[val].list
      }
    }
  },

  methods: {
    tabTo (index) {
      this.activeIndex = index
      if (this.activeIndex === 4) {
        this.showPlotBox = true
      } else if (this.activeIndex === 6) {
        this.showPlotBox = false
        this.$refs.floorGuide.show(0)
      } else {
        this.showPlotBox = false
      }
    },

    /**
     *  关闭infobox
     */
    closeInfoBox (e) {
      if (
        this.showInfoBox &&
        this.$refs.infobox &&
        !this.$refs.infobox.contains(e.target)
      ) {
        this.showInfoBox = false
      }
    },

    /**
     *  任务框中编号加减
     */
    numberAdd (isAdd) {
      const a = isAdd === true ? 1 : -1
      this.editBox.number = parseInt(this.editBox.number) + a
    },

    /**
     *  选择任务
     * @param {Object} item 任务
     */
    selectTask (item) {
      this.editBox.task = item
      this.showPopover = false
    },

    /**
     * 将笛卡尔坐标转为地理坐标
     * @param {Object} position 笛卡尔坐标
     */
    CartesianToDegrees (position) {
      var cartographic = Cesium.Cartographic.fromCartesian(position)
      var lon = Number(
        Cesium.Math.toDegrees(cartographic.longitude).toFixed(7)
      )
      var lat = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(7))
      var height = Math.ceil(cartographic.height)
      return { lat: lat, lon: lon, height: height }
    },

    /**
     *  设置模型任务
     */
    setModelTask () {
      this.showEditBox = false
      if (this.isPlot) {
        var task = JSON.parse(JSON.stringify(this.editBox))
        task.name = this.curEntity.name
        // 将笛卡尔坐标转为地理坐标
        const p = this.CartesianToDegrees(this.curEntity.position)
        const label = this.addModelLabel(
          Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 4),
          task
        )
        this.labelList.push(label)
      } else {
        const t = this.findModelLabel(this.curEntity.name)
        if (t !== undefined) {
          this.copyData(this.editBox, t.opts.data)
          this.updateLabelHtml(t)
        }
      }
    },

    /**
     *  寻找模型对应标签
     * @param {String} name 标签data.name
     */
    findModelLabel (name) {
      return this.labelList.find(t => t.opts.data.name === name)
    },

    /**
     *  获取指定type的默认的标绘样式
     */
    getDefStyle: function (type) {
      return mars3d.draw.util.getDefStyle(type)
    },

    /**
     *  开始编辑
     *@param {Object} entity 模型
     */
    startEditing (entity) {
      // 启用编辑
      gltfEdit.activate(entity, me.viewer, {
        calback: function (result) {}
      })
    },

    /**
     *  停止编辑
     *@param {Object} entity 模型
     */
    stopEditing (entity) {
      gltfEdit.disable() // 停止编辑
    },

    /**
     *  设置任务编辑窗口位置
     *@param {Object} point 屏幕坐标
     */
    setEditBoxPosition (point) {
      const width = this.viewer._element.clientWidth
      const height = this.viewer._element.clientHeight
      const offsetX = 50
      if (point.x + 285 + offsetX >= width) {
        this.boxLeft = 0
      } else this.boxLeft = point.x + offsetX
      if (point.y + 270 >= height) {
        this.boxTop = height - 270
      } else this.boxTop = point.y
    },

    /**
     *  开始绘制
     *@param {Object} item 模型
     */
    startPlot (item) {
      if (!this.drawControl) {
        this.drawControl = new mars3d.Draw(this.viewer, {
          hasEdit: true,
          nameTooltip: true,
          isContinued: false, // 是否连续标绘
          isAutoEditing: false // 绘制完成后是否自动激活编辑
        })

        // 创建完成
        this.drawControl.on(mars3d.draw.event.DrawCreated, function (e) {
          var entity = e.entity
          // if (!me.drawControl.isContinued) {
          //   me.startEditing(entity)
          // }
          // console.log('创建完成')
          // if (entity.boundingSphere) {
          //   const center = entity.boundingSphere.center
          //   const p = new Cesium.Cartesian3(center.x + entity.boundingSphere.radius, center.y, center.z)
          //   var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(me.viewer.scene, p)
          //   var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(me.viewer.scene, entity.position)
          // }
          var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            me.viewer.scene,
            entity.position
          )

          const id = new Date().format('yyyy-MM-dd HH:mm:ss')
          entity.name = id
          me.curEntity = entity
          me.isPlot = true
          me.showEditBox = true
          me.setEditBoxPosition(point)
        })

        // 开始编辑
        this.drawControl.on(mars3d.draw.event.EditStart, function (e) {
          var entity = e.entity
          me.startEditing(entity)
          // console.log('开始编辑')
        })
        //
        this.drawControl.on(mars3d.draw.event.EditMouseMove, function (e) {
          me.stopEditing()
          // console.log('EditMouseMove')
        })

        // 编辑修改了点
        this.drawControl.on(mars3d.draw.event.EditMovePoint, function (e) {
          var entity = e.entity
          me.startEditing(entity)
          const p = me.CartesianToDegrees(entity.position)
          const position = Cesium.Cartesian3.fromDegrees(
            p.lon,
            p.lat,
            p.height + 4
          )
          me.updateLabelPosition(entity.name, position)
          // console.log('编辑修改了点')
        })

        // 停止编辑
        this.drawControl.on(mars3d.draw.event.EditStop, function (e) {
          me.stopEditing()
          // console.log('停止编辑')
        })

        // 删除了对象
        this.drawControl.on(mars3d.draw.event.Delete, function (e) {
          // 删除对应标签
          const t = me.findModelLabel(e.entity.name)
          if (t !== undefined) {
            const index = me.labelList.indexOf(t)
            me.labelList.splice(index, 1)
            t.destroy()
          }
          me.showEditBox = false
          me.stopEditing()
          // console.log('删除了对象')
        })
      }

      // 赋值默认样式
      var defStyle = this.getDefStyle(item.edittype || item.type)
      if (defStyle) {
        item.style = item.style || {}
        for (var i in defStyle) {
          if (item.style[i] == null) {
            item.style[i] = defStyle[i]
          }
        }
      }

      // 赋值默认属性
      item.attr = {
        id: '',
        name: '',
        remark: ''
      }
      item.drawShow = true // 绘制时，是否自动隐藏模型，可避免在3dtiles上拾取坐标存在问题。
      item.noExDragger = true // 去掉辅助编辑的对象
      this.drawControl.startDraw(item)
    },

    /**
     *  结束绘制、等同双击完成绘制
     */
    endPlot () {
      this.drawControl.endDraw()
    },

    /**
     *  获取沙盘绘制数据
     */
    getPlotData () {
      this.options = []
      axios
        .get('config/plotlist.json')
        .then(res => {
          const data = res.data
          let i = 0
          for (var p in data) {
            const array = data[p]
            array.forEach(a => {
              if (a.image.startsWith('$serverURL_gltf$')) {
                a.image = a.image.replace(
                  '$serverURL_gltf$',
                  serverUrl + '/gltf'
                )
              }

              if (a.style.modelUrl.startsWith('$serverURL_gltf$')) {
                a.style.modelUrl = a.style.modelUrl.replace(
                  '$serverURL_gltf$',
                  serverUrl + '/gltf'
                )
              }
            })
            const item = { value: i, label: p, list: array }
            this.options.push(item)
            if (i === 0) this.plotType = i
            i += 1
          }
        })
        .catch(err => {
          console.log('getPlotData Err : ' + err)
        })
    },

    /**
     *  显示隐藏一些按钮
     */
    showOrHideViewerBtns () {
      // 隐藏位置信息状态
      this.viewer.mars.location.show = false
      // 隐藏比例尺
      $('#distanceLegendDiv').hide()
    },

    /**
     *  viewer飞到Entity视角
     * @param {Object} entity 模型
     * @param {Object} callback 飞行完成回调方法
     */
    flyToEntity (entity, callback) {
      // if (me.viewer.camera.positionCartographic.height > 500) {
      this.viewer.mars.popup.close() // 关闭popup
      var position = entity.position
      this.viewer.mars.centerPoint(position, {
        radius: 100, // 距离目标点的距离
        pitch: -50, // 相机方向
        duration: 2,
        complete: callback
      })
      // }
    },

    /**
     *  更新标签html
     * @param {Object} entity 标签
     */
    updateLabelHtml (entity) {
      const task = entity.opts.data
      const text1 = task.department + '-' + task.number
      const text2 = task.task
      const innerhtml =
        '<div class="model-label">' +
        '<span>' +
        text1 +
        '</span>' +
        '<span>' +
        text2 +
        '</span>' +
        '</div>'
      entity.html = innerhtml
    },

    /**
     *  更新标签位置
     * @param {Object} name 标签名称
     * @param {Object} position 标签坐标
     */
    updateLabelPosition (name, position) {
      const t = this.findModelLabel(name)
      if (t !== undefined) {
        t.position = position
      }
    },

    /**
     *  添加模型上方标签
     * @param {Object} position 标签坐标
     * @param {Object} task 任务信息
     */
    addModelLabel (position, task) {
      const text1 = task.department + '-' + task.number
      const text2 = task.task
      const innerhtml =
        '<div class="model-label">' +
        '<span>' +
        text1 +
        '</span>' +
        '<span>' +
        text2 +
        '</span>' +
        '</div>'
      const label = new mars3d.DivPoint(this.viewer, {
        html: innerhtml,
        anchor: [0, 0],
        position: position,
        data: task
      })
      return label
    },

    /**
     *  拷贝数据
     * @param {Object} src
     * @param {Object} dst
     */
    copyData (src, dst) {
      for (var b in dst) {
        // 拷贝属性
        if (Object.prototype.hasOwnProperty.call(src, b)) {
          dst[b] = src[b]
        }
      }
    },

    addModel () {
      me = this
      var dataSource = new Cesium.CustomDataSource()
      this.viewer.dataSources.add(dataSource)
      var position = Cesium.Cartesian3.fromDegrees(114.23534, 30.510244, 10)
      var position2 = Cesium.Cartesian3.fromDegrees(114.23534, 30.510244, 25)
      var position3 = Cesium.Cartesian3.fromDegrees(114.238506, 30.508797, 30)

      // 添加实体
      dataSource.entities.add({
        name: '1111111',
        position: position,
        model: {
          uri:
            serverUrl +
            '/gltf/xiaofang/xiaofang/xiaofangshuan/xiaofangshuan.gltf',
          scale: 1,
          opacity: 1,
          clampToGround: true
        }
      })

      const lat = 30.510093
      let lon = 114.235004
      const id = new Date().format('yyyy-MM-dd HH:mm:ss')
      const task = {
        name: id,
        department: '洪山分局',
        number: '1',
        task: '供水'
      }
      const entity = dataSource.entities.add({
        name: id,
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 12),
        model: {
          uri: serverUrl + '/gltf/mars/firedrill/xiaofangche.gltf',
          scale: 1,
          opacity: 1,
          clampToGround: true
        },
        click: function (entity) {
          me.curEntity = entity
          me.showEditBox = true
          const t = me.findModelLabel(entity.name)
          if (t !== undefined) {
            me.copyData(t.opts.data, me.editBox)
          }
          var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            me.viewer.scene,
            entity.position._value
          )
          me.setEditBoxPosition(point)
        }
      })

      const label = this.addModelLabel(
        Cesium.Cartesian3.fromDegrees(lon, lat, 16),
        task
      )
      // 模型标签列表
      this.labelList = []
      this.labelList.push(label)

      setInterval(() => {
        lon += 0.000001
        entity.position = Cesium.Cartesian3.fromDegrees(lon, lat, 12)
        label.position = Cesium.Cartesian3.fromDegrees(lon, lat, 16)
      }, 1000)

      dataSource.entities.add({
        name: '避难',
        position: Cesium.Cartesian3.fromDegrees(114.23724, 30.510647, 25),
        billboard: {
          image: emergency,
          scale: 1,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            1000
          )
        }
      })

      dataSource.entities.add({
        name: '紧急出口',
        position: Cesium.Cartesian3.fromDegrees(114.234825, 30.510722, 12),
        billboard: {
          image: exit,
          scale: 1,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            1000
          )
        }
      })

      const divpoint1 = new mars3d.DivPoint(this.viewer, {
        html: ` <div class="label labelxfs">
                  <span></span>
                  <span>消防栓</span>
                </div>`,
        anchor: [-61, 0],
        position: position2,
        depthTest: false,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   100,
        //   200000
        // ), // 按视距距离显示
        // popup: {
        //   html: ` <div class="popup-bg">
        //         </div>`,
        //   anchor: [0, -50] // 左右、上下的偏移像素值。
        // },
        click: function (entity) {
          me.infoBox.imgSrc = xfs
          me.infoBox.label = '消防栓'
          me.showInfoBox = false
          me.flyToEntity(entity, function (e) {
            // 飞行完成回调方法
            me.showInfoBox = true
            // me.viewer.mars.popup.show(entity)// 显示popup
          })
        }
      })

      console.log(divpoint1)

      const divpoint2 = new mars3d.DivPoint(this.viewer, {
        html: ` <div class="label labelbf">
                  <span></span>
                  <span>泵房</span>
                </div>`,
        anchor: [-61, 0],
        position: position3,
        depthTest: false,
        stopPropagation: true, // 控制是否阻止冒泡
        click: function (entity) {
          me.infoBox.imgSrc = bf
          me.infoBox.label = '泵房'
          me.showInfoBox = false
          me.flyToEntity(entity, function (e) {
            // 飞行完成回调方法
            me.showInfoBox = true
            // me.viewer.mars.popup.show(entity)// 显示popup
          })
        }
      })

      console.log(divpoint2)

      var layercfg = {
        type: '3dtiles',
        name: '国博',
        url: serverUrl + '/3dtiles/guobo/Production_1.json',
        maximumScreenSpaceError: 1,
        maximumMemoryUsage: 8192,
        offset: { z: -4 },
        dynamicScreenSpaceError: true,
        cullWithChildrenBounds: false,
        luminanceAtZenith: 0.6
      }

      // layercfg.id = 1987
      layercfg.visible = true
      layercfg.flyTo = true
      var layerModel = mars3d.layer.createLayer(layercfg, this.viewer)
      layerModel.centerAt()
    },

    /**
     *  平移相机
     */
    moveCamera (direction) {
      this.moveInterval = setInterval(function () {
        me.viewer.mars.keyboardRoam.moveCamera(direction)
      }, 50)
    },

    /**
     *  停止平移相机
     */
    stopMoveCamera () {
      if (this.moveInterval) {
        clearInterval(this.moveInterval)
      }
    },

    /**
     *  放大
     *  @param {Boolen} in 是否放大
     */
    ZoomIn (isIn) {
      var zoomIn = new mars3d.ZoomNavigation(this.viewer, isIn)
      zoomIn.activate()
    },

    /**
     *  地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
      // 控制鼠标只取模型上的点，忽略地形上的点的拾取
      viewer.mars.onlyPickModelPosition = true
      this.showOrHideViewerBtns()
      // 设置右键旋转
      viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.RIGHT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL
        },
        {
          eventType: Cesium.CameraEventType.MIDDLE_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL
        }
      ]
      viewer.mars.keyboardRoam.bind({
        moveStep: 10, // 平移步长 (米)。
        dirStep: 25, // 相机原地旋转步长，值越大步长越小。
        rotateStep: 1.0, // 相机围绕目标点旋转速率，0.3-2.0
        minPitch: 0.1, // 最小仰角  0-1
        maxPitch: 0.95 // 最大仰角  0-1
      })

      this.addModel()
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
/deep/.mars3d-popup-background {
  background: none;
}

/deep/.cesium-viewer-toolbar {
  top: 74px;
  right: 18px;
}

//popup的倒三角样式
/deep/.mars3d-popup-tip-container {
  margin: -20px auto 0;
}
/deep/.mars3d-popup-tip {
  box-shadow: none;
  background: #1eb0fc;
}

/deep/.mars3d-popup-close-button {
  display: none;
}

/deep/.compass {
  right: 8px !important;
  top: 8px !important;
  width: 107px !important;
  height: 107px !important;
}

/deep/.compass-outer-ring {
  background: url(../../assets/images/3d/N.png) no-repeat !important;
}

/deep/.compass-outer-ring-background {
  display: none;
}

/deep/.compass-rotation-marker {
    display: none !important;
}

/deep/.compass-gyro-background {
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background-color: rgba(47, 53, 60, 0.8);
  box-sizing: content-box;
  //background-image: url(img/compass-inner.svg);
}

/deep/.mars3d-popup-content-wrapper {
  text-align: center;
  max-height: 500px;
  overflow-y: auto;
  box-shadow: none;
  padding: 0px;
  text-align: left;
  border-radius: 3px;
}

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

  .plotBox {
    display: inline-block;
    position: absolute;
    background: url(../../assets/images/3d/plot-box.png) no-repeat;
    width: 290px;
    height: 706px;
    left: 38px;
    top: 50px;

    .models {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      padding-left: 24px;
      .outer {
        background: url(../../assets/images/3d/box.png) no-repeat;
        width: 114px;
        height: 114px;
        margin-right: 12px;
        margin-bottom: 12px;
        padding: 7px;
        cursor: pointer;
        box-sizing: border-box;
        div {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background-size: 100% 100% !important;
        }
      }
    }

    .select {
      margin-left: 24px;
      margin-top: 26px;
      width: 240px;
      background: rgba(17, 33, 57, 1);
      border: 1px solid rgba(29, 175, 251, 1);
      box-sizing: border-box;
      /deep/.el-input__inner {
        background-color: transparent !important;
        border-radius: 0px;
        border: none;
        box-sizing: border-box;
        color: rgba(30, 175, 251, 1);
        height: 34px;
        line-height: 34px;
      }

      /deep/.el-input .el-select__caret {
        color: rgba(29, 175, 251, 1);
      }

      /deep/.el-select-dropdown {
        border-radius: 4px;
        background: rgba(17, 33, 57, 1);
        border: 1px solid rgba(29, 175, 251, 1);
        box-shadow: none;
      }

      /deep/.el-select-dropdown__item {
        height: 27px;
        line-height: 27px;
        color: rgba(30, 175, 251, 1);
      }

      /deep/.el-select-dropdown__item.hover,
      .el-select-dropdown__item:hover {
        background-color: transparent;
      }

      /deep/.el-select-dropdown__item.selected {
        background: #256592;
        color: rgba(30, 175, 251, 1);
      }

      /deep/.el-popper .popper__arrow::after {
        top: 0px;
        border-bottom-color: rgba(29, 175, 251, 1);
      }

      /deep/.el-poppe {
        margin-left: -2px;
      }
    }
  }

  .editBox {
    display: inline-block;
    width: 285px;
    height: 127px;
    background: url(../../assets/images/3d/info-box.png) no-repeat;
    background-size: 100% 100% !important;
    // bottom: 334px;
    // right: 52px;
    position: absolute;
    box-sizing: border-box;
    font-size: 14px;
    padding: 18px 0px 0px 16px;
    .first {
      display: flex;
      height: 30px;
      /deep/.el-input {
        margin-left: 5px;
        margin-right: 14px;
        height: 23px;
        width: 88px;
      }
      /deep/.el-input__inner {
        background: rgba(0, 57, 87, 1);
        opacity: 0.9;
        border-radius: 0px;
        border: none;
        color: #ffffff;
        line-height: 23px;
        height: 23px;
      }
      /deep/.input.el-input {
        width: 45px;
      }
      .num {
        display: flex;
        flex-direction: column;
        width: 8px;
        height: 14px;
        top: 22px;
        right: 30px;
        position: absolute;
        span {
          width: 8px;
          height: 5px;
          cursor: pointer;
        }
        span:nth-child(1) {
          background: url(../../assets/images/3d/up.png) no-repeat;
        }
        span:nth-child(1):active {
          background: url(../../assets/images/3d/up-press.png) no-repeat;
        }
        span:nth-child(2) {
          background: url(../../assets/images/3d/down.png) no-repeat;
          margin-top: 4px;
        }
        span:nth-child(2):active {
          background: url(../../assets/images/3d/down-press.png) no-repeat;
        }
      }
    }
    .btn {
      display: inline-block;
      width: 108px;
      position: absolute;
      left: 87px;
      bottom: 10px;
      height: 23px;
      background: rgba(32, 156, 223, 1);
      text-align: center;
      line-height: 23px;
      cursor: pointer;
    }
    .btn:active {
      background: #00679d;
    }
    .second {
      margin-top: 10px;
    }
    .task {
      position: relative;
      margin-left: 5px;
      display: inline-block;
      width: 194px;
      height: 23px;
      background: rgba(0, 57, 87, 1);
      opacity: 0.9;
      padding: 0px 10px;
      box-sizing: border-box;
      span:nth-child(1) {
        font-size: 14px;
        line-height: 23px;
      }
      span:nth-child(2) {
        right: 10px;
        top: 10px;
        position: absolute;
        display: inline-block;
        width: 8px;
        height: 5px;
        cursor: pointer;
        background: url(../../assets/images/3d/down.png) no-repeat;
      }
      span:nth-child(2):active {
        background: url(../../assets/images/3d/down-press.png) no-repeat;
      }
    }
  }

  .close {
    position: absolute;
    display: inline-block;
    background: url(../../assets/images/3d/close.png) no-repeat;
    top: 6px;
    right: 6px;
    width: 12px;
    height: 12px;
    cursor: pointer;
  }

  .infoBox {
    bottom: 334px;
    right: 52px;
    position: absolute;
    display: inline-block;
    width: 270px;
    height: 330px;
    background: url(../../assets/images/3d/info-box.png) no-repeat;
    padding: 0px 20px;
    box-sizing: border-box;
    text-align: center;
    .img {
      margin-top: 27px;
      width: 230px;
      height: 129px;
    }
    .title {
      display: inline-block;
      font-size: 16px;
      color: rgba(30, 176, 252, 1);
      margin-top: 10px;
      font-weight: 500;
    }
    .decorate {
      margin-top: 15px;
      width: 239px;
      height: 2px;
      background: linear-gradient(
        -90deg,
        rgba(30, 176, 252, 0) 0%,
        rgba(30, 176, 252, 0.99) 51%,
        rgba(30, 176, 252, 0) 100%
      );
    }
    .detail {
      margin-top: 22px;
      ul {
        li {
          word-break: break-all;
          span {
            display: inline-block;
            position: relative;
            top: -7px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 27px;
          }
          div {
            display: inline-block;
            width: 163px;
            height: 23px;
            background: rgba(0, 57, 87, 1);
            opacity: 0.9;
          }
        }
      }
    }
  }

  .rightTool {
    display: flex;
    flex-direction: column;
    width: 80px;
    position: absolute;
    right: 20px;
    top: 125px;
    align-items: center;
    .move {
      width: 80px;
      height: 80px;
      display: inline-block;
      background: url(../../assets/images/3d/move-bg.png) no-repeat;
      position: relative;
      span {
        display: inline-block;
        cursor: pointer;
        position: absolute;
      }
      span:nth-child(1) {
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 40px;
        height: 40px;
        background: url(../../assets/images/3d/hand.png) no-repeat;
      }
      .left {
        top: 50%;
        transform: translateY(-50%);
        width: 9px;
        height: 10px;
      }
      .up {
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 9px;
      }
      span:nth-child(2) {
        left: 7px;
        background: url(../../assets/images/3d/move-left.png) no-repeat;
      }
      span:nth-child(3) {
        right: 7px;
        background: url(../../assets/images/3d/move-right.png) no-repeat;
      }
      span:nth-child(4) {
        top: 7px;
        background: url(../../assets/images/3d/move-up.png) no-repeat;
      }
      span:nth-child(5) {
        bottom: 7px;
        background: url(../../assets/images/3d/move-down.png) no-repeat;
      }
    }
    .zoom {
      display: inline-block;
      cursor: pointer;
      width: 27px;
      height: 27px;
    }
    > span:nth-child(2) {
      margin-top: 13px;
      background: url(../../assets/images/3d/+.png) no-repeat;
    }
    > span:nth-child(3) {
      margin-top: 10px;
      background: url(../../assets/images/3d/-.png) no-repeat;
    }
  }
}
</style>
