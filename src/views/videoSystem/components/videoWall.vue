<template>
  <div class="playerStyle" @dblclick="fullScreen" @click="addPoint">
    <LivePlayer
      ref="playerCtrl"
      :videoUrl="videoInfo.streamUrl"
      :show-custom-button="false"
      :muted="false"
      :controls="false"
      :autoplay="true"
      oncontextmenu="return false"
      fluent
      :live="videoInfo.isLive !==false"
      aspect="fullscreen"
    >
      <div class="info">
        <span></span>
        <span>{{videoInfo.parentLabel}}</span>
      </div>
      <!-- 人员识别 -->
      <div class="face" v-show="videoInfo.positionList&&videoInfo.positionList.length>0">
        <span
          v-for="(item,index) in videoInfo.positionList"
          :key="index"
          :style="{left:item.left/1280*(videoInfo.isShowOperate?1920:playerWidth)+'px',top:item.top/720*(videoInfo.isShowOperate?1080:playerHeight)+'px',width:item.width/1280*(videoInfo.isShowOperate?1920:playerWidth)+'px',height:item.height/720*(videoInfo.isShowOperate?1080:playerHeight)+'px'}"
        ></span>
      </div>
      <div
        class="fullScreen"
        v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false&&bIsFullScreen===true"
        @dblclick.stop="stopEvent"
        @click.stop="stopEvent"
      >
        <div class="deviceInfo">
          <div class="deviceTitle">云台</div>
          <div class="operate">
            <div class="icons">
              <div
                v-for="(item,index) in 9"
                :key="index"
                @mousedown="startChange(index)"
                @mouseup="stopChange(index)"
              ></div>
            </div>
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
                style="width:106px;margin-left:16px;margin-right:16px;"
              ></el-slider>
              <span>{{step}}</span>
            </div>
            <div class="sliderTip">步速值范围为1-8之间</div>
          </div>
        </div>
      </div>
      <div
        class="fullScreenMap"
        v-show="videoInfo.deviceTypeCode==='WRJ'&&videoInfo.isShowOperate&&bIsFullScreen===true"
      >
        <div class="infoTitle">位置</div>
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
      <div
        class="fullScreenMark"
        v-show="showMarkForm"
        @dblclick="stopEvent"
        @click.stop="stopEvent"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="标签名称" prop="tagName">
            <el-input v-model.trim="ruleForm.tagName" placeholder="请输入标签名称" style="width:350px"></el-input>
          </el-form-item>
          <el-form-item label="标签类型" prop="tagType">
            <select
              required
              v-model="ruleForm.tagType"
              style="width:350px;height:34px;border-radius: 5px;padding: 0 12px;"
            >
              <option value disabled selected hidden>请选择标签类型</option>
              <option
                :value="type.id"
                v-for="(type,index) in tageTypeArray"
                :key="index"
              >{{type.name}}</option>
            </select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </LivePlayer>
  </div>
