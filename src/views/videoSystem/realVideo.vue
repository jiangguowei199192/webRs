<template>
  <div class="videoContainer">
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
            <div
              class="list"
              v-for="(item,index1) in onlineArray"
              :key="index1"
              :class="{selected:selectedIndex==index1,unman:item.deviceTypeCode==='WRJ'}"
            >
              <p>
                <span class="area">{{item.label}}</span>
                <i v-show="selectedIndex==index1"></i>
              </p>
              <div class="btns">
                <!-- <div > -->
                <el-button
                  v-for="(list,index2) in item.children"
                  :key="index2"
                  :class="{visible:list.label==='可见光',infrared:list.label==='红外光'}"
                  :style="{backgroundColor:list.isSelected?'rgba(14,90,148,1)':''}"
                  @click.stop="playDeviceVideo(item,list,index1,index2)"
                >{{list.label}}</el-button>
                <!-- <el-button
                    :class="{infrared:list.label==='可见光'}"
                    :style="{backgroundColor:item.infraredIsclick?'rgba(0,212,15,1)':''}"
                    @click.stop="changeStatus(2,index)"
                >{{list.label}}</el-button>-->
                <!-- </div> -->
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
        </div>
      </div>
      <!-- 中间视频部分 -->
      <div slot="center">
        <div class="video">
          <div class="box">
            <div class="title">直播</div>
            <div
              v-if="curSelectedVideo.labelTotal"
              class="curSelected"
            >当前选中:{{curSelectedVideo.labelTotal}}</div>
          </div>
          <div class="videoList">
            <div
              v-for="(item,index) in curVideosArray"
              :key="index"
              :style="machineStatusStyle(showVideoPageSize)"
              @click.stop="operateCurVideo(item,index)"
              :class="{active:curVideoIndex===index}"
            >
              <!-- <div > -->
              <VideoWall :videoInfo="item" :key="index" ref="playerCtrl" v-if="item.streamUrl"></VideoWall>
              <!-- </div> -->
            </div>
          </div>
          <!-- 下面按钮部分 -->
          <div class="tools">
            <div class="leftTool">
              <img :src="palace==9?nineSelectedPalace:ninePalace" @click.stop="changeVideosType(9)" />
              <img :src="palace==4?fourSelectedPalace:fourPalace" @click.stop="changeVideosType(4)" />
              <img :src="palace==1?oneSelectedPalace:onePalace" @click.stop="changeVideosType(1)" />
              <img :src="photoClicked?photoSelected:photo" @click.stop="photoClicked=true" />
              <img :src="mapClicked?mapSelected:map" @click.stop="mapClicked=true" />
            </div>
            <div class="rightTool">
              <img :src="!isPlayAll?playAll:closeAll" @click.stop="playAllVideos" />
              <div class="pagination">
                <el-pagination
                  :page-size="showVideoPageSize"
                  layout="prev,pager, next"
                  :total="totalVideosArray.length"
                  :current-page.sync="currentPage"
                  @prev-click="pre"
                  @next-click="next"
                ></el-pagination>
              </div>

              <img
                :src="!dialogVisible?fullScreen:fullScreenSelected"
                @click.stop="dialogVisible=true"
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
                  <span>{{curSelectedVideo.parentLabel}}</span>
                </li>
                <li>
                  <span>设备编号：</span>
                  <span>{{curSelectedVideo.id}}</span>
                </li>
                <li>
                  <span>设备品牌：</span>
                  <span>{{curSelectedVideo.deviceBrand}}</span>
                </li>
                <!-- <li>
                  <span>设备状态：</span>
                  <span>xxx</span>
                </li>-->
                <li>
                  <span>所在地点：</span>
                  <span>{{curSelectedVideo.deviceAddress}}</span>
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
                  @click.stop="changeCurVideo(index)"
                  :class="{active:activeCurIcon===index}"
                ></div>
              </div>
              <div class="btns">
                <div>
                  <span :class="{active:zoom==1}" @click="zoom=1">+</span>
                  <b>变倍</b>
                  <span :class="{active:zoom==2}" @click="zoom=2">-</span>
                </div>
                <div>
                  <span :class="{active:zoomLens==1}" @click="zoomLens=1">+</span>
                  <b>变焦</b>
                  <span :class="{active:zoomLens==2}" @click="zoomLens=2">-</span>
                </div>
                <div>
                  <span :class="{active:zoomGuang==1}" @click="zoomGuang=1">+</span>
                  <b>光圈</b>
                  <span :class="{active:zoomGuang==2}" @click="zoomGuang=2">-</span>
                </div>
              </div>
              <div class="slider">
                <span class="demonstration">步速</span>
                <el-slider
                  v-model="value2"
                  :min="1"
                  :max="8"
                  style="width:91px;margin-left:16px;margin-right:8px;"
                ></el-slider>
                <span>{{value2}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VideoMain>
    <el-dialog :visible.sync="dialogVisible" width="100%" :fullscreen="true" tabindex="1" id="d1">
      <!-- <div class="fullContainer" v-if="dialogVisible" id="d1"> -->
      <div
        v-for="(item,index) in curVideosArray"
        :key="index"
        :style="machineStatusStyle(showVideoPageSize)"
      >
        <VideoWall :videoInfo="item" :key="index" ref="playerCtrl" v-if="item.streamUrl"></VideoWall>
      </div>
      <!-- </div> -->
    </el-dialog>
  </div>
</template>
<script>
import VideoMain from './components/main'
import TreeData from './components/tree'
import videoMixin from './mixins/videoMixin'
import VideoWall from './components/videoWall'
// import { api } from '@/api/videoSystem/realVideo'
export default {
  name: 'videoContainer',
  components: {
    VideoMain,
    TreeData,
    VideoWall
  },
  mixins: [videoMixin],
  data () {
    return {
      // filterText: '', // 节点过滤文字
      palace: 9, // 默认选中9宫格
      zoom: 0, // 变倍
      zoomLens: 0, // 变焦
      zoomGuang: 0, // 变光
      mapClicked: false, // 设备地图
      photoClicked: false, // 拍照
      dialogVisible: false, // 全屏弹窗
      currentPage: 1, // 默认第1页
      totalVideosArray: [], // 总共的数据
      curVideosArray: [], // 当前展示的数据
      showVideoPageSize: 9, // 每屏显示视频的个数 默认9宫格
      curVideoIndex: 1000,
      activeCurIcon: '', // 默认选中云台的图标
      value2: 4, // 步速值
      isPlayAll: false, // 是否播放所有 控制预览全部
      curSelectedVideo: {} // 当前选中
    }
  },
  methods: {
    // 在线或所有设备切换
    changeOnlineOrAll (isOnline) {
      if (Number(this.isOnline) === Number(isOnline)) return
      this.isOnline = isOnline
      // 如果选择在线设备，则清除所有设备的数据
      if (this.isOnline) {
        this.palace = 9 // 默认选中9宫格
        this.zoom = 0 // 变倍
        this.zoomLens = 0 // 变焦
        this.zoomGuang = 0 // 变光
        this.mapClicked = false // 设备地图
        this.photoClicked = false // 拍照
        this.value2 = 4 // 步速值
        this.activeCurIcon = '' // 默认选中云台的图标
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
      this.curVideoIndex = 1000

      this.isPlayAll = false // 是否播放所有 控制预览全部
      this.curSelectedVideo = {} // 当前选中
      this.init()
    },
    // 点击在线设备中红外光或可见光
    playDeviceVideo (item, list, index1, index2) {
      const curData = Object.assign({}, list, {
        deviceAddress: item.deviceAddress,
        deviceBrand: item.deviceBrand,
        parentLabel: item.label,
        labelTotal: item.label + '-' + list.label
      })
      if (!this.onlineArray[index1].children[index2].isSelected) {
        this.onlineArray.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(list => {
              list.isSelected = false
            })
          }
        })
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
        this.selectedIndex = 200
        this.playOrClose(2, curData)
      }
    },
    // 点击云台图标按钮，控制当前视频
    changeCurVideo (index) {
      this.activeCurIcon = index
    },
    // 点击树节点,播放或关闭当前视频
    playOrClose (type, curTreeData) {
      // 1.添加
      if (type === 1) {
        this.curSelectedVideo = curTreeData
        // 1.1默认位置添加
        if (this.curVideoIndex === 1000) {
          const i = this.totalVideosArray.indexOf('')
          // 如果有空元素，则替换
          if (i !== -1) {
            this.totalVideosArray.splice(i, 1, curTreeData)
            this.curVideosArray = this.totalVideosArray.slice(
              (this.currentPage - 1) * this.showVideoPageSize,
              this.currentPage * this.showVideoPageSize
            )
          } else {
            // 若没有空元素，则追加
            this.totalVideosArray.push(curTreeData)
            // this.curVideosArray = this.totalVideosArray.slice(
            //   0,
            //   this.showVideoPageSize
            // )
            this.next(++this.currentPage)
          }
        } else {
          // 1.2指定位置添加
          // 若指定位置之前有元素，去掉其对应树节点激活的样式
          if (this.curVideosArray[this.curVideoIndex]) {
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
          }
          // 防止有分页的情况
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
        // 2.关闭视频
        this.curSelectedVideo = {}
        this.curVideoIndex = 1000
        let i = 0
        this.totalVideosArray.forEach((item, index) => {
          if (item.id === curTreeData.id) {
            i = index
          }
        })
        this.totalVideosArray.splice(i, 1, '')
        this.curVideosArray = this.totalVideosArray.slice(
          (this.currentPage - 1) * this.showVideoPageSize,
          this.currentPage * this.showVideoPageSize
        )
      }
    },
    // 点击当前视频
    operateCurVideo (curVideo, index) {
      this.curVideoIndex = index
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
                list.isSelected = false
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
    // 预览全部
    playAllVideos () {
      const bs = document.querySelectorAll(
        '.el-tree-node__content span.is-leaf +span.custom-tree-node>span >b'
      )
      console.log(bs)
      // 默认显示第一页，清除之前的数据
      this.currentPage = 1
      this.totalVideosArray = []
      this.curVideoIndex = 1000
      if (this.isOnline) {
        this.onlineArray.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(list => {
              const divs = document.querySelectorAll('div.list')
              if (!this.isPlayAll) {
                for (let i = 0; i < divs.length; i++) {
                  divs[i].classList.add('selected')
                }
                list.isSelected = true
              } else {
                for (let i = 0; i < divs.length; i++) {
                  divs[i].classList.remove('selected')
                }
                list.isSelected = false
                this.curSelectedVideo = {}
              }
            })
          }
        })
      } else {
        for (let i = 0; i < bs.length; i++) {
          if (!JSON.parse(bs[i].getAttribute('obj')).children) {
            if (!this.isPlayAll) {
              bs[i].parentElement.setAttribute('class', 'liveIcon')
              this.totalVideosArray.push(JSON.parse(bs[i].getAttribute('obj')))
            } else {
              // 移除所有激活的
              const divs = document.querySelectorAll('.el-tree-node')
              for (let i = 0; i < divs.length; i++) {
                divs[i].classList.remove('is-current')
              }
              this.curSelectedVideo = {}
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
      this.curVideosArray = this.totalVideosArray.slice(
        0,
        this.showVideoPageSize
      )

      this.isPlayAll = !this.isPlayAll
    },
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
      console.log(result)
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
      }
    },
    // 每一次切换屏幕或选择上一页下一页 默认当前显示的视频中第一个对应左边的树激活
    activeFirstTree () {
      const divs = document.querySelectorAll('.el-tree-node')
      for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('is-current')
      }
      document
        .querySelector('#liveVideo' + this.curVideosArray[0].id)
        .parentElement.parentElement.parentElement.parentElement.classList.add(
          'is-current'
        )
      this.curSelectedVideo = this.curVideosArray[0]
    },
    // 上一页
    pre (cpage) {
      // 始终截取当前页需要的数据
      this.curVideoIndex = 1000
      // const divs = document.querySelectorAll('.el-tree-node')
      // for (let i = 0; i < divs.length; i++) {
      //   divs[i].classList.remove('is-current')
      // }
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
      this.activeFirstTree()
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
      console.log(cpage, this.curVideosArray.length)
    },
    // 动态渲染9个空元素
    machineStatusStyle (n) {
      if (n === 9) {
        return {
          width: '31%',
          height: '31%'
          // marginLeft: '10px'
        }
      } else if (n === 4) {
        return {
          width: '48%',
          height: '48%'
          // marginLeft: '10px'
        }
      } else if (n === 1) {
        return {
          width: '99%',
          height: '99%'
          // marginLeft: '10px'
        }
      }
    },
    // 检查全屏
    checkFull () {
      let isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
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
    }
  },
  created () {
    this.init()
    this.getAllDeptDevices()
    const me = this
    window.onresize = function () {
      if (me.dialogVisible) {
        if (me.checkFull()) {
          // 要执行的动作
          document.getElementById('d1').focus()
        }
      }
    }
  }
  // watch: {
  //   filterDevice (val) {
  //     this.$refs.tree.$refs.tree.filter(val)
  //   }
  // }
}
</script>
<style lang="less" scoped>
.videoContainer {
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
        button.infrared {
          background: url(../../assets/images/infrared.png) no-repeat 4px center;
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
  }
  .rightContent {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 14px;
    padding: 15px 10px;
    .baseInfo,
    .deviceInfo {
      .info {
        box-sizing: border-box;
        width: 202px;
        height: 45px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 45px;
        padding-left: 35px;
      }
    }
    .baseInfo {
      .detail {
        margin-top: 22px;
        min-height: 90px;
        ul {
          padding-left: 24px;
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
      margin-top: 130px;
      .info {
        padding-left: 50px;
      }
      .operate {
        margin-top: 20px;
        .icons {
          display: flex;
          flex-wrap: wrap;
          padding-left: 48px;
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
          div:nth-child(1).active {
            background: url(../../assets/images/device/7_selected.png) no-repeat;
          }
          div:nth-child(2) {
            background: url(../../assets/images/device/8.png) no-repeat;
          }
          div:nth-child(2).active {
            background: url(../../assets/images/device/8_selected.png) no-repeat;
          }
          div:nth-child(3) {
            background: url(../../assets/images/device/9.png) no-repeat;
          }
          div:nth-child(3).active {
            background: url(../../assets/images/device/9_selected.png) no-repeat;
          }
          div:nth-child(4) {
            margin-right: 10px;
            background: url(../../assets/images/device/4.png) no-repeat;
          }
          div:nth-child(4).active {
            background: url(../../assets/images/device/4_selected.png) no-repeat;
          }
          div:nth-child(5) {
            width: 64px;
            height: 64px;
            position: relative;
            top: -7px;
            // left: -5px;
            margin-right: 10px;
            background: url(../../assets/images/device/5.png) no-repeat;
          }
          div:nth-child(5).active {
            background: url(../../assets/images/device/5_selected.png) no-repeat;
          }
          div:nth-child(6) {
            background: url(../../assets/images/device/6.png) no-repeat;
          }
          div:nth-child(6).active {
            background: url(../../assets/images/device/6_selected.png) no-repeat;
          }
          div:nth-child(7) {
            background: url(../../assets/images/device/1.png) no-repeat;
          }
          div:nth-child(7).active {
            background: url(../../assets/images/device/1_selected.png) no-repeat;
          }
          div:nth-child(8) {
            background: url(../../assets/images/device/2.png) no-repeat;
          }
          div:nth-child(8).active {
            background: url(../../assets/images/device/2_selected.png) no-repeat;
          }
          div:nth-child(9) {
            background: url(../../assets/images/device/3.png) no-repeat;
          }
          div:nth-child(9).active {
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
            line-height: 37px;
            text-align: center;
            margin-left: 39px;
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
            }
            span:nth-child(1):after {
              content: "|";
              position: relative;
              left: 15px;
              color: #1ca1dc;
            }
            span:nth-child(3):before {
              content: "|";
              position: relative;
              left: -15px;
              color: #1ca1dc;
            }
            span.active {
              background: linear-gradient(
                90deg,
                rgb(32, 72, 105) 0%,
                rgb(32, 72, 105) 100%
              );
            }
            span:nth-child(1).active:after {
              content: "";
            }
            span:nth-child(3).active:before {
              content: "";
            }
          }
        }
        .slider {
          display: flex;
          padding-left: 39px;

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
        }
      }
    }
  }
  .video {
    box-sizing: border-box;
    padding: 21px 0px 21px 21px;
    // position: relative;
    .box {
      display: flex;
      justify-content: space-between;
      margin-right: 64px;
      .title {
        width: 202px;
        height: 45px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 45px;
        padding-left: 30px;
        margin-bottom: 20px;
      }
      .curSelected {
        font-weight: 400;
        color: rgba(132, 221, 255, 1);
      }
    }
    .videoList {
      display: flex;
      flex-wrap: wrap;
      height: 710px;
      > div {
        box-sizing: border-box;
        height: 223px;

        margin-right: 19px;
        margin-bottom: 20px;
        background: url(../../assets/images/video.png) no-repeat center center;
        background-color: #00497c;
        cursor: pointer;
      }
      > div.active {
        border: 2px solid rgba(255, 244, 100, 1);
      }
    }
    .tools {
      position: absolute;
      bottom: 25px;
      width: 95%;
      height: 71px;
      background: url(../../assets/images/tool-bar.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      .leftTool,
      .rightTool {
        position: relative;
        top: 22px;
        left: 40px;
        img {
          margin-right: 20px;
          cursor: pointer;
        }
        img:nth-child(n + 4) {
          margin-left: 22px;
          margin-right: 0;
        }
        img:nth-child(4) {
          margin-right: 20px;
        }
      }
      .rightTool {
        margin-right: 90px;
        .pagination {
          display: inline-block;
          position: relative;
          top: -10px;
          margin-right: 20px;
          /deep/.el-pagination {
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
            button[disabled] {
              i {
                background: #999;
                color: #2d506f;
              }
            }
          }
        }
      }
    }
  }
  // 全屏弹框
  // .fullContainer {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   left: 0;
  //   bottom: 0;
  //   z-index: 10000;
  //   background: #fff;
  //   display: flex;
  //   flex-wrap: wrap;
  //   overflow: visible;
  //   padding: 20px 30px;
  //   > div {
  //     // cursor: pointer;
  //     margin-right: 19px;
  //     margin-bottom: 20px;
  //     background: url(../../assets/images/video.png) no-repeat center center;
  //     background-color: #00497c;
  //   }
  // }
}
// 修改弹框样式
.el-dialog__wrapper {
  overflow: visible;
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      padding: 0 15px;
      > div {
        // cursor: pointer;
        margin-right: 19px;
        margin-bottom: 20px;
        background: url(../../assets/images/video.png) no-repeat center center;
        background-color: #00497c;
      }
    }
  }
}
</style>
