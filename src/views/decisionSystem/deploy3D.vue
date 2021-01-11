<template>
  <div class="mapcontainer mars3d" @click.capture="containerClick" :style="'height:'+fullHeight+'px;'">
    <Map :url="configUrl" @onload="onMapload"/>
    <div class="backDiv back" @click.stop="back">
      <span></span>
      <span>三维作战</span>
    </div>
    <div class="bottom"></div>
    <div class="tabs">
      <div
        v-for="(item,index) in tabs"
        :key="index"
        :class="{active:activeIndex==index}"
        @click.stop="tabTo(index)"
      >
        <span>{{item}}</span>
      </div>
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
        <el-tooltip  v-for="(item,index) in curModels" :key="index" popper-class="gTooltip plotTooltip" :content="item.name" placement="top" :open-delay="500">
          <div
            class="outer"
            @click="plot(item,index)"
            :class="{active:curModelIndex===index}"
          >
            <div :style="{background: 'url('+ item.image +') no-repeat'}"></div>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="edit" v-show="editMode">
      <div class="tabList">
        <div
          v-for="(item,index) in 4"
          :key="index"
          :class="{active:editIndex==index}"
          @click.stop="editIndex = index"
        ></div>
      </div>
      <div @click.stop="setCameraView">设定视角</div>
      <el-popover
        placement="right"
        trigger="click"
        popper-class="editPopover"
        v-model="editPopover"
      >
        <div class="addList">
          <span v-show="editIndex === 0" @click.stop="plotModel(1)"></span>
          <span v-show="editIndex === 0" @click.stop="plotModel(2)"></span>
          <span v-show="editIndex === 0" @click.stop="plotModel(3)"></span>
          <span v-show="editIndex === 0" @click.stop="plotModel(4)"></span>
          <span v-show="editIndex === 1" @click.stop="plotModel(5)"></span>
          <span v-show="editIndex === 1" @click.stop="plotModel(6)"></span>
          <span v-show="editIndex === 2" @click.stop="plotModel(7)"></span>
          <span v-show="editIndex === 3" @click.stop="plotModel(8)"></span>
        </div>
        <div class="txtList">
          <span v-show="editIndex === 0">消防栓</span>
          <span v-show="editIndex === 0">水池水箱</span>
          <span v-show="editIndex === 0">水泵接合器</span>
          <span v-show="editIndex === 0">泵房</span>
          <span v-show="editIndex === 1">安全出口</span>
          <span v-show="editIndex === 1">应急避难所</span>
          <span v-show="editIndex === 2">重点区域</span>
          <span v-show="editIndex === 3">VR视角</span>
        </div>
        <div class="add" slot="reference"></div>
        <div class="close" @click.stop="editPopover = false" />
      </el-popover>
      <div v-show="showViewDetail" class="detail">
        <span>经度: {{viewDetail.x}}</span>
        <span>纬度: {{viewDetail.y}}</span>
        <span>视高: {{viewDetail.z}}</span>
        <span>方向角: {{viewDetail.heading}}°</span>
        <span>俯仰角: {{viewDetail.pitch}}°</span>
      </div>
      <div class="list webFsScroll">
        <div
          v-for="(item,index) in markDatas[editIndex]"
          :key="index"
          :class="{active:modelIndex==index}"
          @click.stop="selectItemInEditList(index,item)"
        >
          <span :style="machineIcon(item.type)"></span>
          <span></span>
          <span>{{item.name}}</span>
          <span @click.stop="deleteModel(item)"></span>
        </div>
      </div>
    </div>
    <div class="infoBox" v-show="showInfoBox" ref="infobox">
      <el-input type="text" v-model.trim="infoBox.name" :readonly="!infoBox.editing" class="title" :class="{active:infoBox.editing}"></el-input>
      <div class="close" @click="showInfoBox = false" />
      <div v-if="!infoBox.infoImg" class="default"/>
      <img :src="infoBox.infoImg" v-if="infoBox.infoImg && !infoBox.isVr"/>
      <iframe id="frameImg" frameborder="0" :src="infoBox.infoImg" v-if="infoBox.infoImg && infoBox.isVr"></iframe>
      <div class="frame" v-if="infoBox.infoImg && activeIndex !==7" @click="showImage"></div>
      <span class="export" v-show="infoBox.editing" @click.stop="uploadImg"></span>
      <input type="file" ref="picFile" style="display:none" accept="image/jpeg" @change="picFileChange"/>
      <div class="detail">
        <ul>
          <li>
            <span>位置:</span>
            <el-input type="text" v-model.trim="infoBox.location" :readonly="!infoBox.editing" :class="{active:infoBox.editing}"></el-input>
          </li>
          <li>
            <span>说明:</span>
            <el-input type="text" v-model.trim="infoBox.describe" :readonly="!infoBox.editing" :class="{active:infoBox.editing}"></el-input>
          </li>
        </ul>
      </div>
      <span class="btn editBtn" v-show="infoBox.isEdit" @click.stop="infoBox.editing = true">编辑</span>
      <span class="btn editBtn" v-show="infoBox.editing" @click.stop="saveModelInfo(true)">确定</span>
      <span class="btn cancelBtn" v-show="infoBox.editing" @click.stop="saveModelInfo(false)">取消</span>
    </div>
    <div
      class="editBox" ref="editbox"
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
      <span class="btn" @click.stop="setModelTask">确定</span>
      <span class="del" @click.stop="deletePlotModel" v-if="activeIndex === 4"></span>
      <el-checkbox v-model="editBox.hide" v-if="showHideModel">隐藏模型</el-checkbox>
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
      <el-tooltip v-for="(item,index) in topTools" :key="index" popper-class="gTooltip marsTooltip" :content="item" placement="top" :open-delay="500">
        <span @click.stop="topToolClick(index)"></span>
      </el-tooltip>
    </div>
    <el-tooltip popper-class="gTooltip marsTooltip" content="自动旋转" placement="top" :open-delay="500">
      <div class="rotate" :class="{active:isRotate}" @click.stop="autoRotate"></div>
    </el-tooltip>
    <el-dialog
      custom-class="el-dialog-custom"
      :visible.sync="imgDialogVisible"
      :show-close="false"
      type="primary"
      @click="imgDialogVisible = false"
      center
    >
      <img :src="infoBox.infoImg" v-if="!infoBox.isVr"/>
      <iframe id="iframe" :src="infoBox.infoImg" frameborder="0" v-if="infoBox.isVr"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { gltfEdit } from '@/utils/gltfEdit.js'