</template>
<script>
import LivePlayer from '@liveqing/liveplayer'
import droneInfoMixin from '../../../utils/droneInfoMixin'
export default {
  data () {
    return {
      showMarkForm: false,
      ruleForm: {
        tagName: '',
        tagType: ''
      },
      rules: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8个字符', trigger: 'blur' }
        ],
        tagType: [
          { required: true, message: '请选择标签类型', trigger: 'change,blur' }
        ]
      },
      tageTypeArray: [
        {
          id: '1',
          name: '工厂'
        },
        {
          id: '2',
          name: '建筑物'
        },
        {
          id: '3',
          name: '医院'
        },
        {
          id: '4',
          name: '学校'
        }
      ],
      isSub: false, // 是否监听播放进度改变
      isUpdateTime: true,
      curTime: 0,
      curUrl: '',
      activeCurIcon: '', // 默认选中云台的图标
      zoomSpeed: 0, // 变倍
      focusSpeed: 0, // 变焦
      lrisSpeed: 0, // 光圈
      step: 4, // 步速值
      bIsFullScreen: false, // 播放器是否全屏
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
      }
    }
  },

  mixins: [droneInfoMixin],

  components: {
    LivePlayer
  },

  props: {
    videoInfo: {
      default: () => {}
    },
    playerWidth: [Number, String],
    playerHeight: [Number, String]
  },

  computed: {
    deviceCode () {
      return this.videoInfo.deviceCode
    }
    // curFaceArray () {
    //   if (this.faceArray && this.faceArray.length > 0) {
    //     debugger
    //     return this.faceArray.filter(
    //       item => item.deviceCode === this.videoInfo.deviceCode
    //     )
    //   }
    //   return []
    // }
  },

  watch: {
    curTime (val) {
      var r = this.videoInfo.records.find(x => x.url === this.curUrl)
      if (r !== undefined && this.isUpdateTime) {
        this.$emit('timeupdateEvent', this.curTime + r.start * 60)
      }
    },
    deviceCode (val) {
      this.setDroneDevCode(val)
    }
  },

  mounted () {
    // 如果是回放
    if (this.videoInfo.isLive === false) {
      this.subEnded()
      this.subTimeupdate(this.videoInfo.timeupdate)
      this.curUrl = this.videoInfo.streamUrl
    }
    this.setDroneDevCode(this.videoInfo.deviceCode)

    var elementResizeDetectorMaker = require('element-resize-detector')
    var erd = elementResizeDetectorMaker()
    var me = this
    this.startTime = new Date()
    erd.listenTo(this.$refs.playerCtrl.player.el_, function (element) {
      var width = element.offsetWidth
      var height = element.offsetHeight
      if (width === window.screen.width && height === window.screen.height) {
        me.bIsFullScreen = true
        me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: true })
      } else {
        me.bIsFullScreen = false
        me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: false })
        me.resetForm('ruleForm')
      }
    })
  },

  methods: {
    submitForm (formName) {
      console.log(this.ruleForm.tagType)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.showMarkForm = false
      this.$refs[formName].resetFields()
    },
    addPoint (e) {
      if (this.checkFull()) {
        console.log(e.pageX, e.pageY)
        // this.videoInfo.streamUrl = 'ws://111.47.13.103:40007/live/34020000001310000005.flv'
        // setTimeout(() => {
        //   this.$refs.playerCtrl.player.requestFullscreen()
        // }, 500)
        if (this.showMarkForm) {
          return
        }
        this.showMarkForm = true
      }
    },
    // 阻止冒泡
    stopEvent (event) {
      event.stopPropagation()
      return false
    },
    play () {
      this.$refs.playerCtrl.player.play()
    },
    stopAll () {
      var videoInfo = { srcUrl: '', isLive: true }
      this.$emit('update:videoInfo', videoInfo)
    },

    /**
     * 跳转回放记录
     * @param {String} url 跳转记录的url
     * @param {Boolean} jump 是否需要快进
     * @param {jumpSeconds} url 快进的秒数
     */
    jumpRecord (url, jump, jumpSeconds) {
      // 获取暂停状态
      var isPause = this.$refs.playerCtrl.player.paused()
      if (this.curUrl === url) {
        jumpSeconds = jump === true ? jumpSeconds : 1
        // 防止当前视频播放完后，livePlayer变成暂停状态
        if (isPause) {
          this.play()
        }
        this.jumpToSeconds(jumpSeconds)
      } else {
        // 如果需要跳转url,且需要快进，则暂停更新进度
        if (jump === true) {
          this.isUpdateTime = false
        }
        if (!isPause) {
          this.pause()
        }
        this.changeVideoUrl(url)
        if (jump === true) {
          setTimeout(() => {
            // 恢复更新进度
            this.isUpdateTime = true
            this.jumpToSeconds(jumpSeconds)
          }, 500)
        }
      }
    },

    /**
     * 全屏
     */
    fullScreen () {
      // 防止弹出全屏视频对话框后，player为null
      var player = this.$refs.playerCtrl.player
      if (player.isFullscreen()) {
        player.exitFullscreen()
      } else {
        player.requestFullscreen()
      }

      if (this.videoInfo.deviceTypeCode === 'WRJ') {
        const tmpMap = this.$refs.gduMap.map2D
        setTimeout(() => {
          tmpMap._map.updateSize()
        }, 500)
      }
    },

    /**
     * 跳转到XX秒开始播放
     * @param {Number} time xx秒
     */
    jumpToSeconds (time) {
      this.$refs.playerCtrl.player.currentTime(time)
    },

    /**
     * 暂停播放
     */
    pause () {
      this.$refs.playerCtrl.player.pause()
    },

    /**
     * 播放结束
     */
    ended: function () {
      if (this.videoInfo.isLive === false) {
        // 播放完成后，自动播放回放记录中的下一个mp4
        var r = this.videoInfo.records.find(x => x.url === this.curUrl)
        if (r !== undefined) {
          var index = this.videoInfo.records.indexOf(r)
          // 如果不是最后一个回放记录，就继续播放下一个记录
          if (index !== -1 && index < this.videoInfo.records.length - 1) {
            var url = this.videoInfo.records[index + 1].url
            console.log('继续播放下一个记录:' + url)
            this.changeVideoUrl(url)
          } else {
            console.log(this.curUrl + '----最后一个回放记录播放完毕')
            // 将时间轴跳到24点
            if (this.isSub) {
              this.$emit('timeupdateEvent', 24 * 60 * 60)
            }
          }
        }
      }
    },

    /**
     * 改变播放地址
     * @param {String} url 播放地址
     */
    changeVideoUrl (url) {
      this.$refs.playerCtrl.player.src([{ src: url }])
      this.curUrl = url
    },

    /**
     * 更新进度
     */
    timeupdate: function () {
      if (this.videoInfo.isLive === false) {
        this.curTime = Math.floor(this.$refs.playerCtrl.player.currentTime())
      }
    },

    /**
     * 订阅更新进度事件
     */
    subTimeupdate (isSub) {
      this.isSub = isSub
      if (isSub === true) {
        // 防止回放视频已经播放完毕，没有触发timeupdate事件，而导致时间没有更新
        this.curTime = Math.floor(this.$refs.playerCtrl.player.currentTime())
        this.$refs.playerCtrl.player.on('timeupdate', this.timeupdate)
      } else {
        this.$refs.playerCtrl.player.off('timeupdate', this.timeupdate)
      }
    },

    /**
     * 订阅播放结束事件
     */
    subEnded () {
      this.$refs.playerCtrl.player.on('ended', this.ended)
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
    // // 按钮和变倍的鼠标弹起停止控制
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
    // // 变焦和光圈鼠标按下事件
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
    // // 变焦和光圈鼠标松开事件
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
    //         'api/ptz/' +
    //         this.videoInfo.deviceCode +
    //         '/' +
    //         this.videoInfo.id, params
    //       )
    //       .then(res => {
    //         if (res && res.data && res.data.code === 0) {
    //           console.log('控制成功了')
    //         }
    //       })
    //   } else {
    //     this.$axios
    //       .post(
    //         'api/fi/' +
    //         this.videoInfo.deviceCode +
    //         '/' +
    //         this.videoInfo.id, params
    //       )
    //       .then(res => {
    //         if (res && res.data && res.data.code === 0) {
    //           console.log('控制成功了')
    //         }
    //       })
    //   }
    // }
    // 鼠标按下
    startChange (index) {
      const params = {
        device_id: this.videoInfo.deviceCode,
        channel_id: this.videoInfo.id
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
    },
    // 鼠标松开
    stopChange (index) {
      if (index === 4) return
      const params = {
        device_id: this.videoInfo.deviceCode,
        channel_id: this.videoInfo.id,
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
    },
    // 云台操作
    changeViewVideo (params) {
      this.$axios
        .post('/video-service2/index/api/ptzConrol', params)
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            console.log('成功！')
          }
        })
    }
  },
  created () {}
}
</script>
<style lang="less" scoped>
select:invalid {
  color: #a3afb7;
}
.is-error select {
  border-color: #f56c6c;
}
.playerStyle {
  position: relative;
  width: 100%;
  height: 100%;
  :focus {
    outline: none;
  }
}

