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
  </div>
</template>

<script>
import Map from './components/marsMap.vue'
import $ from 'jquery'
import emergency from '@/assets/images/3d/emergencyshelters.png'
var Cesium = window.Cesium
var mars3d = window.mars3d
export default {
  data () {
    return {
      activeIndex: 0,
      configUrl: 'config/config.json',
      widgetUrl: 'config/widget.json',
      viewer: ''
    }
  },
  components: {
    Map
  },
  methods: {
    tabTo (index) {
      this.activeIndex = index
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

    addModel () {
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
            'http://172.16.63.57:9000/mapdata/gltf/xiaofang/xiaofang/xiaofangshuan/xiaofangshuan.gltf',
          scale: 1,
          opacity: 1,
          clampToGround: true
        },
        click: entity => {
          // 单击回调
          this.$message({ message: '您单击了：' })
        }
      })

      const lat = 30.510093
      let lon = 114.235004
      const entity = dataSource.entities.add({
        name: '22222222222',
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 12),
        model: {
          uri:
            'http://172.16.63.57:9000/mapdata/gltf/mars/firedrill/xiaofangche.gltf',
          scale: 1,
          opacity: 1,
          clampToGround: true
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
        popup: {
          html: ` <div class="popup-bg">
                </div>`,
          anchor: [0, -50] // 左右、上下的偏移像素值。
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
        depthTest: false
      })

      console.log(divpoint2)

      // this.viewer.mars.centerPoint(position, {
      //   radius: 300, // 距离目标点的距离
      //   pitch: -50, // 相机方向
      //   duration: 4
      // })
      // this.viewer.flyTo(entity)

      var layercfg = {
        type: '3dtiles',
        name: '国博',
        url: 'http://172.16.63.57:9000/mapdata/3dtiles/guobo/Production_1.json',
        maximumScreenSpaceError: 1,
        maximumMemoryUsage: 8192,
        offset: { z: -4 },
        // center: { y: 30.519161, x: 114.237614, z: 1236.59, heading: 194.6, pitch: -48.8, roll: 359.9 },
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

//popup的倒三角样式
/deep/.mars3d-popup-tip-container {
    margin: -20px auto 0;
}
/deep/.mars3d-popup-tip {
  box-shadow: none;
  background: #1EB0FC;
}

/deep/.mars3d-popup-close-button {
  display: none;
}

/deep/.compass {
  left:8px;
  right: 0px !important;
  top:8px!important;
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
}
</style>
