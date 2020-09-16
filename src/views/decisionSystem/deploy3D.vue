<template>
  <div class="mapcontainer mars3d">
    <Map :url="configUrl" :widgetUrl="widgetUrl" @onload="onMapload" />
    <div class="bottom"></div>
    <div class="tabs">
      <div
        v-for="(item,index) in 8"
        :key="index"
        :class="{active:activeIndex==index}"
        @click.stop="ButtonDown(2,index)"
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
        <div
          v-for="(item,index) in curModels"
          :key="index"
          class="outer"
          @click="ButtonDown(1,item,index)"
          :class="{active:curModelIndex===index}"
          :title="item.name"
        >
          <div :style="{background: 'url('+ item.image +') no-repeat'}"></div>
        </div>
      </div>
    </div>
    <div class="edit" v-show="editMode">
      <div class="tabList">
        <div
          v-for="(item,index) in 4"
          :key="index"
          :class="{active:editIndex==index}"
          @click.stop="ButtonDown(5,index)"
        ></div>
      </div>
      <div @click.stop="ButtonDown(6)">设定视角</div>
      <div class="add" @click.stop="ButtonDown(10,editIndex)" v-show="editIndex!==1&& editIndex!==0"></div>
      <el-popover
        placement="right"
        trigger="click"
        popper-class="editPopover"
        v-model="editPopover"
      >
        <div class="addList">
          <span v-show="editIndex === 0" @click.stop="ButtonDown(8,1)"></span>
          <span v-show="editIndex === 0" @click.stop="ButtonDown(8,2)"></span>
          <span v-show="editIndex === 0" @click.stop="ButtonDown(8,3)"></span>
          <span v-show="editIndex === 0" @click.stop="ButtonDown(8,4)"></span>
          <span v-show="editIndex === 1" @click.stop="ButtonDown(8,5)"></span>
          <span v-show="editIndex === 1" @click.stop="ButtonDown(8,6)"></span>
        </div>
        <div class="txtList">
          <span v-show="editIndex === 0">消防栓</span>
          <span v-show="editIndex === 0">水池水箱</span>
          <span v-show="editIndex === 0">水泵接合器</span>
          <span v-show="editIndex === 0">泵房</span>
          <span v-show="editIndex === 1">安全出口</span>
          <span v-show="editIndex === 1">应急避难所</span>
        </div>
        <div class="add" slot="reference" v-show="editIndex!==2&& editIndex!==3"></div>
        <div class="close" @click="editPopover = false" />
      </el-popover>
      <div v-show="showViewDetail">
        <span>经度: {{viewDetail.lon}}</span>
        <span>纬度: {{viewDetail.lat}}</span>
        <span>视高: {{viewDetail.alt}}</span>
        <span>方向角: {{viewDetail.head}}°</span>
        <span>俯仰角: {{viewDetail.pitch}}°</span>
      </div>
      <div class="list webFsScroll">
        <div
          v-for="(item,index) in markDatas[editIndex]"
          :key="index"
          :class="{active:modelIndex==index}"
          @click.stop="ButtonDown(7,item,index)"
        >
          <span :style="machineIcon(item.type)"></span>
          <span></span>
          <span>{{item.name}}</span>
          <span @click.stop="ButtonDown(9,item)"></span>
        </div>
      </div>
    </div>
    <div class="infoBox" v-show="showInfoBox" ref="infobox">
      <div class="close" @click="showInfoBox = false" />
      <img :src="infoBox.imgSrc" />
      <span class="export"></span>
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
      <div class="close" @click="closeEditBox" />
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
    <FloorGuide ref="floorGuide" v-bind:title="buildingTitle"></FloorGuide>
    <div class="rightTool">
      <span></span>
      <span
        class="left"
        @mousedown="moveCamera(2)"
        @mouseup="stopMoveCamera(2)"
        @mouseleave="stopMoveCamera(2)"
      ></span>
      <span
        class="left"
        @mousedown="moveCamera(3)"
        @mouseup="stopMoveCamera(3)"
        @mouseleave="stopMoveCamera(3)"
      ></span>
      <span
        class="up"
        @mousedown="moveCamera(4)"
        @mouseup="stopMoveCamera(4)"
        @mouseleave="stopMoveCamera(4)"
      ></span>
      <span
        class="up"
        @mousedown="moveCamera(5)"
        @mouseup="stopMoveCamera(5)"
        @mouseleave="stopMoveCamera(5)"
      ></span>
    </div>
    <div class="zoom">
      <span @click="ZoomIn(true)"></span>
      <span @click="ZoomIn(false)"></span>
    </div>
    <div class="rightTool compassGyro">
      <span></span>
      <span
        class="left"
        @mousedown="rotateCamera(2)"
        @mouseup="stopRotateCamera"
        @mouseleave="stopRotateCamera"
      ></span>
      <span
        class="left"
        @mousedown="rotateCamera(3)"
        @mouseup="stopRotateCamera"
        @mouseleave="stopRotateCamera"
      ></span>
      <span
        class="up"
        @mousedown="rotateCamera(4)"
        @mouseup="stopRotateCamera"
        @mouseleave="stopRotateCamera"
      ></span>
      <span
        class="up"
        @mousedown="rotateCamera(5)"
        @mouseup="stopRotateCamera"
        @mouseleave="stopRotateCamera"
      ></span>
    </div>
    <div class="topTool">
      <span v-for="(item,index) in 7" :key="index" @click.stop="ButtonDown(3,index)"></span>
    </div>
    <div class="rotate" :class="{active:isRotate}" @click.stop="ButtonDown(4)"></div>
  </div>
</template>

