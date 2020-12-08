<template>
  <div
    :id="`marsgis-container${mapKey ? '-' + mapKey : ''}`"
    :class="['mars3d-container', customClass, { 'mars3d-container-compare-rh' : compare }]"
  ></div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
var Cesium = window.Cesium
var mars3d = window.mars3d
export default {
  name: 'CesiumViewer',

  props: {
    // 初始化配置参数
    url: String,
    // widgetUrl: String,

    // 地图唯一性标识
    mapKey: {
      type: String,
      default: ''
    },

    // 自定义参数
    options: Object,

    // 是否分屏显示
    compare: {
      type: Boolean,
      default: false
    },

    // 是否插入到body元素上
    appendToBody: {
      type: Boolean,
      default: false
    },

    // 自定义css类名
    customClass: {
      type: String,
      default: ''
    },

    // 是否显示开场动画
    showOpenAnimation: {
      type: Boolean,
      default: true
    },

    // 是否显示导航球
    showCompass: {
      type: Boolean,
      default: true
    }
  },

  mounted () {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }

    if (this.mapKey) {
      this.initMars3d(this.options)
    } else {
      this.getMapConfig(this.url).then((data) => {
        this.initMars3d(data)
      })
    }
  },

  beforeDestroy () {
    // this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // this.handler.destroy()
    // delete this.handler

    this[`viewer${this.mapKey}`].mars.destroy()
    this[`viewer${this.mapKey}`].destroy()
    delete this[`viewer${this.mapKey}`]
  },

  methods: {
    getMapConfig (url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then((res) => {
            resolve(res.data)
          })
          .then((error) => {
            reject(error)
          })
      })
    },

    mapLoad (viewer) {
      // 为了支持不同的材质类型
      Cesium.ExpandByMars.occlusionOpen = false
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
      this.$emit('onload', viewer)
    },

    initMars3d (options) {
      const me = this
      if (this[`viewer${this.mapKey}`]) return
      // eslint-disable-next-line no-undef
      const viewer = mars3d.createMap({
        id: `marsgis-container${this.mapKey ? `-${this.mapKey}` : ''}`,
        data: options.map3d,
        serverURL: options.serverURL,
        ...this.options,
        success: function (viewer, jsondata) { // 地图成功加载完成后执行
          // 隐藏位置信息状态
          viewer.mars.location.show = false
          // 隐藏比例尺
          $('#distanceLegendDiv').hide()
          if (!me.showCompass) $('.compass').hide()
          if (me.showOpenAnimation) {
          // 开场动画
            viewer.mars.openFlyAnimation(function () {
            // 动画播放完成后回调
              me.mapLoad(viewer)
            })
          } else {
            me.mapLoad(viewer)
          }
        }
      })

      // widget处理
      // this.getMapConfig(this.widgetUrl).then((data) => {
      //   this.initStaticWidget(viewer, data)
      // })

      // viewer.mars.click = () => {
      //   // 触发 document 上的事件
      //   document.dispatchEvent(new Event('mousedown'))
      //   document.dispatchEvent(new Event('click'))
      // }
      this[`viewer${this.mapKey}`] = viewer

      // 挂载到全局对象下，所有组件通过this.$viewer访问

      Vue.prototype[`$viewer${this.mapKey}`] = viewer
      // eslint-disable-next-line no-undef
      Vue.prototype.$Cesium = Cesium
      console.log('>>>>> 三维地图创建成功 >>>>')

      window.viewer = viewer
      // this.$emit('onload', viewer)
    },

    // 初始化外部静态widget功能（兼容使用传统模式开发的一些widget）
    initStaticWidget (viewer, widget) {
      // eslint-disable-next-line no-undef
      mars3d.widget.init(viewer, widget)

      // 绑定图层管理
      window.bindToLayerControl = function (options) {
        const layer = viewer.mars.addOperationalLayer(options)

        // eslint-disable-next-line no-undef
        const manageLayersWidget = mars3d.widget.getClass(
          'widgets/manageLayers/widget.js'
        )
        if (manageLayersWidget) {
          manageLayersWidget.addOverlay(options)
        }
        return layer
      }
      // 取消绑定图层管理 ， 参数为bindToLayerControl返回的图层
      window.unbindLayerControl = function (layer) {
        viewer.mars.removeOperationalLayer(layer.config.id)

        // eslint-disable-next-line no-undef
        const manageLayersWidget = mars3d.widget.getClass(
          'widgets/manageLayers/widget.js'
        )
        if (manageLayersWidget) {
          manageLayersWidget.removeLayer(layer.config.name)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" >
.mars3d-container {
  height: 100%;
  overflow: hidden;
}

/* 重写Cesium的css */

/**cesium按钮背景色*/
.cesium-button {
  background-color: #3f4854;
  color: #e6e6e6;
  fill: #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 32px;
}

.cesium-viewer-geocoderContainer .cesium-geocoder-input {
  background-color: rgba(63, 72, 84, 0.7);
}

.cesium-viewer-geocoderContainer .cesium-geocoder-input:focus {
  background-color: rgba(63, 72, 84, 0.9);
}

.cesium-viewer-geocoderContainer .search-results {
  background-color: #3f4854;
}

.cesium-geocoder-searchButton {
  background-color: #3f4854;
}

.cesium-infoBox-title {
  background-color: #3f4854;
}

.cesium-infoBox {
  background: rgba(63, 72, 84, 0.9);
}

.cesium-toolbar-button img {
  height: 100%;
}

.cesium-performanceDisplay-defaultContainer {
  top: auto;
  bottom: 35px;
  right: 50px;
}
.cesium-performanceDisplay-ms,
.cesium-performanceDisplay-fps {
  color: #fff;
}

/**cesium工具栏位置*/
.cesium-viewer-toolbar {
  top: auto;
  left: auto;
  right: 12px;
  bottom: 35px;
}

.cesium-viewer-toolbar > .cesium-toolbar-button,
.cesium-navigationHelpButton-wrapper,
.cesium-viewer-geocoderContainer {
  margin-bottom: 5px;
  float: right;
  clear: both;
  text-align: center;
}

.cesium-baseLayerPicker-dropDown {
  bottom: 0;
  right: 40px;
  max-height: 700px;
  margin-bottom: 5px;
}

.cesium-navigation-help {
  top: auto;
  bottom: 0;
  right: 40px;
  transform-origin: right bottom;
}

.cesium-sceneModePicker-wrapper {
  width: auto;
}

.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon {
  float: left;
  margin: 0 3px;
}

.cesium-viewer-geocoderContainer .search-results {
  left: 0;
  right: 40px;
  width: auto;
  z-index: 9999;
}

.cesium-infoBox-title {
  background-color: #3f4854;
}

.cesium-infoBox {
  top: 50px;
  background: rgba(63, 72, 84, 0.9);
}

/**左下工具栏菜单*/
.toolbar-dropdown-menu-div {
  background: rgba(43, 44, 47, 0.8);
  border: 1px solid #2b2c2f;
  z-index: 991;
  position: absolute;
  right: 60px;
  bottom: 40px;
  display: none;
}

.toolbar-dropdown-menu {
  min-width: 110px;
  padding: 0;
}
.toolbar-dropdown-menu > li {
  padding: 0 3px;
  margin: 2px 0;
}
.toolbar-dropdown-menu > li > a {
  color: #edffff;
  display: block;
  padding: 4px 10px;
  clear: both;
  font-weight: normal;
  line-height: 1.6;
  white-space: nowrap;
  text-decoration: none;
}

.toolbar-dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
  color: #fff;
  background-color: #444d59;
}

.toolbar-dropdown-menu > .active > a,
.dropdown-menu > .active > a:hover,
.dropdown-menu > .active > a:focus {
  color: #fff;
  background-color: #444d59;
}

.toolbar-dropdown-menu i {
  padding-right: 5px;
}
</style>
