<template>
  <div>
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:index==0}" @click.stop="index=0">已选</div>
            <div :class="{active:index==1}" @click.stop="index=1">全部</div>
          </div>
          <div class="search">
            <el-input
              type="text"
              v-model.trim="filterDevice"
              placeholder="请输入设备名称"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <!-- 默认展示已选部分 -->
          <template v-if="index==0">
            <div
              class="list"
              v-for="(item,index) in listArray"
              :key="index"
              :class="{selected:selectedIndex==index}"
            >
              <p>
                <span class="area">{{item.area}}</span>
                <i></i>
              </p>
              <div class="btns">
                <el-button
                  :class="{visible:true, selected:curDevice==item.id, playing:item.playVl}"
                  @click.stop="changeSelectDevice(item.id,index)"
                  v-if="item.visibleText"
                >{{item. visibleText}}</el-button>
                <el-button
                  :class="{infrared:true, selected:curDevice==item.idIr, playing:item.playIr}"
                  @click.stop="changeSelectDevice(item.idIr,index)"
                  v-if="item.infraredText"
                >{{item.infraredText}}</el-button>
              </div>
            </div>
          </template>
          <!-- 全部部分 -->
          <template v-if="index==1">
            <Tree :treeData="treeData" :isLive="false" @selectedChange="getSelectedData" ref="tree"></Tree>
          </template>
        </div>
      </div>
      <div slot="center">
        <div class="video">
          <div class="box">
            <div class="title">回放</div>
            <div v-if="curNode">当前选中:{{curNode.label2}}</div>
          </div>
          <div class="videoList">
            <div
              v-for="(item,index) in curVideosArray"
              :key="index"
              :style="machineStatusStyle(showVideoPageSize)"
              @click.stop="operateCurVideo(item,index)"
              :class="{active:curVideoIndex===index}"
            >
              <VideoWall
                :videoInfo.sync="item"
                :key="index"
                v-if="item.srcUrl"
                ref="videoCtrl"
                @timeupdateEvent="timeupdate"
              ></VideoWall>
            </div>
          </div>
          <!-- 下面按钮部分 -->
          <div class="tools">
            <div class="leftTool">
              <img :src="ninePalace" @click.stop="changeVideosType(9)" />
              <img :src="fourPalace" @click.stop="changeVideosType(4)" />
              <img :src="onePalace" @click.stop="changeVideosType(1)" />
            </div>
            <div class="centerTool">
              <img :src="stop" @click="stopPlayRecord" />
              <img :src="play" @click="playRecord" v-show="!curPlayer.isPlay" />
              <img :src="pause" @click="pauseRecord" v-show="curPlayer.isPlay" />
            </div>
            <div class="rightTool">
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
              <img :src="fullScreen" @click.stop="dialogVisible=true" />
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
          :player="curPlayer"
          @searchRecordEvent="searchRecord"
        ></Calendar>
      </div>
    </VideoMain>
    <el-dialog :visible.sync="dialogVisible" width="100%" :fullscreen="true" tabindex="1" id="d1">
      <!-- <div class="fullContainer" v-if="dialogVisible" id="d1"> -->
      <div
        v-for="(item,index) in curVideosArray"
        :key="index"
        :style="machineStatusStyle(showVideoPageSize)"
      >
        <VideoWall :videoInfo="item" :key="index" ref="playerCtrl" v-if="item.srcUrl"></VideoWall>
      </div>
      <!-- </div> -->
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
export default {
  name: 'videoContainer',
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
      dialogVisible: false, // 全屏弹窗
      curPlayer: '', // 当前播放对象
      curTime: '00:00:00', // 当前播放时间
      recordData: [], // 日历上的回放记录
      currentPage: 1, // 默认第1页
      totalVideosArray: [], // 总共的数据
      curVideosArray: [], // 当前展示的数据
      showVideoPageSize: 9, // 每屏显示视频的个数 默认9宫格
      curVideoIndex: 1000,
      curDevice: '0', // 当前选中设备
      curNode: '', // 当前选中设备树节点
      stop: require('../../assets/images/stop-disable.png'),
      play: require('../../assets/images/play-disable.png'),
      pause: require('../../assets/images/pause.png'),
      records: [], // timeBar上的回放记录
      listArray: [
        {
          area: '发展大道黄浦路1',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          idIr: '1',
          id: '11',
          playVl: false,
          playIr: false
        },
        {
          area: '发展大道黄浦路2',
          infraredText: '红外光',
          isSelected: false,
          idIr: '22',
          id: '2',
          playVl: false,
          playIr: false
        },
        {
          area: '发展大道黄浦路3',
          visibleText: '可见光',
          isSelected: false,
          idIr: '33',
          id: '3',
          playVl: false,
          playIr: false
        },
        {
          area: '发展大道黄浦路4',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          idIr: '44',
          id: '4',
          playVl: false,
          playIr: false
        }
      ],
      videoInfo: { srcUrl: '', isLive: true }
    }
  },

  created () {
    // 初始加载9个空元素
    for (let i = 0; i < this.showVideoPageSize; i++) {
      this.totalVideosArray.push('')
    }
    this.curVideosArray = this.totalVideosArray.slice(
      0,
      this.showVideoPageSize
    )
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
  },

  methods: {
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
     * 设置当前播放对象
     */
    setCurrentPlayerObject (player) {
      if (player.id !== this.curPlayer.id) {
        if (this.curPlayer) {
          this.curPlayer.curTime = this.curTime
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
      this.dateChange(this.$refs.calendarCtrl.getYYMM())
      this.searchRecord(this.$refs.calendarCtrl.getYYMMDD())
    },

    /**
     * 点击当前视频
     */
    operateCurVideo (curVideo, index) {
      this.curVideoIndex = index
      // 如果不是空白区域，给对应的数结构添加样式
      if (this.curVideosArray[index]) {
        var i = this.totalVideosArray.indexOf(curVideo)
        if (i !== -1) {
          this.setCurrentPlayerObject(this.totalVideosArray[i])
        }
        this.curNode = this.curPlayer.treeNode
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
    },

    /**
     * 获取子组件传递过来的数据
     */
    getSelectedData (data, pData) {
      this.curNode = data
      this.curNode.label2 = pData.label + '-' + this.curNode.label
      var player = this.totalVideosArray.find(v => v.id === data.id)
      if (player === undefined) {
        player = ''
      }
      this.setCurrentPlayerObject(player)
    },

    /**
     * 修改选中设备
     */
    changeSelectDevice (id, index) {
      this.curDevice = id
      this.selectedIndex = index
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
          stream: 'yaochen',
          period: date,
          secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc'
        })
        .then(res => {
          var rs = res.data
          if (rs && rs.code === 0) {
            this.recordData = rs.data.paths
          }
        })
    },

    /**
     * 搜索回放mp4文件
     * @param {String} date 日期信息 YYMMDD
     */
    searchRecord (date) {
      if (!this.curNode) return
      this.records = []
      this.playbarEnable(false)
      this.$axios
        .post(api.getMp4RecordFile, {
          vhost: '__defaultVhost_ ',
          app: 'live',
          stream: 'yaochen',
          period: date,
          secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc'
        })
        .then(res => {
          var rs = res.data
          if (rs && rs.code === 0) {
            rs.data.paths.forEach(p => {
              var date = new Date(p.start_time * 1000)
              var start =
                date.getHours() * 60 +
                date.getMinutes() +
                date.getSeconds() / 60
              var index = rs.data.rootPath.indexOf('/record')
              var url = ''
              if (index !== -1) {
                url =
                  'http://116.85.50.50:8888' +
                  rs.data.rootPath.substring(index) +
                  p.file_name
              }

              var r = { duration: p.time_len / 60, start: start, url: url }
              this.records.push(r)
              if (this.records.length > 0) {
                this.playbarEnable(true)
              }
            })
          }
        })
    },
    // 切换每屏显示的个数
    changeVideosType (n) {
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
      }
    },
    // 上一页
    pre (cpage) {
      // 始终截取当前页需要的数据
      this.curVideoIndex = 1000
      const divs = document.querySelectorAll('.el-tree-node')
      for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('is-current')
      }
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
    },
    // 下一页
    next (cpage) {
      // 清掉之前的选中状态
      this.curVideoIndex = 1000
      const divs = document.querySelectorAll('.el-tree-node')
      for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('is-current')
      }
      if (cpage * this.showVideoPageSize > this.totalVideosArray.length) {
        const j = this.totalVideosArray.length
        // 若不够，数据则补位空格
        for (let i = 0; i < cpage * this.showVideoPageSize - j; i++) {
          this.totalVideosArray.push('')
        }
      }
      // console.log(this.totalVideosArray.length)
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
      // console.log(cpage, this.curVideosArray.length)
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
     * 添加Player
     * @param {Object} player
     */
    addPlayer (player) {
      this.curPlayer = player
      // 1.1默认位置添加
      if (this.curVideoIndex === 1000) {
        const i = this.totalVideosArray.indexOf('')
        // 如果有空元素，则替换
        if (i !== -1) {
          this.totalVideosArray.splice(i, 1, player)
          this.curVideosArray = this.totalVideosArray.slice(
            0,
            this.showVideoPageSize
          )
        } else {
          // 若没有空元素，则追加
          this.totalVideosArray.push(player)
          this.curVideosArray = this.totalVideosArray.slice(
            0,
            this.showVideoPageSize
          )
        }
      } else {
        // 1.2指定位置添加
        // 若指定位置之前有元素，去掉其激活的样式
        if (this.totalVideosArray[this.curVideoIndex]) {
          document
            .querySelector(
              '#liveVideo' + this.totalVideosArray[this.curVideoIndex].id
            )
            .parentElement.setAttribute('class', '')
          document
            .querySelector(
              '#liveVideo' + this.totalVideosArray[this.curVideoIndex].id
            )
            .parentElement.parentElement.parentElement.parentElement.classList.remove(
              'is-current'
            )
        }
        this.totalVideosArray.splice(this.curVideoIndex, 1, player)
        this.curVideoIndex = 1000
        this.curVideosArray = this.totalVideosArray.slice(
          0,
          this.showVideoPageSize
        )
      }
    },

    /**
     * 移除Player
     * @param {Object} player
     */
    removePlayer (player) {
      var index = this.totalVideosArray.indexOf(player)
      if (index !== -1) this.totalVideosArray[index] = ''
      this.curVideosArray = this.totalVideosArray.slice(
        0,
        this.showVideoPageSize
      )
      this.curPlayer = ''
    },

    /**
     * 开始播放
     */
    playRecord () {
      // 如果当前有播放对象
      if (this.curPlayer) {
        if (this.curPlayer.isPlay === false) {
          var ctrl = this.findVideoControl()
          if (ctrl !== undefined) {
            ctrl.play()
            this.curPlayer.isPlay = true
          }
        }
      } else {
        var r = this.findRecordByTime()
        if (r === undefined) return
        var seconds = r.record.start * 60
        if (r.jump === true) seconds += r.jumpSeconds
        this.timeupdate(seconds)
        this.addPlayer({
          treeNode: this.curNode,
          id: this.curNode.id,
          srcUrl: r.record.url,
          isLive: false,
          records: this.records,
          timeupdate: true,
          isPlay: true,
          curTime: this.curTime,
          label: this.curNode.label2
        })
        if (r.jump === true) {
          this.$nextTick(() => {
            this.jumpToSeconds(r.jumpSeconds)
          })
        }
      }

      this.setTreeNodeLiveIcon(true, this.curNode.id)
    },

    /**
     * 暂停播放
     */
    pauseRecord () {
      var ctrl = this.findVideoControl()
      if (ctrl !== undefined) {
        ctrl.pause()
        this.curPlayer.isPlay = false
      }
    },

    /**
     * 停止播放
     */
    stopPlayRecord () {
      if (this.curPlayer) {
        this.setTreeNodeLiveIcon(false, this.curPlayer.id)
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
      if (isPlay && !curSpan.getAttribute('class')) {
        curSpan.setAttribute('class', 'liveIcon')
      } else if (!isPlay) {
        curSpan.setAttribute('class', '')
      }
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
    findRecordByTime () {
      if (this.records.length === 0) return undefined

      var arry = this.curTime.split(':')
      var time =
        parseInt(arry[0]) * 60 + parseInt(arry[1]) + parseInt(arry[2]) / 60
      var r = this.records.find(
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
        r = this.records.find(x => x.start > time)
      }

      if (r === undefined) return undefined

      return { record: r, jump: jump, jumpSeconds: jumpSeconds }
    },

    /**
     * 跳转播放
     */
    jump () {
      if (this.curPlayer.isPlay === true) {
        var r = this.findRecordByTime()
        if (r !== undefined) {
          var ctrl = this.findVideoControl()
          if (ctrl !== undefined) {
            ctrl.changeVideoUrl(r.record.url, r.jump, r.jumpSeconds)
          }
        }
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
    }
  }
}
</script>
<style lang="less" scoped>
.leftContainer {
  box-sizing: border-box;
  padding: 27px 25px 0 28px;
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: bold;

  div.tab {
    display: flex;
    cursor: pointer;
    height: 34px;
    line-height: 34px;
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
    height: 62px;
    background: url(../../assets/images/list-unselected.png) no-repeat;
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
      }
      button.visible {
        background: url(../../assets/images/visible.png) no-repeat 4px center;
      }
      button.infrared {
        background: url(../../assets/images/infrared.png) no-repeat 4px center;
      }
      button.selected {
        border: 1px solid rgba(0, 255, 17, 1);
      }
      button.playing {
        background: rgba(0, 212, 14, 1);
      }
    }
  }
  div.selected {
    background: url(../../assets/images/list-selected.png) no-repeat;
  }
}

.video {
  box-sizing: border-box;
  padding: 21px 0px 0px 21px;
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
    }
  }
  .videoList {
    display: flex;
    flex-wrap: wrap;
    height: 710px;
    > div {
      // width: 384px;
      // width: 31%;
      box-sizing: border-box;
      height: 223px;

      margin-right: 11px;
      margin-bottom: 11px;
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
    bottom: 75px;
    width: 95%;
    height: 65px;
    background: url(../../assets/images/tool-bar.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    .leftTool,
    .rightTool,
    .centerTool {
      position: relative;
      top: 22px;
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
              color: #000;
            }
          }
        }
      }
    }
  }

  .time {
    position: absolute;
    bottom: 25px;
    width: 92%;
    left: 40px;
  }
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