<script>
import Map from './components/marsMap.vue'
import FloorGuide from './components/FloorGuide.vue'
import { stringIsNullOrEmpty } from '@/utils/validate'
import { uuid } from '@/utils/public'
import axios from 'axios'
var Cesium = window.Cesium
var mars3d = window.mars3d
var gltfEdit = window.gltfEdit
const serverUrl = 'http://172.16.16.101:9000/mapdata'
let me
export default {
  // 所有cesium和mars3d对象 都不要绑定到data
  data () {
    return {
      isRotate: false, // 是否自动旋转
      num: 1, // 编号
      activeIndex: 0,
      editIndex: 0,
      modelIndex: 1000,
      showViewDetail: false, // 显示视角信息
      curModelIndex: 1000, // 沙盘绘制模式下，选中模型索引
      configUrl: 'config/config.json',
      widgetUrl: 'config/widget.json',
      showPlotBox: false,
      editMode: false, // 是否编辑模式
      isPlot: false, // 是否是沙盘绘制
      plotType: '',
      options: [], // 沙盘绘制选项
      curModels: [],
      showInfoBox: false,
      showEditBox: false, // 是否显示模型任务编辑框
      boxLeft: 0, // 任务编辑弹窗left
      boxTop: 0, // 任务编辑弹窗top
      showPopover: false,
      editPopover: false, // 编辑模式Popover是否显示
      infoBox: { imgSrc: '' },
      editBox: { department: '天门敦', number: '1', task: '- -' },
      viewDetail: { lat: '', lon: '', alt: '', head: '', pitch: '' },
      markDatas: [[], [], [], []],
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
    // document.addEventListener('click', this.closeInfoBox)
  },

  beforeDestroy () {
    if (this.drawControl) {
      this.endPlot()
    }
    // document.removeEventListener('click', this.closeInfoBox)
  },

  watch: {
    plotType (val) {
      if (this.options.length > 0 && val >= 0 && val < this.options.length) {
        this.curModels = this.options[val].list
      }
    },

    editIndex (val) {
      if (val !== 0 && val !== 1) {
        this.editPopover = false
      }
      this.fliterModel(val)
    },

    activeIndex (val) {
      switch (val) {
        case 0:
        case 4:
        case 6:
          this.fliterModel(1000)
          break
        case 1:
        case 2:
        case 3:
          this.fliterModel(val - 1)
          break
        case 5:
          this.fliterModel(3)
          break
        case 7:
          this.fliterModel(this.editIndex)
          break
        default:
          break
      }
    }
  },

  methods: {
    tabTo (index) {
      if (this.activeIndex === index) return
      this.activeIndex = index
      this.showPlotBox = false
      this.editMode = false
      if (this.activeIndex === 4) {
        this.showPlotBox = true
      } else if (this.activeIndex === 6) {
        this.$refs.floorGuide.show(this.buildingInfos, 0)
      } else if (this.activeIndex === 7) {
        this.editMode = true
      }
    },

    /**
     *  匹配icon
     */
    machineIcon (type) {
      switch (type) {
        case 1:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/xiaofangshuan-edit.png') +
              ') no-repeat'
          }
        case 2:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/watertank-edit.png') +
              ') no-repeat'
          }
        case 3:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/pumpadapter-edit.png') +
              ') no-repeat'
          }
        case 4:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/pumphouse-edit.png') +
              ') no-repeat'
          }
        case 5:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/exit-edit.png') +
              ') no-repeat'
          }
        case 6:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/emergencyshelters-edit.png') +
              ') no-repeat'
          }
        case 7:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/build-edit.png') +
              ') no-repeat'
          }
        case 8:
          return {
            background:
              'url(' +
              require('../../assets/images/3d/vr-edit.png') +
              ') no-repeat'
          }
        default:
          break
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
     *  关闭任务编辑框
     */
    closeEditBox () {
      if (this.isPlot && this.showEditBox) {
        this.$notify.warning({ title: '警告', message: '请先添加任务' })
        return
      }
      this.showEditBox = false
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
     * 根据 距离方向 和 观察点 计算 目标点
     * @param {Object} viewPoint 观察点
     * @param {Object} direction 方向
     * @param {Object} radius 可视距离
     */
    getPointByDirectionAnd (position, angle, radius) {
      var center = mars3d.pointconvert.cartesian2mercator(position)

      var x = center[0] + radius * Math.cos(angle)
      var y = center[1] + radius * Math.sin(angle)

      var newPoint = mars3d.pointconvert.mercator2cartesian([x, y, center[2]])
      return newPoint
    },

    /**
     * 计算模型下方矩形框位置
     * @param {Object} entity 模型
     */
    getModelRectPosition (entity) {
      // 求出模型heading值
      var hpr = mars3d.matrix.getHeadingPitchRollByMatrix(entity.modelMatrix)
      var heading = Cesium.Math.toDegrees(hpr.heading)
      heading = 360 - heading
      heading = Cesium.Math.toRadians(heading)
      // 左上
      const p1 = Cesium.Matrix4.multiplyByPoint(
        entity.modelMatrix,
        new Cesium.Cartesian3(-7, 2, 0),
        new Cesium.Cartesian3()
      )
      // 右上
      const p2 = Cesium.Matrix4.multiplyByPoint(
        entity.modelMatrix,
        new Cesium.Cartesian3(5, 2, 0),
        new Cesium.Cartesian3()
      )
      // 右下
      const p3 = Cesium.Matrix4.multiplyByPoint(
        entity.modelMatrix,
        new Cesium.Cartesian3(5, -2, 0),
        new Cesium.Cartesian3()
      )
      // 左下
      const p4 = Cesium.Matrix4.multiplyByPoint(
        entity.modelMatrix,
        new Cesium.Cartesian3(-7, -2, 0),
        new Cesium.Cartesian3()
      )
      return {
        rotation: heading,
        p1: p1,
        p2: p2,
        p3: p3,
        p4: p4
      }
    },

    /**
     *  设置模型任务
     */
    setModelTask () {
      if (stringIsNullOrEmpty(this.editBox.department)) {
        this.$notify.warning({ title: '警告', message: '请输入单位' })
        return
      }
      if (stringIsNullOrEmpty(this.editBox.number)) {
        this.$notify.warning({ title: '警告', message: '请输入序号' })
        return
      }
      if (
        stringIsNullOrEmpty(this.editBox.task) ||
        this.editBox.task === '- -'
      ) {
        this.$notify.warning({ title: '警告', message: '请输入任务' })
        return
      }
      this.showEditBox = false
      if (this.isPlot) {
        // 开启drawControl编辑功能
        this.drawControl.hasEdit(true)
        this.isPlot = false
        var task = JSON.parse(JSON.stringify(this.editBox))
        task.name = this.curEntity.name
        this.addModelLabel(this.curEntity, task)

        // 添加模型下方矩形框
        const entity = this.curEntity
        const p = this.getModelRectPosition(entity)
        const rect = this.viewer.entities.add({
          name: task.name,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy([
              p.p1,
              p.p2,
              p.p3,
              p.p4,
              p.p1
            ]),
            material: Cesium.Color.GREEN.withAlpha(0.5)
          }
        })

        // 消防车下方，矩形框列表
        if (!this.rectList) this.rectList = []
        this.rectList.push(rect)
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
      return this.labelList.find(t => t.opts.name === name)
    },

    /**
     *  寻找模型对应marker
     * @param {String} name 标签data.name
     */
    findModelMarker (name) {
      return this.markList.find(t => t.opts.name === name)
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
      this.showOrHideRect(false, entity)
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
      const offsetX = 100
      if (point.x + 285 + offsetX >= width) {
        this.boxLeft = 0
      } else this.boxLeft = point.x + offsetX
      if (point.y + 270 >= height) {
        this.boxTop = height - 270
      } else this.boxTop = point.y
    },

    /**
     *  自动查找任务编辑框的序号
     */
    autoFindEditBoxNum () {
      var number = 1
      for (var i = 0; i < this.labelList.length; i++) {
        const t = this.labelList[i]
        if (parseInt(t.opts.data.number) !== number) {
          break
        } else number += 1
      }

      return number
    },

    /**
     *  顶部工具栏按下
     *@param {Object} item
     */
    topToolClick (item) {
      switch (item) {
        case 0:
          this.returnHome()
          break
        case 1:
          this.screenshot()
          break
        case 2:
          // this.viewer.mars.onlyPickModelPosition = false
          this.measureLength(false)
          break
        case 3:
          // this.viewer.mars.onlyPickModelPosition = false
          this.measureHeight(false)
          break
        case 4:
          // this.viewer.mars.onlyPickModelPosition = false
          this.measureArea(false)
          break
        default:
          break
      }
    },

    /**
     *  按钮按下
     *@param {Object} item
     *@param {Object} type 按钮类型
     */
    ButtonDown (type, item, index) {
      if (!this.viewer) return
      // 停止测量
      if (this.measureSurface) {
        this.measureSurface.stopDraw()
      }
      this.showInfoBox = false
      if (this.isPlot && this.showEditBox) {
        this.$notify.warning({ title: '警告', message: '请先添加任务' })
        return
      }
      if (this.showEditBox) {
        this.showEditBox = false
      }
      this.clearCurEntity()

      switch (type) {
        case 1:
          this.curModelIndex = index
          this.startPlot(item)
          break
        case 2:
          this.tabTo(item)
          break
        case 3:
          this.topToolClick(item)
          break
        case 4:
          this.autoRotate()
          break
        case 5:
          this.editIndex = item
          break
        case 6:
          this.setCameraView()
          break
        case 7:
          this.modelIndex = index
          this.selectItemInEditList(item)
          break
        case 8:
          this.plotModel(item)
          break
        case 9:
          this.deleteModel(item)
          break
        case 10:
          this.plotModel(item === 2 ? 7 : 8)
          break
        default:
          break
      }
    },

    /**
     *  隐藏/显示消防车下方矩形框
     *@param {Boolen} show
     *@param {Object} entity 矩形框名字
     */
    showOrHideRect (show, entity) {
      const attr = entity.attribute
      // 如果是编辑模式下添加的模型
      if (Object.prototype.hasOwnProperty.call(attr, 'edit')) {
        return
      }

      if (me.rectList) {
        const r = me.rectList.find(t => t._name === entity.name)
        if (r !== undefined) {
          if (show) {
            const p = this.getModelRectPosition(entity)
            r.polygon.hierarchy = new Cesium.PolygonHierarchy([
              p.p1,
              p.p2,
              p.p3,
              p.p4,
              p.p1
            ])
          }
          r.show = show
        }
      }
    },

    /**
     *  标会编辑模式下的模型
     *@param {Number} type 模型类型
     */
    plotModel (type) {
      this.editPopover = false
      let item = ''
      switch (type) {
        case 1:
          item = {
            name: '消防栓',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/xiaofangshuan.png'),
            // infobox上的图片
            infoImg: require('../../assets/images/3d/xfs.jpg'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/xiaofang/xiaofangshuan/xiaofangshuan.gltf',
              scale: 0.5
            }
          }
          break
        case 2:
          item = {
            name: '水池水箱',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/watertank.png'),
            // infobox上的图片
            infoImg: require('../../assets/images/3d/bf.jpg'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/xiaofang/common/gltf2.gltf',
              scale: 7
            }
          }
          break
        case 3:
          item = {
            name: '水泵接合器',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/xiaofangshuibengjieheqi.png'),
            // infobox上的图片
            infoImg: require('../../assets/images/3d/xfs.jpg'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/xiaofang/xiaofangshuibengjieheqi/xiaofangshuibengjieheqi.gltf',
              scale: 0.1
            }
          }
          break
        case 4:
          item = {
            name: '泵房',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/pumphouse.png'),
            // infobox上的图片
            infoImg: require('../../assets/images/3d/bf.jpg'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/xiaofang/common/gltf2.gltf',
              scale: 7
            }
          }
          break
        case 5:
          item = {
            name: '安全出口',
            type: 'billboard',
            edittype: 'billboard',
            style: {
              image: require('../../assets/images/3d/exit.png'),
              visibleDepth: false,
              distanceDisplayCondition: true,
              distanceDisplayCondition_far: 1000
            }
          }
          break
        case 6:
          item = {
            name: '应急避难所',
            type: 'billboard',
            edittype: 'billboard',
            style: {
              image: require('../../assets/images/3d/emergencyshelters.png'),
              visibleDepth: false,
              distanceDisplayCondition: true,
              distanceDisplayCondition_far: 1000
            }
          }
          break
        case 7:
          item = {
            name: '重点单位',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/build.png'),
            // infobox上的图片
            infoImg: require('../../assets/images/3d/bf.jpg'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/xiaofang/common/gltf2.gltf',
              scale: 7
            }
          }
          break
        case 8:
          item = {
            name: 'VR全景',
            type: 'model-p',
            isVr: true,
            // 标签上的图片
            img: require('../../assets/images/3d/vr-icon.png'),
            // infobox上的图片
            infoImg: require('../../assets/images/3d/vrquanjing.jpg'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/xiaofang/common/gltf2.gltf',
              scale: 7
            }
          }
          break
        default:
          break
      }
      const modelUrl = item.style.modelUrl
      if (modelUrl && modelUrl.startsWith('$serverURL_gltf$')) {
        item.style.modelUrl = item.style.modelUrl.replace(
          '$serverURL_gltf$',
          serverUrl + '/gltf'
        )
      }

      item.editIndex = this.editIndex
      item.plotType = type
      item.edit = true
      this.startPlot(item)
    },

    /**
     *  选中编辑模式中列表某项
     */
    selectItemInEditList (item) {
      const m = this.modelList.find(m => m.name === item.id)
      if (m !== undefined) {
        this.flyToEntity(m)
      }
    },

    /**
     *  删除编辑模式里面模型
     *@param {Object} item
     */
    deleteModel (item) {
      const m = this.modelList.find(m => m.name === item.id)
      if (m !== undefined) {
        this.drawControl.deleteEntity(m)
        this.deleteModelMarker(m)
        const index = this.modelList.indexOf(m)
        this.modelList.splice(index, 1)
      }
    },

    /**
     *  删除模型对应marker
     *@param {Object} entity 模型
     */
    deleteModelMarker (entity) {
      const attr = entity.attribute
      if (attr.type !== 'billboard') {
        // 删除对应marker
        const t = this.findModelMarker(entity.name)
        if (t !== undefined) {
          const index = this.markList.indexOf(t)
          this.markList.splice(index, 1)
          t.destroy()
        }
      }
      const list = this.markDatas[attr.editIndex]
      const l = list.find(r => r.id === entity.name)
      if (l !== undefined) {
        const index = list.indexOf(l)
        list.splice(index, 1)
      }
    },

    /**
     *  标会编辑模式下的模型完成
     *@param {Object} entity 模型
     */
    plotModelComplete (entity) {
      const id = uuid(8, 16)
      const attr = entity.attribute
      if (!entity.name) entity.name = id
      // 编辑模式下的模型列表
      if (!this.modelList) this.modelList = []
      this.modelList.push(entity)
      // 模型才添加marker
      if (attr.type !== 'billboard') {
        this.addModelMark(entity)
      }
      this.markDatas[this.editIndex].push({
        type: attr.plotType,
        name: attr.name,
        id: entity.name
      })
    },

    /**
     *  根据类型过滤模型
     */
    fliterModel (index) {
      if (this.modelList) {
        this.modelList.forEach(e => {
          if (e.attribute.editIndex === index) { e.show = true } else e.show = false
        })
      }
      if (this.markList) {
        this.markList.forEach(e => {
          if (e.opts.editIndex === index) { e.visible = true } else e.visible = false
        })
      }
    },

    /**
     *  开始绘制
     *@param {Object} item 模型
     */
    startPlot (item) {
      if (!this.drawControl) {
        this.drawControl = new mars3d.Draw(this.viewer, {
          drawShow: true,
          hasEdit: true,
          // nameTooltip: true,//是否在不可编辑状态时将 name名称 属性 绑定到tooltip
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
          const attr = entity.attribute
          const id = new Date().format('yyyy-MM-dd HH:mm:ss')
          if (Object.prototype.hasOwnProperty.call(attr, 'edit')) {
            entity.drawOk = true
            if (attr.type === 'billboard') {
              me.plotModelComplete(entity)
            } else if (entity.loadOk && entity.drawOk) {
              me.plotModelComplete(entity)
            }
          } else {
            entity.name = id
            var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              me.viewer.scene,
              entity.position
            )
            me.curModelIndex = 1000
            // 禁用drawControl编辑功能
            me.drawControl.hasEdit(false)
            me.curEntity = entity
            // 显示模型任务编辑框
            me.isPlot = true
            me.showEditBox = true
            me.editBox.number = me.autoFindEditBoxNum()
            me.editBox.task = '- -'
            me.setEditBoxPosition(point)
          }
        })

        // 模型加载完成后事件
        this.drawControl.on(mars3d.draw.event.LoadEnd, function (e) {
          var entity = e.entity
          const attr = entity.attribute
          if (Object.prototype.hasOwnProperty.call(attr, 'edit')) {
            entity.loadOk = true
            if (entity.loadOk && entity.drawOk) {
              me.plotModelComplete(entity)
            }
          }
          // console.log('gltf模型加载完成')
        })

        // 开始编辑
        this.drawControl.on(mars3d.draw.event.EditStart, function (e) {
          if (e.entity.attribute.type !== 'billboard') {
            me.startEditing(e.entity)
          }
          // console.log('开始编辑')
        })

        this.drawControl.on(mars3d.draw.event.EditMouseMove, function (e) {
          if (e.entity.attribute.type !== 'billboard') {
            me.showOrHideRect(false, e.entity)
            me.stopEditing()
          }
          // console.log('EditMouseMove')
        })

        // 编辑修改了点
        this.drawControl.on(mars3d.draw.event.EditMovePoint, function (e) {
          var entity = e.entity
          if (entity.attribute.type !== 'billboard') {
            me.startEditing(entity)
            const position = me.getModelLabelPosition(entity)
            const attr = entity.attribute
            // 如果是编辑模式下添加的模型
            if (Object.prototype.hasOwnProperty.call(attr, 'edit')) {
              me.updateMarkerPosition(entity.name, position)
            } else {
              me.updateLabelPosition(entity.name, position)
            }
          }
          // console.log('编辑修改了点')
        })

        // 停止编辑
        this.drawControl.on(mars3d.draw.event.EditStop, function (e) {
          if (e.entity.attribute.type !== 'billboard') {
            me.showOrHideRect(true, e.entity)
            me.stopEditing()
          }
          // console.log('停止编辑')
        })

        // 删除了对象
        this.drawControl.on(mars3d.draw.event.Delete, function (e) {
          var entity = e.entity
          const attr = entity.attribute
          // 如果是编辑模式下添加的模型
          if (Object.prototype.hasOwnProperty.call(attr, 'edit')) {
            me.deleteModelMarker(entity)
          } else {
            // 删除对应标签
            const t = me.findModelLabel(entity.name)
            if (t !== undefined) {
              const index = me.labelList.indexOf(t)
              me.labelList.splice(index, 1)
              t.destroy()
            }
            // 删除矩形框列表
            if (me.rectList) {
              const r = me.rectList.find(t => t._name === entity.name)
              if (r !== undefined) {
                const index = me.labelList.indexOf(r)
                me.labelList.splice(index, 1)
                me.viewer.entities.remove(r)
              }
            }
            me.showEditBox = false
          }

          me.stopEditing(entity)
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
     *  更新Marker位置
     * @param {Object} name 标签名称
     * @param {Object} position 标签坐标
     */
    updateMarkerPosition (name, position) {
      const t = this.findModelMarker(name)
      if (t !== undefined) {
        t.position = position
      }
    },

    /**
     *  获取模型上方文字坐标
     * @param {Object} primitive 模型
     */
    getModelLabelPosition (primitive) {
      // 求出模型中心点坐标
      var center = Cesium.Matrix4.multiplyByPoint(
        primitive.modelMatrix,
        primitive.boundingSphere.center,
        new Cesium.Cartesian3()
      )
      const p = me.CartesianToDegrees(center)
      return Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 2)
    },

    /**
     *  添加模型上方标签
     * @param {Object} primitive 模型
     * @param {Object} task 任务信息
     */
    addModelLabel (primitive, task) {
      const position = this.getModelLabelPosition(primitive)
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
        data: task,
        name: primitive.name,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500)
      })
      this.labelList.push(label)
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

    /**
     *  primitives方式添加模型
     * @param {Object} cfg 模型配置
     * @param {Object} callback 模型加载后的回调
     */
    createModel (cfg, callback) {
      var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0)
      var hpRoll = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(cfg.heading || 0),
        Cesium.Math.toRadians(cfg.pitch || 0),
        Cesium.Math.toRadians(cfg.roll || 0)
      )

      var converter =
        cfg.converter || Cesium.Transforms.eastNorthUpToFixedFrame // Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west')

      var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      )
      if (cfg.scale) {
        Cesium.Matrix4.multiplyByUniformScale(
          modelMatrix,
          cfg.scale,
          modelMatrix
        )
      }

      var modelPrimitive = this.viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          url: cfg.url,
          modelMatrix: modelMatrix,
          minimumPixelSize: cfg.minimumPixelSize || 30,
          silhouetteColor: Cesium.Color.fromAlpha(
            Cesium.Color.YELLOW,
            parseFloat(0.9)
          )
        })
      )
      modelPrimitive.attribute = cfg
      modelPrimitive.name = cfg.id
      modelPrimitive.position = position
      modelPrimitive.hasOutLine = true

      modelPrimitive.readyPromise.then(function (model) {
        callback(modelPrimitive)
      })

      return modelPrimitive
    },

    /**
     *  显示模型编辑框
     * @param {Object} entity 模型
     */
    showModelEditBox (entity) {
      me.showEditBox = true
      const t = me.findModelLabel(entity.name)
      if (t !== undefined) {
        me.copyData(t.opts.data, me.editBox)
      }
      var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        me.viewer.scene,
        entity.position
      )
      me.setEditBoxPosition(point)
    },

    /**
     *  添加模型标签
     * @param {Object} entity 模型
     */
    addModelMark (entity) {
      const attr = entity.attribute
      const position = me.getModelLabelPosition(entity)
      let html = ''
      if (attr.isVr) {
        html = ` <div class="labelvr">
                </div>`
      } else {
        html = ` <div class="label labelxfs">
                  <img src="${attr.img}"></img>
                  <span>${attr.name}</span>
                </div>`
      }
      const marker = new mars3d.DivPoint(this.viewer, {
        editIndex: attr.editIndex,
        html: html,
        anchor: [0, -10],
        position: position,
        depthTest: false,
        name: entity.name,
        click: function (entity) {
          me.ClickDivPoint(entity, attr.infoImg, attr.name, false)
        }
      })
      this.infoBox.imgSrc = attr.infoImg
      this.infoBox.label = attr.name
      this.showInfoBox = true
      // 标签列表
      if (!this.markList) {
        this.markList = []
      }
      this.markList.push(marker)
    },

    addModel () {
      me = this
      var dataSource = new Cesium.CustomDataSource()
      this.viewer.dataSources.add(dataSource)
      const lat = 30.510093
      const lon = 114.235004
      const id = new Date().format('yyyy-MM-dd HH:mm:ss')
      this.createModel(
        {
          url: serverUrl + '/gltf/mars/firedrill/xiaofangche.gltf',
          x: lon,
          y: lat,
          z: 12,
          id: id
        },
        function (primitive) {
          const task = {
            name: id,
            department: '洪山分局',
            number: '1',
            task: '供水'
          }
          // 模型标签列表
          me.labelList = []
          me.addModelLabel(primitive, task)
        }
      )

      // setInterval(() => {
      //   lon += 0.000001
      //   // entity.position = Cesium.Cartesian3.fromDegrees(lon, lat, 12)
      //   var position = Cesium.Cartesian3.fromDegrees(lon, lat, 12)
      //   var hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0))

      //   var converter = Cesium.Transforms.eastNorthUpToFixedFrame // Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west')

      //   var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, converter)
      //   modelPrimitive.modelMatrix = modelMatrix
      //   modelPrimitive.position = position
      //   label.position = Cesium.Cartesian3.fromDegrees(lon, lat, 16)
      // }, 1000)

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

      layercfg.visible = true
      layercfg.flyTo = true
      this.layerModel = mars3d.layer.createLayer(layercfg, this.viewer)
      this.layerModel.centerAt()
    },

    /**
     *  点击DivPoint
     * @param {Object} entity DivPoint
     * @param {Object} imgSrc 图片
     * @param {String} label 标题
     * @param {Boolen} showInfoBox 是否显示infobox
     */
    ClickDivPoint (entity, imgSrc, label, showInfoBox) {
      if (this.isPlot && this.showEditBox) {
        this.$notify.warning({ title: '警告', message: '请先添加任务' })
        return
      }

      if (this.showEditBox) {
        this.showEditBox = false
        this.showPopover = false
      }
      this.clearCurEntity()
      this.showInfoBox = false
      this.flyToEntity(entity, function (e) {
        // 飞行完成回调方法
        if (showInfoBox) {
          me.infoBox.imgSrc = imgSrc
          me.infoBox.label = label
          me.showInfoBox = showInfoBox
        }
      })
    },

    /**
     *  相机视角回到home点
     */
    returnHome () {
      this.layerModel.centerAt()
    },

    /**
     *  平移相机
     */
    moveCamera (direction) {
      if (!this.viewer) return
      switch (direction) {
        case 4:
          this.viewer.mars.keyboardRoam.startMoveForward()
          break
        case 5:
          this.viewer.mars.keyboardRoam.startMoveBackward()
          break
        case 2:
          this.viewer.mars.keyboardRoam.startMoveLeft()
          break
        case 3:
          this.viewer.mars.keyboardRoam.startMoveRight()
          break
        default:
          break
      }
    },

    /**
     *  停止平移相机
     */
    stopMoveCamera (direction) {
      if (!this.viewer) return
      switch (direction) {
        case 4:
          this.viewer.mars.keyboardRoam.stopMoveForward()
          break
        case 5:
          this.viewer.mars.keyboardRoam.stopMoveBackward()
          break
        case 2:
          this.viewer.mars.keyboardRoam.stopMoveLeft()
          break
        case 3:
          this.viewer.mars.keyboardRoam.stopMoveRight()
          break
        default:
          break
      }
    },

    /**
     *  停止旋转相机
     */
    stopRotateCamera (direction) {
      if (this.moveInterval) {
        clearInterval(this.moveInterval)
      }
    },

    /**
     *  旋转相机
     */
    rotateCamera (direction) {
      if (!this.viewer) return
      this.moveInterval = setInterval(function () {
        me.viewer.mars.keyboardRoam.rotateCamera(direction)
      }, 50)
    },

    /**
     *  放大
     *  @param {Boolen} in 是否放大
     */
    ZoomIn (isIn) {
      if (!this.viewer) return
      var zoomIn = new mars3d.ZoomNavigation(this.viewer, isIn)
      zoomIn.activate()
    },

    /**
     *  测量开始,移除鼠标事件
     * @param {Number} type 测量类型
     */
    measureStart () {
      // 禁用drawControl编辑功能
      if (this.drawControl) {
        this.drawControl.hasEdit(false)
      }
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    },

    /**
     *  测量结束,绑定鼠标事件
     */
    measureEnd () {
      // 开启drawControl编辑功能
      if (this.drawControl) {
        this.drawControl.hasEdit(true)
      }
      // 控制鼠标只取模型上的点，忽略地形上的点的拾取
      this.viewer.mars.onlyPickModelPosition = true
      this.handler.setInputAction(event => {
        me.showInfoBox = false
        // 如果正在编辑第一次绘制模型的任务
        if (me.isPlot && me.showEditBox) {
          me.$notify.warning({ title: '警告', message: '请先添加任务' })
          return
        }

        me.clearCurEntity()
        var pickedObject = me.viewer.scene.pick(event.position)
        // 如果点击的是模型
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.primitive instanceof Cesium.Model &&
          pickedObject.primitive._resource._url.indexOf('axis.gltf') === -1
        ) {
          me.curEntity = pickedObject.primitive
          let show = true
          // 如果点击消防栓模型
          const attr = pickedObject.primitive.attribute
          if (attr && Object.prototype.hasOwnProperty.call(attr, 'edit')) {
            show = false
            me.infoBox.imgSrc = attr.infoImg
            me.infoBox.label = attr.name
            me.showInfoBox = true
            me.showEditBox = false
          }
          // 设置模型选中样式
          if (pickedObject.primitive.hasOutLine) {
            pickedObject.primitive.silhouetteSize = 8
          }
          // 显示任务编辑窗
          if (show && pickedObject.primitive.position) {
            me.showModelEditBox(pickedObject.primitive)
          }
        } else {
          // 如果点击其他区域
          me.showEditBox = false
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    },

    /**
     *  测距
     *  @param {Boolen} terrain 测量长度、面积时标识是否贴地模式
     */
    measureLength (terrain) {
      if (!this.measureSurface) return
      this.measureStart()
      this.measureSurface.measuerLength({
        terrain: terrain,
        onEnd: this.measureEnd,
        style: {
          // 可以自定义样式
          lineType: 'solid',
          color: '#00A8FF',
          width: 3,
          clampToGround: true // 是否贴地
        }
      })
    },

    /**
     *  测面积
     *  @param {Boolen} terrain 测量长度、面积时标识是否贴地模式
     */
    measureArea (terrain) {
      if (!this.measureSurface) return
      this.measureStart()
      this.measureSurface.measureArea({
        terrain: terrain,
        onEnd: this.measureEnd,
        style: {
          // 可以自定义样式
          color: '#00A8FF',
          opacity: 0.25,
          outline: true,
          outlineColor: '#00A8FF',
          outlineWidth: 2,
          clampToGround: true // 贴地
        }
      })
    },

    /**
     *  高度差
     *  @param {Boolen} isSuper 是否三角测量
     */
    measureHeight (isSuper) {
      if (!this.measureSurface) return
      this.measureStart()
      this.measureSurface.measureHeight({
        isSuper: isSuper,
        onEnd: this.measureEnd,
        style: {
          // 可以自定义样式
          lineType: 'solid',
          color: '#00A8FF',
          width: 3,
          clampToGround: true // 是否贴地
        }
      })
    },

    /**
     *  设置视角
     */
    setCameraView () {
      this.showViewDetail = true
      const view = mars3d.point.getCameraView(this.viewer, true)
      this.viewDetail.lat = view.x
      this.viewDetail.lon = view.y
      this.viewDetail.alt = view.z
      this.viewDetail.head = view.heading
      this.viewDetail.pitch = view.pitch
      console.log(view)
    },

    /**
     *  清除当前模型
     */
    clearCurEntity () {
      if (this.curEntity) {
        if (this.curEntity.hasOutLine) {
          this.curEntity.silhouetteSize = 0
        }
        this.curEntity = ''
      }
    },

    /**
     *  自动旋转
     */
    autoRotate () {
      if (!this.layerModel) return
      this.isRotate = !this.isRotate
      if (this.isRotate) {
        mars3d.point.windingPoint.start(
          this.viewer,
          this.layerModel.originalCenter
        )
      } else mars3d.point.windingPoint.stop()
    },

    /**
     *  截图
     */
    screenshot () {
      this.viewer.mars.expImage({
        download: true,
        calback: function (base64, size) {
          // 回调
          window.layer.open({
            type: 1,
            title: '场景出图',
            skin: 'layer-mars-dialog animation-scale-up',
            resize: true,
            area: ['50%', '60%'], // 宽高
            content: '<img src=' + base64 + ' style="width:100%;">'
          })
        }
      })
    },

    /**
     *  地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
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

      this.measureSurface = new mars3d.analysi.Measure({
        viewer: viewer,
        removeScreenSpaceEvent: true,
        label: {
          // 可设置文本样式
          color: '#333333',
          font_family: '微软雅黑',
          font_size: 12,
          background_color: '#ffffff',
          background_opacity: 1,
          background: true
        }
      })

      // 地图鼠标按下
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      this.measureEnd()
      this.addModel()
    }
  }
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
  right: 16px !important;
  width: 107px !important;
  height: 107px !important;
  bottom: 24px !important;
}

/deep/.compass-outer-ring {
  background: url(../../assets/images/3d/N.png) no-repeat !important;
  bottom: 138px !important;
}

/deep/.compass-outer-ring-background {
  display: none;
}

/deep/.compass-rotation-marker {
  display: none !important;
}

/deep/.compass-gyro-background {
  display: none;
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
    div.active {
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

  .edit {
    position: absolute;
    background: url(../../assets/images/3d/edit-box.png) no-repeat;
    width: 368px;
    height: 690px;
    left: 38px;
    top: 50px;
    .tabList {
      margin-left: 70px;
      margin-top: 30px;
      display: flex;
      align-items: flex-end;
      div {
        width: 37px;
        height: 42px;
        cursor: pointer;
        margin-right: 22px;
      }
      div:nth-child(1) {
        background: url(../../assets/images/3d/water-small.png) no-repeat;
      }
      div:nth-child(1).active {
        background: url(../../assets/images/3d/water-small-s.png) no-repeat;
        width: 46px;
        height: 52px;
      }
      div:nth-child(2) {
        background: url(../../assets/images/3d/fire-small.png) no-repeat;
      }
      div:nth-child(2).active {
        background: url(../../assets/images/3d/fire-small-s.png) no-repeat;
        width: 46px;
        height: 52px;
      }
      div:nth-child(3) {
        background: url(../../assets/images/3d/area-small.png) no-repeat;
      }
      div:nth-child(3).active {
        background: url(../../assets/images/3d/area-small-s.png) no-repeat;
        width: 46px;
        height: 52px;
      }
      div:nth-child(4) {
        background: url(../../assets/images/3d/vr-small.png) no-repeat;
      }
      div:nth-child(4).active {
        background: url(../../assets/images/3d/vr-small-s.png) no-repeat;
        width: 46px;
        height: 52px;
      }
    }
    .list {
      box-sizing: border-box;
      height: 432px;
      margin-top: 29px;
      margin-right: 8px;
      overflow-y: auto;
      padding: 0px 23px 0px 33px;
      > div {
        width: 299px;
        height: 44px;
        box-sizing: border-box;
        background: #0a2549;
        border-radius: 6px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        span:nth-child(1) {
          margin-right: 19px;
          margin-left: 10px;
          display: inline-block;
          width: 28px;
          height: 28px;
        }
        span:nth-child(2) {
          display: inline-block;
          width: 2px;
          height: 42px;
          background: url(../../assets/images/3d/rect.png) no-repeat;
          margin-right: 27px;
        }
        span:nth-child(3) {
          display: inline-block;
          font-size: 16px;
          color: #00cbff;
          flex-grow: 1;
        }
        span:nth-child(4) {
          cursor: pointer;
          display: inline-block;
          width: 15px;
          height: 20px;
          background: url(../../assets/images/3d/delete.png) no-repeat;
          margin-left: 14px;
          margin-right: 14px;
        }
      }
      > div.active {
        border: 1px solid #36a0f2;
      }
    }

    > div:nth-child(2) {
      position: absolute;
      width: 108px;
      height: 28px;
      background: #209cdf;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 28px;
      left: 40px;
      bottom: 75px;
      cursor: pointer;
    }
    > div:nth-child(2):active {
      background: #00679d;
    }
    .add {
      position: absolute;
      width: 40px;
      height: 40px;
      background: url(../../assets/images/3d/add.png) no-repeat;
      right: 40px;
      bottom: 69px;
      cursor: pointer;
    }
    .add:active {
      background: url(../../assets/images/3d/add-click.png) no-repeat;
    }
    > div:nth-child(4) {
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      left: 24px;
      bottom: 8px;
      span {
        display: inline-block;
        height: 22px;
        background: #0a2549;
        font-size: 10px;
        color: #ffffff;
        line-height: 22px;
        width: 97px;
        margin-right: 10px;
        margin-bottom: 6px;
        text-align: center;
      }
    }
  }

  .plotBox {
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
      .outer.active {
        border: 2px solid rgba(255, 244, 100, 1);
        background: none;
      }
      .outer:hover {
        border: 2px solid rgba(255, 244, 100, 1);
        background: none;
      }
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
    width: 285px;
    height: 127px;
    background: url(../../assets/images/3d/info-box.png) no-repeat;
    background-size: 100% 100% !important;
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
    width: 270px;
    height: 330px;
    background: url(../../assets/images/3d/info-box.png) no-repeat;
    padding: 0px 20px;
    box-sizing: border-box;
    text-align: center;

    > img {
      margin-top: 27px;
      width: 230px;
      height: 129px;
    }
    .export {
      cursor: pointer;
      display: inline-block;
      top: 134px;
      right: 20px;
      position: absolute;
      width: 22px;
      height: 22px;
      background: url(../../assets/images/3d/export.png) no-repeat;
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
    position: absolute;
    right: 30px;
    bottom: 143px;
    width: 80px;
    height: 80px;
    background: url(../../assets/images/3d/move-bg.png) no-repeat;
    span {
      display: inline-block;
      cursor: pointer;
      position: absolute;
    }
    span:nth-child(1) {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background: url(../../assets/images/3d/hand.png) no-repeat;
      cursor: default;
    }
    .left {
      width: 18px;
      height: 18px;
    }
    .up {
      left: 50%;
      transform: translateX(-50%);
      width: 18px;
      height: 18px;
    }
    span:nth-child(2) {
      top: 50%;
      transform: translateY(-50%);
      left: 3px;
      background: url(../../assets/images/3d/move-left.png) no-repeat;
    }
    span:nth-child(3) {
      top: 29px;
      right: 3px;
      background: url(../../assets/images/3d/move-right.png) no-repeat;
    }
    span:nth-child(4) {
      top: 3px;
      background: url(../../assets/images/3d/move-up.png) no-repeat;
    }
    span:nth-child(5) {
      bottom: 3px;
      background: url(../../assets/images/3d/move-down.png) no-repeat;
    }
  }

  .zoom {
    position: absolute;
    right: 58px;
    bottom: 240px;
    display: flex;
    flex-direction: column;
    span {
      display: inline-block;
      cursor: pointer;
      width: 27px;
      height: 27px;
    }
    span:nth-child(1) {
      margin-top: 13px;
      background: url(../../assets/images/3d/+.png) no-repeat;
    }
    span:nth-child(2) {
      margin-top: 10px;
      background: url(../../assets/images/3d/-.png) no-repeat;
    }
  }

  .compassGyro {
    right: 30px;
    bottom: 38px;
    span:nth-child(1) {
      background: url(../../assets/images/3d/eye.png) no-repeat !important;
    }
  }

  .topTool {
    position: absolute;
    display: flex;
    top: 20px;
    right: 30px;
    width: 406px;
    height: 44px;
    background: url(../../assets/images/3d/toolbar-bg.png) no-repeat;
    align-items: center;
    span {
      display: inline-block;
      cursor: pointer;
      width: 30px;
      height: 30px;
    }
    span:nth-child(1) {
      background: url(../../assets/images/3d/home.png) no-repeat;
      margin-left: 16px;
    }
    span:nth-child(2) {
      background: url(../../assets/images/3d/snap.png) no-repeat;
      margin-left: 59px;
    }
    span:nth-child(3) {
      background: url(../../assets/images/3d/measure-distance.png) no-repeat;
      margin-left: 41px;
    }
    span:nth-child(3)::before {
      content: "";
      position: absolute;
      top: 4px;
      right: 251px;
      display: inline-block;
      width: 2px;
      height: 37px;
      background: url(../../assets/images/3d/tool-rect.png) no-repeat;
    }
    span:nth-child(4) {
      background: url(../../assets/images/3d/measure-height.png) no-repeat;
      margin-left: 10px;
    }
    span:nth-child(5) {
      background: url(../../assets/images/3d/measure-area.png) no-repeat;
      margin-left: 10px;
    }
    span:nth-child(6) {
      background: url(../../assets/images/3d/setting.png) no-repeat;
      margin-left: 33px;
    }
    span:nth-child(6)::before {
      content: "";
      position: absolute;
      top: 4px;
      right: 105px;
      display: inline-block;
      width: 2px;
      height: 37px;
      background: url(../../assets/images/3d/tool-rect.png) no-repeat;
    }
    span:nth-child(7) {
      background: url(../../assets/images/3d/share.png) no-repeat;
      margin-left: 13px;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  .rotate {
    position: absolute;
    top: 27px;
    right: 346px;
    width: 30px;
    height: 30px;
    background: url(../../assets/images/3d/rotate-inner.png) no-repeat;
    cursor: pointer;
  }

  .rotate.active {
    //动画名称 动画时间 运动曲线 何时开始 播放次数
    animation: rotate 10s linear 0s infinite;
  }
}
</style>
