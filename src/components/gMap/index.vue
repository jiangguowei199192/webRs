<template>
  <div class="gduMapMain">
    <div
      id="mapContainer"
      :class="{lineCursor:measureType==1,areaCursor:measureType==2}"
      @dblclick="dblClickMap"
    ></div>
    <div class="measureTools" v-if="bShowAllTools && bShowMeasure">
      <div
        class="lineBtn"
        :class="{btnLine:measureType!=1,btnLineSel:measureType==1}"
        @click="clickLine"
      ></div>
      <div
        class="areaBtn"
        :class="{btnArea:measureType!=2,btnAreaSel:measureType==2}"
        @click="clickArea"
      ></div>
    </div>
    <div class="basicTools" v-if="bShowAllTools && bShowBasic">
      <el-popover placement="left" trigger="click" popper-class="el-popover-custom">
        <div class="mapPopover">
          <div class="mapTypeContainer">
            <div style="height:45px;position: relative;">
              <div
                class="mapImg mapNormal"
                :class="{mapSelBorder:(mapTypeCur == 3 || mapTypeCur == 6)}"
                @click="changeBasicMap(2)"
              ></div>
            </div>
            <span
              class="mapTypeName"
              :class="{mapSelText:(mapTypeCur == 3 || mapTypeCur == 6)}"
            >2D地图</span>
          </div>
          <div class="mapInterval">
            <div class="intervalLine"></div>
          </div>
          <div class="mapTypeContainer">
            <div style="height:45px;position: relative;">
              <div
                class="mapImg mapSatellite"
                :class="{mapSelBorder:(mapTypeCur == 2 || mapTypeCur == 5)}"
                @click="changeBasicMap(1)"
              ></div>
            </div>
            <span
              class="mapTypeName"
              :class="{mapSelText:(mapTypeCur == 2 || mapTypeCur == 5)}"
            >卫星地图</span>
          </div>
          <div class="mapInterval">
            <div class="intervalLine"></div>
          </div>
          <div class="mapTypeContainer">
            <div style="height:45px;position: relative;">
              <div
                class="mapImg mapHybrid"
                :class="{mapSelBorder:(mapTypeCur == 1 || mapTypeCur == 4)}"
                @click="changeBasicMap(0)"
              ></div>
            </div>
            <span
              class="mapTypeName"
              :class="{mapSelText:(mapTypeCur == 1 || mapTypeCur == 4)}"
            >混合地图</span>
          </div>
        </div>
        <div slot="reference" class="yDivBtn btnSelMap" v-if="bShowSelMap" @click="clickSelMap"></div>
      </el-popover>
      <div class="yDivBtn btnLocator" @click="clickLocator"></div>
      <div class="yDivBtn btnZoomIn" @click="clickZoomIn"></div>
      <div class="yDivBtn btnZoomOut" @click="clickZoomOut"></div>
    </div>
    <div class="lonLatTools disable-user-select" v-if="bShowAllTools && bShowLonLat">
      <span style="margin:0px 15px;">{{mouseLat}}&#176;{{latFlag}}</span>
      <span style="margin:0px 15px;">{{mouseLon}}&#176;{{lonFlag}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gMap',
  data () {
    return {
      locale: 'zh',
      measureType: 0,
      bShowTheTif: true,
      map2D: null,
      lon: 110.200431,
      lat: 32.751584,
      mouseLon: '0',
      mouseLat: '0',
      lonFlag: 'N',
      latFlag: 'E',
      mapTypeBasic: 1,
      mapTypeIndex: 0,
      mapTypeCur: 1
    }
  },

  props: {
    // 操作类型 areaNew - 新建区域
    handleType: {
      type: String,
      default: ''
    },
    // 为false时，隐藏所有地图工具按钮；为true时，各按钮根据各自属性判断是否显示。
    bShowAllTools: {
      type: Boolean,
      default: true
    },
    // 控制是否显示测量的两个按钮
    bShowMeasure: {
      type: Boolean,
      default: false
    },
    // 是否显示右下角竖型工具条
    bShowBasic: {
      type: Boolean,
      default: false
    },
    // 是否显示地图切换
    bShowSelMap: {
      type: Boolean,
      default: true
    },
    // 是否显示实时经纬度坐标信息
    bShowLonLat: {
      type: Boolean,
      default: true
    },
    minZoom: {
      type: Number,
      default: 2
    },
    maxZoom: {
      type: Number,
      default: 21
    },
    // 为false时，emit eventLocator事件。
    doLocator: {
      type: Boolean,
      default: true
    }
  },

  created () {
    this.mapTypeBasic = 1
    this.lon = 110.200431
    this.lat = 32.751584
  },

  mounted () {
    this.createMap()
  },

  computed: {
  },

  watch: {
    handleType: {
      handler (newValue, oldValue) {
        if (newValue === 'areaNew') this.DrawPolygon()
        else {
          this.DrawStop()
        }
      }
    }
  },

  methods: {
    createMap () {
      this.mapTypeCur = this.mapTypeBasic + this.mapTypeIndex
      this.map2D = new D2.Map2D({
        containerId: 'mapContainer',
        baseLayerType: this.mapTypeCur,
        serverBaseUrl: './'
      })
      this.setPositionFormatCB()
      this.map2D.setMinZoom(this.minZoom)
      this.map2D.setMaxZoom(this.maxZoom)
      this.map2D.zoomToCenter(this.lon, this.lat)
      this.map2D.markerLayerManager.baseUrl = localStorage.ftpBaseUrl
      this.$emit('eventMapLoaded')
    },

    // 绘制多边形
    DrawPolygon () {
      this.DrawChangeType(2)
      this.DrawStart()
    },

    // 绘制类型
    DrawChangeType (type) {
      //  0: "Point",
      //   1: "LineString",
      //   2: "Polygon",
      //   3: "Square",
      //   4: "Box",
      //   5: "Circle"
      this.map2D.drawHelper.type = type
    },

    // 开始绘制
    DrawStart () {
      this.map2D.drawHelper.start()
    },

    // 结束绘制
    DrawStop () {
      this.map2D.drawHelper.stop()
    },

    // 双击地图时结束测量
    dblClickMap () {
      if (this.measureType !== 0) {
        this.measureType = 0
        this.map2D.measureTool.stop()
        this.map2D.measureTool.start()
        this.map2D.measureTool.stop()
      }
    },

    // 开始测量距离
    clickLine () {
      this.measureType = 1
      this.map2D.measureTool.stop()
      this.map2D.measureTool.type = 'LENGTH'
      this.map2D.measureTool.start()
    },

    // 开始测量面积
    clickArea () {
      this.measureType = 2
      this.map2D.measureTool.stop()
      this.map2D.measureTool.type = 'AREA'
      this.map2D.measureTool.start()
    },

    // 点击切换地图类型
    clickSelMap () {
      // do...
    },

    // 定位到地图指定坐标
    clickLocator () {
      if (this.doLocator) this.map2D.zoomToCenter(this.lon, this.lat)
      else this.$emit('eventLocator')
    },

    // 地图移动到指定坐标
    mapMoveTo (longitude, latitude, bSave = true) {
      if (bSave) {
        this.lon = longitude
        this.lat = latitude
      }
      this.map2D.zoomToCenter(longitude, latitude)
    },

    // 地图级别放大(视距变小)
    clickZoomIn () {
      this.map2D.zoomIn()
    },

    // 地图级别缩小(视距变大)
    clickZoomOut () {
      this.map2D.zoomOut()
    },

    // 切换地图底图
    changeBasicMap (index) {
      this.mapTypeIndex = index
      const tmpType = this.mapTypeBasic + index
      if (this.mapTypeCur !== tmpType) {
        this.mapTypeCur = tmpType
        this.map2D._imageLayerManager.changeBaseLayer(this.mapTypeCur)
      }
    },

    // 增加tif切片影像层
    addTifImgLayerByUrl (tifUrl) {
      const tmpLayer = this.map2D._imageLayerManager.add(tifUrl, ly => {
        this.map2D.zoomToLayer(ly)
      })
      return tmpLayer
    },

    // 鼠标滑动经纬度样式设置
    positionFormat (coordinate) {
      if (coordinate) {
        this.mouseLat = Math.abs(coordinate[1]).toFixed(6)
        this.latFlag = coordinate[1] > 0 ? 'N' : 'S'
        this.mouseLon = Math.abs(coordinate[0]).toFixed(6)
        this.lonFlag = coordinate[0] > 0 ? 'E' : 'W'
        return '' // 返回空，不显示地图自带的经纬度显示框。
      } else {
        return ''
      }
    },
    setPositionFormatCB () {
      this.map2D.setMousePositionFormat(this.positionFormat)
    },

    // 添加团队标记
    addTeamMarkers (teamData) {
      const data = { data: teamData }
      this.map2D.markerLayerManager.addTeamMarker(data)
    },
    // 删除所有团队标记
    delAllTeamMarkers () {
      this.map2D._markerLayerManager.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.xDivBtn {
  display: inline-block;
  height: 30px;
  width: 30px;
  background-size: 100% 100%;
  margin-left: 10px;
  cursor: pointer;
}
.yDivBtn {
  display: block;
  height: 30px;
  width: 30px;
  background-size: 100% 100%;
  margin-top: 10px;
  cursor: pointer;
}

.mapPopover {
  .mapInterval {
    display: inline-block;
    width: 30px;
    .intervalLine {
      width: 1px;
      height: 30px;
      background-color: #ffffff66;
      margin-left: 15px;
      margin-bottom: 20px;
    }
  }
  .mapTypeContainer {
    display: inline-block;
    text-align: center;
    width: 50px;
    .mapImg {
      height: 45px;
      width: 45px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-size: 100% 100%;
      cursor: pointer;
    }
    .mapNormal {
      background-image: url("../../assets/images/normal_map.png");
    }
    .mapSatellite {
      background-image: url("../../assets/images/satellite_map.png");
    }
    .mapHybrid {
      background-image: url("../../assets/images/hybird_map.png");
    }
    .mapTypeName {
      font-size: 12px;
      color: white;
      pointer-events: none;
    }
    .mapSelBorder {
      border: 1px #ffa030 solid;
    }
    .mapSelText {
      color: #ffa030;
    }
  }
}

.gduMapMain {
  width: 100%;
  height: 100%;
  position: relative;
  #mapContainer {
    width: 100%;
    height: 100%;
  }
  .lineCursor {
    cursor: url("../../assets/images/m_line.png") 3 4, auto;
  }
  .areaCursor {
    cursor: url("../../assets/images/m_area.png") 3 2, auto;
  }
  .measureTools {
    position: absolute;
    height: 34px;
    background-color: white;
    right: 15px;
    top: 15px;
    border-radius: 4px;
    .lineBtn {
      display: inline-block;
      height: 28px;
      width: 26px;
      background-size: 100% 100%;
      margin: 3px 10px 3px 10px;
      cursor: pointer;
    }
    .btnLine {
      background-image: url("../../assets/images/line.png");
    }
    .btnLineSel {
      background-image: url("../../assets/images/line_select.png");
    }
    .areaBtn {
      display: inline-block;
      height: 27px;
      width: 27px;
      background-size: 100% 100%;
      margin: 4px 10px 3px 10px;
      cursor: pointer;
    }
    .btnArea {
      background-image: url("../../assets/images/area.png");
    }
    .btnAreaSel {
      background-image: url("../../assets/images/area_select.png");
    }
  }
  .basicTools {
    position: absolute;
    width: 30px;
    right: 15px;
    bottom: 45px;
    .btnSelMap {
      background-image: url("../../assets/images/map_change.png");
    }
    .btnSelMap:active {
      background-image: url("../../assets/images/map_change_press.png");
    }
    .btnLocator {
      background-image: url("../../assets/images/map_locator.png");
    }
    .btnLocator:active {
      background-image: url("../../assets/images/map_locator_press.png");
    }
    .btnZoomIn {
      background-image: url("../../assets/images/zoomin.png");
    }
    .btnZoomIn:active {
      background-image: url("../../assets/images/zoomin_press.png");
    }
    .btnZoomOut {
      background-image: url("../../assets/images/zoomout.png");
    }
    .btnZoomOut:active {
      background-image: url("../../assets/images/zoomout_press.png");
    }
  }
  .lonLatTools {
    position: absolute;
    background-color: #00000066;
    color: white;
    height: 25px;
    line-height: 25px;
    right: 15px;
    bottom: 10px;
    cursor: default;
    border-radius: 4px;
    pointer-events: none;
  }
}
</style>
