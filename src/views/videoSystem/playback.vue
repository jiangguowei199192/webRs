<template>
  <div class="playBack">
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:isOnline}" @click.stop="changeOnlineOrAll(true)">在线</div>
            <div :class="{active:!isOnline}" @click.stop="changeOnlineOrAll(false)">全部</div>
          </div>
          <!-- 默认展示已选部分 -->
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
                <i v-show="item.isPlay"></i>
              </p>
              <div class="btns">
                <!-- <div > -->
                <el-button
                  v-for="(list,index2) in item.children"
                  :key="index2"
                  :class="{visible:!list.isSelected,visibleSelected:list.isSelected}"
                  :style="{backgroundColor:list.isSelected?'rgba(0,212,15,1)':'',color:list.isSelected?'#fff':'#1EB0FC'}"
                  @click.stop="playDeviceVideo(item,list,index1,index2)"
                  :title="list.label"
                >{{list.label&&list.label.length>3?list.label.slice(0,3)+'..':list.label?list.label:'-'}}</el-button>
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
            <Tree :treeData="treeData" :isLive="false" @selectedChange="getSelectedData" ref="tree"></Tree>
          </template>
        </div>
      </div>
      <div slot="center">
        <div class="video">
          <div class="box">
            <div class="title">回放</div>
            <div v-if="curNode">当前选中:{{curNode.parentLabel}}</div>
          </div>
          <div class="videoList" :class="{videolistFullscreenStyle:dialogVisible}">
            <div
              v-for="(item,index) in curVideosArray"
              :key="index"
              :style="machineStatusStyle(showVideoPageSize)"
            >
              <div
                @click.stop="operateCurVideo(item,index)"
                :class="{active:curVideoIndex===index}"
              >
                <VideoWall
                  :videoInfo.sync="item"
                  :key="index"
                  v-if="item.streamUrl"
                  ref="videoCtrl"
                  @timeupdateEvent="timeupdate"
                ></VideoWall>
              </div>
            </div>
          </div>
          <!-- 下面按钮部分 -->
          <div class="tools">
            <div class="leftTool">
              <!-- <img
                :src="showVideoPageSize==9?nineSelectedPalace:ninePalace"
                @click.stop="changeVideosType(9)"
              /> -->
              <img
                :src="showVideoPageSize==4?fourSelectedPalace:fourPalace"
                @click.stop="changeVideosType(4)"
              />
              <img
                :src="showVideoPageSize==1?oneSelectedPalace:onePalace"
                @click.stop="changeVideosType(1)"
              />
            </div>
            <div class="centerTool">
              <img :src="stop" @click="stopPlayRecord" />
              <img :src="play" @click="playRecord" v-show="!curPlayer.isPlay" />
              <img :src="pause" @click="pauseRecord" v-show="curPlayer.isPlay" />
            </div>
            <div class="rightTool">
              <!-- <div class="pagination">
                <el-pagination
                  :page-size="showVideoPageSize"
                  layout="prev,pager, next"
                  :total="totalVideosArray.length"
                  :current-page.sync="currentPage"
                  @prev-click="pre"
                  @next-click="next"
                ></el-pagination>
              </div>-->
              <div class="download" @click="download" />
              <img :src="fullScreen" @click.stop="showFullScreen" />
            </div>
          </div>
          <TimeBar
            ref="timeCtrl"
            class="time"
            :segments="records"
            :curTime.sync="curTime"
            @jumpEvent="jump"
          ></TimeBar>
        </div>
      </div>
      <div slot="right">
        <Calendar
          ref="calendarCtrl"
          @dateChangeEvent="dateChange"
          :markData="recordData"
          :snapList="snapList"
          :player="curPlayer"
          @searchRecordEvent="searchRecord"
        ></Calendar>
      </div>
    </VideoMain>
    <!-- <div class="fullContainer" v-if="dialogVisible" id="d1">
      <div
        :style="machineStatusStyle(showVideoPageSize)"
        v-for="(item,index) in curVideosArray"
        :key="index"
      >
        <div :class="{active:fulllIndex==index}" @click="fulllIndex=index">
          <VideoWall :videoInfo="item" :key="index"  v-if="item.streamUrl" :playbackFullScreen="true"></VideoWall>
        </div>
      </div>
    </div> -->
    <el-dialog :visible.sync="downloadDlgVisible" class="downloadDlg" width="803px">
      <div class="downloadContainer webFsScroll">
        <div class="title">
          <span>视频列表</span>
        </div>
        <div class="downloadBtn" @click="downloadMp4">
          <img src="../../assets/images/download-pic.png" />
          <span>下载</span>
        </div>
        <div class="close" @click="downloadDlgVisible = false;radio = -1"></div>
        <div>
          <el-table
            @row-click="ClickTableRow"
            :data="curPageRecord"
            stripe
            empty-text="no data"
            tooltip-effect="light"
            height="216px"
          >
            <el-table-column label width="33" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index">{{''}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" align="center" min-width="7%"></el-table-column>
            <el-table-column
              label="文件名"
              prop="fileName"
              align="center"
              :show-overflow-tooltip="true"
              min-width="16%"
            ></el-table-column>
            <el-table-column
              label="文件大小"
              prop="fileSize"
              align="center"
              :show-overflow-tooltip="true"
              min-width="15%"
              :formatter="formatFileSize"
            ></el-table-column>
            <el-table-column
              label="开始时间"
              prop="start"
              :formatter="formatFileStart"
              align="center"
              :show-overflow-tooltip="true"
              min-width="22%"
            ></el-table-column>
            <el-table-column
              label="结束时间"
              prop="start"
              align="center"
              :formatter="formatFileEnd"
              :show-overflow-tooltip="true"
              min-width="22%"
            ></el-table-column>
            <el-table-column
              label="所属设备"
              prop="deviceName"
              align="center"
              :show-overflow-tooltip="true"
              min-width="18%"
            ></el-table-column>
          </el-table>
          <el-pagination
            class="tablePagination"
            popper-class="pageSelect"
            :page-size="downloadPageSize"
            layout="total, sizes, prev, pager, next"
            :page-sizes="[5, 10, 20]"
            :total="records.length"
            :current-page.sync="curRecordPage"
            @current-change="currentRecordPageChange"
            @size-change="downloadPageSizeChange"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { api } from '@/api/videoSystem/videoRecord.js'
