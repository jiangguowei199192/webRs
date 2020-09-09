<template>
  <div class="playerStyle">
    <LivePlayer
      ref="playerCtrl"
      :videoUrl="videoInfo.streamUrl"
      :show-custom-button="false"
      :muted="false"
      :controls="false"
      :autoplay="true"
      oncontextmenu="return false"
      fluent
      :stretch="true"
      :live="videoInfo.isLive !==false"
      aspect="fullscreen"
    >
      <div ref="playerArea" class="pointLayer" @dblclick="fullScreen">
        <div
          v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
          ref="drawBox"
          :class="{bg:showAR}"
        >
          <template v-if="showAR">
            <div class="header">AR实景地图指挥</div>
          </template>
          <div class="footer" @dblclick.stop="stopEvent">
            <a
              @mouseenter="showActive(1)"
              @mouseleave="showActive(0)"
              title="AR"
              @click="showAR=!showAR"
            >
              <img :src="arPic" alt title="AR" />
              <img v-show="active === 1" class="hide_tab" :src="arSelectedPic" />
            </a>
            <a
              @mouseenter="showActive(2)"
              @mouseleave="showActive(0)"
              @click="showRealPolice=!showRealPolice"
              title="火情报警"
            >
              <img :src="alarmPic" alt />
              <img v-show="active === 2" class="hide_tab" :src="alarmSelectedPic" />
            </a>
            <a @mouseenter="showActive(3)" @mouseleave="showActive(0)" title="抓取">
              <img :src="capturePic" alt />
              <img v-show="active === 3" class="hide_tab" :src="captureSelectedPic" />
            </a>
            <a @mouseenter="showActive(4)" @mouseleave="showActive(0)" title="图库">
              <img :src="photoPic" alt />
              <img v-show="active === 4" class="hide_tab" :src="photoSelectedPic" />
            </a>
            <template v-if="showAR">
              <a @mouseenter="showActive(5)" @mouseleave="showActive(0)" title="标签">
                <img :src="tagPic" alt />
                <img v-show="active === 5" class="hide_tab" :src="tagSelectedPic" />
              </a>
              <a @mouseenter="showActive(6)" @mouseleave="showActive(0)" title="搜索">
                <img :src="searchPic" alt />
                <img v-show="active === 6" class="hide_tab" :src="searchSelectedPic" />
              </a>
              <a @mouseenter="showActive(7)" @mouseleave="showActive(0)" title="设置">
                <img :src="settingPic" title="设置" alt />
                <img v-show="active === 7" class="hide_tab" :src="settingSelectedPic" />
              </a>
            </template>
          </div>
          <!-- 实时警情 -->
          <div class="realPoliceInfo" v-show="showRealPolice" @dblclick.stop="stopEvent">
            <div class="title">实时警情</div>
            <div class="content webFsScroll">
              <div class="item" v-for="(item,index) in 9" :key="index">
                <div class="pic">
                  <img src="../../../assets/images/type_fire.png" alt />
                </div>
                <div>
                  <p>时间：2020-08-12 15:12:00</p>
                  <p>地点：武汉市第一医院</p>
                  <p>坐标：30.254124 114.221454</p>
                  <p>
                    类型：
                    <span class="type">火情报警</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info">
        <span></span>
        <span>{{videoInfo.parentLabel}}</span>
      </div>
      <!-- 人员识别 -->
      <div class="fullScreenFace" v-show="videoInfo.positionList&&videoInfo.positionList.length>0">
        <span
          v-for="(item,index) in videoInfo.positionList"
          :key="index"
          :style="{left:item.left/1280*(videoInfo.isShowOperate?1920:playerWidth)+'px',top:item.top/720*(videoInfo.isShowOperate?1080:playerHeight)+'px',width:item.width/1280*(videoInfo.isShowOperate?1920:playerWidth)+'px',height:item.height/720*(videoInfo.isShowOperate?1080:playerHeight)+'px'}"
        ></span>
      </div>
      <!-- 云台操作 -->
      <!-- <div
        class="fullScreenOperate"
        v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
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
      </div>-->
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
      <!-- <div class="btns">
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
      </div>-->
      <!-- 新版云台操作 -->
      <div
        class="operate"
        v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
      >
        <div class="circle">
          <div v-for="(item,index) in 8" :key="index"></div>
        </div>
        <div class="extra">
          <!-- <img src="" alt="" class="zoom">
          <img src="" alt="" class="focus">
          <img src="" alt="" class="add">
          <span class="step">X1.0</span>
          <img src="" alt="" class="minus">-->
          <div v-for="(item,index) in 5" :key="index">
            <template v-if="index===3">
              <span>X1.0</span>
            </template>
          </div>
        </div>
      </div>
      <!-- 无人机地图 -->
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
      <div class="fullScreenMark" v-show="showMarkForm">
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
      active: '',
      showAR: false, // 显示AR
      showRealPolice: false, // 显示实时警情
      arPic: require('@/assets/images/AR/ar.png'),
      arSelectedPic: require('@/assets/images/AR/ar_selected.png'),

      alarmPic: require('@/assets/images/AR/alarm.png'),
      alarmSelectedPic: require('@/assets/images/AR/alarm_selected.png'),

      capturePic: require('@/assets/images/AR/capature.png'),
      captureSelectedPic: require('@/assets/images/AR/capature_selected.png'),

      photoPic: require('@/assets/images/AR/photo.png'),
      photoSelectedPic: require('@/assets/images/AR/photo_selected.png'),

      tagPic: require('@/assets/images/AR/tag.png'),
      tagSelectedPic: require('@/assets/images/AR/tag_selected.png'),

      searchPic: require('@/assets/images/AR/search.png'),
      searchSelectedPic: require('@/assets/images/AR/search_selected.png'),

      settingPic: require('@/assets/images/AR/setting.png'),
      settingSelectedPic: require('@/assets/images/AR/setting_selected.png'),

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
    this.erd = elementResizeDetectorMaker()
    this.setPlayerSizeListener()
    // // 监听键盘按键事件
    // document.addEventListener('keyup', (e) => {
    //   if (e.keyCode === 13) {
    //     this.getCurPosition()
    //   }
    // })
  },

  methods: {
    // 鼠标悬停显示的图片
    showActive (index) {
      this.active = index
    },
    setPlayerSizeListener () {
      var me = this
      this.erd.listenTo(this.$refs.playerArea, function (element) {
        var width = element.offsetWidth
        // var height = element.offsetHeight
        // console.log(width, element.clientWidth, element.clientWidth, element.style.width)
        // if (width === window.screen.width && height === window.screen.height) {
        if (width === window.screen.width) {
          me.bIsFullScreen = true
          me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: true })
        } else {
          me.bIsFullScreen = false
          me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: false })
          me.resetForm('ruleForm')
        }
      })
    },
    // 创建元素
    createImgDom (obj) {
      console.log('传递过来的顶部距离', obj.data.offsetTop)
      const div = document.createElement('div')
      div.className = 'pic'
      div.style.left = obj.data.offsetLeft + 'px'
      div.style.top = obj.data.offsetTop + 'px'
      const span = document.createElement('span')
      span.innerHTML = 'x'
      span.style.color = '#ccc'
      span.addEventListener('click', function (e) {
        e.target.parentNode.remove()
      })
      const input = document.createElement('input')
      input.style.width = '100px'
      input.value = obj.data.labelText
      input.addEventListener('click', e => {
        this.showMarkForm = true
      })
      div.appendChild(span)
      div.appendChild(input)
      this.$refs.drawBox.appendChild(div)
    },
    // 表单提交
    submitForm (formName) {
      console.log(this.ruleForm.tagType)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('成功')
          // this.createImgDom(this.ruleForm.tagType)
          // 成功之后调用该方法获取坐标信息
          this.$refs.drawArea.customQuery(this.ruleForm)
          this.resetForm('ruleForm')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.showMarkForm = false
      this.$refs[formName].resetFields()
    },
    // 显示表单
    showMarkDialog (e) {
      if (this.bIsFullScreen === true) {
        // console.log(e.pageX, e.pageY)
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
        }, 200)
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
        channel_id: this.videoInfo.streamType
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
        channel_id: this.videoInfo.streamType,
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
<style lang="less" >
.playerStyle {
  ::selection {
    background: transparent;
  }
  position: relative;
  width: 100%;
  height: 100%;
  :focus {
    outline: none;
  }
  select:invalid {
    color: #a3afb7;
  }
  .is-error select {
    border-color: #f56c6c;
  }
  .pointLayer {
    position: absolute;
    height: 100%;
    width: 100%;
    > div {
      height: 100%;
      > div.header {
        position: absolute;
        left: 50%;
        width: 1205px;
        height: 69px;
        line-height: 69px;
        text-align: center;
        transform: translateX(-50%);
        background: url(../../../assets/images/AR/ar_header.png) no-repeat;
        font-size: 36px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
      }
      ::selection {
        background: transparent;
      }
      div.footer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 1920px;
        height: 73px;
        background: url(../../../assets/images/AR/ar_footer.png) no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: text;
        a {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 40px;
          margin-right: 32px;
          cursor: pointer;
          .hide_tab {
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }
      .realPoliceInfo {
        position: absolute;
        top: 125px;
        right: 40px;
        width: 306px;
        height: 568px;
        cursor: text;
        background: url(../../../assets/images/AR/police_info.png) no-repeat;
        div.title {
          padding: 18px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
        }
        div.content {
          padding: 0 14px 0 18px;
          max-height: 500px;
          overflow-y: auto;
          .item {
            display: flex;
            font-size: 12px;
            padding: 10px 8px;
            margin-bottom: 10px;
            background: linear-gradient(
              -90deg,
              rgba(30, 176, 252, 0.1) 0%,
              rgba(30, 176, 252, 0.1) 100%
            );
            // opacity: 0.22;
            div.pic {
              width: 80px;
              height: 80px;
              margin-right: 8px;
              img {
                width: 100%;
                height: 100%;
              }
            }

            div p {
              line-height: 18px;
              span.type {
                color: #1eb0fc;
              }
            }
          }
        }
      }
      //   div.pic {
      //     display: inline-block;
      //     position: absolute;
      //   }
      //   span {
      //     position: absolute;
      //     right: 0;
      //     top: -10px;
      //     cursor: pointer;
      //     display: none;
      //   }
      //   div.pic:hover span {
      //     display: inline;
      //   }
      //   div.pic img {
      //     vertical-align: middle;
      //     /* border-radius: 50%; */
      //   }
      //   div.pic input {
      //     //  background:#00a9ff;
      //     opacity: 0.6;
      //   }
    }
    div.bg {
      background: url(../../../assets/images/AR/ar_bg.png) no-repeat;
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
  .fullScreenFace {
    span {
      position: absolute;
      // background: url(../../../assets/images/person.png) no-repeat;
      border: 2px solid green;
    }
  }
  .fullScreenOperate {
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
  div.operate {
    position: absolute;
    right: 90px;
    bottom: 85px;
    cursor: text;
    .circle {
      width: 165px;
      height: 164px;
      background: url(../../../assets/images/operate/circle.png) no-repeat;
      position: relative;
      div {
        width: 36px;
        height: 36px;
        position: absolute;
        cursor: pointer;
      }
      div:nth-child(1) {
        left: 50%;
        top: 5px;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/up.png) no-repeat center;
      }
      div:nth-child(2) {
        left: 76%;
        top: 30px;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/right_up.png) no-repeat
          center;
      }
      div:nth-child(3) {
        left: 88%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url(../../../assets/images/operate/right.png) no-repeat
          center;
      }
      div:nth-child(4) {
        left: 78%;
        top: 62%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/right_bottom.png)
          no-repeat center;
      }
      div:nth-child(5) {
        left: 52%;
        top: 78%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/down.png) no-repeat
          center;
      }
      div:nth-child(6) {
        left: 26%;
        top: 62%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/left_down.png) no-repeat
          center;
      }
      div:nth-child(7) {
        left: 14%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url(../../../assets/images/operate/left.png) no-repeat
          center;
      }
      div:nth-child(8) {
        left: 25%;
        top: 16%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/left_up.png) no-repeat
          center;
      }
    }
    .extra {
      position: absolute;
      top:0;
      right:0;
      div {
        width: 36px;
        height: 36px;
        position: relative;
        cursor: pointer;
      }
      div:nth-child(1) {
        left: -34px;
        top: -42px;
        background: url(../../../assets/images/operate/zoom.png) no-repeat
          center;
      }
      div:nth-child(2) {
        left: 22px;
        top: -60px;
        background: url(../../../assets/images/operate/focus.png) no-repeat
          center;
      }
      div:nth-child(3) {
        width:51px;
        height:63px;
        left: 54px;
        top: -54px;
        background: url(../../../assets/images/operate/add.png) no-repeat
          center;
      }
      div:nth-child(4) {
        left: 64px;
        top: -44px;
        background:#1477AB;
        width:40px;
        height:40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        border: 2px solid #2ECCEE;
      }
       div:nth-child(5) {
             width:59px;
        height:48px;
        left: 20px;
        top: -42px;
        background: url(../../../assets/images/operate/minus.png) no-repeat
          center;
      }
    }
  }
}
</style>