import { api } from '@/api/3d.js'
import globalApi from '@/utils/globalApi'
// import EXIF from 'exif-js'
import Map from './components/marsMap.vue'
import FloorGuide from './components/FloorGuide.vue'
import { stringIsNullOrEmpty } from '@/utils/validate'
import { uuid } from '@/utils/public'
import { CartesianToDegrees } from '@/utils/mars3d'
import axios from 'axios'
var Cesium = window.Cesium
var mars3d = window.mars3d
const serverUrl = globalApi.headImg + '/cloud-video/prePlanFor3D/gltf'
let me
export default {
  // 所有cesium和mars3d对象 都不要绑定到data
  data () {
    return {
      minHeight: 929,
      fullHeight: 0,
      homeView: '',
      cameraViews: ['', '', '', ''], // 编辑模式下的视角
      imgDialogVisible: false,
      isRotate: false, // 是否自动旋转
      num: 1, // 编号
      activeIndex: 0,
      editIndex: 1000,
      modelIndex: 1000,
      showViewDetail: false, // 显示视角信息
      curModelIndex: 1000, // 沙盘绘制模式下，选中模型索引
      configUrl: 'config/config.json',
      showPlotBox: false,
      editMode: false, // 是否编辑模式
      isPlot: false, // 是否是沙盘绘制
      plotType: '',
      options: [], // 沙盘绘制选项
      curModels: [],
      showHideModel: false, // 显示隐藏模型选项
      showInfoBox: false,
      showEditBox: false, // 是否显示模型任务编辑框
      boxLeft: 0, // 任务编辑弹窗left
      boxTop: 0, // 任务编辑弹窗top
      showPopover: false,
      editPopover: false, // 编辑模式Popover是否显示
      infoBox: { infoImg: '', isEdit: true, location: '', describe: '', name: '', editing: false, isVr: false },
      editBox: { department: '天门敦', number: '1', task: '- -', hide: false },
      viewDetail: { y: '', x: '', z: '', heading: '', pitch: '' },
      markDatas: [[], [], [], []],
      topTools: ['回正', '截图', '测距', '测高', '测面积', '保存', '设置', '分享'],
      tabs: [
        '实时GIS',
        '水源分布',
        '防火设计',
        '重点区域',
        '沙盘绘制',
        'VR视角',
        '图纸资料',
        '编辑模式'
      ],
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
      buildingTitle: '',
      buildingInfos: []
    }
  },
  components: {
    Map,
    FloorGuide
  },

  mounted () {
    this.getPlotData()
    this.modelPath = this.$route.query.model
    this.configPath = this.$route.query.config
    this.enterpriseId = this.$route.query.enterpriseId
    this.buildingInfos = this.$route.query.buildingInfos
    this.buildingTitle = this.$route.query.buildingTitle
    this.setMapHeight()
    const me = this
    window.onresize = () => {
      me.setMapHeight()
    }
  },

  beforeDestroy () {
    window.onresize = null
    if (this.drawControl) {
      this.endPlot()
    }
  },

  watch: {
    plotType (val) {
      if (this.options.length > 0 && val >= 0 && val < this.options.length) {
        this.curModels = this.options[val].list
      }
    },

    editIndex (val) {
      this.modelIndex = 1000
      this.fliterModel(val)
      if (this.cameraViews[val] !== '') {
        this.showViewDetail = true
        this.copyData(this.cameraViews[val], this.viewDetail)
        this.viewer.mars.centerAt(this.viewDetail)
      } else {
        this.returnHome()
        this.showViewDetail = false
        for (var i in this.viewDetail) this.viewDetail[i] = ''
      }
    },

    showEditBox (val) {
      if (val === false) {
        this.editBox.hide = false
        this.clearCurEntity()
      }
    },

    showInfoBox (val) {
      if (val === false) {
        this.clearCurEntity()
        for (var i in this.infoBox) {
          if (i !== 'isEdit' && i !== 'editing' && i !== 'isVr') {
            this.infoBox[i] = ''
          }
        }
        this.infoBox.editing = false
        this.infoBox.isVr = false
      }
    },

    activeIndex (val, oldVal) {
      if (val === 0 || val === 4 || val === 7) { this.enableDrawControlEdit(true) } else this.enableDrawControlEdit(false)
      let save = false
      if (oldVal === 7 && val !== 7) { save = true } else if (oldVal === 4 && val !== 4) { save = true }
      if (save && this.drawControl && !stringIsNullOrEmpty(this.drawControl.toGeoJSON())) {
        // this.$confirm('当前存在未保存的标绘对象，是否保存?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   showClose: false
        // })
        //   .then(() => {

        //   })
        //   .catch(() => {

        //   })
      }
      var viewIndex = 1000
      switch (val) {
        case 0:
          this.fliterModel(5)
          break
        case 6:
          this.fliterModel(1000)
          break
        case 4:
          this.fliterModel(5)
          break
        case 1:
        case 2:
        case 3:
          this.fliterModel(val - 1)
          viewIndex = val - 1
          break
        case 5:
          this.fliterModel(3)
          viewIndex = 3
          break
        case 7:
          viewIndex = this.editIndex
          this.fliterModel(this.editIndex)
          break
        default:
          break
      }

      if (viewIndex === 1000) this.returnHome()
      else if (this.cameraViews[viewIndex] !== '') this.viewer.mars.centerAt(this.cameraViews[viewIndex])
      else this.returnHome()
    }
  },

  methods: {
    // 设置地图高度，避免F11全屏时，底部有空白
    setMapHeight () {
      var h = document.documentElement.clientHeight - 96
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
    },

    containerClick (event) {
      if (!this.viewer) {
        event.stopPropagation()
        return
      }
      // 如果点击到三维地球，直接返回。因为ScreenSpaceEventHandler绑定的InputAction会最先执行
      if (this.viewer.scene.canvas.contains(event.target)) return
      // 如果点击到信息编辑弹窗
      if (this.$refs.infobox.contains(event.target)) return
      // 停止测量
      if (this.measureSurface) this.measureSurface.stopDraw()
      // 如果正在显示infobox的大图，则不隐藏infobox
      if (!this.imgDialogVisible) this.showInfoBox = false
      // 如果点击到任务编辑弹窗
      if (this.$refs.editbox.contains(event.target)) return
      else if (this.isPlot && this.showEditBox) {
        // 如果第一次编辑任务
        this.$notify.closeAll()
        this.$notify.warning({ title: '警告', message: '请先添加任务' })
        event.stopPropagation()
        return
      }
      if (this.showEditBox) this.showEditBox = false
      this.clearCurEntity()
    },

    tabTo (index) {
      if (this.activeIndex === index && this.activeIndex !== 6) return
      this.activeIndex = index
      this.showPlotBox = false
      this.editMode = false
      if (this.activeIndex === 4) {
        this.showPlotBox = true
      } else if (this.activeIndex === 6) {
        this.$refs.floorGuide.show(this.buildingInfos, 0)
      } else if (this.activeIndex === 7) {
        this.editMode = true
        if (this.editIndex === 1000) this.editIndex = 0
      }
    },

    /**
     *  上传图片
     */
    uploadImg () {
      this.$refs.picFile.click()
    },

    /**
     *  上传模型详情图片
     * @param {Object} file 图片文件
     */
    uploadModelImg (file) {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const formData = new FormData()
      formData.append('file', file)
      const url = this.infoBox.isVr ? api.uploadPanorama : api.uploadModelPic
      this.$axios.post(url, formData, config).then((res) => {
        if (res.data.code === 0) {
          if (this.infoBox.isVr)me.infoBox.infoImg = globalApi.headImg + res.data.data
          else me.infoBox.infoImg = globalApi.headImg + res.data.data.picPath
          me.curEntity.attribute.infoImg = me.infoBox.infoImg
        }
      }).catch(err => {
        const log = this.infoBox.isVr ? 'uploadPanorama Err : ' : 'uploadModelPic Err : '
        console.log(log + err)
      })
    },

    /**
     *  图片选择完毕
     */
    picFileChange (e) {
      if (e.target.files.length <= 0) return
      const f = e.target.files[0]
      this.$refs.picFile.value = null
      if (this.infoBox.isVr) {
        // // VR图像长宽比需要2:1
        // EXIF.getData(f, function () {
        //   let valid = true
        //   const allMetaData = EXIF.getAllTags(this)
        //   if (!allMetaData.PixelXDimension || !allMetaData.PixelYDimension) {
        //     valid = false
        //   } else if (allMetaData.PixelXDimension !== allMetaData.PixelYDimension * 2) {
        //     valid = false
        //   }

        //   if (!valid) me.$notify.warning({ title: '警告', message: '无效图片,全景图长宽比需要是2:1' })
        //   else me.uploadModelImg(f)
        // })
        var img = new Image()
        img.onload = function () {
          if (this.complete === true) {
            if (this.width !== this.height * 2) me.$notify.warning({ title: '警告', message: '无效图片,全景图长宽比需要是2:1' })
            else me.uploadModelImg(f)
          }
          // 清除释放
          window.URL.revokeObjectURL(img.src)
        }
        img.src = window.URL.createObjectURL(f)
      } else this.uploadModelImg(f)
    },

    /**
     *  显示Infobox上的图
     */
    showImage () {
      if (this.activeIndex === 7) return
      this.imgDialogVisible = true
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
        this.$notify.closeAll()
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
     *  保存模型数据
     * @param {Object} save 是否保存
     */
    saveModelInfo (save) {
      if (!this.curEntity) return
      let dst = ''
      if (this.curEntity instanceof Cesium.Entity || this.curEntity instanceof Cesium.Model) {
        dst = this.curEntity.attribute
      } else if (this.curEntity && this.curEntity instanceof Cesium.Billboard) {
        dst = this.curEntity.id.attribute
      }
      if (save === true) {
        this.copyData(this.infoBox, dst)
        // 更新marker上的文字
        if (!(this.curEntity instanceof Cesium.Billboard) && !dst.isVr) {
          this.updateMarkerLabel(dst.id, this.curEntity)
        }
        const list = this.markDatas[dst.editIndex]
        const l = list.find(r => r.id === dst.id)
        if (l !== undefined) { l.name = dst.name }
      } else this.copyData(this.curEntity.attribute, this.infoBox)
      this.infoBox.editing = false
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
     *  删除沙盘绘制的模型
     */
    deletePlotModel () {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          const id = this.curEntity.attribute.id
          const m = this.modelList.find(m => m.attribute.id === id)
          if (m !== undefined) this.drawControl.deleteEntity(m)
          if (this.isPlot) {
            this.isPlot = false
            // 启用drawControl编辑功能
            this.enableDrawControlEdit(true)
          }
        })
        .catch(() => {

        })
    },

    /**
     *  设置模型任务
     */
    setModelTask () {
      if (stringIsNullOrEmpty(this.editBox.department)) {
        this.$notify.closeAll()
        this.$notify.warning({ title: '警告', message: '请输入单位' })
        return
      }
      if (stringIsNullOrEmpty(this.editBox.number)) {
        this.$notify.closeAll()
        this.$notify.warning({ title: '警告', message: '请输入序号' })
        return
      }
      if (
        stringIsNullOrEmpty(this.editBox.task) ||
        this.editBox.task === '- -'
      ) {
        this.$notify.closeAll()
        this.$notify.warning({ title: '警告', message: '请输入任务' })
        return
      }
      this.showEditBox = false
      if (this.isPlot) {
        var task = JSON.parse(JSON.stringify(this.editBox))
        task.id = this.curEntity.attribute.id
        this.curEntity.attribute.task = task
        // 开启drawControl编辑功能
        this.enableDrawControlEdit(true)
        this.isPlot = false
        this.addModelLabel(this.curEntity, task)
        // 添加模型下方矩形框
        this.addModelRect(this.curEntity)
      } else {
        this.copyData(this.editBox, this.curEntity.attribute.task)
        const t = this.findModelLabel(this.curEntity.attribute.id)
        if (t !== undefined) {
          this.copyData(this.editBox, t.options.data)
          this.updateLabelHtml(t)
        }
        this.curEntity.show = !this.editBox.hide
        this.curEntity.attribute.show = !this.editBox.hide
        if (this.editBox.hide) {
          this.showOrHideRect(true, this.curEntity)
          this.stopEditing()
        }
      }
    },

    /**
     *  寻找模型对应标签
     * @param {String} name 标签data.name
     */
    findModelLabel (name) {
      return this.labelList.find(t => t.options.name === name)
    },

    /**
     *  寻找模型对应marker
     * @param {String} name 标签data.name
     */
    findModelMarker (name) {
      return this.markList.find(t => t.options.name === name)
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
      // 当前正在编辑的实体
      this.curEditEntity = entity
      this.showOrHideRect(false, entity)
      // 启用编辑
      gltfEdit.activate(entity, me.viewer, {
        calback: function (result) {
        }
      })
    },

    /**
     *  停止编辑
     *@param {Object} entity 模型
     */
    stopEditing (entity) {
      this.curEditEntity = ''
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
        this.boxLeft = width - 285 - 20
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
      const list = this.labelList.sort(function (a, b) { return parseInt(a.options.data.number) - parseInt(b.options.data.number) })
      for (var i = 0; i < list.length; i++) {
        const t = list[i]
        if (parseInt(t.options.data.number) !== number) {
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
        case 5:
          var json = ''
          if (!this.drawControl || stringIsNullOrEmpty(json = this.drawControl.toGeoJSON())) {
            this.$notify.closeAll()
            this.$notify.warning({ title: '提示', message: '当前未标绘任何数据' })
          } else {
            json.cameraViews = this.cameraViews
            const blob = new Blob([JSON.stringify(json)], { type: 'application/json' })
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const formData = new FormData()
            formData.append('enterpriseId', this.enterpriseId)
            formData.append('configFile', blob, 'plotModelData.json')
            this.$axios.post(api.uploadModelConfig, formData, config).then((res) => {
              if (res.data.code === 0) {
                this.configPath = globalApi.headImg + res.data.data.configPath
                this.$notify.closeAll()
                this.$notify.info({ title: '提示', message: '保存成功' })
              }
            }).catch(err => {
              this.$notify.closeAll()
              this.$notify.info({ title: '提示', message: '保存失败' })
              console.log('uploadModelConfig Err : ' + err)
            })
            // console.log(json)
          }
          break
        case 6:
          // this.clearDraw()
          break
        case 7:
          // this.loadGeoJson()
          break
        default:
          break
      }
    },

    /**
     *  清除所有标绘数据
     */
    clearDraw () {
      this.drawControl.clearDraw()
      if (this.markList) {
        this.markList.forEach(m => m.destroy())
        this.markList = []
      }
      if (this.labelList) {
        this.labelList.forEach(m => m.destroy())
        this.labelList = []
      }
      if (this.rectList) {
        this.rectList.forEach(m => this.viewer.entities.remove(m))
        this.rectList = []
      }
      if (this.modelList) this.modelList = []
      if (this.markDatas) this.markDatas = [[], [], [], []]
    },

    /**
     *  替换地址，避免内外网切换问题
     */
    replaceUrl (srcUrl) {
      let url = srcUrl
      let startI = url.indexOf('//')
      url = url.slice(startI + 2)
      startI = url.indexOf('/')
      url = url.slice(startI)
      return globalApi.headImg + url
    },

    /**
     *  加载geoJson
     */
    loadGeoJson () {
      if (this.configPath) {
        axios.get(globalApi.headImg + this.configPath)
          .then(res => {
            const data = res.data
            // console.log(data)
            if (data.features && data.features.length > 0) {
              // 需要替换模型地址和infoImg地址，避免内外网问题
              data.features.forEach(f => {
                if (f.properties && f.properties.type === 'model-p' && f.properties.style && f.properties.style.modelUrl) {
                  const url = f.properties.style.modelUrl
                  f.properties.style.modelUrl = this.replaceUrl(url)
                }
                if (f.properties && f.properties.infoImg) {
                  const url = f.properties.infoImg
                  f.properties.infoImg = this.replaceUrl(url)
                }
              })
            }
            this.cameraViews = data.cameraViews
            const entities = this.drawControl.loadJson(data)
            if (!this.modelList) this.modelList = []
            entities.forEach(e => {
              this.modelList.push(e)
              const attr = e.attribute
              // 编辑模式下绘制的模型
              if (attr.edit) {
                if (attr.type !== 'billboard') {
                  this.addModelMark(e)
                }
                this.markDatas[attr.editIndex].push({
                  type: attr.plotType, // 编辑模式下，模型列表的Icon类型
                  name: attr.name,
                  id: attr.id
                })
              } else {
                // 沙盘绘制添加的模型
                // 添加模型上方标签
                e.attribute.task.hide = false
                this.addModelLabel(e, e.attribute.task)
                // 添加模型下方矩形框
                this.addModelRect(e)
              }
            })
            // console.log('----------------------------')
            // console.log(entities)
          })
          .catch(err => {
            console.log('getModelConfigFile Err : ' + err)
          })
      }
    },

    /**
     *  返回
     */
    back () {
      this.$router.go(-1)
    },

    /**
     *  沙盘绘制
     *@param {Object} item 待绘制模型
     *@param {Object} type 绘制类别
     */
    plot (item, index) {
      this.curModelIndex = index
      const m = JSON.parse(JSON.stringify(item))
      if (this.plotType === 0) m.hasRect = true
      this.startPlot(m)
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
        const r = me.rectList.find(t => t._name === attr.id)
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
            style: {
              modelUrl:
                '$serverURL_gltf$/xiaofang/xiaofangshuan/xiaofangshuan.gltf',
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
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/common/qiqiu.gltf',
              scale: 0.1
            }
          }
          break
        case 3:
          item = {
            name: '水泵接合器',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/xiaofangshuibengjieheqi.png'),
            style: {
              modelUrl:
                '$serverURL_gltf$/xiaofang/xiaofangshuibengjieheqi/xiaofangshuibengjieheqi.gltf',
              scale: 0.08
            }
          }
          break
        case 4:
          item = {
            name: '泵房',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/pumphouse.png'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/common/qiqiu.gltf',
              scale: 0.1
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
              visibleDepth: false
              // distanceDisplayCondition: true,
              // distanceDisplayCondition_far: 1000
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
              visibleDepth: false
              // distanceDisplayCondition: true,
              // distanceDisplayCondition_far: 1000
            }
          }
          break
        case 7:
          item = {
            name: '重点区域',
            type: 'model-p',
            // 标签上的图片
            img: require('../../assets/images/3d/build.png'),
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/common/qiqiu.gltf',
              scale: 0.1
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
            style: {
              modelUrl: '$serverURL_gltf$/xiaofang/common/qiqiu.gltf',
              scale: 0.1
            }
          }
          break
        default:
          break
      }
      const modelUrl = item.style.modelUrl
      if (modelUrl && modelUrl.startsWith('$serverURL_gltf$')) {
        item.style.modelUrl = item.style.modelUrl.replace('$serverURL_gltf$', serverUrl)
      }

      // infobox上的图片
      item.infoImg = ''
      item.editIndex = this.editIndex
      item.plotType = type
      item.edit = true
      this.startPlot(item)
    },

    /**
     *  选中编辑模式中列表某项
     */
    selectItemInEditList (index, item) {
      this.modelIndex = index
      const m = this.modelList.find(m => m.attribute.id === item.id)
      if (m !== undefined) {
        this.viewer.mars.flyTo(m, { duration: 3, radius: 100, pitch: -30 })
      }
    },

    /**
     *  删除编辑模式里面模型
     *@param {Object} item
     */
    deleteModel (item) {
      this.modelIndex = 1000
      const m = this.modelList.find(m => m.attribute.id === item.id)
      if (m !== undefined) {
        this.drawControl.deleteEntity(m)
        this.deleteModelMarker(m)
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
        const t = this.findModelMarker(attr.id)
        if (t !== undefined) {
          const index = this.markList.indexOf(t)
          this.markList.splice(index, 1)
          t.destroy()
        }
      }
      const list = this.markDatas[attr.editIndex]
      const l = list.find(r => r.id === attr.id)
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
      this.curEntity = entity
      const id = uuid(8, 16)
      const attr = entity.attribute
      attr.id = id
      // 标绘的模型列表
      if (!this.modelList) this.modelList = []
      this.modelList.push(entity)
      // 模型才添加marker
      if (attr.type !== 'billboard') {
        this.addModelMark(entity)
      }
      this.markDatas[this.editIndex].push({
        type: attr.plotType, // 编辑模式下，模型列表的Icon类型
        name: attr.name,
        id: id
      })

      // 防止模型后来才加载，没有执行this.handler.setInputAction
      if (!this.showInfoBox) {
        if (!attr.init) {
          this.copyData(attr, this.infoBox)
          attr.init = true
          this.infoBox.editing = true
        }
        this.showInfoBox = true
      }
    },

    /**
     *  根据类型过滤模型
     * @param {Number} index 模式 5:沙盘绘制模式
     */
    fliterModel (index) {
      // 显示隐藏实时gis数据
      if (this.gisCollection) {
        this.gisCollection.show = this.activeIndex === 0
      }
      // 实时gis模式，显示实时gis数据和所有绘制数据（包含沙盘绘制模型、水源、防火、重点区域、VR)
      // 沙盘绘制模式，显示所有绘制数据（包含沙盘绘制模型、水源、防火、重点区域、VR)

      // 隐藏/显示模型上方标签
      if (this.activeIndex === 0) {
        if (this.labelList) {
          this.labelList.forEach(e => { e.visible = true })
        }
      } else if (this.labelList) {
        let list = this.labelList.filter(item => !item.options.isGis)
        list.forEach(e => { e.visible = this.activeIndex === 4 })
        list = this.labelList.filter(item => item.options.isGis)
        list.forEach(e => { e.visible = false })
      }
      if (this.modelList) {
        this.modelList.forEach(e => {
          const attr = e.attribute
          // 沙盘绘制的模型，且模型隐藏
          if (attr.editIndex === 5 && attr.show === false) e.show = false
          else if (index === 5) e.show = true
          else if (e.attribute.editIndex === index)e.show = true
          else e.show = false
        })

        if (this.curEditEntity) this.stopEditing()
      }

      // 隐藏/显示消防车下方矩形框
      if (this.rectList) {
        this.rectList.forEach(e => { e.show = this.activeIndex === 4 || this.activeIndex === 0 })
      }

      // 隐藏/显示模型上方marker
      if (this.markList) {
        this.markList.forEach(e => {
          if (index === 5) e.visible = true
          else if (e.options.editIndex === index) e.visible = true
          else e.visible = false
        })
      }
    },

    /**
     *  开始绘制
     *@param {Object} item 模型
     */
    startPlot (item) {
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
                a.image = a.image.replace('$serverURL_gltf$', serverUrl)
              }

              if (a.style.modelUrl.startsWith('$serverURL_gltf$')) {
                a.style.modelUrl = a.style.modelUrl.replace('$serverURL_gltf$', serverUrl)
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
        pitch: -30, // 相机方向
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
      const task = entity.options.data
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
     *  更新Marker的文字
     * @param {Object} name 标签名称
     * @param {Object} entity 标签对应的模型
     */
    updateMarkerLabel (name, entity) {
      const t = this.findModelMarker(name)
      if (t !== undefined) {
        // t.position = position
        const attr = entity.attribute
        const innerhtml = ` <div class="label labelxfs">
                  <img src="${attr.img}"></img>
                  <span>${attr.name}</span>
                </div>`
        t.html = innerhtml
      }
    },

    /**
     *  获取模型上方文字坐标
     * @param {Object} primitive 模型
     */
    getModelLabelPosition (primitive) {
      // 求出模型中心点坐标
      // var center = Cesium.Matrix4.multiplyByPoint(
      //   primitive.modelMatrix,
      //   primitive.boundingSphere.center,
      //   new Cesium.Cartesian3()
      // )
      // const p = me.CartesianToDegrees(center)
      // return Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 2)
      const attr = primitive.attribute
      const p = CartesianToDegrees(primitive.position)
      if (attr.edit) {
        return Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 5)
      } else return Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height + 3)
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
        name: primitive.attribute.id,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500)
      })
      this.labelList.push(label)
      return label
    },

    /**
     *  添加模型下方矩形框
     * @param {Object} entity 模型
     */
    addModelRect (entity) {
      if (!entity.attribute.hasRect) return
      const p = this.getModelRectPosition(entity)
      const rect = this.viewer.entities.add({
        name: entity.attribute.id,
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
     * 添加实时gis模型
     * @param {Object} cfg 模型配置
     */
    createGisModel (cfg) {
      cfg.id = uuid(8, 16)
      if (!this.gisCollection) {
        this.gisCollection = new Cesium.PrimitiveCollection()
        this.viewer.scene.primitives.add(this.gisCollection)
      }
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

      var modelPrimitive = this.gisCollection.add(
        Cesium.Model.fromGltf({
          url: cfg.url,
          modelMatrix: modelMatrix
          // minimumPixelSize: cfg.minimumPixelSize || 30
        })
      )
      modelPrimitive.attribute = cfg
      modelPrimitive.position = position
      // modelPrimitive.hasOutLine = true

      modelPrimitive.readyPromise.then(function (model) {
        const task = {
          name: cfg.id,
          department: '洪山分局',
          number: '1',
          task: '供水'
        }
        const l = me.addModelLabel(modelPrimitive, task)
        l.options.isGis = true
      })

      return modelPrimitive
    },

    /**
     *  显示模型编辑框
     * @param {Object} entity 模型
     */
    showModelEditBox (entity) {
      if (this.activeIndex === 0 && entity.attribute.hasRect) this.showHideModel = true
      else this.showHideModel = false
      this.showEditBox = true
      const t = me.findModelLabel(entity.attribute.id)
      this.editBox.hide = !entity.show
      if (t !== undefined) {
        this.copyData(t.options.data, this.editBox)
      }
      var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        entity.position
      )
      this.setEditBoxPosition(point)
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
        anchor: [0, 0],
        position: position,
        depthTest: false,
        name: attr.id,
        click: function (entity) {
          me.ClickDivPoint(entity)
        }

      })
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
      this.createGisModel({
        url: serverUrl + '/xiaofangche/paomoche.gltf',
        x: lon,
        y: lat,
        z: 12
      })

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
      const url = globalApi.headImg + this.modelPath
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
      setTimeout(() => {
        me.ZoomIn(true)
      }, 500)
      setTimeout(() => {
        me.homeView = me.getCameraView()
      }, 1000)
    },

    /**
     *  点击DivPoint
     * @param {Object} entity DivPoint
     */
    ClickDivPoint (entity) {
      this.clearCurEntity()
      this.showInfoBox = false
      this.viewer.mars.flyTo(entity, { duration: 3, radius: 100, pitch: -30 })
    },

    /**
     *  相机视角回到home点
     */
    returnHome () {
      this.viewer.mars.centerAt(this.homeView)
    },

    /**
     *  平移相机
     */
    moveCamera (direction) {
      if (!this.viewer) return
      if (me.isPlot && me.showEditBox) return
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
      if (me.isPlot && me.showEditBox) return
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
     *  启用/禁用drawControl编辑功能
     *  @param {Boolen} enable 是否启用
     */
    enableDrawControlEdit (enable) {
      if (this.drawControl) {
        this.drawControl.hasEdit(enable)
      }
    },

    /**
     *  测量开始,移除鼠标事件
     */
    measureStart () {
      // 禁用drawControl编辑功能
      this.enableDrawControlEdit(false)
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    },

    /**
     *  测量结束,绑定鼠标事件
     */
    measureEnd () {
      // 开启drawControl编辑功能
      this.enableDrawControlEdit(true)
      // 控制鼠标只取模型上的点，忽略地形上的点的拾取
      this.viewer.mars.onlyPickModelPosition = true
      this.handler.setInputAction(event => {
        me.showInfoBox = false
        // 如果正在编辑第一次绘制模型的任务
        if (me.isPlot && me.showEditBox) {
          this.$notify.closeAll()
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
          // 如果点击编辑模式下添加的模型
          const attr = pickedObject.primitive.attribute
          if (attr && attr.edit) {
            show = false
            me.copyData(attr, me.infoBox)
            me.infoBox.isEdit = me.activeIndex === 7
            if (me.infoBox.isEdit && !attr.init) {
              attr.init = true
              me.infoBox.editing = true
            }
            me.showInfoBox = true
            me.showEditBox = false
          }
          // 设置模型选中样式
          if (me.activeIndex !== 4 && me.activeIndex !== 7) {
            // 如果不是沙盘绘制的模型，设置模型轮廓
            if (!attr.editIndex || attr.editIndex !== 5) {
              pickedObject.primitive.silhouetteColor = Cesium.Color.fromAlpha(
                Cesium.Color.YELLOW,
                parseFloat(0.9)
              )
              pickedObject.primitive.silhouetteSize = 8
            }
          }
          // 显示任务编辑窗
          if (show && pickedObject.primitive.position) {
            me.showModelEditBox(pickedObject.primitive)
          }
        } else if (Cesium.defined(pickedObject) && pickedObject.primitive instanceof Cesium.Billboard) {
          me.curEntity = pickedObject.primitive
          // 如果点击billboard
          me.showEditBox = false
          const attr = pickedObject.primitive.id.attribute
          me.copyData(attr, me.infoBox)
          me.infoBox.isEdit = me.activeIndex === 7
          if (me.infoBox.isEdit && !attr.init) {
            attr.init = true
            me.infoBox.editing = true
          }
          if (me.activeIndex === 2) {
            me.flyToEntity(pickedObject.primitive, function (e) {
              // 飞行完成回调方法
              me.showInfoBox = true
            })
          } else me.showInfoBox = true
        } else if (Cesium.defined(pickedObject) && pickedObject.primitive instanceof Cesium.GroundPrimitive) {
          // 如果点击模型下方矩形
          // 如果模型隐藏，需要显示任务编辑框
          me.showEditBox = false
          const entity = pickedObject.id
          const m = me.modelList.find(m => m.attribute.id === entity.name)
          if (m !== undefined && !m.show) {
            me.curEntity = m
            me.showModelEditBox(m)
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
          width: 3
          // clampToGround: true // 是否贴地
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
          width: 3
          // clampToGround: true // 是否贴地
        }
      })
    },

    /**
     *  获取当前视角
     */
    getCameraView () {
      const view = mars3d.point.getCameraView(this.viewer, true)
      return view
    },

    /**
     *  设置视角
     */
    setCameraView () {
      this.showViewDetail = true
      this.viewDetail = this.getCameraView()
      const v = JSON.parse(JSON.stringify(this.viewDetail))
      this.cameraViews[this.editIndex] = v
    },

    /**
     *  清除当前模型
     */
    clearCurEntity () {
      if (this.curEntity) {
        this.curEntity.silhouetteSize = 0
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
     *  初始化drawControl
     */
    initDrawControl () {
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
        attr.location = ''
        attr.describe = ''
        if (attr.edit) {
          entity.drawOk = true
          if (attr.type === 'billboard') {
            me.plotModelComplete(entity)
          } else if (entity.loadOk && entity.drawOk) {
            me.plotModelComplete(entity)
          }
        } else {
          const id = uuid(8, 16)
          attr.id = id
          // 沙盘绘制的模型
          attr.editIndex = 5
          var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            me.viewer.scene,
            entity.position
          )
          me.curModelIndex = 1000
          // 禁用drawControl编辑功能
          me.enableDrawControlEdit(false)
          me.curEntity = entity
          // 标绘的模型列表
          if (!me.modelList) me.modelList = []
          me.modelList.push(entity)
          // 显示模型任务编辑框
          me.isPlot = true
          me.showHideModel = false
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
        if (attr.edit) {
          entity.loadOk = true
          if (entity.loadOk && entity.drawOk) {
            me.plotModelComplete(entity)
          }
        } else if (attr.name === '步行动画_人') {
          entity.activeAnimations.addAll({
            loop: Cesium.ModelAnimationLoop.REPEAT,
            speedup: 0.5,
            reverse: false
          })
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
          if (attr.edit) {
            me.updateMarkerPosition(attr.id, position)
          } else {
            me.updateLabelPosition(attr.id, position)
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

        const index = me.modelList.indexOf(entity)
        if (index > -1) { me.modelList.splice(index, 1) }
        // 如果是编辑模式下添加的模型
        if (attr.edit) {
          me.deleteModelMarker(entity)
        } else {
          // 删除对应标签
          const t = me.findModelLabel(attr.id)
          if (t !== undefined) {
            const index = me.labelList.indexOf(t)
            me.labelList.splice(index, 1)
            t.destroy()
          }
          // 删除矩形框列表
          if (me.rectList) {
            const r = me.rectList.find(t => t._name === attr.id)
            if (r !== undefined) {
              const index = me.rectList.indexOf(r)
              me.rectList.splice(index, 1)
              me.viewer.entities.remove(r)
            }
          }
          me.showEditBox = false
        }

        me.stopEditing(entity)
        // console.log('删除了对象')
      })
    },

    /**
     *  地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
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
      this.initDrawControl()
      // 模型标签列表
      this.labelList = []
      // 地图鼠标按下
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      this.measureEnd()
      this.addModel()
      this.loadGeoJson()
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
  overflow: hidden;
  .back{
    width: 134px;
    top:20px;
    background: rgba(18, 30, 58, 0.85);
  }

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
      span{
        display: inline-block;
        font-size: 16px;
        color: #FFFFFF;
        transform: translate(2px,90px);
      }
    }
    div.active {
      //transform: scale(1.2);
      width: 87px;
      height: 98px;
      transform: translateY(-8px);
       span{
        transform: translate(10px,98px);
      }
    }
    div:nth-child(1) {
      background: url(../../assets/images/3d/gis.png) no-repeat;
    }
    div:nth-child(1).active {
      background: url(../../assets/images/3d/gis-select.png) no-repeat;
    }
    div:nth-child(2) {
      background: url(../../assets/images/3d/water.png) no-repeat;
    }
    div:nth-child(2).active {
      background: url(../../assets/images/3d/water-select.png) no-repeat;
    }
    div:nth-child(3) {
      background: url(../../assets/images/3d/fire.png) no-repeat;
    }
    div:nth-child(3).active {
      background: url(../../assets/images/3d/fire-select.png) no-repeat;
    }
    div:nth-child(4) {
      background: url(../../assets/images/3d/area.png) no-repeat;
    }
    div:nth-child(4).active {
      background: url(../../assets/images/3d/area-select.png) no-repeat;
    }
    div:nth-child(5) {
      background: url(../../assets/images/3d/draw.png) no-repeat;
    }
    div:nth-child(5).active {
      background: url(../../assets/images/3d/draw-select.png) no-repeat;
    }
    div:nth-child(6) {
      background: url(../../assets/images/3d/vr.png) no-repeat;
       span {
       transform: translate(6px,90px);
      }
    }
    div:nth-child(6).active {
      background: url(../../assets/images/3d/vr-select.png) no-repeat;
      span {
       transform: translate(16px,98px);
      }
    }
    div:nth-child(7) {
      background: url(../../assets/images/3d/paper.png) no-repeat;
    }
    div:nth-child(7).active {
      background: url(../../assets/images/3d/paper-select.png) no-repeat;
    }
    div:nth-child(8) {
      background: url(../../assets/images/3d/edit.png) no-repeat;
    }
    div:nth-child(8).active {
      background: url(../../assets/images/3d/edit-select.png) no-repeat;
    }
  }

  .edit {
    position: absolute;
    background: url(../../assets/images/3d/edit-box.png) no-repeat;
    width: 368px;
    height: 690px;
    left: 38px;
    top: 90px;
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
    .detail {
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
    top: 90px;

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
    z-index: 100;
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
      width: 72px;
      position: absolute;
      right: 30px;
      bottom: 10px;
      height: 24px;
      background: rgba(32, 156, 223, 1);
      text-align: center;
      line-height: 24px;
      cursor: pointer;
    }
    .btn:active {
      background: #00679d;
    }
    .del {
      display: inline-block;
      width: 16px;
      position: absolute;
      left: 15px;
      bottom: 15px;
      height: 16px;
      background: url(../../assets/images/3d/delete-s.png) no-repeat;
      cursor: pointer;
    }
    .del:active {
      background: url(../../assets/images/3d/delete-s-click.png) no-repeat;
    }
    .second {
      margin-top: 10px;
    }
    /deep/.el-checkbox__inner {
      border: 1px solid #209CDF;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      background-color: transparent;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    }
    /deep/.el-checkbox {
      color: #fff;
      margin-top:10px;
    }
    /deep/.el-checkbox__input.is-checked+.el-checkbox__label {
      color: #fff;
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner::after {
      visibility:visible;
    }
    /deep/.el-checkbox__inner::after {
      background: #2097D9;
      border-radius: 50%;
      border: none;
      height: 10px;
      left: 2px;
      top: 2px;
      transform: none;
      width: 10px;
      visibility:hidden;
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
    height: 335px;
    background: url(../../assets/images/3d/info-box.png) no-repeat;
    background-size: 100% 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    /deep/.el-input{
      width: 173px;
      height: 23px;
      font-size: 14px;
    }
    /deep/.el-input__inner {
      height: 23px;
      background: #033754;
      opacity: 0.9;
      border-radius: 0px;
      border: none;
      color: #1EB0FC;
      line-height: 23px;
      padding: 0 15px;
    }
    .title{
      margin-top: 14px;
      font-size: 16px;
      /deep/.el-input__inner {
        padding: 0px;
        background: transparent;
      }
    }
     /deep/.el-input.active .el-input__inner {
        border: 1px solid #209CDF;
     }
    > img {
      position: relative;
      margin-top: 20px;
      width: 230px;
      height: 122px;
    }
    #frameImg
    {
      position: relative;
      margin-top: 20px;
      width: 230px;
      height: 122px;
    }
    .frame
    {
      position: absolute;
      top: 20px;
      width: 230px;
      height: 122px;
      cursor: pointer;
      background: transparent
    }
    .default{
      position: relative;
      margin-top: 20px;
      width: 230px;
      height: 122px;
      background: url(../../assets/images/3d/default.png) no-repeat;
    }
    .export {
      cursor: pointer;
      display: inline-block;
      top: 156px;
      right: 20px;
      position: absolute;
      width: 22px;
      height: 22px;
      background: url(../../assets/images/3d/export.png) no-repeat;
    }
    .detail {
      margin-top: 20px;
      ul {
        li {
          word-break: break-all;
          margin-bottom: 10px;
          span {
            display: inline-block;
            position: relative;
            //top: -7px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 27px;
            margin-right: 10px;
          }
        }
      }
    }
    .btn {
      display: inline-block;
      width: 70px;
      height: 24px;
      background: #209CDF;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #FFFFFF;
      cursor: pointer;
      position: absolute;
      bottom: 12px;
    }
    .btn:active {
      background: #00679d;
    }
    .editBtn {
       right: 34px;
    }
    .cancelBtn{
      box-sizing: border-box;
      border: 1px solid #209CDF;
      background:transparent;
      right: 114px;
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
    width: 436px;
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
    span:nth-child(1):active {
      background: url(../../assets/images/3d/home-click.png) no-repeat;
    }
    span:nth-child(2) {
      background: url(../../assets/images/3d/snap.png) no-repeat;
      margin-left: 59px;
    }
    span:nth-child(2):active {
      background: url(../../assets/images/3d/snap-click.png) no-repeat;
    }
    span:nth-child(3) {
      background: url(../../assets/images/3d/measure-distance.png) no-repeat;
      margin-left: 41px;
    }
    span:nth-child(3):active {
      background: url(../../assets/images/3d/measure-distance-click.png) no-repeat;
    }
    span:nth-child(3)::before {
      content: "";
      position: absolute;
      top: 4px;
      right: 281px;
      display: inline-block;
      width: 2px;
      height: 37px;
      background: url(../../assets/images/3d/tool-rect.png) no-repeat;
    }
    span:nth-child(4) {
      background: url(../../assets/images/3d/measure-height.png) no-repeat;
      margin-left: 10px;
    }
    span:nth-child(4):active {
      background: url(../../assets/images/3d/measure-height-click.png) no-repeat;
    }
    span:nth-child(5) {
      background: url(../../assets/images/3d/measure-area.png) no-repeat;
      margin-left: 10px;
    }
    span:nth-child(5):active {
      background: url(../../assets/images/3d/measure-area-click.png) no-repeat;
    }
     span:nth-child(6) {
      background: url(../../assets/images/3d/save.png) no-repeat;
      margin-left: 28px;
    }
    span:nth-child(6):active {
      background: url(../../assets/images/3d/save-click.png) no-repeat;
    }
    span:nth-child(6)::before {
      content: "";
      position: absolute;
      top: 4px;
      right: 135px;
      display: inline-block;
      width: 2px;
      height: 37px;
      background: url(../../assets/images/3d/tool-rect.png) no-repeat;
    }

    span:nth-child(7) {
      background: url(../../assets/images/3d/setting.png) no-repeat;
      margin-left: 9px;
    }
    span:nth-child(7):active {
      background: url(../../assets/images/3d/setting-click.png) no-repeat;
    }
    span:nth-child(8) {
      background: url(../../assets/images/3d/share.png) no-repeat;
      margin-left: 9px;
    }
    span:nth-child(8):active {
      background: url(../../assets/images/3d/share-click.png) no-repeat;
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
    right: 376px;
    width: 30px;
    height: 30px;
    background: url(../../assets/images/3d/rotate-inner.png) no-repeat;
    cursor: pointer;
  }

  .rotate:active {
    background: url(../../assets/images/3d/rotate-inner-click.png) no-repeat;
  }

  .rotate.active {
    //动画名称 动画时间 运动曲线 何时开始 播放次数
    animation: rotate 10s linear 0s infinite;
  }
}
</style>