import VideoMain from './components/main'
import Calendar from './components/calendar'
import TimeBar from './components/timeBar'
import Tree from './components/tree'
import videoMixin from './mixins/videoMixin'
import VideoWall from './components/videoWall'
import { timeFormat } from '@/utils/date'
import globalApi from '@/utils/globalApi'
export default {
  name: 'playbackContainer',
  components: {
    VideoMain,
    Calendar,
    TimeBar,
    VideoWall,
    Tree

    // VideoWall
  },
  mixins: [videoMixin],
  data () {
    return {
      curRecordPage: 1,
      curPageRecord: [], // 当前页显示的回放数据
      radio: -1,
      downloadPageSize: 5, // 下载每页显示个数
      downloadDlgVisible: false, // 下载弹窗
      dialogVisible: false, // 全屏弹窗
      curPlayer: '', // 当前播放对象
      curTime: '00:00:00', // 当前播放时间
      recordData: [], // 日历上的回放记录
      currentPage: 1, // 默认第1页
      totalVideosArray: [], // 总共的数据
      curVideosArray: [], // 当前展示的数据
      showVideoPageSize: 4, // 每屏显示视频的个数 默认9宫格
      curVideoIndex: 1000,
      curNode: '', // 当前选中设备树节点
      stop: require('../../assets/images/stop-disable.png'),
      play: require('../../assets/images/play-disable.png'),
      pause: require('../../assets/images/pause.png'),
      records: [], // timeBar上的回放记录
      snapList: [], // 抓图列表
      curCalendar: '' // 当前日历时间 YYYY-MM-DD
    }
  },

  beforeCreate () {
    this.isLive = false
  },

  created () {
    this.init()
    const me = this
    // 监听键盘按键事件
    document.addEventListener('keyup', function (e) {
      if (e.keyCode === 27) {
        // 这一步只能监听到全屏页面的esc 视频中的esc监听不到
        if (me.dialogVisible) {
          me.dialogVisible = false
        }
      }
    })
  },

  mounted () {

  },

  methods: {
    /**
     * 回放当前页数改变
     */
    currentRecordPageChange (val) {
      this.curRecordPage = val
      this.curPageRecord = this.sliceRecordList(this.curRecordPage)
    },

    /**
     * 获取回放总页数
     */
    getRecordTotalPageCount () {
      var tPageNum =
        this.records.length % this.downloadPageSize > 0
          ? parseInt(this.records.length / this.downloadPageSize) + 1
          : parseInt(this.records.length / this.downloadPageSize)
      if (tPageNum === 0) tPageNum = 1
      return tPageNum
    },

    /**
     * 获取当前页码的回放列表
     */
    sliceRecordList (curPage) {
      var tPageNum = this.getRecordTotalPageCount()
      if (curPage > tPageNum) return []
      var start = (curPage - 1) * this.downloadPageSize
      if (curPage === tPageNum) {
        return this.records.slice(start)
      } else {
        var end = start + this.downloadPageSize
        return this.records.slice(start, end)
      }
    },

    /**
     * 下载回放视频
     */
    downloadMp4 () {
      if (this.radio === -1) return
      const item = this.curPageRecord[this.radio]
      var url = item.url
      const eleLink = document.createElement('a')
      eleLink.download = url
      eleLink.style.display = 'none'
      eleLink.href = url
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    },

    /**
     * 下载每页显示条数改变
     */
    downloadPageSizeChange (val) {
      this.downloadPageSize = val
      this.curRecordPage = 1
      this.curPageRecord = this.sliceRecordList(this.curRecordPage)
    },

    /**
     * 点击表格行
     */
    ClickTableRow (row) {
      this.radio = this.records.indexOf(row)
    },

    /**
     * 格式化文件大小
     */
    formatFileSize (row, column) {
      const size = row.fileSize / (1024 * 1024)
      return Math.ceil(size) + 'M'
    },

    /**
     * 格式化文件时间
     */
    formatFileDate (date, seconds) {
      // 此写法IE下返回NaN
      // var d = new Date(date + ' 00:00:00')
      // var timestamp = d.getTime()
      // d.setTime(timestamp + 1000 * seconds)
      // return timeFormat(d.getTime())
      date = date + ' 00:00:00'
      var timestamp = Date.parse(date.replace(/-/g, '/')) + 1000 * seconds
      return timeFormat(timestamp)
    },

    /**
     * 格式化文件开始时间
     */
    formatFileStart (row, column) {
      var seconds = row.start * 60
      return this.formatFileDate(row.date, seconds)
    },

    /**
     * 格式化文件结束时间
     */
    formatFileEnd (row, column) {
      var seconds = row.start * 60 + row.duration * 60
      return this.formatFileDate(row.date, seconds)
    },

    init () {
      // 初始加载9个空元素
      this.totalVideosArray = []
      for (let i = 0; i < this.showVideoPageSize; i++) {
        this.totalVideosArray.push('')
      }
      this.curVideosArray = this.totalVideosArray.slice(
        0,
        this.showVideoPageSize
      )
    },

    /**
     * 在线或所有设备切换
     */
    changeOnlineOrAll (isOnline) {
      if (Number(this.isOnline) === Number(isOnline)) return
      // this.getAllDeptDevices()
      this.isOnline = isOnline
      // 如果选择在线设备，则清除所有设备的数据
      if (this.isOnline) {
        const divs = document.querySelectorAll('.el-tree-node')
        for (let i = 0; i < divs.length; i++) {
          divs[i].classList.remove('is-current')
        }
      } else {
        this.selectedIndex = 200 // 激活在线设备 初始值200，不激活
        this.initOnlineArray()
      }
      // 更新时间轴指针的位置
      this.timeupdate(0)
      this.records = []
      this.recordData = []
      this.curNode = ''
      this.snapList = []
      this.currentPage = 1 // 默认第1页
      this.showVideoPageSize = 4 // 每屏显示视频的个数 默认9宫格
      this.curVideoIndex = 1000
      this.curPlayer = ''
      this.init()
    },

    /**
     * 检查全屏
     */
    checkFull () {
      let isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },

    /**
     * 设备离线
     * @param {device} device 设备信息
     */
    deviceOffline (device) {
      // 如果展示全部设备，则不处理
      if (!this.isOnline) return
      if (device.children && device.children.length > 0) {
        device.children.forEach(item => {
          // 如果当前播放对象，下线了
          if (this.curPlayer && this.curPlayer.id === item.id) { this.stopPlayRecord() } else {
            // 视频墙中视频对象，下线
            var video = this.totalVideosArray.find(
              v => v !== '' && v.id === item.id
            )
            if (video !== undefined) {
              var index = this.totalVideosArray.indexOf(video)
              if (index !== -1) {
                this.totalVideosArray[index] = ''
              }
            }
            this.curVideosArray = this.totalVideosArray.slice(
              (this.currentPage - 1) * this.showVideoPageSize,
              this.currentPage * this.showVideoPageSize
            )
          }

          if (this.curNode.id === item.id) {
            this.selectedIndex = 200
            this.records = []
            this.recordData = []
            this.curNode = ''
            this.snapList = []
          }
        })
      }
    },

    /**
     * 设置当前播放对象
     */
    setCurrentPlayerObject (player) {
      if (player.id !== this.curPlayer.id) {
        if (this.curPlayer) {
          // 需要记录时间轴上的时间，和播放的时间
          this.curPlayer.curTime = this.curTime
          if (this.curPlayer.isPlay) { this.curPlayer.playTime = this.curTime }
          // 取消订阅进度更新事件
          var ctrl = this.findVideoControl()
          if (ctrl !== undefined) {
            ctrl.subTimeupdate(false)
          }
        }
        this.curPlayer = player
        // 设置时间轴进度
        if (this.curPlayer.curTime) {
          var arry = this.curPlayer.curTime.split(':')
          var time =
            parseInt(arry[0]) * 60 * 60 +
            parseInt(arry[1]) * 60 +
            parseInt(arry[2])
          this.timeupdate(time)
        } else this.timeupdate(0)

        // 订阅进度更新事件
        ctrl = this.findVideoControl()
        if (ctrl !== undefined) {
          ctrl.subTimeupdate(true)
        }
      }
      // 查询回放记录
      // 设置日历
      if (this.curPlayer.calendar && this.curPlayer.calendar !== this.curCalendar) {
        // setDate函数，若日历日期改变，会触发查询回放记录
        this.$refs.calendarCtrl.setDate(this.curPlayer.calendar)
      } else {
        this.dateChange(this.$refs.calendarCtrl.getYYMM())
        this.searchRecord(this.$refs.calendarCtrl.getYYMMDD())
      }
    },

    /**
     * 初始化OnlineArray
     */
    initOnlineArray () {
      this.onlineArray.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(item, 'isPlay')) {
          delete item.isPlay
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach(list => {
            list.isSelected = false
          })
        }
      })
    },

    /**
     *  点击在线设备中红外光或可见光
     */
    playDeviceVideo (item, list, index1, index2) {
      this.selectedIndex = index1
      if (
        this.curNode &&
        this.curNode.id === this.onlineArray[index1].children[index2].id
      ) { return }

      this.curNode = this.onlineArray[index1].children[index2]
      this.curNode.pID = this.onlineArray[index1].id
      this.curNode.parentLabel =
        this.onlineArray[index1].label +
        '-' +
        this.onlineArray[index1].children[index2].label
      var player = this.totalVideosArray.find(v => v.id === this.curNode.id)
      if (player === undefined) {
        player = ''
      }
      this.setCurrentPlayerObject(player)

      if (!this.onlineArray[index1].children[index2].isSelected) {
        // 默认去掉所有isSelected的样式
        this.onlineArray.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(list => {
              list.isSelected = false
            })
          }
        })
        this.$set(
          this.onlineArray[index1].children[index2],
          'isSelected',
          true
        )
      }
    },

    /**
     * 激活在线设备和对应的相机
     * @param {String}} id 相机id
     */
    activeOnlineArrayItem (id) {
      this.onlineArray.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(list => {
            list.isSelected = false
            if (list.id === id) {
              this.selectedIndex = index
              list.isSelected = true
            }
          })
        }
      })
    },

    /**
     * 点击当前视频
     */
    operateCurVideo (curVideo, index) {
      if (this.curVideoIndex === index && !curVideo && curVideo.id === this.curPlayer.id) return

      this.curVideoIndex = index
      // 如果不是空白区域，给对应的数结构添加样式
      if (this.curVideosArray[index]) {
        if (this.isOnline) {
          this.activeOnlineArrayItem(curVideo.id)
        } else {
          // 点击当前视频区域，默认去掉所有激活的样式
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
        }
        if (this.curNode && this.curNode.id === curVideo.id) return

        this.curNode = this.curVideosArray[index].treeNode
        this.setCurrentPlayerObject(this.curVideosArray[index])
      }
    },

    /**
     * 获取子组件传递过来的数据
     */
    getSelectedData (data, pData) {
      if (this.curNode && this.curNode.id === data.id) return
      this.curNode = data
      this.curNode.parentLabel = pData.label + '-' + this.curNode.label
      this.curNode.pID = pData.id
      var player = this.totalVideosArray.find(v => v.id === data.id)
      if (player === undefined) {
        player = ''
      }
      this.setCurrentPlayerObject(player)
    },

    /**
     * 日历日期改变
     * @param {String} date 日期信息 YYMM
     */
    dateChange (date) {
      if (!this.curNode) return
      this.$axios
        .post(api.getMp4RecordFile, {
          vhost: '__defaultVhost_ ',
          app: 'live',
          stream: this.curNode.id,
          period: date,
          secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc'
        })
        .then(res => {
          var rs = res.data
          if (rs && rs.code === 0) {
            this.recordData = rs.data.paths
          }
        })
        .catch(err => {
          console.log('getMp4RecordFile Err : ' + err)
        })
    },

    /**
     * 获取抓图列表
     * @param {String} date 日期信息 YYMMDD
     */
    getSnapList (date) {
      this.snapList = []
      // 此写法IE下返回NaN
      // var timestamp = new Date(date + ' 00:00:00').getTime()
      date = date + ' 00:00:00'
      var timestamp = Date.parse(date.replace(/-/g, '/'))
      this.$axios
        .get(api.getSnapList, {
          params: {
            deviceCode: this.curNode.pID,
            channelId: this.curNode.streamType,
            date: timestamp
          }
        })
        .then(res => {
          var rs = res.data
          if (rs && rs.code === 0) {
            this.snapList = rs.data
          }
        }).catch(err => {
          console.log('getSnapList Err : ' + err)
        })
    },

    /**
     * 搜索回放mp4文件
     * @param {String} date 日期信息 YYMMDD
     */
    searchRecord (date) {
      this.curCalendar = date
      if (!this.curNode) return
      this.records = []
      this.playbarEnable(false)
      this.getSnapList(date)
      this.$axios
        .post(api.getMp4RecordFile, {
          vhost: '__defaultVhost_ ',
          app: 'live',
          stream: this.curNode.id,
          period: date,
          secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc'
        })
        .then(res => {
          var rs = res.data
          if (rs && rs.code === 0) {
            rs.data.paths.forEach(p => {
              var d = new Date(p.start_time * 1000)
              var start =
                d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60
              var index = rs.data.rootPath.indexOf('/record')
              var url = ''
              if (index !== -1) {
                url =
                  globalApi.baseUrl + '/video-service1' +
                  rs.data.rootPath.substring(index) +
                  p.file_name
              }
              const device = this.curNode.parentLabel.split('-')[0]
              var r = {
                duration: p.time_len / 60,
                start: start,
                url: url,
                fileName: p.file_name,
                fileSize: p.file_size,
                deviceName: device,
                date: date
              }
              this.records.push(r)
              if (this.records.length > 0) {
                this.playbarEnable(true)
              }
            })
          }
        })
        .catch(err => {
          console.log('getMp4RecordFile Err : ' + err)
        })
    },
    // 切换每屏显示的个数
    changeVideosType (n) {
      // this.currentPage = 1
      // this.curVideoIndex = 1000
      // this.showVideoPageSize = n
      // // 将有数据的视频放到前面
      // const newTotalVideosArray = []
      // this.totalVideosArray.forEach(item => {
      //   if (item) {
      //     newTotalVideosArray.push(item)
      //   }
      // })
      // for (
      //   let i = 0;
      //   i < this.totalVideosArray.length - newTotalVideosArray.length;
      //   i++
      // ) {
      //   newTotalVideosArray.push('')
      // }
      // this.totalVideosArray = newTotalVideosArray
      // // 在总数据中获取实际有视频的数据
      // const result = this.totalVideosArray.filter(item => item !== '')
      // console.log(result)
      // // 1.如果有视频小于每屏的展示数据（包含没有的情况）
      // if (result.length <= n) {
      //   // 1.1由大变小
      //   if (this.totalVideosArray.length >= n) {
      //     this.curVideosArray = this.totalVideosArray.slice(0, n)
      //     // 此操作过滤掉不要的空元素
      //     this.totalVideosArray = this.totalVideosArray.slice(0, n)
      //   } else {
      //     // 1.2由小变大
      //     const j = this.totalVideosArray.length
      //     for (let i = 0; i < n - j; i++) {
      //       this.totalVideosArray.push('')
      //     }
      //     this.curVideosArray = this.totalVideosArray.slice(0, n)
      //   }
      // } else {
      //   // 2.如果实际视频并且大于每屏的展示数据
      //   // 过滤掉本身数据中空元素
      //   this.totalVideosArray = this.totalVideosArray.filter(
      //     item => item !== ''
      //   )
      //   this.curVideosArray = this.totalVideosArray.slice(0, n)
      //   console.log(this.curVideosArray)
      // }
      // if (this.curVideosArray[0]) {
      //   this.activeFirstTree()
      // }

      if (this.isOnline) {
        // 清除所有的在线设备播放样式
        this.onlineArray.forEach(item => {
          if (Object.prototype.hasOwnProperty.call(item, 'isPlay')) {
            delete item.isPlay
          }
        })
      } else {
        const bs = document.querySelectorAll(
          '.el-tree-node__content span.is-leaf +span.custom-tree-node>span >b'
        )
        bs.forEach(item => {
          item.parentElement.setAttribute('class', '')
        })
      }

      this.currentPage = 1
      this.curVideoIndex = 1000
      this.showVideoPageSize = n
      this.init()
      // 更新时间轴指针的位置
      this.timeupdate(0)
      this.curPlayer = ''
    },

    // // 每一次切换屏幕或选择上一页下一页 默认当前显示的视频中第一个对应左边的树激活
    // activeFirstTree () {
    //   if (this.isOnline) {
    //     // 清除所有的在线设备播放样式
    //     this.onlineArray.forEach(item => {
    //       if (Object.prototype.hasOwnProperty.call(item, 'isPlay')) {
    //         delete item.isPlay
    //       }
    //     })
    //     this.activeOnlineArrayItem(this.curVideosArray[0].id)
    //     this.setOnlineItemLiveIcon(true, this.selectedIndex)
    //   } else {
    //     const divs = document.querySelectorAll('.el-tree-node')
    //     for (let i = 0; i < divs.length; i++) {
    //       divs[i].classList.remove('is-current')
    //     }
    //     document
    //       .querySelector('#liveVideo' + this.curVideosArray[0].id)
    //       .parentElement.parentElement.parentElement.parentElement.classList.add(
    //         'is-current'
    //       )
    //   }
    // },

    // // 上一页
    // pre (cpage) {
    //   // 始终截取当前页需要的数据
    //   this.curVideoIndex = 1000
    //   // const divs = document.querySelectorAll('.el-tree-node')
    //   // for (let i = 0; i < divs.length; i++) {
    //   //   divs[i].classList.remove('is-current')
    //   // }
    //   this.curVideosArray = this.totalVideosArray.slice(
    //     (cpage - 1) * this.showVideoPageSize,
    //     cpage * this.showVideoPageSize
    //   )
    //   this.activeFirstTree()
    // },
    // // 下一页
    // next (cpage) {
    //   // 清掉之前的选中状态
    //   this.curVideoIndex = 1000
    //   // const divs = document.querySelectorAll('.el-tree-node')
    //   // for (let i = 0; i < divs.length; i++) {
    //   //   divs[i].classList.remove('is-current')
    //   // }
    //   if (cpage * this.showVideoPageSize > this.totalVideosArray.length) {
    //     const j = this.totalVideosArray.length
    //     // 若不够，数据则补位空格
    //     for (let i = 0; i < cpage * this.showVideoPageSize - j; i++) {
    //       this.totalVideosArray.push('')
    //     }
    //   }
    //   console.log(this.totalVideosArray.length)
    //   this.curVideosArray = this.totalVideosArray.slice(
    //     (cpage - 1) * this.showVideoPageSize,
    //     cpage * this.showVideoPageSize
    //   )
    //   this.activeFirstTree()
    //   console.log(cpage, this.curVideosArray.length)
    // },

    // 动态渲染9个空元素
    machineStatusStyle (n) {
      if (n === 9) {
        return {
          width: '33.3%',
          height: '33.3%'
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

    /**
     * 跳转到XX秒开始播放
     * @param {Number} time xx秒
     */
    jumpToSeconds (time) {
      var ctrl = this.findVideoControl()
      if (ctrl !== undefined) {
        ctrl.jumpToSeconds(time)
      }
    },

    /**
     * 替换视频墙中某个视频
     * @param {Number} index 视频索引
     */
    replaceVideo (index, jumpInfo) {
      // 若指定位置之前有元素，去掉其激活的样式
      if (this.curVideosArray[index]) {
        if (this.isOnline) {
          // 去掉前个在线设备的播放样式
          for (var j = 0; j < this.onlineArray.length; j++) {
            var item = this.onlineArray[j]
            if (item.children && item.children.length > 0) {
              var c = item.children.find(
                i => i.id === this.curVideosArray[index].id
              )
              if (c !== undefined) {
                if (Object.prototype.hasOwnProperty.call(item, 'isPlay')) {
                  delete item.isPlay
                }
                break
              }
            }
          }
        } else {
          document
            .querySelector('#liveVideo' + this.curVideosArray[index].id)
            .parentElement.setAttribute('class', '')
          document
            .querySelector('#liveVideo' + this.curVideosArray[index].id)
            .parentElement.parentElement.parentElement.parentElement.classList.remove(
              'is-current'
            )
        }
        this.curVideosArray[index].streamUrl = ''
      }
      var i = index + this.showVideoPageSize * (this.currentPage - 1)
      this.totalVideosArray.splice(i, 1, this.curPlayer)
      const me = this
      setTimeout(() => {
        // 解决用v-for数据更新后视图并没更新解决
        me.curVideosArray.splice(i, 1, me.curPlayer)
        me.curVideoIndex = 1000
        if (jumpInfo.jump === true) {
          this.$nextTick(() => {
            this.jumpToSeconds(jumpInfo.jumpSeconds)
          })
        }
      }, 500)
    },

    /**
     * 添加Player
     * @param {Object} player
     */
    addPlayer (player, jumpInfo) {
      this.curPlayer = player
      // 1.1默认位置添加
      if (this.curVideoIndex === 1000) {
        const i = this.totalVideosArray.indexOf('')
        // 如果有空元素，则替换
        if (i !== -1) {
          this.totalVideosArray.splice(i, 1, player)
          this.curVideosArray = this.totalVideosArray.slice(
            (this.currentPage - 1) * this.showVideoPageSize,
            this.currentPage * this.showVideoPageSize
          )
          if (jumpInfo.jump === true) {
            this.$nextTick(() => {
              this.jumpToSeconds(jumpInfo.jumpSeconds)
            })
          }
        } else {
          // 若没有空元素，则替换第一个
          this.replaceVideo(0, jumpInfo)
        }
      } else {
        // 1.2指定位置添加
        // 若指定位置之前有元素，去掉其激活的样式
        this.replaceVideo(this.curVideoIndex, jumpInfo)
      }
    },

    /**
     * 移除Player
     * @param {Object} player
     */
    removePlayer (player) {
      var index = this.totalVideosArray.indexOf(player)
      if (index !== -1) {
        this.totalVideosArray[index] = ''
        // 去掉黄色边框
        index = this.curVideosArray.indexOf(player)
        if (index !== -1 && index === this.curVideoIndex) {
          this.curVideoIndex = 1000
        }
      }
      // 解决用v-for数据更新后视图并没更新解决
      this.curVideosArray.splice(index, 1, '')
      this.curPlayer = ''
    },

    /**
     * 开始播放
     */
    playRecord () {
      // 如果当前有播放对象
      let r = ''
      if (this.curPlayer) {
        if (this.curPlayer.isPlay === false) {
          var ctrl = this.findVideoControl()
          if (ctrl !== undefined) {
            ctrl.play()
            this.curPlayer.isPlay = true
            // 判断是否需要跳转播放
            if (this.curPlayer.playTime !== this.curPlayer.curTime) {
              r = this.findRecordByTime(this.curPlayer.records)
              if (r !== undefined) {
                ctrl.jumpRecord(r.record.url, r.jump, r.jumpSeconds)
              }
            }
          }
        }
      } else {
        r = this.findRecordByTime(this.records)
        if (r === undefined) return
        var seconds = r.record.start * 60
        if (r.jump === true) seconds += r.jumpSeconds
        this.timeupdate(seconds)
        this.addPlayer(
          {
            treeNode: this.curNode,
            id: this.curNode.id,
            streamUrl: r.record.url,
            isLive: false,
            records: this.records,
            timeupdate: true,
            isPlay: true,
            curTime: this.curTime, // 时间轴上的时间
            playTime: this.curTime, // 播放的时间
            calendar: this.curCalendar, // 回放日期
            parentLabel: this.curNode.parentLabel
          },
          r
        )
      }

      if (this.isOnline) {
        this.setOnlineItemLiveIcon(true, this.selectedIndex)
      } else this.setTreeNodeLiveIcon(true, this.curNode.id)
    },

    /**
     * 暂停播放
     */
    pauseRecord () {
      var ctrl = this.findVideoControl()
      if (ctrl !== undefined) {
        ctrl.pause()
        this.curPlayer.isPlay = false
        // 记录当前时间轴上时间
        this.curPlayer.curTime = this.curTime
        this.curPlayer.playTime = this.curTime
      }
    },

    /**
     * 停止播放
     */
    stopPlayRecord () {
      if (this.curPlayer) {
        if (this.isOnline) {
          this.setOnlineItemLiveIcon(false, this.selectedIndex)
        } else this.setTreeNodeLiveIcon(false, this.curPlayer.id)

        this.removePlayer(this.curPlayer)
      }
      // 更新时间轴指针的位置
      this.timeupdate(0)
    },

    /**
     * 设置设备树节点的liveicon
     */
    setTreeNodeLiveIcon (isPlay, id) {
      const curSpan = document.getElementById('liveVideo' + id).parentElement
      if (isPlay) {
        curSpan.setAttribute('class', 'liveIcon')
      } else {
        curSpan.setAttribute('class', '')
      }
    },

    /**
     * 设置在线设备的liveicon
     */
    setOnlineItemLiveIcon (isPlay, index) {
      if (isPlay) {
        Reflect.set(this.onlineArray[index], 'isPlay', isPlay)
      } else {
        if (
          Object.prototype.hasOwnProperty.call(
            this.onlineArray[index],
            'isPlay'
          )
        ) {
          delete this.onlineArray[index].isPlay
        }
      }
    },

    /**
     * 全屏
     */
    showFullScreen () {
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

    /**
     * 查找视频墙组件
     */
    findVideoControl () {
      if (!this.curPlayer) return undefined
      return this.$refs.videoCtrl.find(
        c => c.videoInfo.id === this.curPlayer.id
      )
    },

    /**
     * 播放进度更新
     * @param {seconds} 当前进度（秒）
     */
    timeupdate (seconds) {
      this.$refs.timeCtrl.jumpMinute(seconds / 60)
    },

    /**
     * 根据时间找回放记录
     */
    findRecordByTime (records) {
      if (records === '' || records.length === 0) return undefined

      var arry = this.curTime.split(':')
      var time =
        parseInt(arry[0]) * 60 + parseInt(arry[1]) + parseInt(arry[2]) / 60
      var r = records.find(
        x => x.start <= time && x.start + x.duration >= time
      )
      // 是否需要跳转
      var jump = false
      // 跳转的秒数
      var jumpSeconds = 0
      if (r !== undefined) {
        jump = true
        jumpSeconds = (time - r.start) * 60
      } else {
        r = records.find(x => x.start > time)
      }

      if (r === undefined) {
        r = records[records.length - 1]
        jump = true
        jumpSeconds = r.duration * 60
      }

      return { record: r, jump: jump, jumpSeconds: jumpSeconds }
    },

    /**
     * 跳转播放
     */
    jump () {
      if (!this.curPlayer) return

      if (this.curPlayer.isPlay === true) {
        var r = this.findRecordByTime(this.curPlayer.records)
        if (r !== undefined) {
          var ctrl = this.findVideoControl()
          if (ctrl !== undefined) {
            ctrl.jumpRecord(r.record.url, r.jump, r.jumpSeconds)
          }
        }
      } else {
        this.curPlayer.curTime = this.curTime
      }
    },

    /**
     * playbar可用/禁用
     * @param {Boolean} isEnable 是否可用
     */
    playbarEnable (isEnable) {
      if (isEnable) {
        this.stop = require('../../assets/images/stop.png')
        this.play = require('../../assets/images/play.png')
      } else {
        this.stop = require('../../assets/images/stop-disable.png')
        this.play = require('../../assets/images/play-disable.png')
      }
    },

    /**
     * 下载回放视频
     */
    download () {
      if (this.records.length === 0) return
      this.curRecordPage = 1
      this.downloadDlgVisible = true
      this.curPageRecord = this.sliceRecordList(this.curRecordPage)
    }
  }
}
</script>
<style lang="less" scoped>
.playBack{
  padding:20px;
}
.leftContainer {
  box-sizing: border-box;
  padding: 27px 0px 0 28px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  //font-weight: bold;

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
    // /* --- 改变滚动条样式 --- */
    // .onlineList::-webkit-scrollbar {
    //   width: 10px;
    // }
    // /* --- 滚动条里面的滚动块 --- */
    // .onlineList::-webkit-scrollbar-thumb {
    //   border-radius: 10px;
    //   box-shadow: inset 0 0 5px rgb(0, 180, 255);
    //   background: rgba(0, 180, 255, 0.2);
    // }

    // /* --- 滚动条里面轨道 --- */
    // .onlineList::-webkit-scrollbar-track {
    //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    //   border-radius: 10px;
    //   background: #096090;
    // }
    // .onlineList::-webkit-scrollbar-corner {
    //   background: transparent;
    // }

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
        background: url(../../assets/images/visible_selected.png) no-repeat 4px
          center;
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

.video {
  box-sizing: border-box;
  padding: 21px 13px 0px 23px;
  //background: red;
  // position: relative;
  .box {
    display: flex;
    justify-content: space-between;
    margin-right: 64px;
    .title {
        width: 196px;
        height: 34px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 34px;
        padding-left: 30px;
        margin-bottom: 11px;
    }
  }
  .videoList {
    height: 700px;
    display: flex;
    flex-wrap: wrap;
     > div {
       > div {
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
    position: absolute;
    left: 23px;
    right: 23px;
    bottom: 70px;
    height: 56px;
    background: url(../../assets/images/tool-bar.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    .leftTool,
    .rightTool,
    .centerTool {
      position: relative;
      top: 16px;
      img {
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .leftTool {
      left: 40px;
    }

    .rightTool {
      margin-right: 20px;
      // .pagination {
      //   display: inline-block;
      //   position: relative;
      //   top: -12px;
      //   margin-right: 6px;
      //   /deep/.el-pagination {
      //     button {
      //       background-color: transparent !important;
      //       i {
      //         width: 20px;
      //         height: 20px;
      //         border-radius: 50%;
      //         background: #23cefd;
      //         text-align: center;
      //         line-height: 20px;
      //         color: #000;
      //       }
      //     }

      //     button[disabled] {
      //       i {
      //         background: #999;
      //         color: #2d506f;
      //       }
      //     }
      //   }
      // }

      .download {
        display: inline-block;
        margin-right: 18px;
        width: 28px;
        height: 25px;
        background: url("../../assets/images/download.png") no-repeat;
        cursor: pointer;
      }

      .download:active {
        background: url("../../assets/images/download-press.png") no-repeat;
      }
    }
  }

  .time {
    position: absolute;
    bottom: 20px;
    left: 40px;
    right: 40px;
  }
}

/deep/.el-dialog {
  .el-dialog__header {
    display: none;
  }
}

.videolistFullscreenStyle {
  position:fixed;
  top: 0;
  right: 0;
  width: 100%;
  height:100%!important;
  z-index: 1000;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  overflow: visible;
  background-image: url('../../assets/images/bg.png');
}

// 全屏弹框
.fullContainer {
  position: fixed;
  top: 0;
  // right: 0;
  left: 0;
  // bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  overflow: visible;
  // padding: 20px 30px;
  background: url(../../assets/images/bg.png) no-repeat;
    > div {
     > div {
        box-sizing: border-box;
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 10px;
        width:calc(100% - 10px);
        height:calc(100% - 10px);
        background: url(../../assets/images/video.png) no-repeat center center;
        background-color: #00497c;
      }
      div.active {
        border: 2px solid #fff464;
      }
    }
}

// 修改弹框样式
#d1.el-dialog__wrapper {
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
      background: url(../../assets/images/bg.png) no-repeat;
      > div {
        div {
          // cursor: pointer;
          height: 100%;
          margin-right: 19px;
          // margin-bottom: 20px;
          background: url(../../assets/images/video.png) no-repeat center center;
          background-color: #00497c;
        }
      }
    }
  }
}

.downloadDlg.el-dialog__wrapper {
  /deep/.el-dialog {
    background: transparent;
    .el-dialog__body {
      display: inline-block;
      padding: 0px;
      width: 100%;
      height: 359px;
      background: url(../../assets/images/download-box.png) no-repeat;
      .downloadContainer {
        padding: 20px;
        .title {
          display: inline-block;
          background: url(../../assets/images/header-bg.png) no-repeat;
          width: 202px;
          height: 45px;
          span {
            font-size: 18px;
            color: white;
            line-height: 45px;
            margin-left: 30px;
          }
        }
        .downloadBtn {
          cursor: pointer;
          position: absolute;
          left: 637px;
          display: inline-block;
          width: 112px;
          height: 32px;
          background: url(../../assets/images/downloag-bg.png) no-repeat;
          padding: 0px 0px 0px 17px;
          span {
            font-size: 14px;
            color: white;
            line-height: 32px;
            margin-left: 7px;
          }
        }
        .downloadBtn:active {
          background: url(../../assets/images/downloag-bg-press.png) no-repeat;
        }
        .close {
          cursor: pointer;
          position: absolute;
          top: 28px;
          left: 757px;
          display: inline-block;
          width: 18px;
          height: 18px;
          background: url(../../assets/images/close.png) no-repeat;
        }
      }
    }
  }
}

/* 删除表格下横线 */
.el-table::before {
  height: 0px;
}

.el-table {
  /* --- 改变滚动条样式 --- */
  ::-webkit-scrollbar {
   width: 17px;
  }
  /* --- 滚动条里面的滚动块 --- */
  /deep/ ::-webkit-scrollbar-thumb {
    background: #1c9ed7;
  }
  /* --- 滚动条里面轨道 --- */
  ::-webkit-scrollbar-track {
    background: rgba(30, 176, 252, 0.3);
  }

  margin-top: 15px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  background-color: transparent;
  /* 表格表头样式 */
  /deep/.el-table__header-wrapper th {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    height: 26px;
    padding: 0;
    background-color: rgba(54, 143, 187, 1);
  }

   /deep/.el-table__body-wrapper {
    height: calc(100% - 26px) !important;
  }

  /deep/.el-table__body{
    width: 100% !important;
  }

  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
  }

  /deep/.el-table__body tr {
    background-color: rgba(51, 105, 132, 1);
  }

  /* 鼠标hover每行的样式*/
  /deep/.el-table__body tr:hover > td {
    background-color: rgba(51, 105, 132, 1);
  }

  /deep/td,
  /deep/th {
    border: none;
  }

  //单选框样式
  /deep/ .el-radio__inner {
    border: 1px solid rgba(255, 255, 255, 1);
    background: transparent;
  }

  //单选框选中样式
  /deep/ .el-radio__input.is-checked .el-radio__inner::after {
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 1);
  }
}

/* 修改偶数行颜色*/
/deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(54, 143, 187, 1);
}
</style>
