<template>
  <div class="deviceMap">
    <videoMain :showLeft="showLeft" :isShowRight="isShowRight" @hideLeftNav="closeLeftNav">
      <!-- 左侧部分 -->
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:isOnline}" @click.stop="changeOnlineOrAll(true)">在线</div>
            <div :class="{active:!isOnline}" @click.stop="changeOnlineOrAll(false)">全部</div>
          </div>
          <!-- 默认展示在线设备 -->
          <template v-if="isOnline">
            <div
              class="list"
              v-for="(item,index) in onlineArray"
              :key="index"
              :class="{selected:selectedIndex==index,unman:item.deviceTypeCode==='WRJ'}"
              @click.stop="selectOnlineDeviceItem(item,index)"
            >
              <p>
                <span class="area">{{item.label}}</span>
              </p>
              <div class="btns">
                <el-button
                  v-for="(list,index2) in item.children"
                  :key="index2"
                  class="visible"
                >{{list.label}}</el-button>
              </div>
            </div>
          </template>
          <!-- 全部部分 -->
          <template v-else>
            <div class="search">
              <el-input
                type="text"
                v-model.trim="filterDevice"
                placeholder="请输入设备名称"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>
            <tree-data
              :treeData="treeData"
              ref="tree"
              :isLiveTree="false"
              @clickAnDeviceItem="clickAnDeviceItem"
            ></tree-data>
          </template>
          <div
            v-if="(isOnline&&onlineArray.length===0)||!isOnline&&treeData.length===0"
            class="empty"
          >暂无数据</div>
        </div>
      </div>
      <div slot="center">
        <div class="video">
          <div class="deviceMapBox">
            <div class="title">
              <img src="@/assets/images/back.png" @click.stop="$router.go(-1)" />设备地图
            </div>
            <div class="container">
              <gMap
                ref="gduMap"
                handleType="devMap"
                :bShowSimpleSearchTools="true"
                :bShowBasic="true"
                :bShowMeasure="false"
              ></gMap>
            </div>
          </div>
        </div>
      </div>
    </videoMain>
  </div>
