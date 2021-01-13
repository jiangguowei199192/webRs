<template>
  <div class="gduMapMain">
    <div
      :id="mapContainerID"
      class="mapContainer"
      :class="{
        lineCursor: measureType == 1,
        areaCursor: measureType == 2,
        radiusCorner: bRadiusCorner,
        flatCorner: bFlatCorner,
      }"
      @dblclick="dblClickMap"
    ></div>
    <div
      class="simpleSearchCtrl"
      :class="{ simpleSearchCtrl_Mini: bMiniSearchStyle }"
      v-if="bShowAllTools && bShowSimpleSearchTools"
    >
      <input
        class="simpleInputText"
        :class="{ simpleInputText_Mini: bMiniSearchStyle }"
        :id="simpleAddrSearchID"
        v-model="simpleFilterText"
        type="text"
        autocomplete="off"
        value
        v-on:keyup.enter="simpleSearchAddrs(simpleFilterText, false)"
        v-on:keyup.delete="simpleResetChooseAddr"
        :placeholder="simplePlaceHolder"
      />
      <div
        class="simpleInputSearch"
        :class="{ simpleInputSearch_Mini: bMiniSearchStyle }"
        @click.stop="simpleSearchAddrs(simpleFilterText, true)"
      >
        <img
          class="simpleIcon"
          :class="{ simpleIcon_Mini: bMiniSearchStyle }"
          src="../../assets/images/simpleAddrSearch.png"
        />
      </div>
    </div>
    <div class="searchCtrl" v-if="bShowAllTools && bShowSearchTools">
      <input
        class="inputText"
        :id="addrSearchID"
        v-model="filterText"
        type="text"
        autocomplete="off"
        value
        v-on:keyup.enter="searchAddrs(filterText, false)"
        v-on:keyup.delete="resetChooseAddr"
        :placeholder="placeHolder"
      />
      <div class="inputSearch" @click.stop="searchAddrs(filterText, true)">
        <img
          class="searchIcon"
          src="../../assets/images/simpleAddrSearch.png"
        />
      </div>
      <div class="inputFunc" @click.stop="routeOrCloseFunc">
        <img
          class="closeIcon"
          v-show="bRouteOrClose === false"
          src="../../../public/assets/images/search_close.png"
        />
        <img
          class="closeIcon"
          v-show="bRouteOrClose === true"
          src="../../../public/assets/images/route.png"
        />
      </div>
    </div>
    <div class="routeCtrl disable-user-select" v-show="bShowRouteCtrl">
      <el-input
        :id="pointStartID"
        class="pointInput"
        v-model="startText"
        size="mini"
        :placeholder="startHolder"
        auto-complete="new-address"
      >
        <div slot="prepend" style="corlor: black">起</div>
        <el-button
          slot="append"
          icon="el-icon-close"
          size="mini"
          class="appendBtn"
          @click.stop="clearStartPoi"
        ></el-button>
      </el-input>
      <el-input
        :id="pointEndID"
        class="pointInput"
        v-model="endText"
        size="mini"
        :placeholder="endHolder"
        auto-complete="new-address"
      >
        <div slot="prepend" style="corlor: black">终</div>
        <el-button
          slot="append"
          icon="el-icon-close"
          size="mini"
          class="appendBtn"
          @click.stop="clearEndPoi"
        ></el-button>
      </el-input>
      <div class="routeBtn routeClose" @click.stop="closeRouteCtrl"></div>
      <div class="routeBtn routeSwap" @click.stop="swapRoutePoint"></div>
    </div>
    <div class="searchResult webFsScroll" v-show="bShowResult">
      <div
        class="searchItem"
        v-for="(addr, index) in addrResults"
        :key="index"
        :class="{ itemSeparator: index != 0, searchItemHover: addr._bHover }"
        @click.stop="gotoAddrDetails($event, addr)"
        @mouseenter="mouseHandler($event, addr, true)"
        @mouseleave="mouseHandler($event, addr, false)"
      >
        <div class="keyAddr" v-show="addr.keyId != undefined"></div>
        <img
          class="itemImg"
          v-show="addr._imgUrl != null"
          :src="addr._imgUrl"
        />
        <div class="itemName" :title="addr.name">
          {{ index + 1 }}. {{ addr.name }}
        </div>
        <div class="itemAddr" v-show="addr._addr != null">{{ addr._addr }}</div>
        <div class="itemTel" v-show="addr.tel.length > 0">
          {{ titelTel }}{{ addr.tel }}
        </div>
      </div>
    </div>
    <plan v-if="bShowPaln" ref="plan" id="plan"></plan>
    <div class="measureTools" v-if="bShowAllTools && bShowMeasure">
      <div
        class="lineBtn"
        :class="{ btnLine: measureType != 1, btnLineSel: measureType == 1 }"
        @click="clickLine"
      ></div>
      <div
        class="areaBtn"
        :class="{ btnArea: measureType != 2, btnAreaSel: measureType == 2 }"
        @click="clickArea"
      ></div>
    </div>
    <div
      class="basicTools"
      :class="{
        basicToolsBottom: !bShowLonLat,
        basicToolsBottom2: bBasicHighBottom,
      }"
      v-if="bShowAllTools && bShowBasic"
    >
      <el-popover
        :append-to-body="bAppendToBody"
        ref="ctrlFuncLayer"
        placement="left"
        trigger="click"
        popper-class="el-popover-custom"
      >
        <div class="mapPopover">
          <div class="mapTypeContainer">
            <div style="height: 45px; position: relative">
              <div
                class="mapImg layerHigh"
                :class="{ mapSelBorder: bShowHighPoint }"
                @click="showLayer('high', !bShowHighPoint)"
              >
                <img
                  class="layer_selected"
                  v-show="bShowHighPoint"
                  src="../../assets/images/layer_selected.png"
                />
              </div>
            </div>
            <span class="mapTypeName" :class="{ mapSelText: bShowHighPoint }"
              >高点监控</span
            >
          </div>
          <div class="mapInterval">
            <div class="intervalLine"></div>
          </div>
          <div class="mapTypeContainer">
            <div style="height: 45px; position: relative">
              <div
                class="mapImg layerDrone"
                :class="{ mapSelBorder: bShowDrone }"
                @click="showLayer('drone', !bShowDrone)"
              >
                <img
                  class="layer_selected"
                  v-show="bShowDrone"
                  src="../../assets/images/layer_selected.png"
                />
              </div>
            </div>
            <span class="mapTypeName" :class="{ mapSelText: bShowDrone }"
              >无人机</span
            >
          </div>
          <div class="mapInterval">
            <div class="intervalLine"></div>
          </div>
          <div class="mapTypeContainer">
            <div style="height: 45px; position: relative">
              <div
                class="mapImg layerFire"
                :class="{ mapSelBorder: bShowFire }"
                @click="showLayer('fire', !bShowFire)"
              >
                <img
                  class="layer_selected"
                  v-show="bShowFire"
                  src="../../assets/images/layer_selected.png"
                />
              </div>
            </div>
            <span class="mapTypeName" :class="{ mapSelText: bShowFire }"
              >火点</span
            >
          </div>
        </div>
        <div
          slot="reference"
          ref="selLayerCtrl"
          class="yDivBtn btnSelLayer btnActive"
          v-if="bShowSelLayer"
          @click="clickChangeFuncLayers"
        ></div>
      </el-popover>
      <el-popover
        :append-to-body="bAppendToBody"
        ref="ctrlBasicLayer"
        placement="left"
        trigger="click"
        popper-class="el-popover-custom"
      >
        <div class="mapPopover">
          <div class="mapTypeContainer">
            <div style="height: 45px; position: relative">
              <div
                class="mapImg mapNormal"
                :class="{ mapSelBorder: mapTypeCur == 3 || mapTypeCur == 6 }"
                @click="changeBasicMap(2)"
              ></div>
            </div>
            <span
              class="mapTypeName"
              :class="{ mapSelText: mapTypeCur == 3 || mapTypeCur == 6 }"
              >2D地图</span
            >
          </div>
          <div class="mapInterval">
            <div class="intervalLine"></div>
          </div>
          <div class="mapTypeContainer">
            <div style="height: 45px; position: relative">
              <div
                class="mapImg mapSatellite"
                :class="{ mapSelBorder: mapTypeCur == 2 || mapTypeCur == 5 }"
                @click="changeBasicMap(1)"
              ></div>
            </div>
            <span
              class="mapTypeName"
              :class="{ mapSelText: mapTypeCur == 2 || mapTypeCur == 5 }"
              >卫星地图</span
            >
          </div>
          <div class="mapInterval">
            <div class="intervalLine"></div>
          </div>
          <div class="mapTypeContainer">
            <div style="height: 45px; position: relative">
              <div
                class="mapImg mapHybrid"
                :class="{ mapSelBorder: mapTypeCur == 1 || mapTypeCur == 4 }"
                @click="changeBasicMap(0)"
              ></div>
            </div>
            <span
              class="mapTypeName"
              :class="{ mapSelText: mapTypeCur == 1 || mapTypeCur == 4 }"
              >混合地图</span
            >
          </div>
        </div>
        <div
          slot="reference"
          ref="selMapCtrl"
          class="yDivBtn btnSelMap btnActive"
          v-if="bShowSelMap"
          @click="clickChangeBasicLayers"
        ></div>
      </el-popover>
      <div class="yDivBtn btnLocator btnActive" @click="clickLocator"></div>
      <div class="yDivBtn btnZoomIn btnActive" @click="clickZoomIn"></div>
      <div class="yDivBtn btnZoomOut btnActive" @click="clickZoomOut"></div>
    </div>
    <div
      class="lonLatTools disable-user-select"
      v-if="bShowAllTools && bShowLonLat"
    >
      <span style="margin: 0px 15px">{{ mouseLon }}&#176;{{ lonFlag }}</span>
      <span style="margin: 0px 15px">{{ mouseLat }}&#176;{{ latFlag }}</span>
    </div>
    <div class="rpBottomBox" v-if="bShowBottomMenu">
      <div class="rpBottomMenu">
        <div class="menuItem" :class="{unSelectItem:!bShowRpLayerCamera}"
          @click="setRpLayerVisible('RP_Camera')">
          <div class="itemImgBox">
            <div class="itemImg itemCamera"></div>
          </div>
          <div class="itemTextBox">
            <div class="itemText">红外设备</div>
          </div>
        </div>
        <div class="menuItem" :class="{unSelectItem:!bShowRpLayerDrone}"
          @click="setRpLayerVisible('RP_Drone')">
          <div class="itemImgBox">
            <div class="itemImg itemDrone"></div>
          </div>
          <div class="itemTextBox">
            <div class="itemText">无人机</div>
          </div>
        </div>
        <div class="menuItem" :class="{unSelectItem:!bShowRpLayerPolice}"
          @click="setRpLayerVisible('RP_Police')">
          <div class="itemImgBox">
            <div class="itemImg itemPolice"></div>
          </div>
          <div class="itemTextBox">
            <div class="itemText">消防人员</div>
          </div>
        </div>
        <div class="menuItem" :class="{unSelectItem:!bShowRpLayerInstitution}"
          @click="setRpLayerVisible('RP_Institution')">
          <div class="itemImgBox">
            <div class="itemImg itemInstitution"></div>
          </div>
          <div class="itemTextBox">
            <div class="itemText">消防机构</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AMapHelper from '../../axios/amapapis'
