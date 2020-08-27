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
    <div class="editBox" v-show="showEditBox">
      <div class="close" @click="showEditBox = false" />
      <div class="first">
        <span>单位：</span>
        <el-input></el-input>
        <span>编号：</span>
        <el-input class="input"></el-input>
      </div>
      <div class="first second">
        <span>任务：</span>
        <el-popover placement="bottom" width="400" trigger="click" popper-class="taskPopover">
          <div></div>
          <div slot="reference" class="task">
            <span>供水</span>
            <span></span>
          </div>
        </el-popover>
        <span class="btn" style="margin-left:10px">任务列表</span>
      </div>
      <span class="btn confirm">确定</span>
    </div>
    <FloorGuide ref="floorGuide" v-bind:title="buildingTitle" v-bind:info="buildingInfos"></FloorGuide>
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
      plotType: '',
      options: [], // 沙盘绘制选项
      curModels: [],
      showInfoBox: false,
      showEditBox: false,
      infoBox: { imgSrc: '' },
      buildingTitle: '黄鹤楼',
      buildingInfos: [
        // 测试数据
        {
          title: '1层',
          image:
            'http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png',
          selected: true
        },
        { title: '2层', image: '', selected: false },
        {
          title: '3层',
          image:
            'http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png',
          selected: false
        },
        { title: '4层', image: '', selected: false },
        {
          title: '5层',
          image:
            'http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png',
          selected: false
        },
        { title: '6层', image: '', selected: false },
        { title: '7层', image: '', selected: false },
        { title: '8层', image: '', selected: false },
        { title: '9层', image: '', selected: false },
        { title: '10层', image: '', selected: false },
        { title: '11层', image: '', selected: false },
        { title: '12层', image: '', selected: false },
        { title: '13层', image: '', selected: false },
        { title: '14层', image: '', selected: false },
        { title: '15层', image: '', selected: false }
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
        this.$refs.floorGuide.show()
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
          // var entity = e.entity
          // if (!me.drawControl.isContinued) {
          //   me.startEditing(entity)
          // }
          // console.log('创建完成')
          me.showEditBox = true
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
          // console.log('编辑修改了点')
        })

        // 停止编辑
        this.drawControl.on(mars3d.draw.event.EditStop, function (e) {
          me.stopEditing()
          // console.log('停止编辑')
        })

        // 删除了对象
        this.drawControl.on(mars3d.draw.event.Delete, function (e) {
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
      const entity = dataSource.entities.add({
        name: '22222222222',
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 12),
        model: {
          uri: serverUrl + '/gltf/mars/firedrill/xiaofangche.gltf',
          scale: 1,
          opacity: 1,
          clampToGround: true
        },
        click: function (entity) {
          me.showEditBox = true
        }
      })

      setInterval(() => {
        lon += 0.000001
        entity.position = Cesium.Cartesian3.fromDegrees(lon, lat, 12)
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
    bottom: 334px;
    right: 52px;
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
      margin-left: 5px;
      display: inline-block;
      width: 194px;
      height: 23px;
      background: rgba(0, 57, 87, 1);
      opacity: 0.9;
      padding: 0px 10px;
      box-sizing: border-box;
      span {
        font-size: 14px;
        line-height: 23px;
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
}
</style>
