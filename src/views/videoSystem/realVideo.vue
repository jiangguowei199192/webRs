<template>
  <div class="videoContainer" onload onresize>
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <!-- 左侧部分 -->
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:isOnline}" @click.stop="changeOnlineOrAll(true)">在线</div>
            <div :class="{active:!isOnline}" @click.stop="changeOnlineOrAll(false)">全部</div>
          </div>
          <!-- 默认展示在线设备 -->
          <template v-if="isOnline">
            <div class="onlineList webFsScroll">
            <div
              class="list"
              v-for="(item,index1) in onlineArray"
              :key="index1"
              :class="{selected:selectedIndex==index1,unman:item.deviceTypeCode==='WRJ'}"
            >
              <p>
                <span class="area">{{item.label}}</span>
                <i
                  v-show="item.children&&item.children.some(child=>{return child.isSelected==true})"
                ></i>
              </p>
              <div class="btns" >
                <!-- <div > -->
                <el-button
                  v-for="(list,index2) in item.children"
                  :key="index2"
                  :class="{visible:!list.isSelected,visibleSelected:list.isSelected}"
                  :style="{backgroundColor:list.isSelected?'rgba(0,212,15,1)':'',color:list.isSelected?'#fff':'#1EB0FC'}"
                  @click.stop="playDeviceVideo(item,list,index1,index2)"
                  :title="list.label"
                >{{list.label&&list.label.length>3?list.label.slice(0,3)+'..':list.label?list.label:'-'}}</el-button>
                <!-- <el-button
                    :class="{infrared:list.label==='可见光'}"
                    :style="{backgroundColor:item.infraredIsclick?'rgba(0,212,15,1)':''}"
                    @click.stop="changeStatus(2,index)"
                >{{list.label}}</el-button>-->
                <!-- </div> -->
              </div>
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
            <tree-data :treeData="treeData" ref="tree" @videoChange="playOrClose"></tree-data>
          </template>
          <div
            v-if="(isOnline&&onlineArray.length===0)||!isOnline&&treeData.length===0"
            class="empty"
          >暂无数据</div>
        </div>
      </div>
      <!-- 中间视频部分 -->
      <div slot="center">
        <div class="video">
          <div class="box">
            <div class="title">直播</div>
            <div class="info">
              <div
                class="curSelected"
                v-show="curSelectedVideo.labelTotal"
              >当前选中:{{curSelectedVideo.labelTotal}}</div>
              <div class="warning" @click.stop="$router.push({name:'fireAlarm'})">
                <img :src="firePic" alt />
                监控报警
                <b>{{ fireWarningArray.length }}</b>个
              </div>
            </div>
          </div>
          <div class="videoList" ref="videoList" :class="{videolistFullscreen:dialogVisible}">
            <div
              v-for="(item,index) in curVideosArray"
              :key="index"
              :style="machineStatusStyle1(showVideoPageSize)"
            >
              <div
                @click.stop="operateCurVideo(item,index)"
                :class="{active:curVideoIndex===index}"
                ref="video"
              >
                <VideoWall
                  :videoInfo.sync="item"
                  :key="index"
                  v-if="item.streamUrl"
                  ref="videoCtrl"
                  @fullscreenvideo="fullscreenvideo"
                  :playerWidth="playerWidth"
                  :playerHeight="playerHeight"
                ></VideoWall>
              </div>
            </div>
          </div>
          <!-- 下面按钮部分 -->
          <div class="tools">
            <div class="leftTool">
              <img
                :src="palace==9?nineSelectedPalace:ninePalace"
                @click.stop="changeVideosType(9)"
                title="9宫格"
              />
              <img
                :src="palace==4?fourSelectedPalace:fourPalace"
                @click.stop="changeVideosType(4)"
                title="4宫格"
              />
              <img
                :src="palace==1?oneSelectedPalace:onePalace"
                @click.stop="changeVideosType(1)"
                title="1宫格"
              />
              <img :src="photoClicked?photoSelected:photo" @click.stop="showImg" title="抓取" />
              <img
                :src="mapClicked?mapSelected:map"
                @click.stop="mapClicked=true;$router.push({name:'deviceMap'})"
                title="设备地图"
              />
              <!-- 用于显示截取的图片 -->
              <img
                :src="`${picUrl}${cutImgUrl}`"
                alt
                id="pic"
                v-show="showCutImg"
                @click.stop="cutDialogVisible=true"
              />
            </div>
            <div class="rightTool">
              <img
                :src="!isPlayAll?playAll:closeAll"
                @click.stop="playAllVideos"
                :title="!isPlayAll?'预览全部':'取消预览全部'"
              />
              <div class="pagination">
                <el-pagination
                  :page-size="showVideoPageSize"
                  layout="prev,next"
                  :total="totalVideosArray.length"
                  :current-page.sync="currentPage"
                  @prev-click="pre"
                  @next-click="next"
                ></el-pagination>
              </div>

              <img
                :src="!dialogVisible?fullScreen:fullScreenSelected"
                :title="!dialogVisible?'全屏':'取消全屏'"
                @click.stop="openDialog()"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧部分 -->
      <div slot="right">
        <div class="rightContent">
          <div class="baseInfo">
            <div class="info">基本信息</div>
            <div class="detail">
              <ul v-show="Object.keys(curSelectedVideo).length>0">
                <li>
                  <span>设备名称：</span>
                  <span>{{curSelectedVideo.parentLabel||'-'}}</span>
                </li>
                <li>
                  <span>设备编号：</span>
                  <span>{{curSelectedVideo.deviceCode||'-'}}</span>
                </li>
                <li>
                  <span>设备品牌：</span>
                  <span>{{curSelectedVideo.deviceBrand||'-'}}</span>
                </li>
                <!-- <li>
                  <span>设备状态：</span>
                  <span>xxx</span>
                </li>-->
                <li>
                  <span>所在地点：</span>
                  <span>{{curSelectedVideo.deviceAddress||'-'}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="deviceInfo" v-show="curSelectedVideo.deviceTypeCode==='GDJK'">
            <div class="info">云台</div>
            <div class="operate">
              <div class="icons">
                <!-- <div></div>
                <div ></div>
                <div ></div>
                <div ></div>
                <div ></div>
                <div ></div>
                <div ></div>
                <div></div>
                <div></div>-->
                <div
                  v-for="(item,index) in 9"
                  :key="index"
                  @mousedown="startChange(index)"
                  @mouseup="stopChange(index)"
                ></div>
              </div>
              <!-- 国标 -->
              <!-- <div class="btns">
                <div>
                  <span @mousedown="startChange(1000,true)" @mouseup="stopChange">+</span>
                  <b>变倍</b>
                  <span @mousedown="startChange(1001,true)" @mouseup="stopChange">-</span>
                </div>
                <div>
                  <span @mousedown="startFocusLris(1002)" @mouseup="stopFocusLris">+</span>
                  <b>变焦</b>
                  <span @mousedown="startFocusLris(1003)" @mouseup="stopFocusLris">-</span>
                </div>
                <div>
                  <span @mousedown="startFocusLris(1004)" @mouseup="stopFocusLris">+</span>
                  <b>光圈</b>
                  <span @mousedown="startFocusLris(1005)" @mouseup="stopFocusLris">-</span>
                </div>
              </div>-->
              <!-- sdk -->
              <div class="btns">
                <div>
                  <span @mousedown="startChange(1000)" @mouseup="stopChange(1000)">+</span>
                  <b>变倍</b>
                  <span @mousedown="startChange(1001)" @mouseup="stopChange(1001)">-</span>
                </div>
                <div>
                  <span @mousedown="startChange(1002)" @mouseup="stopChange(1002)">+</span>
                  <b>变焦</b>
                  <span @mousedown="startChange(1003)" @mouseup="stopChange(1003)">-</span>
                </div>
                <div>
                  <span @mousedown="startChange(1004)" @mouseup="stopChange(1004)">+</span>
                  <b>光圈</b>
                  <span @mousedown="startChange(1005)" @mouseup="stopChange(1005)">-</span>
                </div>
              </div>
              <div class="slider">
                <span class="demonstration">步速</span>
                <el-slider
                  v-model="step"
                  :min="1"
                  :max="8"
                  style="width:98px;margin-left:16px;margin-right:16px;"
                ></el-slider>
                <span>{{step}}</span>
              </div>
              <div class="sliderTip">步速值范围为1-8之间</div>
            </div>
          </div>
          <div class="deviceInfo" v-show="curSelectedVideo.deviceTypeCode==='WRJ'">
            <div class="info">位置</div>
            <div class="mapBox">
              <gMap
                ref="gduMap"
                handleType="devMap"
                :bShowSimpleSearchTools="false"
                :bShowBasic="false"
                :bShowMeasure="false"
                :bShowLonLat="false"
                :bAutoLocate="false"
              ></gMap>
            </div>
          </div>
        </div>
      </div>
    </VideoMain>
  <!-- 弃用 -->
    <!-- <div class="fullContainer" v-if="dialogVisible" id="d1" ref="fullContainer">
      <div
        :style="machineStatusStyle1(showVideoPageSize)"
        v-for="(item,index) in fullVideoArray"
        :key="index"
      >
        <div
          @click="fulllIndex=index"
          :class="{active:fulllIndex==index}"
        >
          <VideoWall
            :videoInfo="item"
            :key="index"
            ref="playerCtrl"
            v-if="item.streamUrl"
            @fullscreenvideo="fullscreenvideo"
          ></VideoWall>
        </div>
      </div>
    </div> -->

    <el-dialog
      :visible.sync="cutDialogVisible"
      class="cutDialog"
      :close-on-click-modal="false"
      :show-close="false"
      :before-close="clearRemark"
    >
      <img :src="`${picUrl}${cutImgUrl}`" width="743px" height="428px" alt />
      <span slot="footer" class="dialog-footer">
        <div class="remark">
          <div class="replain">
            <span>说明：</span>
            <el-input v-model.trim="remark" placeholder="请输入" :maxlength="27"></el-input>
          </div>
          <div>
            <el-button @click="cutDialogVisible = false;remark=''" style="width:87px;">取 消</el-button>
            <el-button type="primary" @click.stop="confirm" style="width:87px;">确 定</el-button>
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import VideoMain from './components/main'
import TreeData from './components/tree'
import videoMixin from './mixins/videoMixin'
import fireMixin from '../../utils/fireMixin'
import droneInfoMixin from '../../utils/droneInfoMixin'
import VideoWall from './components/videoWall'
import { api } from '@/api/videoSystem/realVideo'
import globalApi from '../../utils/globalApi'
import { throttle, debounce } from '../../utils/public.js'
import { EventBus } from '@/utils/eventBus.js'
import MqttService from '@/utils/mqttService'

export default {
  name: 'videoContainer',
  components: {
    VideoMain,
    TreeData,
    VideoWall
  },
  data () {
    return {
      playerWidth: '',
      playerHeight: '',
      picUrl: globalApi.baseUrl + '/video-service2', // 图片前缀
      curScreenInfo: {}, // 保存当前双击的视频信息
      firePic: require('@/assets/images/fire.png'),
      palace: 9, // 默认选中9宫格
      zoomSpeed: 0, // 变倍
      focusSpeed: 0, // 变焦
      lrisSpeed: 0, // 光圈
      mapClicked: false, // 设备地图
      photoClicked: false, // 拍照
      showCutImg: false,
      cutImgUrl: '', // 显示抓取的图片
      dialogVisible: false, // 全屏弹窗
      cutDialogVisible: false, // 抓取弹窗
      remark: '', // 说明文字
      currentPage: 1, // 默认第1页
      totalVideosArray: [], // 总共的数据
      curVideosArray: [], // 当前展示的数据
      showVideoPageSize: 9, // 每屏显示视频的个数 默认9宫格
      curVideoIndex: 1000,
      step: 4, // 步速值
      recordNums: {
        leftUp: 0,
        up: 0,
        rightUp: 0,
        left: 0,
        right: 0,
        leftDown: 0,
        down: 0,
        rightDown: 0,
        zoomAdd: 0,
        zoomMinus: 0,
        focusAdd: 0,
        focusMinus: 0,
        lrisAdd: 0,
        lrisMinus: 0

      },
      isPlayAll: false, // 是否播放所有 控制预览全部
      curSelectedVideo: {}, // 当前选中
      imgId: '', // 保存抓取图片id
      bHasFullVideo: false // 有全屏播放视频
    }
  },
  mixins: [videoMixin, fireMixin, droneInfoMixin],
  methods: {
    // 在线或所有设备切换
    changeOnlineOrAll (isOnline) {
      if (Number(this.isOnline) === Number(isOnline)) return
      // this.getAllDeptDevices()
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
      this.currentPage = 1 // 默认第1页
      this.showVideoPageSize = 9 // 每屏显示视频的个数 默认9宫格
      this.palace = 9 // 默认选中9宫格
      this.zoomSpeed = 0 // 变倍
      this.focusSpeed = 0 // 变焦
      this.lrisSpeed = 0 // 光圈
      this.recordNums = {
        leftUp: 0,
        up: 0,
        rightUp: 0,
        left: 0,
        right: 0,
        leftDowm: 0,
        dowm: 0,
        rightDown: 0,
        zoomAdd: 0,
        zoomMinus: 0,
        focusAdd: 0,
        focusMinus: 0,
        lrisAdd: 0,
        lrisMinus: 0
      }
      this.step = 4 // 步速值
      this.mapClicked = false // 设备地图
      this.photoClicked = false // 拍照
      this.isPlayAll = false // 是否播放所有 控制预览全部
      this.curVideoIndex = 1000 // 默认不选中
      this.curSelectedVideo = {} // 当前选中
      this.init()
    },
    // 点击在线设备中红外光或可见光
    playDeviceVideo (item, list, index1, index2) {
      const curData = Object.assign({}, list, {
        isShowOperate: false,
        deviceCode: item.id,
        deviceAddress: item.deviceAddress,
        deviceBrand: item.deviceBrand,
        parentLabel: item.label,
        labelTotal: item.label + '-' + list.label
      })
      console.log(curData)
      if (!this.onlineArray[index1].children[index2].isSelected) {
        // 关闭其它所有的选中状态
        // this.onlineArray.forEach(item => {
        //   if (item.children && item.children.length > 0) {
        //     item.children.forEach(list => {
        //       list.isSelected = false
        //     })
        //   }
        // })
        this.selectedIndex = index1
        this.$set(
          this.onlineArray[index1].children[index2],
          'isSelected',
          true
        )
        this.playOrClose(1, curData)
      } else {
        this.$set(
          this.onlineArray[index1].children[index2],
          'isSelected',
          false
        )
        // const result = this.onlineArray[index1].children.some(child => {
        //   return child.isSelected === true
        // })
        // 只要有一个被选中
        // if (result) {
        //   this.selectedIndex = index1
        // } else {
        //   this.selectedIndex = 200
        // }
        // 只要有关闭，则不选中任何 和树结构保持一致
        this.selectedIndex = 200
        this.playOrClose(2, curData)
      }
    },
    // 清除其它按钮的记录次数
    clearRecord (curKey) {
      for (const key in this.recordNums) {
        if (key !== curKey) {
          this.recordNums[key] = 0
        }
      }
    },
    // 按钮和变倍的鼠标按下事件
    // startChange (index, isInOut = false) {
    //   const params = {}
    //   if (!isInOut) {
    //     switch (index) {
    //       case 0:
    //         ++this.recordNums.leftUp
    //         this.clearRecord('leftUp')
    //         // 左上
    //         params.leftRight = 1
    //         params.upDown = 1
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.leftUp > 255
    //             ? 255
    //             : this.step * this.recordNums.leftUp
    //         params.zoomSpeed = 0
    //         console.dir(params)
    //         this.changeViewVideo(1, params)
    //         break
    //       case 1:
    //         ++this.recordNums.up
    //         this.clearRecord('up')
    //         // 上移
    //         params.upDown = 1
    //         params.leftRight = 0
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.up > 255
    //             ? 255
    //             : this.step * this.recordNums.up
    //         params.zoomSpeed = 0
    //         console.dir(params)
    //         this.changeViewVideo(1, params)
    //         break
    //       case 2:
    //         ++this.recordNums.rightUp
    //         this.clearRecord('rightUp')
    //         // 右上
    //         params.leftRight = 2
    //         params.upDown = 1
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.rightUp > 255
    //             ? 255
    //             : this.step * this.recordNums.rightUp
    //         params.zoomSpeed = 0
    //         console.dir(params)
    //         this.changeViewVideo(1, params)
    //         break
    //       case 3:
    //         ++this.recordNums.left
    //         this.clearRecord('left')
    //         // 左
    //         params.leftRight = 1
    //         params.upDown = 0
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.left > 255
    //             ? 255
    //             : this.step * this.recordNums.left
    //         params.zoomSpeed = 0
    //         this.changeViewVideo(1, params)
    //         console.dir(params)
    //         break
    //       case 4:
    //         break
    //       case 5:
    //         ++this.recordNums.right
    //         this.clearRecord('right')
    //         // 右
    //         params.leftRight = 2
    //         params.upDown = 0
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.right > 255
    //             ? 255
    //             : this.step * this.recordNums.right
    //         params.zoomSpeed = 0
    //         console.dir(params)
    //         this.changeViewVideo(1, params)
    //         break
    //       case 6:
    //         ++this.recordNums.leftDown
    //         this.clearRecord('leftDown')
    //         // 左下
    //         params.leftRight = 1
    //         params.upDown = 2
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.leftDown > 255
    //             ? 255
    //             : this.step * this.recordNums.leftDown
    //         params.zoomSpeed = 0
    //         console.dir(params)
    //         this.changeViewVideo(1, params)
    //         break
    //       case 7:
    //         ++this.recordNums.down
    //         this.clearRecord('down')
    //         // 下
    //         params.upDown = 2
    //         params.leftRight = 0
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.down > 255
    //             ? 255
    //             : this.step * this.recordNums.down
    //         params.zoomSpeed = 0
    //         console.dir(params)
    //         this.changeViewVideo(1, params)
    //         break
    //       case 8:
    //         ++this.recordNums.rightDown
    //         this.clearRecord('rightDown')
    //         // 右下
    //         params.leftRight = 2
    //         params.upDown = 2
    //         params.inOut = 0
    //         params.moveSpeed =
    //           this.step * this.recordNums.rightDown > 255
    //             ? 255
    //             : this.step * this.recordNums.rightDown
    //         params.zoomSpeed = 0
    //         this.changeViewVideo(1, params)
    //         console.dir(params)
    //         break
    //       default:
    //         break
    //     }
    //   } else {
    //     // 变倍
    //     params.leftRight = 0
    //     params.upDown = 0
    //     params.moveSpeed = 0
    //     if (index === 1000) {
    //       params.inOut = 2
    //       params.zoomSpeed = this.zoomSpeed++ > 15 ? 15 : this.zoomSpeed
    //     } else {
    //       params.inOut = 1
    //       this.zoomSpeed--
    //       this.zoomSpeed = this.zoomSpeed < 0 ? 0 : this.zoomSpeed
    //       params.zoomSpeed = this.zoomSpeed
    //     }
    //     this.changeViewVideo(1, params)
    //     console.log(params)
    //   }
    // },
    // 按钮和变倍的鼠标弹起停止控制
    // stopChange () {
    //   const params = {}
    //   params.leftRight = 0
    //   params.upDown = 0
    //   params.inOut = 0
    //   params.moveSpeed = 0
    //   params.zoomSpeed = 0
    //   console.log('停止')
    //   console.dir(params)
    //   this.changeViewVideo(1, params)
    // },
    // 变焦和光圈鼠标按下事件
    // startFocusLris (type) {
    //   const params = {}
    //   if (type === 1002) {
    //     params.focus = 2
    //     params.focusSpeed = this.focusSpeed++ > 255 ? 255 : this.focusSpeed
    //     params.lris = 0
    //     params.lrisSpeed = 0
    //   } else if (type === 1003) {
    //     params.focus = 1
    //     this.focusSpeed--
    //     this.focusSpeed = this.focusSpeed < 0 ? 0 : this.focusSpeed
    //     params.focusSpeed = this.focusSpeed
    //     params.lris = 0
    //     params.lrisSpeed = 0
    //   } else if (type === 1004) {
    //     params.lris = 2
    //     params.lrisSpeed = this.lrisSpeed++ > 255 ? 255 : this.lrisSpeed
    //     params.focus = 0
    //     params.focusSpeed = 0
    //   } else if (type === 1005) {
    //     params.lris = 1
    //     this.lrisSpeed--
    //     this.lrisSpeed = this.lrisSpeed < 0 ? 0 : this.lrisSpeed
    //     params.lrisSpeed = this.lrisSpeed
    //     params.focus = 0
    //     params.focusSpeed = 0
    //   }
    //   console.log(params)
    //   this.changeViewVideo(2, params)
    // },
    // 变焦和光圈鼠标松开事件
    // stopFocusLris () {
    //   const params = {
    //     lris: 0,
    //     lrisSpeed: 0,
    //     focus: 0,
    //     focusSpeed: 0
    //   }
    //   this.changeViewVideo(2, params)
    // },
    // 云台操作按钮的请求
    // changeViewVideo (type, params) {
    //   if (type === 1) {
    //     this.$axios
    //       .post(
    //         '/api/ptz/' + '34020000001320000003' + '/' + '34020000001310000004',
    //         params
    //       )
    //       .then(res => {
    //         if (res && res.data && res.data.code === 0) {
    //           console.log('控制成功了')
    //         }
    //       })
    //   } else {
    //     this.$axios
    //       .post(
    //         '/api/fi/' +
    //           this.curSelectedVideo.deviceCode +
    //           '/' +
    //           this.curSelectedVideo.id,
    //         params
    //       )
    //       .then(res => {
    //         if (res && res.data && res.data.code === 0) {
    //           console.log('控制成功了')
    //         }
    //       })
    //   }
    // },
    // 鼠标按下
    startChange: debounce(function (index) {
      const params = {
        device_id: this.curSelectedVideo.deviceCode,
        channel_id: this.curSelectedVideo.streamType
      }
      switch (index) {
        case 0:
          // 左上
          params.cmd_type = 32
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1:
          // 上移
          params.cmd_type = 0
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 2:
          // 右上
          params.cmd_type = 33
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 3:
          // 左移
          params.cmd_type = 2
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 4:
          break
        case 5:
          // 右移
          params.cmd_type = 3
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 6:
          // 左下
          params.cmd_type = 34
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 7:
          // 下
          params.cmd_type = 1
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 8:
          // 右下
          params.cmd_type = 35
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1000:
          // 变倍+
          params.cmd_type = 4
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1001:
          // 变倍-
          params.cmd_type = 5
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1002:
          // 变焦+
          params.cmd_type = 6
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1003:
          // 变焦-
          params.cmd_type = 7
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1004:
          // 光圈+
          params.cmd_type = 8
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1005:
          // 光圈-
          params.cmd_type = 9
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        default:
          break
      }
    }, 500),
    // 鼠标松开
    stopChange: debounce(function (index) {
      if (index === 4) return
      const params = {
        device_id: this.curSelectedVideo.deviceCode,
        channel_id: this.curSelectedVideo.streamType,
        stop: 1,
        step: 0,
        cmd_type: ''
      }
      switch (index) {
        case 0:
          // 左上
          params.cmd_type = 32
          break
        case 1:
          // 上移
          params.cmd_type = 0
          break
        case 2:
          // 右上
          params.cmd_type = 33
          break
        case 3:
          // 左移
          params.cmd_type = 2
          break
        case 4:
          break
        case 5:
          // 右移
          params.cmd_type = 3
          break
        case 6:
          // 左下
          params.cmd_type = 34
          break
        case 7:
          // 下
          params.cmd_type = 1
          break
        case 8:
          // 右下
          params.cmd_type = 35
          break
        case 1000:
          // 变倍+
          params.cmd_type = 4
          break
        case 1001:
          // 变倍-
          params.cmd_type = 5
          break
        case 1002:
          // 变焦+
          params.cmd_type = 6
          break
        case 1003:
          // 变焦-
          params.cmd_type = 7
          break
        case 1004:
          // 光圈+
          params.cmd_type = 8
          break
        case 1005:
          // 光圈-
          params.cmd_type = 9
          break
      }
      console.log(params)
      this.changeViewVideo(params)
    }, 500),
    // 云台操作
    changeViewVideo (params) {
      this.$axios.post('/video-service2/index/api/ptzConrol', params).then(res => {
        if (res && res.data && res.data.code === 0) {
          console.log('操作成功了！')
        }
      })
    },
    refreshMap (video) {
      if (video !== undefined && video !== null) {
        if (video.deviceTypeCode === 'WRJ') {
          this.setDroneDevCode(video.deviceCode)
          const tmpMap = this.$refs.gduMap.map2D
          setTimeout(() => {
            tmpMap._map.updateSize()
          }, 1)
        }
      }
    },
    // 点击树节点,播放或关闭当前视频
    playOrClose (type, curTreeData) {
      // 1.添加
      if (type === 1) {
        new MqttService().client.send('video/start/algorithm', JSON.stringify({ deviceCode: curTreeData.deviceCode, channelId: curTreeData.streamType, streamUrl: curTreeData.streamUrl, isOpen: 1 }))
        this.curSelectedVideo = JSON.parse(JSON.stringify(curTreeData))
        console.log('当前选中', this.curSelectedVideo)
        this.refreshMap(curTreeData)
        // 1.1默认位置添加
        if (this.curVideoIndex === 1000) {
          const i = this.totalVideosArray.indexOf('')
          // 如果有空元素，则替换
          if (i !== -1) {
            this.totalVideosArray.splice(i, 1, curTreeData)
            // 防止添加的视频不在当前页
            const startI = Math.floor(i / this.showVideoPageSize)
            // this.curVideosArray = this.totalVideosArray.slice(
            //   (this.currentPage - 1) * this.showVideoPageSize,
            //   this.currentPage * this.showVideoPageSize
            // )
            this.curVideosArray = this.totalVideosArray.slice(
              startI * this.showVideoPageSize,
              (startI + 1) * this.showVideoPageSize
            )
            this.currentPage = startI + 1
          } else {
            // 若没有空元素，则追加
            this.totalVideosArray.push(curTreeData)
            // this.curVideosArray = this.totalVideosArray.slice(
            //   0,
            //   this.showVideoPageSize
            // )
            // 防止当前播放不在最后一页
            this.currentPage = Math.ceil(this.totalVideosArray.length / this.showVideoPageSize)
            this.next(this.currentPage)
          }
        } else {
          // 1.2指定位置添加
          // 若指定位置之前有元素，去掉其对应树节点激活的样式
          if (this.curVideosArray[this.curVideoIndex]) {
            if (!this.isOnline) {
              document
                .querySelector(
                  '#liveVideo' + this.curVideosArray[this.curVideoIndex].id
                )
                .parentElement.setAttribute('class', '')
              document
                .querySelector(
                  '#liveVideo' + this.curVideosArray[this.curVideoIndex].id
                )
                .parentElement.parentElement.parentElement.parentElement.classList.remove(
                  'is-current'
                )
            } else {
              this.onlineArray.forEach((list, index1) => {
                list.children.forEach((child, index2) => {
                  if (child.id === this.curVideosArray[this.curVideoIndex].id) {
                    this.$set(
                      this.onlineArray[index1].children[index2],
                      'isSelected',
                      false
                    )
                  }
                })
              })
            }
          }
          // 防止有分页的情况（分屏之后的curVideoIndex从0开始）
          const index =
            this.curVideoIndex +
            this.showVideoPageSize * (this.currentPage - 1)
          this.totalVideosArray.splice(index, 1, curTreeData)
          this.curVideoIndex = 1000
          this.curVideosArray = this.totalVideosArray.slice(
            (this.currentPage - 1) * this.showVideoPageSize,
            this.currentPage * this.showVideoPageSize
          )
        }
      } else {
        new MqttService().client.send('video/stop/algorithm', JSON.stringify({ deviceCode: curTreeData.deviceCode, channelId: curTreeData.streamType, streamUrl: curTreeData.streamUrl, isOpen: 0 }))
        // 2.关闭视频 如果关闭的是显示的视频
        // if (curTreeData.id === this.curSelectedVideo.id) {
        this.curSelectedVideo = {}
        this.curVideoIndex = 1000
        // }
        this.totalVideosArray.forEach((item, index) => {
          if (item.id === curTreeData.id) {
            this.totalVideosArray.splice(index, 1, '')
          }
        })
        this.curVideosArray = this.totalVideosArray.slice(
          (this.currentPage - 1) * this.showVideoPageSize,
          this.currentPage * this.showVideoPageSize
        )
        // 关闭时如果都没有视频了，则显示全部预览按钮
        let n = 0
        this.curVideosArray.forEach(item => {
          if (item) {
            n = 1
          }
        })
        if (n === 0) {
          this.isPlayAll = false
        }
      }
      // this.addTitle()
    },
    // 点击当前视频
    operateCurVideo (curVideo, index) {
      this.curVideoIndex = index
      if (curVideo.deviceTypeCode === 'WRJ') {
        this.setDroneDevCode(curVideo.deviceCode)
        const tmpMap = this.$refs.gduMap.map2D
        setTimeout(() => {
          tmpMap._map.updateSize()
        }, 1)
      }
      // 如果不是空白区域，给对应的数结构添加样式
      if (this.curVideosArray[this.curVideoIndex]) {
        this.curSelectedVideo = curVideo
        // 点击当前视频区域，默认去掉所有激活的样式
        if (!this.isOnline) {
          const divs = document.querySelectorAll('.el-tree-node')
          for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove('is-current')
          }
          document
            .querySelector(
              '#liveVideo' + this.curVideosArray[this.curVideoIndex].id
            )
            .parentElement.parentElement.parentElement.parentElement.classList.add(
              'is-current'
            )
        } else {
          this.onlineArray.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(list => {
                if (list.id === curVideo.id) {
                  this.selectedIndex = index
                  list.isSelected = true
                }
              })
            }
          })
        }
      }
    },
    // 预览或取消全部
    playAllVideos: debounce(function () {
      const bs = document.querySelectorAll(
        '.el-tree-node__content span.is-leaf +span.custom-tree-node>span >b'
      )
      console.log(bs)
      // 默认显示第一页，清除之前的数据
      this.currentPage = 1
      this.totalVideosArray = []
      this.curVideoIndex = 1000
      this.curSelectedVideo = {}
      if (this.isOnline) {
        const divs = document.querySelectorAll('.leftContainer > div.list')
        if (!this.isPlayAll) {
          for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove('selected')
          }
          this.onlineArray.forEach(item => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(list => {
                if (list.onlineStatus === 'online') {
                  list.isSelected = true
                  const curData = Object.assign({}, list, {
                    deviceCode: item.id,
                    deviceAddress: item.deviceAddress,
                    deviceBrand: item.deviceBrand,
                    parentLabel: item.label,
                    labelTotal: item.label + '-' + list.label
                  })
                  this.totalVideosArray.push(curData)
                }
              })
            }
          })
        } else {
          for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove('selected')
          }
          this.onlineArray.forEach(item => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(list => {
                list.isSelected = false
              })
            }
          })
        }
      } else {
        for (let i = 0; i < bs.length; i++) {
          if (
            !JSON.parse(bs[i].getAttribute('obj')).children &&
            JSON.parse(bs[i].getAttribute('obj')).onlineStatus === 'online'
          ) {
            if (!this.isPlayAll) {
              bs[i].parentElement.setAttribute('class', 'liveIcon')
              this.totalVideosArray.push(JSON.parse(bs[i].getAttribute('obj')))
            } else {
              // 移除所有激活的
              const divs = document.querySelectorAll('.el-tree-node')
              for (let i = 0; i < divs.length; i++) {
                divs[i].classList.remove('is-current')
              }
              bs[i].parentElement.setAttribute('class', '')
            }
          }
        }
      }

      // 若不够，数据则补位空格
      if (this.showVideoPageSize > this.totalVideosArray.length) {
        const j = this.totalVideosArray.length
        for (let i = 0; i < this.showVideoPageSize - j; i++) {
          this.totalVideosArray.push('')
        }
      }
      // this.curVideosArray = this.totalVideosArray.slice(
      //   0,
      //   this.showVideoPageSize
      // )
      for (let i = 0; i < this.showVideoPageSize; i++) {
        setTimeout(() => {
          this.curVideosArray.splice(i, 1, this.totalVideosArray[i])
        }, 300)
      }
      this.isPlayAll = !this.isPlayAll
    }, 500),
    // 切换每屏显示的个数
    changeVideosType (n) {
      this.palace = n
      this.currentPage = 1
      this.curVideoIndex = 1000
      this.showVideoPageSize = n
      // 将有数据的视频放到前面
      const newTotalVideosArray = []
      this.totalVideosArray.forEach(item => {
        if (item) {
          newTotalVideosArray.push(item)
        }
      })
      for (
        let i = 0;
        i < this.totalVideosArray.length - newTotalVideosArray.length;
        i++
      ) {
        newTotalVideosArray.push('')
      }
      this.totalVideosArray = newTotalVideosArray
      // 在总数据中获取实际有视频的数据
      const result = this.totalVideosArray.filter(item => item !== '')
      // console.log(result)
      // 1.如果有视频小于每屏的展示数据（包含没有的情况）
      if (result.length <= n) {
        // 1.1由大变小
        if (this.totalVideosArray.length >= n) {
          this.curVideosArray = this.totalVideosArray.slice(0, n)
          // 此操作过滤掉不要的空元素
          this.totalVideosArray = this.totalVideosArray.slice(0, n)
        } else {
          // 1.2由小变大
          const j = this.totalVideosArray.length
          for (let i = 0; i < n - j; i++) {
            this.totalVideosArray.push('')
          }
          this.curVideosArray = this.totalVideosArray.slice(0, n)
        }
      } else {
        // 2.如果实际视频并且大于每屏的展示数据
        // 过滤掉本身数据中空元素
        this.totalVideosArray = this.totalVideosArray.filter(
          item => item !== ''
        )
        this.curVideosArray = this.totalVideosArray.slice(0, n)
        console.log(this.curVideosArray)
      }
      if (this.curVideosArray[0]) {
        this.activeFirstTree()
      } else {
        this.curSelectedVideo = {}
      }
      // this.addTitle()
    },
    // 每一次切换屏幕或选择上一页下一页 默认当前显示的视频中第一个对应左边的树激活
    activeFirstTree () {
      if (!this.isOnline) {
        const divs = document.querySelectorAll('.el-tree-node')
        for (let i = 0; i < divs.length; i++) {
          divs[i].classList.remove('is-current')
        }
        document
          .querySelector('#liveVideo' + this.curVideosArray[0].id)
          .parentElement.parentElement.parentElement.parentElement.classList.add(
            'is-current'
          )
      } else {
        console.log(this.curVideosArray)
        this.onlineArray.forEach((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(list => {
              if (list.id === this.curVideosArray[0].id) {
                this.selectedIndex = index
                list.isSelected = true
              }
            })
          }
        })
      }
      if (!this.curVideosArray[0]) {
        this.selectedIndex = 200
      } else {
        this.curSelectedVideo = this.curVideosArray[0]
      }
      // this.curSelectedVideo = this.curVideosArray[0]
    },
    // 上一页
    pre (cpage) {
      // 始终截取当前页需要的数据
      this.curVideoIndex = 1000
      // const divs = document.querySelectorAll('.el-tree-node')
      // for (let i = 0; i < divs.length; i++) {
      //   divs[i].classList.remove('is-current')
      // }
      console.log('总共', this.totalVideosArray)
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
      console.log('当前', this.curVideosArray)
      if (this.curVideosArray[0]) {
        this.activeFirstTree()
      } else {
        this.curSelectedVideo = {}
      }
      // this.addTitle()
    },
    // 下一页
    next (cpage) {
      // 清掉之前的选中状态
      this.curVideoIndex = 1000
      // const divs = document.querySelectorAll('.el-tree-node')
      // for (let i = 0; i < divs.length; i++) {
      //   divs[i].classList.remove('is-current')
      // }
      if (cpage * this.showVideoPageSize > this.totalVideosArray.length) {
        const j = this.totalVideosArray.length
        // 若不够，数据则补位空格
        for (let i = 0; i < cpage * this.showVideoPageSize - j; i++) {
          this.totalVideosArray.push('')
        }
      }
      console.log(this.totalVideosArray.length)
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
      this.activeFirstTree()
      // this.addTitle()
    },
    // 动态渲染9个容器
    machineStatusStyle1 (n) {
      if (n === 9) {
        return {
          width: '33.33%',
          height: '33.33%'
        }
      } else if (n === 4) {
        return {
          width: '50%',
          height: '50%'
        }
      } else if (n === 1) {
        return {
          width: '100%',
          height: '100%'
        }
      }
    },
    // 检查全屏
    checkFull () {
      let isFull =
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },
    // 双击视频时给显示操作按钮（视频列表及全屏页面公用此方法）
    fullscreenvideo (videoObj) {
      this.curScreenInfo = videoObj.info
      if (videoObj.bfull === true) {
        this.totalVideosArray.forEach((item, index) => {
          if (item.id === videoObj.info.id) {
            this.$set(this.totalVideosArray[index], 'isShowOperate', true)
          }
        })
        this.curVideosArray.forEach((item, index) => {
          if (item.id === videoObj.info.id) {
            this.$set(this.curVideosArray[index], 'isShowOperate', true)
          }
        })
      } else {
        this.totalVideosArray.forEach((item, index) => {
          if (item.id === videoObj.info.id) {
            this.$set(this.totalVideosArray[index], 'isShowOperate', false)
          }
        })
        this.curVideosArray.forEach((item, index) => {
          if (item.id === videoObj.info.id) {
            this.$set(this.curVideosArray[index], 'isShowOperate', false)
          }
        })
      }
      this.bHasFullVideo = videoObj.bfull
    },
    init () {
      // 初始加载9个空元素
      this.totalVideosArray = []
      for (let i = 0; i < 9; i++) {
        this.totalVideosArray.push('')
      }
      this.curVideosArray = this.totalVideosArray.slice(
        0,
        this.showVideoPageSize
      )
    },
    // 设备下线
    deviceOffline (device) {
      if (device.id === this.curSelectedVideo.deviceCode) {
        if (this.isOnline) {
          this.selectedIndex = 200
        }
        this.curSelectedVideo = {}
      }
      this.totalVideosArray.forEach((item, index) => {
        if (item.deviceCode === device.id) {
          this.totalVideosArray.splice(index, 1, '')
        }
      })
      this.curVideosArray = this.totalVideosArray.slice(
        (this.currentPage - 1) * this.showVideoPageSize,
        this.currentPage * this.showVideoPageSize
      )
    },
    // 点击抓取，显示抓拍图片
    showImg: throttle(function () {
      if (Object.keys(this.curSelectedVideo).length === 0) {
        this.$notify.warning({ title: '警告', message: '请先选择设备！' })
        return
      }
      // 显示抓取的图片
      const params = {
        deviceCode: this.curSelectedVideo.deviceCode,
        channleId: this.curSelectedVideo.streamType
      }
      this.$axios.post(api.deviceSnap, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          // this.photoClicked = true
          this.showCutImg = true
          this.imgId = res.data.data.id
          this.cutImgUrl = res.data.data.filePath
          this.$notify.success({
            title: '成功',
            message: '抓取成功！',
            duration: 800
          })
          // this.$nextTick(() => {
          // 目的地
          //   this.moveElement('pic', 150, -200)
          // })
          setTimeout(() => {
            // document.getElementById('pic').style.left = '410px'
            // document.getElementById('pic').style.top = '-470px'
            this.showCutImg = false
          }, 4000)
        }
      })
    }, 5000),
    // 点击确定按钮
    confirm () {
      // 防止此时设备下线
      if (Object.keys(this.curSelectedVideo).length === 0) {
        this.$notify.warning({ title: '警告', message: '请先选择设备！' })
      }
      const params = {
        id: this.imgId,
        deviceCode: this.curSelectedVideo.deviceCode,
        filePath: this.cutImgUrl,
        channelId: this.curSelectedVideo.streamType,
        remark: this.remark
      }
      this.$axios.post(api.deviceUpdate, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.$notify.success({ title: '成功', message: '添加说明成功！' })
          this.cutDialogVisible = false
          this.clearRemark()
        }
      })
    },
    // 关闭抓取弹框之前
    clearRemark () {
      this.remark = ''
    },
    // 移动图片
    moveElement (elementID, finalX, finalY) {
      console.log(finalX, finalY)
      const timer = setInterval(() => {
        const elem = document.getElementById(elementID)
        let xpos = parseInt(elem.offsetLeft)
        let ypos = parseInt(elem.offsetTop)
        console.log(xpos, ypos)
        if (xpos === finalX && ypos === finalY) {
          clearInterval(timer)
        }
        if (xpos < finalX) {
          xpos++
        }
        if (xpos > finalX) {
          xpos--
        }
        if (ypos < finalY) {
          ypos++
        }
        if (ypos > finalY) {
          ypos--
        }
        elem.style.left = xpos + 'px'
        elem.style.top = ypos + 'px'
      }, 1)
    },
    // 全屏显示视频页面
    openDialog () {
      // 添加全屏样式class
      this.dialogVisible = true
      setTimeout(() => {
        this.$notify({
          dangerouslyUseHTMLString: true,
          title: '提示',
          message: '按esc键可退出全屏',
          type: 'info',
          duration: 3000
        })
      }, 500)
    },
    // 给分页添加提示（暂时不加）
    addTitle () {
      this.$nextTick(() => {
        const prevBtn = document.querySelector('.el-pagination > .btn-prev')
        const nextBtn = document.querySelector('.el-pagination > .btn-next')
        if (!prevBtn.getAttribute('disabled')) {
          prevBtn.title = `当前页${this.currentPage} / ${(Math.ceil(this.totalVideosArray.length / this.showVideoPageSize))}`
        } else {
          prevBtn.removeAttribute('title')
        }
        if (!nextBtn.getAttribute('disabled')) {
          nextBtn.title = `当前页${this.currentPage} / ${(Math.ceil(this.totalVideosArray.length / this.showVideoPageSize))}`
        } else {
          nextBtn.removeAttribute('title')
        }
      })
    },
    getPlayerStyle () {
      this.$nextTick(() => {
        this.playerWidth = this.$refs.video[0].clientWidth
        this.playerHeight = this.$refs.video[0].clientHeight
      })
    }
  },
  created () {
    this.init()
    const me = this
    // 监听键盘按键事件
    document.addEventListener('keyup', function (e) {
      if (e.keyCode === 27) {
        // 这一步只能监听到全屏页面的esc 视频中的esc监听不到
        // IE浏览器全屏时任然能够监控到esc键，这里处理还有点遗留问题。。。
        if (!me.bHasFullVideo && me.dialogVisible) {
          me.dialogVisible = false
        }
      }
    })
  },
  mounted () {
    this.getPlayerStyle()
    EventBus.$on('peopleRealChange', info => {
      this.totalVideosArray.forEach((item, index) => {
        if (item.deviceCode === info.deviceCode && item.streamType === info.channelId) {
          this.$set(this.totalVideosArray[index], 'positionList', info.positionList)
        }
      })
      this.curVideosArray.forEach((item, index) => {
        if (item.deviceCode === info.deviceCode && item.streamType === info.channelId) {
          this.$set(this.curVideosArray[index], 'positionList', info.positionList)
        }
      })
    })
    this.bSaveMultiDroneInfos = true
  }
}
</script>
<style lang="less" scoped>
.videoContainer {
  box-sizing: border-box;
  .leftContainer {
    box-sizing: border-box;
    padding: 27px 0 0 28px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    // font-weight: bold;

    div.tab {
      display: flex;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      width: 230px;
      color: #23cefd;
      background: #062C5D;
      // text-align: center;
      div {
        width: 104px;
        box-sizing: border-box;
      }
      div:nth-child(1) {
        padding-left: 30px;
      }
      div:nth-child(2) {
        padding-left: 20px;
      }
      div.active {
        width: 126px !important;
        color: #fff;
        font-weight: bold;
      }
      div:nth-child(1).active {
        background: url(../../assets/images/left.png) no-repeat;
      }
      div:nth-child(2).active {
        padding-left: 42px;
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
    div.onlineList{
      max-height:800px;
      overflow-y: auto;
      margin-right:8px;
    }
    div.list {
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
  .rightContent {
    font-size: 16px;
    font-family: Source Han Sans CN;
    color: rgba(255, 255, 255, 1);
    line-height: 14px;
    padding:21px 13px 0px 23px;
    .baseInfo,
    .deviceInfo {
      .info {
        box-sizing: border-box;
        width: 196px;
        height: 34px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 34px;
        padding-left: 35px;
      }
    }
    .baseInfo {
      .detail {
        margin-top: 22px;
        height: 230px;
        ul {
          padding-left: 15px;
          padding-right: 22px;
          li {
            // text-align: justify;
            word-break: break-all;
            span {
              line-height: 20px;
            }
          }
          li:not(:nth-child(1)) {
            margin-top: 14px;
          }
          li:nth-child(2) {
            margin-top: 17px;
          }
        }
      }
    }
    .deviceInfo {
      margin-top: 10px;
      .operate {
        margin-top: 20px;
        .icons {
          display: flex;
          flex-wrap: wrap;
          padding-left: 20px;
          div {
            width: 48px;
            height: 48px;
            margin-right: 19px;
            margin-bottom: 19px;
            cursor: pointer;
          }
          div:nth-child(1) {
            background: url(../../assets/images/device/7.png) no-repeat;
          }
          div:nth-child(1):hover {
            background: url(../../assets/images/device/7_selected.png) no-repeat;
          }
          div:nth-child(2) {
            background: url(../../assets/images/device/8.png) no-repeat;
          }
          div:nth-child(2):hover {
            background: url(../../assets/images/device/8_selected.png) no-repeat;
          }
          div:nth-child(3) {
            background: url(../../assets/images/device/9.png) no-repeat;
          }
          div:nth-child(3):hover {
            background: url(../../assets/images/device/9_selected.png) no-repeat;
          }
          div:nth-child(4) {
            margin-right: 10px;
            background: url(../../assets/images/device/4.png) no-repeat;
          }
          div:nth-child(4):hover {
            background: url(../../assets/images/device/4_selected.png) no-repeat;
          }
          div:nth-child(5) {
            width: 64px;
            height: 64px;
            position: relative;
            margin-left: 2px;
            top: -7px;
            // left: -5px;
            margin-right: 10px;
            background: url(../../assets/images/device/5.png) no-repeat;
            cursor: text;
            margin-bottom: 5px;
          }
          // div:nth-child(5):hover {
          //   background: url(../../assets/images/device/5_selected.png) no-repeat;
          // }
          div:nth-child(6) {
            background: url(../../assets/images/device/6.png) no-repeat;
          }
          div:nth-child(6):hover {
            background: url(../../assets/images/device/6_selected.png) no-repeat;
          }
          div:nth-child(7) {
            background: url(../../assets/images/device/1.png) no-repeat;
          }
          div:nth-child(7):hover {
            background: url(../../assets/images/device/1_selected.png) no-repeat;
          }
          div:nth-child(8) {
            background: url(../../assets/images/device/2.png) no-repeat;
          }
          div:nth-child(8):hover {
            background: url(../../assets/images/device/2_selected.png) no-repeat;
          }
          div:nth-child(9) {
            background: url(../../assets/images/device/3.png) no-repeat;
          }
          div:nth-child(9):hover {
            background: url(../../assets/images/device/3_selected.png) no-repeat;
          }
        }
        .btns {
          box-sizing: border-box;
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 18px;
          > div {
            width: 201px;
            height: 37px;
            line-height: 35px;
            text-align: center;
            margin-left:10px;
            background: rgba(46, 108, 147, 1);
            border: 1px solid rgba(28, 161, 220, 1);
            color: #84ddff;
            display: flex;
            justify-content: space-between;
            margin-bottom: 13px;
            span {
              display: inline-block;
              width: 48px;
              font-size: 24px;
              cursor: pointer;
              position: relative;
            }
            span:nth-child(1):after {
              content: "|";
              position: absolute;
              left: 45px;
              color: #1ca1dc;
              top: -2px;
            }
            span:nth-child(3):before {
              content: "|";
              position: absolute;
              left: -1px;
              color: #1ca1dc;
              top: -2px;
            }
            span:hover {
              background: linear-gradient(
                90deg,
                rgb(32, 72, 105) 0%,
                rgb(32, 72, 105) 100%
              );
            }
            span:nth-child(1):hover:after {
              display:none
            }
            span:nth-child(3):hover:before {
               display:none
            }
          }
        }
        .slider {
          display: flex;
          padding-left:10px;

          span {
            line-height: 38px;
          }
          span.demonstration {
            font-weight: bold;
            color: rgba(132, 221, 255, 1);
          }
          span:nth-child(3) {
            display: inline-block;
            width: 38px;
            height: 24px;
            background: rgba(46, 108, 147, 1);
            border: 1px solid rgba(28, 161, 220, 1);
            border-radius: 10px;
            text-align: center;
            position: relative;
            top: 5px;
            line-height: 24px;
          }
          /deep/.el-slider__bar {
            background-color: #84ddff;
          }
          /deep/.el-slider__button {
            background-color: #84ddff;
          }
          /deep/.el-slider__button-wrapper{
            z-index:100
          }
        }
        .sliderTip{
          font-size:14px;
          margin-top: 2px;
          padding-left:42px;
          color:#fff;
          opacity: .5;
        }
      }
      .mapBox {
        margin: 23px 24px 10px 10px;
        width: 210px;
        height: 130px;
      }
    }
  }
  .video {
    box-sizing: border-box;
    padding: 21px 13px 0px 23px;
    // position: relative;
    .box {
      display: flex;
      justify-content: space-between;
      margin-right: 10px;
       margin-bottom: 20px;
      .title {
        width: 196px;
        height: 34px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 34px;
        padding-left: 30px;
      }
      div.info {
        display: flex;
        font-weight: 400;
        line-height: 34px;
        color: rgba(132, 221, 255, 1);
        .curSelected {
          margin-right: 70px;
        }
        .warning {
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          img {
            vertical-align: middle;
            margin-right: 12px;
            position: relative;
            top: -2px;
          }
          b {
            color: #ff0000;
          }
        }
      }
    }
    .videoList {
      display: flex;
      flex-wrap: wrap;
      height: 710px;
      > div {
        >div {
          box-sizing: border-box;
          // height: 223px;

          margin-right: 10px;
          margin-bottom: 10px;
          width:calc(100% - 10px);
          height:calc(100% - 10px);
          background: url(../../assets/images/video.png) no-repeat center center;
          background-color: #00497c;
          cursor: pointer;
        }
        > div.active {
          border: 2px solid rgba(255, 244, 100, 1);
        }
      }
    }
    .tools {
      position: relative;
      width:calc(100% - 10px);
      height: 60px;
      background: url(../../assets/images/tool-bar.png) round;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      margin-top:20px;
      .leftTool,
      .rightTool {
        position: relative;
        top: 16px;
        left: 40px;
        img {
          margin-right: 20px;
          cursor: pointer;
        }
        img:nth-child(n + 4) {
          // margin-left: 22px;
          margin-right: 0;
        }
        img:nth-child(4) {
          margin-right: 20px;
        }
      }
      .rightTool {
        margin-right: 70px;
        .pagination {
          display: inline-block;
          position: relative;
          top: -12px;
          margin-right: 5px;
          /deep/.el-pagination {
            padding: 0;
            button {
              background-color: transparent !important;
              i {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #23cefd;
                text-align: center;
                line-height: 20px;
                color: #1c638b;
              }
            }
            button.btn-next,
            button.btn-prev {
              padding: 0;
            }
            button[disabled] {
              i {
                background: #999;
                color: #2d506f;
              }
            }
          }
        }
      }
      .leftTool {
        #pic {
          width: 200px;
          height: 200px;
          position: absolute;
          z-index: 1000;
          top: -200px;
          left: 150px;
          // 动画的位置
          // top: -470px;
          // left: 410px;
          transition: all linear;
        }
      }
    }
  }
  // 全屏弹框
  // .fullContainer {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   // left: 0;
  //   // bottom: 0;
  //   height: 100%;
  //   width: 100%;
  //   z-index: 1000;
  //   background: #fff;
  //   display: flex;
  //   flex-wrap: wrap;
  //   overflow: visible;
  //   // padding: 20px 30px;
  //   background: url(../../assets/images/bg.png) no-repeat;
  //   > div {
  //     >div {
  //       box-sizing: border-box;
  //       cursor: pointer;
  //       margin-right: 10px;
  //       margin-bottom: 10px;
  //       width:calc(100% - 10px);
  //       height:calc(100% - 10px);
  //       background: url(../../assets/images/video.png) no-repeat center center;
  //       background-color: #00497c;
  //     }
  //     div.active {
  //       border: 2px solid #fff464;
  //     }
  //   }
  // }
}
.videolistFullscreen {
  position:fixed;
  top: 0;
  right: 0;
  width: 100%;
  height:100% !important;
  z-index: 1000;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  overflow: visible;
  background-image: url('../../assets/images/bg.png');
}
.cutDialog {
  background: rgba(0, 0, 0, 0.6);
  /deep/.el-dialog {
    width: 803px;
    height: 549px;
    background: url(../../assets/images/dialog-bg.png) no-repeat;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 26px 30px;
    }
    .el-dialog__footer {
      padding: 0 30px;
      .remark {
        display: flex;
        justify-content: space-between;
        .replain {
          text-align: left;
          span {
            color: #fff;
          }
          .el-input {
            width: 410px;
            .el-input__inner {
              color: #fff;
              border: none;
              border-bottom: 1px solid rgb(153, 153, 153);
              background: transparent;
            }
            input::-webkit-input-placeholder {
              color: #999;
            }
          }
        }
        .el-button--default {
          background: transparent;
          color: rgba(30, 176, 252, 1);
        }
        .el-button--primary {
          background: #1eb0fc;
        }
      }
    }
  }
}
</style>