import Plan from '../../views/decisionSystem/components/Plan.vue'
import { settingApi } from '@/api/setting'

export default {
  name: 'gMap',
  components: {
    Plan
  },
  data () {
    return {
      mapContainerID: null,
      simpleAddrSearchID: null,
      addrSearchID: null,
      pointStartID: null,
      pointEndID: null,
      simpleAutoTips: null,
      autoTips: null,
      autoStartTips: null,
      startPoi: null,
      startText: null,
      startFeature: null,
      startHolder: '请输入起点地址',
      autoEndTips: null,
      endPoi: null,
      endText: null,
      endFeature: null,
      endHolder: '请输入终点地址',
      simpleFilterText: '',
      filterText: '',
      simplePlaceHolder: '请输入地点或经纬度',
      placeHolder: '请输入目的地',
      titelTel: '电话: ',
      bRouteOrClose: false, // true:route,false:close
      bShowRouteCtrl: false,
      bShowResult: false,
      bShowPaln: false,
      addrResults: null,
      lastResults: null,
      simpleChooseAddr: null,
      chooseAddr: null,
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
      mapTypeCur: 1,
      bShowHighPoint: true,
      bShowDrone: true,
      bShowFire: true,
      bBasicHighBottom: false, // 控制右下角基础工具条向上移动
      bAppendToBody: true, // 控制Popover弹窗附加文档结构位置
      popoverOffsetX: -38, // 地图右下角工具条Popover弹窗x轴偏移
      popoverOffsetY: 33, // 地图右下角工具条Popover弹窗y轴偏移
      bShowRpLayerInstitution: true,
      bShowRpLayerPolice: true,
      bShowRpLayerDrone: true,
      bShowRpLayerCamera: true
    }
  },

  props: {
    // 默认底图序号
    baseMapIndex: {
      type: Number,
      default: 0
    },
    // 地图圆角样式
    bRadiusCorner: {
      type: Boolean,
      default: false
    },
    // 地图平角样式
    bFlatCorner: {
      type: Boolean,
      default: false
    },
    // 是否启用双击样式
    bDbClickStyle: {
      type: Boolean,
      default: false
    },
    // 为false时，不根据浏览器自动定位；为true时，根据浏览器定位用户当前位置。
    bAutoLocate: {
      type: Boolean,
      default: true
    },
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
    // 简易搜索框(火情警报、设备地图页面会用到)
    bShowSimpleSearchTools: {
      type: Boolean,
      default: false
    },
    // 迷你简易搜索框样式
    bMiniSearchStyle: {
      type: Boolean,
      default: false
    },
    // 复杂搜索框(包含路线规划功能，消防地图页面会用到)
    bShowSearchTools: {
      type: Boolean,
      default: false
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
    // 是否显示图层切换
    bShowSelLayer: {
      type: Boolean,
      default: true
    },
    // 是否显示底图切换
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
      default: 18
    },
    // 为false时，emit eventLocator事件。
    doLocator: {
      type: Boolean,
      default: true
    },
    // 是否显示底部图层显示隐藏菜单
    bShowBottomMenu: {
      type: Boolean,
      default: false
    }
  },

  created () {
    const tmpTime = new Date()
    const tmpStamp = tmpTime.getTime()
    this.mapContainerID = 'mapContainer_' + tmpStamp
    this.simpleAddrSearchID = '_simpleAddrSearch_' + tmpStamp
    this.addrSearchID = '_addrSearch_' + tmpStamp
    this.pointStartID = '_pointStart_' + tmpStamp
    this.pointEndID = '_pointEnd_' + tmpStamp

    this.mapTypeBasic = 1
    this.lon = 110.200431
    this.lat = 32.751584
  },

  mounted () {
    this.createMap()
  },

  computed: {},

  watch: {
    handleType: {
      handler (newValue, oldValue) {
        if (newValue === 'areaNew') this.DrawPolygon()
        else {
          this.DrawStop()
        }
      }
    },

    $route: 'domIsExist'
  },

  methods: {
    // 目标是否存在
    domIsExist () {
      var dom = document.querySelector('#plan')
      if (dom) this.clickDomChange()
    },
    // 目标切换
    clickDomChange () {
      this.$nextTick(() => {
        const plan = document.querySelector('#plan')
        const input = document.querySelector('.searchCtrl')
        document.onclick = (e) => {
          this.bShowPaln = false
        }
        plan.onclick = (e) => {
          e.stopPropagation()
        }
        input.onclick = (e) => {
          e.stopPropagation()
        }
      })
    },

    getRootUrl () {
      var curWwwPath = window.document.location.href
      var pathName = window.document.location.pathname
      var pos = curWwwPath.indexOf(pathName)
      var tmpRoot = curWwwPath.substring(0, pos)
      tmpRoot += this.$router.options.base
      return tmpRoot
    },
    // 创建地图组件
    createMap () {
      const rootUrl = this.getRootUrl()
      this.mapTypeIndex = this.baseMapIndex
      if (this.mapTypeIndex > 2 || this.mapTypeIndex < 0) {
        this.mapTypeIndex = 0
      }
      this.mapTypeCur = this.mapTypeBasic + this.mapTypeIndex
      let bNetWorkConn = true
      if (localStorage.bNetWorkConn !== undefined) {
        if (localStorage.bNetWorkConn === 'false') {
          bNetWorkConn = false
        }
      }
      bNetWorkConn = true // 暂时不启用离线地图(启用离线地图需要配置好DataConfig.json中offlineLayers地址)
      // eslint-disable-next-line
      this.map2D = new D2.Map2D({
        containerId: this.mapContainerID,
        baseLayerType: this.mapTypeCur,
        mapOriginType: 'gaode',
        serverBaseUrl: rootUrl,
        bIsOnline: bNetWorkConn,
        rpClickSelect: true
      })
      this.setPositionFormatCB()
      this.map2D.setMinZoom(this.minZoom)
      this.map2D.setMaxZoom(this.maxZoom)
      this.map2D.zoomToCenter(this.lon, this.lat)
      this.map2D.markerLayerManager.baseUrl = localStorage.ftpBaseUrl
      this.$emit('eventMapLoaded')

      if (this.bAutoLocate) {
        this.map2D.geoLocation(this.curLocationCB) // 根据浏览器自动定位当前位置
      }
      this.map2D.addAutocomplete(this.initSearchBox) // 初始化高德地图搜索提示功能输入框

      this.map2D.searchLayerManager.select()
      this.map2D.searchLayerManager.selectMarkerEvent.addEventListener(
        this.selectMarkerEventCB
      )
      this.map2D.searchLayerManager.popNavImgClickEvent.addEventListener(
        this.popNavImgClickEventCB
      )
      this.map2D.searchLayerManager.setPopupNavVisible(false)

      this.map2D.enableDoubleClickZoom(false)
    },

    // 自动定位当前位置回调
    curLocationCB (lon, lat) {
      this.lon = lon
      this.lat = lat
      this.map2D.setZoom(16)
      this.map2D.zoomToCenter(lon, lat)
    },

    // 点击气泡弹窗中图标按钮事件回调
    popNavImgClickEventCB (addr) {
      if (addr != null && addr !== undefined) {
        this.map2D.searchLayerManager.clear()
        this.addRoutePoint(addr, false)
        this.bShowRouteCtrl = true
        this.bShowPaln = false
      }
    },

    // 点击位置标记图标事件回调
    selectMarkerEventCB (addr) {
      this.gotoAddrDetails(null, addr, false)
    },

    // 处理搜索结果并显示
    updateSearchResults (_results) {
      if (_results != null) {
        let tmpIndex = 0
        let tmpMaxLon = -180
        let tmpMaxLat = -90
        let tmpMinLon = 180
        let tmpMinLat = 90
        const tmpRes = []
        _results.forEach((addr) => {
          if (addr.name !== undefined && addr.address !== undefined) {
            tmpIndex += 1
            addr._index = tmpIndex
            addr._bHover = false
            addr._updateHoverCB = this.updateMouseHover
            if (addr.photos.length > 0) {
              addr._imgUrl = addr.photos[0].url
            } else {
              addr._imgUrl = null
            }
            if (addr.address != null && !(addr.address instanceof Array)) {
              addr._addr = addr.address
            } else {
              addr._addr = null
            }
            const tmpStrs = addr.location.split(',')
            addr._lon = parseFloat(tmpStrs[0])
            addr._lat = parseFloat(tmpStrs[1])
            if (addr._lon > tmpMaxLon) tmpMaxLon = addr._lon
            if (addr._lat > tmpMaxLat) tmpMaxLat = addr._lat
            if (addr._lon < tmpMinLon) tmpMinLon = addr._lon
            if (addr._lat < tmpMinLat) tmpMinLat = addr._lat
            tmpRes.push(addr)
          }
        })
        if (tmpRes.length > 0) {
          this.addrResults = tmpRes
          this.map2D.searchLayerManager.clear()
          this.map2D.searchLayerManager.addSearchAddrs(tmpRes)
          if (tmpRes.length > 0) {
            this.bShowResult = true
            this.bRouteOrClose = false
          }
          if (tmpRes.length > 1) {
            this.map2D.zoomToExtent(tmpMinLon, tmpMinLat, tmpMaxLon, tmpMaxLat)
            this.map2D.zoomOut()
          }
          return
        }
      }
      this.addrResults = null
      this.bShowResult = false
      this.bRouteOrClose = false // true (由true改为false隐藏路线导航功能)
      this.map2D.searchLayerManager.clear()
    },

    // 重点单位搜索结果追加
    appendKeyResults (_keyResult) {
      if (_keyResult.length < 1) {
        return
      }
      if (_keyResult.length > 0 && this.addrResults === null) {
        this.addrResults = []
      }
      const tmpKeyRes = []
      _keyResult.forEach((k) => {
        k._bHover = false
        k._updateHoverCB = this.updateMouseHover
        k.keyId = k.id
        if (k.enterpriseOtherInfo !== null) {
          const tmpInfo = JSON.parse(k.enterpriseOtherInfo)
          k.id = tmpInfo.mapId
        }
        k.name = k.enterpriseName
        k.address = k.enterpriseAddress
        k._addr = k.enterpriseAddress
        k._lon = k.enterpriseLongitude
        k._lat = k.enterpriseLatitude
        k.tel = k.enterpriseTel
        if (
          k.enterpriseTelBackup !== undefined &&
          k.enterpriseTelBackup !== ''
        ) {
          k.tel += ';' + k.enterpriseTelBackup
        }
        k._imgUrl = null
        tmpKeyRes.push(k)
      })
      if (this.addrResults.length > 0 && tmpKeyRes.length > 0) {
        for (let j = 0; j < tmpKeyRes.length; j++) {
          for (let k = 0; k < this.addrResults.length; k++) {
            if (tmpKeyRes[j].id === this.addrResults[k].id) {
              this.addrResults.splice(k, 1)
              break
            }
          }
          if (this.addrResults.length < 1) {
            break
          }
        }
      }
      this.addrResults.push.apply(this.addrResults, tmpKeyRes)
      const tmpRes = []
      const totalNum = this.addrResults.length
      let count = 0
      const tA = this.addrResults
      let tmpMaxLon = -180
      let tmpMaxLat = -90
      let tmpMinLon = 180
      let tmpMinLat = 90
      for (let i = totalNum - 1; i >= 0; i--) {
        count += 1
        tA[i]._index = count
        if (tA[i]._lon > tmpMaxLon) tmpMaxLon = tA[i]._lon
        if (tA[i]._lat > tmpMaxLat) tmpMaxLat = tA[i]._lat
        if (tA[i]._lon < tmpMinLon) tmpMinLon = tA[i]._lon
        if (tA[i]._lat < tmpMinLat) tmpMinLat = tA[i]._lat
        tmpRes.push(tA[i])
      }
      this.map2D.searchLayerManager.clear()
      this.map2D.searchLayerManager.addSearchAddrs(tmpRes)
      if (tmpRes.length > 1) {
        this.map2D.zoomToExtent(tmpMinLon, tmpMinLat, tmpMaxLon, tmpMaxLat)
        this.map2D.zoomOut()
      } else {
        this.map2D.zoomToCenter(tA[0]._lon, tA[0]._lat)
        this.map2D.setZoom(16)
      }
      this.addrResults = []
      this.addrResults = tmpRes
      this.bShowResult = true
      this.bRouteOrClose = false
    },

    // 根据网络结果查询预案
    async handleAutoTipsPoi (poi) {
      var that = this
      if (poi.id === '' || poi.id === null || poi.id === undefined) {
        that.searchAddrs(poi.name, true)
        return
      }

      let bFoundKey = false
      await this.$axios
        .get(settingApi.enterpriseList, {
          params: { enterpriseOtherInfo: poi.id }
        })
        .then((res) => {
          if (res.data.code === 0) {
            var keyDatas = res.data.data.data
            if (keyDatas.length > 0) {
              bFoundKey = true
              that.addrResults = []
              that.appendKeyResults(keyDatas)
            }
          }
        })
        .catch((err) => {
          console.log('handleAutoTipsPoi.enterpriseList Err : ' + err)
        })
      if (bFoundKey) {
        return
      }

      AMapHelper.getPoiDetail({ id: poi.id })
        .then((res) => {
          that.chooseAddr = null
          if (res.data.status === '1') {
            that.updateSearchResults(res.data.pois)
          }
        })
        .catch((err) => {
          console.log('handleAutoTipsPoi.AMapHelper.getPoiDetail Err : ' + err)
        })

      if (poi.location.lng !== undefined && poi.location.lat !== undefined) {
        that.mapMoveTo(poi.location.lng, poi.location.lat, false)
      }
    },

    // 初始化搜索提示框
    initSearchBox () {
      var that = this
      if (this.bShowSimpleSearchTools) {
        // eslint-disable-next-line
        this.simpleAutoTips = new AMap.Autocomplete({
          input: this.simpleAddrSearchID
        })
        // eslint-disable-next-line
        AMap.event.addListener(this.simpleAutoTips, "select", (e) => {
          // 注册监听，当选中某条记录时会触发
          if (
            e.poi.location.lng !== undefined &&
            e.poi.location.lat !== undefined
          ) {
            that.addCustomMarker(
              e.poi.name,
              e.poi.location.lng,
              e.poi.location.lat
            )
            that.mapMoveTo(e.poi.location.lng, e.poi.location.lat, false)
          }
        })
        // eslint-disable-next-line
        AMap.event.addListener(this.simpleAutoTips, "choose", (e) => {
          // 注册监听，当选中某条记录时会触发
          that.simpleChooseAddr = e
          that.simpleFilterText = e.poi.name
        })
      }

      if (this.bShowSearchTools) {
        // 输入提示
        // eslint-disable-next-line
        this.autoTips = new AMap.Autocomplete({ input: this.addrSearchID });
        // eslint-disable-next-line
        AMap.event.addListener(this.autoTips, "select", (e) => {
          // 注册监听，当选中某条记录时会触发
          that.bShowPaln = false
          that.handleAutoTipsPoi(e.poi)
        })
        // eslint-disable-next-line
        AMap.event.addListener(this.autoTips, "choose", (e) => {
          // 注册监听，当选中某条记录时会触发
          that.chooseAddr = e
          that.filterText = e.poi.name
        })

        // Init start POI
        // eslint-disable-next-line
        this.autoStartTips = new AMap.Autocomplete({
          input: this.pointStartID
        })
        // eslint-disable-next-line
        AMap.event.addListener(this.autoStartTips, "select", (e) => {
          // 注册监听，当选中某条记录时会触发
          if (
            e.poi.location.lng !== undefined &&
            e.poi.location.lat !== undefined
          ) {
            e.poi._lon = e.poi.location.lng
            e.poi._lat = e.poi.location.lat
            that.mapMoveTo(e.poi._lon, e.poi._lat, false)
            that.map2D.setZoom(16)
            that.addRoutePoint(e.poi, true)
          }
        })

        // Init end POI
        // eslint-disable-next-line
        this.autoEndTips = new AMap.Autocomplete({ input: this.pointEndID });
        // eslint-disable-next-line
        AMap.event.addListener(this.autoEndTips, "select", (e) => {
          // 注册监听，当选中某条记录时会触发
          if (
            e.poi.location.lng !== undefined &&
            e.poi.location.lat !== undefined
          ) {
            e.poi._lon = e.poi.location.lng
            e.poi._lat = e.poi.location.lat
            that.mapMoveTo(e.poi._lon, e.poi._lat, false)
            that.map2D.setZoom(16)
            that.addRoutePoint(e.poi, false)
          }
        })
      }

      console.log('initSearchBox ...... OK')
    },

    // 添加自定义位置标记
    addCustomMarker (name, lon, lat) {
      this.map2D.customMarkerLayerManager.clear()
      this.map2D.customMarkerLayerManager.addMarker({
        name: name,
        lon: lon,
        lat: lat,
        _bWgs2Gcj: false
      })
      this.map2D.setZoom(16)
    },
    // Enter或点击搜索事件处理
    async simpleSearchAddrs (addrStr, bDetail) {
      if (addrStr === '') {
        return
      }
      if (this.simpleChooseAddr != null && bDetail !== true) {
        return
      }
      this.simpleAutoTips.Ub.style.visibility = 'hidden'

      const strs = addrStr.split(',')
      if (strs.length === 2) {
        try {
          if (!String.prototype.trim) {
            // eslint-disable-next-line
            String.prototype.trim = function () {
              return this.replace(/^\s*|\s*$/g, '')
            }
          }
          strs[0] = strs[0].trim()
          strs[1] = strs[1].trim()
          // eslint-disable-next-line
          const lonreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,14})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,14}|180)$/;
          // eslint-disable-next-line
          const latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,14}|90\.0{0,14}|[0-8]?\d{1}|90)$/;
          if (lonreg.test(strs[0]) && latreg.test(strs[1])) {
            const tmpLon = parseFloat(strs[0])
            const tmpLat = parseFloat(strs[1])
            this.addCustomMarker(addrStr, tmpLon, tmpLat)
            this.mapMoveTo(tmpLon, tmpLat, false)
            return
          } else if (lonreg.test(strs[1]) && latreg.test(strs[0])) {
            const tmpLon = parseFloat(strs[1])
            const tmpLat = parseFloat(strs[0])
            this.mapMoveTo(tmpLon, tmpLat, false)
            this.addCustomMarker(addrStr, tmpLon, tmpLat)
            return
          }
        } catch (error) {
          console.log('LonLat Reg exception : ' + error)
        }
      }

      const that = this
      AMapHelper.getTips({ keywords: addrStr })
        .then((res) => {
          if (res.data.status === '1') {
            const tmpTips = res.data.tips
            for (let index = 0; index < tmpTips.length; index++) {
              try {
                const tmpStrs = tmpTips[index].location.split(',')
                const tmpLon = parseFloat(tmpStrs[0])
                const tmpLat = parseFloat(tmpStrs[1])
                this.addCustomMarker(addrStr, tmpLon, tmpLat)
                that.mapMoveTo(tmpLon, tmpLat, false)
                break
              } catch (error) {
                console.log('tmpTips.forEach exception : ' + error)
              }
            }
          }
        })
        .catch((err) => {
          console.log('AMapHelper.getTips Err : ' + err)
        })
    },
    // 删除搜索框中文字事件处理
    simpleResetChooseAddr () {
      this.simpleChooseAddr = null
    },

    // 分级搜索位置信息
    async searchAMapAddrs (addrStr) {
      const tmpParams1 = { keywords: addrStr }
      const tmpParams2 = { keywords: addrStr, citylimit: true }
      if (localStorage.location_city_adcode !== undefined) {
        tmpParams1.city = localStorage.location_city_adcode
      }
      let bTmpFound = false
      await AMapHelper.getPOIs(tmpParams1)
        .then((res) => {
          if (res.data.status === '1') {
            if (res.data.pois.length > 0) {
              this.updateSearchResults(res.data.pois)
              bTmpFound = true
            }
          }
        })
        .catch((err) => {
          console.log('searchAMapAddrs.AMapHelper.getPOIs1 Err : ' + err)
        })

      if (bTmpFound) {
        return
      }

      await AMapHelper.getPOIs(tmpParams2)
        .then((res) => {
          if (res.data.status === '1') {
            this.updateSearchResults(res.data.pois)
          }
        })
        .catch((err) => {
          console.log('searchAMapAddrs.AMapHelper.getPOIs2 Err : ' + err)
        })
    },
    // 根据输入搜索位置信息
    async searchAddrs (addrStr, bDetail) {
      if (addrStr === '') {
        return
      }
      if (this.chooseAddr != null && bDetail !== true) {
        return
      }
      this.bShowPaln = false
      this.autoTips.Ub.style.visibility = 'hidden'
      this.updateSearchResults(null)
      await this.searchAMapAddrs(addrStr)

      await this.$axios
        .get(settingApi.enterpriseList, { params: { enterpriseName: addrStr } })
        .then((res) => {
          if (res.data.code === 0) {
            var keyDatas = res.data.data.data
            this.appendKeyResults(keyDatas)
          }
        })
        .catch((err) => {
          console.log('axios.get(settingApi.enterpriseList) Err : ' + err)
        })
    },

    // 删除搜索框中文字事件处理
    resetChooseAddr () {
      this.chooseAddr = null
      if (this.filterText === '') {
        this.updateSearchResults(null)
        this.bShowPaln = false
      }
    },

    // 显示导航页面或清理所有搜索结果项
    routeOrCloseFunc () {
      if (this.bRouteOrClose) {
        this.bShowRouteCtrl = true
        if (this.chooseAddr != null) {
          this.endPoi = this.chooseAddr.poi
          this.endText = this.endPoi.name
        }
      }
      this.filterText = ''
      this.chooseAddr = null
      this.autoTips.Ub.style.visibility = 'hidden'
      this.updateSearchResults(null)
      // this.bShowPaln = false
    },

    // 隐藏导航框
    closeRouteCtrl () {
      this.bShowRouteCtrl = false
      this.clearStartPoi()
      this.clearEndPoi()
      this.map2D.routeLayerManager.clear()
    },

    // 交换路线起始点
    swapRoutePoint () {
      this.delRoutePoint(true)
      this.delRoutePoint(false)
      const tmpStartPoi = this.endPoi
      this.endPoi = null
      const tmpEndPoi = this.startPoi
      this.startPoi = null
      this.addRoutePoint(tmpStartPoi, true)
      this.addRoutePoint(tmpEndPoi, false)
    },

    // 选择某一搜索结果显示其预案详情信息
    gotoAddrDetails (event, addr, bCallHandler = true) {
      this.lastResults = this.addrResults
      this.bShowResult = false
      this.bShowPaln = true
      this.$nextTick(() => {
        this.$refs.plan.show(addr)
      })
      if (bCallHandler) {
        this.map2D.searchLayerManager._select.getFeatures().push(addr._feature) // 此句避免位置标记右侧的弹窗不消失
        this.map2D.searchLayerManager.selectFeatureHandler(addr._feature)
      }
      this.clickDomChange()
    },

    // 在地图中鼠标移入移出标记时回调刷新列表中结果项
    updateMouseHover (addr, bHover) {
      this.addrResults.forEach((tmpAddr) => {
        if (tmpAddr._index === addr._index) {
          tmpAddr._bHover = bHover
        }
      })
    },

    // 鼠标移入移出搜索结果项
    mouseHandler (event, addr, bHover) {
      this.map2D.searchLayerManager.mouseHoverHandler(
        addr._feature,
        addr._layer,
        bHover
      )
    },

    // 处理高德地图路线数据
    updateRoutes (srcData) {
      const that = this
      const tmpStart = [this.startPoi._lon, this.startPoi._lat]
      const tmpEnd = [this.endPoi._lon, this.endPoi._lat]
      const tmpRoutes = srcData.paths
      tmpRoutes.forEach((route) => {
        const polyLintArray = []
        polyLintArray.push(tmpStart)
        route.steps.forEach((s) => {
          const polyLine = s.polyline.split(';')
          polyLine.forEach((item) => {
            const ll = item.split(',')
            const tmpLL = [+ll[0], +ll[1]]
            polyLintArray.push(tmpLL)
          })
        })
        polyLintArray.push(tmpEnd)
        that.map2D.routeLayerManager.addRoute(polyLintArray, false)
      })
    },
    // 高德地图路线规划接口
    qureyRoutes (startPoi, endPoi) {
      const tmpOrigin = startPoi._lon + ',' + startPoi._lat
      const tmpOriginId = startPoi.id
      const tmpDestination = endPoi._lon + ',' + endPoi._lat
      const tmpDestinationId = endPoi.id
      const tmpOption = {
        origin: tmpOrigin,
        destination: tmpDestination,
        originid: tmpOriginId,
        destinationid: tmpDestinationId,
        strategy: 10
      }
      AMapHelper.getRoutes(tmpOption)
        .then((res) => {
          if (res.data.status === '1') {
            this.updateRoutes(res.data.route)
          }
        })
        .catch((err) => {
          console.log('AMapHelper.getRoutes Err : ' + err)
        })
    },

    // 在路线规划层增加起始点标记 bStartOrEnd: true,Start point | false,End point
    addRoutePoint (pointPoi, bStartOrEnd) {
      if (pointPoi == null) {
        if (bStartOrEnd) {
          this.startText = ''
        } else {
          this.endText = ''
        }
        return
      }
      pointPoi._bWgs2Gcj = false
      if (bStartOrEnd) {
        this.startPoi = pointPoi
        this.startText = pointPoi.name
        this.delRoutePoint(true)
        this.startFeature = this.map2D.routeLayerManager.addPoint(
          this.startPoi,
          true
        )
      } else {
        this.endPoi = pointPoi
        this.endText = pointPoi.name
        this.delRoutePoint(false)
        this.endFeature = this.map2D.routeLayerManager.addPoint(
          this.endPoi,
          false
        )
      }
      if (this.startPoi != null && this.endPoi != null) {
        this.map2D.routeLayerManager.clearAllRoutes()
        const tmpMaxLon =
          this.startPoi._lon > this.endPoi._lon
            ? this.startPoi._lon
            : this.endPoi._lon
        const tmpMaxLat =
          this.startPoi._lat > this.endPoi._lat
            ? this.startPoi._lat
            : this.endPoi._lat
        const tmpMinLon =
          this.startPoi._lon < this.endPoi._lon
            ? this.startPoi._lon
            : this.endPoi._lon
        const tmpMinLat =
          this.startPoi._lat < this.endPoi._lat
            ? this.startPoi._lat
            : this.endPoi._lat
        this.map2D.zoomToExtent(tmpMinLon, tmpMinLat, tmpMaxLon, tmpMaxLat)
        this.map2D.zoomOut()
        this.qureyRoutes(this.startPoi, this.endPoi)
      }
    },
    // 移除起始点标记
    delRoutePoint (bStartOrEnd) {
      if (bStartOrEnd) {
        if (this.startFeature != null) {
          this.map2D.routeLayerManager.removeFeature(this.startFeature)
          this.startFeature = null
        }
      } else {
        if (this.endFeature != null) {
          this.map2D.routeLayerManager.removeFeature(this.endFeature)
          this.endFeature = null
        }
      }
    },

    // 清理起点POI信息
    clearStartPoi () {
      this.startPoi = null
      this.startText = ''
      this.autoStartTips.Ub.style.visibility = 'hidden'
      this.delRoutePoint(true)
      this.map2D.routeLayerManager.clearAllRoutes()
    },
    // 清理终点POI信息
    clearEndPoi () {
      this.endPoi = null
      this.endText = ''
      this.autoEndTips.Ub.style.visibility = 'hidden'
      this.delRoutePoint(false)
      this.map2D.routeLayerManager.clearAllRoutes()
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
      if (this.bDbClickStyle) {
        this.$emit('mapDbClickEvent')
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

    // 显示、隐藏图层
    showLayer (layerFlag, bShow) {
      if (layerFlag === 'high') {
        this.bShowHighPoint = bShow
        this.map2D.devCameraLayerManager.setLayerVisible(bShow)
      } else if (layerFlag === 'drone') {
        this.bShowDrone = bShow
        this.map2D.devDroneLayerManager.setLayerVisible(bShow)
      } else if (layerFlag === 'fire') {
        this.bShowFire = bShow
        this.map2D.devFireWarningLayerManager.setLayerVisible(bShow)
      }
    },

    // 设置基础工具条是否向上平移
    setBasicHighBottom (bHigh) {
      this.bBasicHighBottom = bHigh
    },
    // 设置基础工具条是否向上平移
    setPopoverAppendStyle (bAppend) {
      this.bAppendToBody = bAppend
    },
    // 设置Popover弹窗偏移量
    setPopoverPositionOffset (x, y) {
      this.popoverOffsetX = x
      this.popoverOffsetY = y
    },

    // 关闭切换图层的Popover
    closeAllPopover () {
      if (this.$refs.ctrlFuncLayer !== undefined) {
        this.$refs.ctrlFuncLayer.doClose()
      }
      if (this.$refs.ctrlBasicLayer !== undefined) {
        this.$refs.ctrlBasicLayer.doClose()
      }
    },
    // 弹出切换功能图层的Popover
    clickChangeFuncLayers () {
      this.closeAndOffsetPopover(
        this.$refs.ctrlBasicLayer,
        this.$refs.ctrlFuncLayer
      )
      this.$refs.selLayerCtrl.blur()
    },
    // 弹出切换底图图层的Popover
    clickChangeBasicLayers () {
      this.closeAndOffsetPopover(
        this.$refs.ctrlFuncLayer,
        this.$refs.ctrlBasicLayer
      )
      this.$refs.selMapCtrl.blur()
    },
    // 关闭和偏移Popover弹窗
    closeAndOffsetPopover (closePop, offsetPop) {
      let tmpbOffset = true
      try {
        if (offsetPop.popperElm.ariaHidden === 'false') {
          tmpbOffset = false
        }
      } catch (error) {}
      this.$nextTick(() => {
        closePop.doClose()
        if (this.bAppendToBody === false) {
          const tmpThis = this
          setTimeout(() => {
            const tmpStyle = offsetPop.popperElm.style
            tmpThis.offsetPopoverPosition(
              tmpStyle,
              tmpThis.popoverOffsetX,
              tmpThis.popoverOffsetY,
              tmpbOffset
            )
          }, 1)
        }
      })
    },
    // 偏移Popover弹窗位置
    offsetPopoverPosition (style, offsetx, offsety, bOffset) {
      let tmpLeft = style.left
      tmpLeft = tmpLeft.replace('px', '')
      tmpLeft = parseFloat(tmpLeft)
      let tmpTop = style.top
      tmpTop = tmpTop.replace('px', '')
      tmpTop = parseFloat(tmpTop)
      tmpLeft = tmpLeft + offsetx + 'px'
      tmpTop = tmpTop + offsety + 'px'
      if (bOffset) {
        style.left = tmpLeft
        style.popoverOffsetLeft = tmpLeft
        style.top = tmpTop
        style.popoverOffsetTop = tmpTop
      }
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
      const tmpLayer = this.map2D._imageLayerManager.add(tifUrl, (ly) => {
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
    },

    // 显示隐藏Layers
    setRpLayerVisible (type) {
      if (type === 'RP_Institution') {
        this.bShowRpLayerInstitution = !this.bShowRpLayerInstitution
        this.map2D.riverProtectionManager.setLayerInstitutionVisible(this.bShowRpLayerInstitution)
        if (!this.bShowRpLayerInstitution) this.map2D.riverProtectionManager.hideOverlaysByType(type)
      } else if (type === 'RP_Police') {
        this.bShowRpLayerPolice = !this.bShowRpLayerPolice
        this.map2D.riverProtectionManager.setLayerPoliceVisible(this.bShowRpLayerPolice)
        if (!this.bShowRpLayerPolice) this.map2D.riverProtectionManager.hideOverlaysByType(type)
      } else if (type === 'RP_Drone') {
        this.bShowRpLayerDrone = !this.bShowRpLayerDrone
        this.map2D.riverProtectionManager.setLayerDroneVisible(this.bShowRpLayerDrone)
        if (!this.bShowRpLayerDrone) this.map2D.riverProtectionManager.hideOverlaysByType(type)
      } else if (type === 'RP_Camera') {
        this.bShowRpLayerCamera = !this.bShowRpLayerCamera
        this.map2D.riverProtectionManager.setLayerCameraVisible(this.bShowRpLayerCamera)
        if (!this.bShowRpLayerCamera) this.map2D.riverProtectionManager.hideOverlaysByType(type)
      }
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
    .layerHigh {
      background-image: url("../../assets/images/type_high.png");
    }
    .layerDrone {
      background-image: url("../../assets/images/type_drone.png");
    }
    .layerFire {
      background-image: url("../../assets/images/type_fire.png");
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
      border: 1px #1eb0fc solid;
    }
    .mapSelText {
      color: #1eb0fc;
    }
    .layer_selected {
      height: 45px;
      width: 45px;
    }
  }
}

.gduMapMain {
  width: 100%;
  height: 100%;
  position: relative;
  .mapContainer {
    width: 100%;
    height: 100%;
    border: 0px solid transparent;
    overflow: hidden;
  }
  .radiusCorner {
    -moz-border-radius: 20px;
    border-radius: 20px;
  }
  .flatCorner {
    clip-path: polygon(
      20px 0,
      calc(100% - 20px) 0,
      100% 20px,
      100% calc(100% - 20px),
      calc(100% - 20px) 100%,
      20px 100%,
      0 calc(100% - 20px),
      0 20px
    );
  }
  .lineCursor {
    cursor: url("../../assets/images/m_line.png") 3 4, auto;
  }
  .areaCursor {
    cursor: url("../../assets/images/m_area.png") 3 2, auto;
  }
  .simpleSearchCtrl {
    position: absolute;
    //width: 400px;
    height: 32px;
    background-color: white;
    left: 15px;
    top: 15px;
    border-radius: 4px;
    border: 0px solid transparent;
    .simpleInputText {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 325px;
      height: 32px;
      border-width: 0px;
      border-radius: 4px;
      padding-left: 5px;
      padding-right: 54px; // 调整搜索提示框宽度与路线图标对齐
      background-color: white;
      outline: none;
    }
    .simpleInputSearch {
      position: absolute;
      left: 337px;
      top: 0px;
      height: 32px;
      width: 48px;
      border-width: 0px;
      border: 0px solid transparent;
      cursor: pointer;
      padding: 0px;
      margin: 0px;
      //border-left: 1px solid gray;
      background-color: #144683;
      .simpleIcon {
        margin-left: 8px;
      }
    }
    .simpleInputSearch:active {
      opacity: 0.9;
    }
  }
  .simpleSearchCtrl_Mini {
    height: 26px;
    left: 7px;
    top: 7px;
    .simpleInputText_Mini {
      width: 175px;
      height: 26px;
      padding-left: 5px;
      padding-right: 54px; // 调整搜索提示框宽度与路线图标对齐
    }
    .simpleInputSearch_Mini {
      left: 187px;
      height: 26px;
      .simpleIcon_Mini {
        margin-top: -2px;
      }
    }
  }
  .searchCtrl {
    position: absolute;
    height: 32px;
    background-color: white;
    left: 15px;
    top: 15px;
    border-radius: 4px;
    border: 0px solid transparent;
    .inputText {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 294px;
      height: 32px;
      border-width: 0px;
      border-radius: 4px;
      padding-left: 5px;
      padding-right: 102px; // 调整搜索提示框宽度与路线图标对齐
      background-color: white;
      outline: none;
    }
    .inputSearch {
      position: absolute;
      left: 306px;
      top: 0px;
      height: 32px;
      width: 48px;
      border-width: 0px;
      border: 0px solid transparent;
      cursor: pointer;
      padding: 0px;
      margin: 0px;
      background-color: #144683;
      .searchIcon {
        margin-left: 8px;
      }
    }
    .inputSearch:hover {
      opacity: 0.95;
    }
    .inputSearch:active {
      opacity: 0.9;
    }
    .inputFunc {
      position: absolute;
      left: 354px;
      top: 0px;
      height: 32px;
      width: 48px;
      border-width: 0px;
      border: 0px solid transparent;
      cursor: pointer;
      padding: 0px;
      margin: 0px;
      background-color: #144683;
      .closeIcon {
        margin-left: 8px;
      }
    }
    .inputFunc:hover {
      opacity: 0.95;
    }
    .inputFunc:active {
      opacity: 0.9;
    }
  }
  .searchResult {
    position: absolute;
    width: 400px;
    left: 15px;
    top: 60px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 4px;
    background: white;
    max-height: 500px;
    .searchItem {
      padding: 5px 5px 10px 5px;
      margin: 0px 10px;
      overflow: hidden;
      color: black;
      background: white;
      cursor: pointer;
      .keyAddr {
        float: left;
        margin-top: 5px;
        height: 16px;
        width: 16px;
        background-image: url("../../assets/images/keyAddr.png");
      }
      .itemName {
        font-size: 14px;
        margin-left: 3px;
        margin-top: 3px;
        color: rgb(63, 107, 165);
      }
      .itemAddr {
        font-size: 12px;
        margin-top: 5px;
        color: rgb(148, 157, 168);
      }
      .itemTel {
        font-size: 12px;
        margin-top: 5px;
        color: rgb(71, 76, 83);
      }
      .itemImg {
        float: right;
        height: 60px;
        width: 80px;
        margin-top: 5px;
      }
    }
    .searchItemHover {
      background: rgba($color: #f7f5f5, $alpha: 1);
    }
    .itemSeparator {
      border-top: 1px solid rgb(221, 214, 214);
    }
  }
  .routeCtrl {
    position: absolute;
    width: 400px;
    height: 100px;
    background-color: rgb(14, 217, 231);
    left: 15px;
    top: 15px;
    border-radius: 4px;
    border: 0px solid transparent;
    .routeBtn {
      position: absolute;
      height: 32px;
      width: 32px;
      border-width: 0px;
      border: 0px solid transparent;
      cursor: pointer;
      padding: 0px;
      margin: 0px;
      background-color: rgba($color: #f7f5f5, $alpha: 0.3);
    }
    .routeSwap {
      left: 10px;
      top: 31px;
      background-image: url("../../../public/assets/images/swap.png");
    }
    .routeClose {
      left: 368px;
      top: 0px;
      background-image: url("../../../public/assets/images/search_close.png");
    }
    .pointInput {
      width: 306px;
      margin-left: 52px;
      margin-top: 10px;
      .appendBtn {
        width: 48px;
      }
      .appendBtn:hover {
        color: rgb(63, 107, 165);
        opacity: 50%;
      }
      .appendBtn:active {
        color: rgb(63, 107, 165);
        opacity: 1;
      }
    }
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
    z-index: 10;
    .btnActive:active {
      opacity: 0.8;
    }
    .btnSelLayer {
      background-image: url("../../assets/images/layer_select.png");
    }
    .btnSelMap {
      background-image: url("../../assets/images/map_change.png");
    }
    .btnLocator {
      background-image: url("../../assets/images/map_locator.png");
    }
    .btnZoomIn {
      background-image: url("../../assets/images/zoomin.png");
    }
    .btnZoomOut {
      background-image: url("../../assets/images/zoomout.png");
    }
  }
  .basicToolsBottom {
    bottom: 15px;
  }
  .basicToolsBottom2 {
    bottom: 145px;
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
    .rpBottomBox {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0px;
    width: 100%;
    height: 84px;
    .rpBottomMenu {
      width: 1207px;
      height: 84px;
      background-image: url('../../assets/images/map/mapBottomMenuBg.png');
      display: flex;
      justify-content: center;
      align-items: center;
      .menuItem {
        margin-top: 10px;
        margin-left: 22px;
        margin-right: 22px;
        display: inline-block;
        cursor: pointer;
        width: 68px;
        height: 64px;
        .itemImgBox {
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          .itemImg {
            display: inline-block;
            height: 40px;
            width: 40px;
          }
          .itemInstitution {
            background-image: url('../../assets/images/map/institution.png');
          }
          .itemPolice {
            background-image: url('../../assets/images/map/police.png');
          }
          .itemDrone {
            background-image: url('../../assets/images/map/drone.png');
          }
          .itemCamera {
            background-image: url('../../assets/images/map/camera.png');
          }
        }
        .itemTextBox {
          margin-top: 2px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          .itemText {
            color: #00CCFF;
            display: inline-block;
          }
        }
      }
      .unSelectItem {
        opacity: 0.35;
      }
    }
  }
}
</style>