</template>
<script>
import VideoMain from './components/main'
import TreeData from './components/tree'
import videoMixin from './mixins/videoMixin'
import { EventBus } from '@/utils/eventBus.js'
export default {
  name: 'deviceMap',
  components: {
    VideoMain,
    TreeData
  },
  mixins: [videoMixin],
  data () {
    return {
      isShowRight: false
    }
  },
  methods: {
    // 在线或所有设备切换
    changeOnlineOrAll (isOnline) {
      if (Number(this.isOnline) === Number(isOnline)) return
      this.isOnline = isOnline
      // 如果选择在线设备
      if (this.isOnline) {
        const divs = document.querySelectorAll('.el-tree-node')
        for (let i = 0; i < divs.length; i++) {
          divs[i].classList.remove('is-current')
        }
      } else {
        this.selectedIndex = 200 // 激活在线设备 初始值200，不激活
        this.onlineArray.forEach(item => {
          item.children.forEach(list => {
            list.isSelected = false
          })
        })
      }
    },
    // 定位地图中设备位置
    showDeviceDetailInfo (item) {
      this.$refs.gduMap.map2D.devCameraLayerManager.resetSelectedFeature()
      this.$refs.gduMap.map2D.devDroneLayerManager.resetSelectedFeature()
      this.$refs.gduMap.map2D.devFireWarningLayerManager.resetSelectedFeature()
      if (item.deviceTypeCode === 'GDJK') {
        this.$refs.gduMap.showLayer('high', true)
        this.$refs.gduMap.map2D.devCameraLayerManager.selectFeatureByID(item)
      } else if (item.deviceTypeCode === 'WRJ') {
        this.$refs.gduMap.showLayer('drone', true)
        this.$refs.gduMap.map2D.devDroneLayerManager.selectFeatureByID(item)
      }
      this.$refs.gduMap.map2D.zoomToCenter(
        item.deviceLongitude,
        item.deviceLatitude
      )
    },
    // 点击在线设备中红外光或可见光
    selectOnlineDeviceItem (item, index) {
      this.showDeviceDetailInfo(item)
      this.selectedIndex = index
    },
    // 点击全部设备列表中设备项
    clickAnDeviceItem (curDeviceInfo) {
      this.showDeviceDetailInfo(curDeviceInfo)
    },
    // 加载显示高点设备、无人机位置标记
    initMapDevices () {
      if (
        this.$refs.gduMap !== undefined &&
        this.$refs.gduMap.map2D !== undefined
      ) {
        this.$refs.gduMap.map2D.devCameraLayerManager.addDevices(
          this.cameraDevArray
        )
        this.$refs.gduMap.map2D.devDroneLayerManager.addDevices(
          this.droneDevArray
        )
      }
    },
    // 高点设备、无人机状态更新(地图标记)
    updateDeviceStatus (info) {
      if (
        this.$refs.gduMap !== undefined &&
        this.$refs.gduMap.map2D !== undefined
      ) {
        if (info.deviceTypeCode === 'GDJK') {
          this.$refs.gduMap.map2D.devCameraLayerManager.addOrUpdateDevice(info)
        } else if (info.deviceTypeCode === 'WRJ') {
          this.$refs.gduMap.map2D.devDroneLayerManager.addOrUpdateDevice(info)
        }
      }
    }
  },
  created () {
    EventBus.$on('GetAllDeptDevices_Done', bFlag => {
      this.initMapDevices()
    })
    EventBus.$on('UpdateDeviceOnlineStatus', info => {
      this.updateDeviceStatus(info)
    })
  },
  mounted () {
    this.$refs.gduMap.showLayer('fire', false)
  }
}
</script>
<style lang="less" scoped>
.deviceMap {
  box-sizing: border-box;
  .leftContainer {
    box-sizing: border-box;
    padding: 27px 0 0 28px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;

    div.tab {
      display: flex;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      width: 230px;
      color: #23cefd;
      background: #1a3e68;
      text-align: center;
      div {
        width: 104px;
      }
      div.active {
        width: 126px !important;
        color: #fff;
      }
      div:nth-child(1).active {
        background: url(../../assets/images/left.png) no-repeat;
      }
      div:nth-child(2).active {
        background: url(../../assets/images/right.png) no-repeat;
      }
    }
    div.search {
      width: 230px;
      margin-top: 20px;
      background: #10203b;
      /deep/ .el-input__inner {
        background: #10203b;
        border: 1px solid #1eb0fc;
        color: #1eb0fc;
      }

      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #1eb0fc;
      }
    }
    div.list {
      cursor: pointer;
      margin-top: 20px;
      padding-left: 10px;
      padding-top: 10px;
      height: 72px;
      background: url(../../assets/images/list-unselected.png) no-repeat;
      width: 230px;
      box-sizing: border-box;
      p {
        margin-bottom: 8px;
        color: #1eb0fc;
        i {
          display: inline-block;
          width: 17px;
          height: 10px;
          background: url(../../assets/images/live.png) no-repeat;
          margin-left: 12px;
        }
      }
      div.btns {
        button {
          font-size: 12px;
          font-weight: bold;
          box-sizing: border-box;
          width: 74px;
          height: 22px;
          line-height: 22px;
          border: 1px solid rgba(30, 176, 252, 1);
          padding: 0;
          background: #10243f;
          color: #1eb0fc;
          text-align: right;
          padding-right: 8px;
          vertical-align: middle;
        }
        button.visible {
          background: url(../../assets/images/visible.png) no-repeat 4px center;
        }
        button.visibleSelected {
          background: url(../../assets/images/visible_selected.png) no-repeat
            4px center;
        }
      }
    }
    div.selected {
      background: url(../../assets/images/list-selected.png) no-repeat;
    }
    div.list.unman {
      background: url(../../assets/images/unman_unselected.png) no-repeat;
    }
    div.list.unman.selected {
      background: url(../../assets/images/unman_selected.png) no-repeat;
    }
    div.empty {
      position: relative;
      min-height: 60px;
      text-align: center;
      width: 100%;
      height: 100%;
      color: #909399;
      line-height: 60px;
      font-size: 14px;
    }
  }
  .video {
    box-sizing: border-box;
    padding: 21px 0px 21px 21px;
    // position: relative;
    .deviceMapBox {
      // display: flex;
      // justify-content: space-between;
      margin-right: 24px;
      > .title {
        width: 128px;
        height: 36px;
        border: 1px solid rgba(57, 164, 221, 1);
        text-align: center;
        // width: 202px;
        // height: 45px;
        // background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 36px;
        // padding-left: 30px;
        margin-bottom: 20px;
        img {
          margin-right: 10px;
          cursor: pointer;
          vertical-align: middle;
        }
      }
      .container {
        height: 785px;
        position: relative;
      }
    }
  }
}
</style>