.info {
  position: absolute;
  left: 10px;
  top: 10px;
  :nth-child(1) {
    position: relative;
    top: -2px;
    display: inline-block;
    width: 17px;
    height: 10px;
    background: url(../../../assets/images/videowall-play.png) no-repeat;
  }

  :nth-child(2) {
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    margin-left: 8px;
  }
}
.face {
  span {
    position: absolute;
    // background: url(../../../assets/images/person.png) no-repeat;
    border:2px solid green;
  }
}
.fullScreen {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 293px;
  height: 509px;
  background: url(../../../assets/images/full-screen-operate.png) no-repeat;
  cursor: text;
  .deviceInfo {
    padding-top: 18px;
    .deviceTitle {
      box-sizing: border-box;
      width: 202px;
      height: 34px;
      background: url(../../../assets/images/device/info-title.png) no-repeat;
      line-height: 34px;
      padding-left: 37px;
      margin-left: 20px;
    }
    .operate {
      margin-top: 20px;
      .icons {
        display: flex;
        flex-wrap: wrap;
        padding-left: 45px;
        div {
          width: 48px;
          height: 48px;
          margin-right: 19px;
          margin-bottom: 19px;
          cursor: pointer;
        }
        div:nth-child(1) {
          background: url(../../../assets/images/device/7.png) no-repeat;
        }
        div:nth-child(1):hover {
          background: url(../../../assets/images/device/7_selected.png)
            no-repeat;
        }
        div:nth-child(2) {
          background: url(../../../assets/images/device/8.png) no-repeat;
        }
        div:nth-child(2):hover {
          background: url(../../../assets/images/device/8_selected.png)
            no-repeat;
        }
        div:nth-child(3) {
          background: url(../../../assets/images/device/9.png) no-repeat;
        }
        div:nth-child(3):hover {
          background: url(../../../assets/images/device/9_selected.png)
            no-repeat;
        }
        div:nth-child(4) {
          margin-right: 10px;
          background: url(../../../assets/images/device/4.png) no-repeat;
        }
        div:nth-child(4):hover {
          background: url(../../../assets/images/device/4_selected.png)
            no-repeat;
        }
        div:nth-child(5) {
          width: 64px;
          height: 64px;
          position: relative;
          margin-left: 2px;
          top: -7px;
          // left: -5px;
          margin-right: 10px;
          background: url(../../../assets/images/device/5.png) no-repeat;
          cursor: text;
          margin-bottom: 5px;
        }
        // div:nth-child(5):hover {
        //   background: url(../../../assets/images/device/5_selected.png)
        //     no-repeat;
        // }
        div:nth-child(6) {
          background: url(../../../assets/images/device/6.png) no-repeat;
        }
        div:nth-child(6):hover {
          background: url(../../../assets/images/device/6_selected.png)
            no-repeat;
        }
        div:nth-child(7) {
          background: url(../../../assets/images/device/1.png) no-repeat;
        }
        div:nth-child(7):hover {
          background: url(../../../assets/images/device/1_selected.png)
            no-repeat;
        }
        div:nth-child(8) {
          background: url(../../../assets/images/device/2.png) no-repeat;
        }
        div:nth-child(8):hover {
          background: url(../../../assets/images/device/2_selected.png)
            no-repeat;
        }
        div:nth-child(9) {
          background: url(../../../assets/images/device/3.png) no-repeat;
        }
        div:nth-child(9):hover {
          background: url(../../../assets/images/device/3_selected.png)
            no-repeat;
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
          margin-left: 37px;
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
            top: -3px;
          }
          span:nth-child(3):before {
            content: "|";
            position: absolute;
            left: -1px;
            color: #1ca1dc;
            top: -3px;
          }
          span:hover {
            background: linear-gradient(
              90deg,
              rgb(32, 72, 105) 0%,
              rgb(32, 72, 105) 100%
            );
          }
          span:nth-child(1):hover:after {
            display: none;
          }
          span:nth-child(3):hover:before {
            display: none;
          }
        }
      }
      .slider {
        display: flex;
        padding-left: 37px;

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
      .sliderTip {
        font-size: 14px;
        margin-top: 2px;
        padding-left: 65px;
        color: #fff;
        opacity: 0.5;
      }
    }
  }
}
.fullScreenMap {
  position: absolute;
  right: 30px;
  bottom: 81px;
  width: 293px;
  height: 279px;
  background: url(../../../assets/images/map_box.png) no-repeat;
  padding: 15px 10px;
  .infoTitle {
    padding-left: 35px;
    width: 202px;
    height: 34px;
    background: url(../../../assets/images/device/info-title.png) no-repeat;
    line-height: 34px;
  }
  .mapBox {
    margin-left: 12px;
    margin-top: 20px;
    width: 247px;
    height: 150px;
  }
}
.fullScreenMark {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background: #00497c;
  form {
    margin-top: 30px;
  }
  .el-button.el-button--primary {
    padding: 0;
    height: 40px !important;
    background: #409eff;
  }
}
</style>
