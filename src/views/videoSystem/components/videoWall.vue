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
          <!-- canvas绘图 -->
          <canvas-area :showAR="showAR" @canvasEnd="getPosition" :showMarkForm="showMarkForm"></canvas-area>
          <template v-if="showAR">
            <div class="header">AR实景地图指挥</div>
          </template>
          <div class="footer" @dblclick.stop="stopEvent">
            <a @mouseenter="showActive(1)" @mouseleave="showActive(0)" title="AR" @click="changeAR">
              <img :src="arPic" alt title="AR" />
              <img v-show="active === 1" class="hide_tab" :src="arSelectedPic" />
            </a>
            <!-- <a
              @mouseenter="showActive(2)"
              @mouseleave="showActive(0)"
              @click="showCurindex=1"
              title="火情报警"
            >
              <img :src="alarmPic" alt />
              <img v-show="active === 2" class="hide_tab" :src="alarmSelectedPic" />
            </a>-->
            <a
              @mouseenter="showActive(3)"
              @mouseleave="showActive(0)"
              title="抓取"
              @click.stop="showImg"
            >
              <img :src="capturePic" alt />
              <img v-show="active === 3" class="hide_tab" :src="captureSelectedPic" />
              <!-- 用于显示截取的图片 -->
              <img
                :src="`${picUrl}${cutImgUrl}`"
                class="cutImg"
                id="pic"
                v-show="showCutImg"
                @click.stop="cutDialogVisible=true;isAdd=true"
              />
            </a>
            <a
              @mouseenter="showActive(4)"
              @mouseleave="showActive(0)"
              title="图库"
              @click="getPicStorage"
            >
              <img :src="photoPic" alt />
              <img v-show="active === 4" class="hide_tab" :src="photoSelectedPic" />
            </a>
            <template v-if="showAR">
              <a
                @mouseenter="showActive(5)"
                @mouseleave="showActive(0)"
                title="标签"
                @click="showCurindex=4"
              >
                <img :src="tagPic" alt />
                <img v-show="active === 5" class="hide_tab" :src="tagSelectedPic" />
              </a>
              <!-- <a @mouseenter="showActive(6)" @mouseleave="showActive(0)" title="搜索">
                <img :src="searchPic" alt />
                <img v-show="active === 6" class="hide_tab" :src="searchSelectedPic" />
              </a>
              <a
                @mouseenter="showActive(7)"
                @mouseleave="showActive(0)"
                title="设置"
                @click="showCurindex=6"
              >
                <img :src="settingPic" title="设置" alt />
                <img v-show="active === 7" class="hide_tab" :src="settingSelectedPic" />
              </a>-->
            </template>
          </div>
          <!-- 实时警情弹框 -->
          <div class="realPoliceInfo" v-show="showCurindex==1" @dblclick.stop="stopEvent">
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
            <img src="../../../assets/images/AR/X.png" @click="showCurindex=1000" />
          </div>
          <!-- 标签弹框 -->
          <div class="tagInfo" @dblclick.stop="stopEvent" v-show="showCurindex==4">
            <div>
              <img src="../../../assets/images/AR/high2.png" alt />
              <p>高点监控</p>
            </div>
            <div>
              <img src="../../../assets/images/AR/building.png" alt />
              <p>建筑大厦</p>
            </div>
            <div>
              <img src="../../../assets/images/AR/river2.png" alt />
              <p>河流</p>
            </div>
            <img src="../../../assets/images/AR/X.png" alt @click="showCurindex=1000" />
          </div>
          <!-- 图库弹框 -->
          <div class="picStorage" @dblclick.stop="stopEvent" v-show="showCurindex==3">
            <!-- 关闭按钮 -->
            <img src="../../../assets/images/AR/X.png" alt @click="showCurindex=1000" />
            <div>
              <span>起止时间：</span>
              <el-date-picker
                type="datetimerange"
                v-model="dateRange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :append-to-body="false"
                @change="getTimeRange"
                value-format="timestamp"
              ></el-date-picker>
            </div>
            <div class="box">
              <div class="item" v-for="(item,index) in picStorageArray" :key="index">
                <div class="container">
                  <img :src="`${picUrl}${item.filePath}`" />
                  <div class="mask">
                    <i class="el-icon-edit" @click.stop="editCurPic(item)"></i>
                    <i class="el-icon-delete" @click.stop="deleteCurPic(item)"></i>
                  </div>
                </div>
                <p>{{item.createTime|timeFormat}}</p>
                <p
                  :title="item.remark"
                >{{item.remark&&item.remark.length>9?item.remark.slice(0,9)+'.':item.remark}}</p>
              </div>
              <div class="empty" v-if="picStorageArray&&picStorageArray.length==0">暂无数据</div>
            </div>
            <el-pagination
              v-if="picStorageArray&&picStorageArray.length>0"
              background
              layout="total,prev, pager, next"
              :total="pageInfo.total"
              class="tablePagination"
              style="position:absolute;bottom: 25px;width: 774px;"
              popper-class="pageSelect"
              :page-size="pageInfo.pageSize"
              @current-change="handleCurrentChange"
              :current-page.sync="pageInfo.currentPage"
            ></el-pagination>
          </div>
          <!-- 设置弹框 -->
          <div class="settingInfo" v-show="showCurindex==6" @dblclick.stop="stopEvent">
            <div class="settingTitle">标签设置</div>
            <img src="../../../assets/images/AR/X.png" alt @click="showCurindex=1000" />
            <div class="operateBox">
              <div>
                <span>标签名称：</span>
                <el-input style="width:140px;" v-model.trim="tagName" placeholder="请输入标签名称"></el-input>
              </div>
              <div style="margin-left:44px;">
                <span>标签类型：</span>
                <el-select
                  style="width:140px"
                  v-model="tagType"
                  placeholder="请选择标签类型"
                  :popper-append-to-body="false"
                  popper-class="selectStyle"
                >
                  <el-option
                    v-for="item in tagArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <br />
              <div style="margin-top:14px;">
                <span>设备名称：</span>
                <el-input style="width:140px;" v-model.trim="deviceName" placeholder="请输入设备名称"></el-input>
              </div>
              <div style="margin-left:44px; margin-top:14px;">
                <span>启用状态：</span>
                <el-select
                  style="width:140px"
                  v-model="status"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  popper-class="selectStyle"
                >
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="0"></el-option>
                </el-select>
              </div>
              <div class="icon">
                <img src="../../../assets/images/AR/search_icon.png" alt />
                <img src="../../../assets/images/AR/refresh.png" alt />
                <img src="../../../assets/images/AR/down.png" alt />
                <img src="../../../assets/images/AR/more.png" alt />
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%;margin-top:17px;" :stripe="true">
              <el-table-column prop="date" label="日期" width="180" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180" align="center"></el-table-column>
              <el-table-column prop="address" label="地址" align="center"></el-table-column>
            </el-table>
            <el-pagination
              class="tablePagination"
              background
              layout="total, prev, pager, next"
              popper-class="pageSelect"
              :page-size="5"
              :total="1000"
            >></el-pagination>
          </div>
        </div>
      </div>
      <template v-if="showNotification">
        <!-- 警告 -->
        <div role="alert" class="el-notification right" style="top: 16px; z-index: 2000;">
          <i
            class="el-notification__icon"
            :class="{'el-icon-warning':infoObj.isWarning,'el-icon-success':infoObj.isSuccess,'el-icon-error':infoObj.isError}"
          ></i>
          <div class="el-notification__group is-with-icon">
            <h2 class="el-notification__title">{{infoObj.title}}</h2>
            <div class="el-notification__content">
              <p>{{infoObj.msg}}</p>
            </div>
            <div
              class="el-notification__closeBtn el-icon-close"
              @click.stop="showNotification=false"
            ></div>
          </div>
        </div>
      </template>
      <!-- 视频图标及标签 -->
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
          :class="{ship:item.label==1}"
        ></span>
      </div>
      <!-- 显示AR标签 -->
      <div
        class="fullScreenAr"
        v-show="showAR&&videoInfo.arPositionList&&videoInfo.arPositionList.length>0"
      >
        <div
          v-for="(item,index) in videoInfo.arPositionList"
          :class="{high:item.label==0,build:item.label==1,river:item.label==2}"
          :key="index"
          :style="{
          left:item.label=='0'?((Number(item.left)+Number(item.width/2))/1280*1920-51.5)+'px':(Number(item.left)+Number(item.width/2))/1280*1920+'px',
         top:item.label==0?((item.top/720)*1080-102)+'px':((item.top/720)*1080-58)+'px'}"
        >
          <div>{{item.labelName}}</div>
          <!-- Number(item.left)+Number(item.width/2))/720)*1080-25+'px' -->
        </div>
      </div>
      <!-- 新版云台操作 -->
      <div
        class="operate"
        v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
      >
        <div class="circle">
          <div
            v-for="(item,index) in 8"
            :key="index"
            @mousedown="startChange(index)"
            @mouseup="stopChange(index)"
          ></div>
        </div>
        <div class="extra">
          <div title="变倍" :class="{selected:curSelectedIcon==0}" @click="curSelectedIcon=0"></div>
          <div title="变焦" :class="{selected:curSelectedIcon==1}" @click="curSelectedIcon=1"></div>
          <div @mousedown="startChange(999)" @mouseup="stopChange(999)"></div>
          <div @click.stop="addStep" title="步速">
            <span>X{{step}}</span>
          </div>
          <div @mousedown="startChange(9999)" @mouseup="stopChange(9999)"></div>
        </div>
      </div>
      <!-- 无人机指挥 -->
      <div
        class="droneControl"
        v-show="videoInfo.deviceTypeCode==='WRJ'&&videoInfo.isShowOperate&&bIsFullScreenVideo===true"
      >
        <div class="header stretchIMG">
          <div class="exitFullScreen" @click="exitFullScreen">
            <span></span>
            <span>退出全屏</span>
          </div>
        </div>
        <div class="bottom stretchIMG"></div>
        <div class="menu stretchIMG">
          <div
            class="itemBtn"
            :class="{detectBtn:!bDetectStatus,detectBtnActive:bDetectStatus}"
            @click.stop="switchDetectStatus"
          ></div>
          <div class="itemBtn puzzleBtn" @click.stop="switchPuzzlingStatus">
            <div class="scanningStyle" v-show="bPuzzlingStatus"></div>
          </div>
          <div
            class="itemBtn"
            :class="{pointBtn:!bSetPointStatus,pointBtnActive:bSetPointStatus}"
            @click.stop="switchSetPointStatus"
          ></div>
          <div
            class="itemBtn"
            :class="{routeBtn:!bShowRouteStatus,routeBtnActive:bShowRouteStatus}"
            @click.stop="switchShowRouteStatus"
          ></div>
        </div>
        <div class="mapOuterBox" :class="{mapOuterBoxFullScreen:bIsFullscreenMap}">
          <div class="mapArea" :class="{mapAreaFullScreen:bIsFullscreenMap}">
            <gMap
              ref="gduMap"
              handleType="devMap"
              :baseMapIndex="0"
              :bShowSimpleSearchTools="false"
              :bShowBasic="bIsFullscreenMap"
              :bShowSelLayer="false"
              :bShowMeasure="false"
              :bShowLonLat="false"
              :bAutoLocate="true"
              :bDbClickStyle="true"
              @mapDbClickEvent="mapDbClickEventCB"
            ></gMap>
            <div class="sizeChange" v-show="!bIsFullscreenMap" @click="changeVideoAndMap" />
          </div>
        </div>
        <div class="smallVideoStyle" v-if="bIsFullscreenMap===true&&bIsFullScreenVideo===true">
          <div class="smallVideoArea">
            <div class="smallVideoBox" @dblclick="changeVideoAndMap">
              <LivePlayer
                ref="smallPlayerCtrl"
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
              />
              <div class="sizeChange" @click="changeVideoAndMap" />
            </div>
          </div>
        </div>
      </div>
      <!-- 添加标签的弹框 -->
      <div class="fullScreenMark" v-show="showMarkForm">
        <img src="../../../assets/images/AR/close.png" @click="resetForm('ruleForm')" />
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="标签名称" prop="tagName">
            <el-input v-model.trim="ruleForm.tagName" placeholder="请输入标签名称" style="width:228px"></el-input>
          </el-form-item>
          <el-form-item label="标签类型" prop="tagType" style="margin-top:20px;">
            <el-select
              style="width:228px"
              required
              v-model="ruleForm.tagType"
              placeholder="请选择标签类型"
              :popper-append-to-body="false"
              popper-class="selectStyle"
            >
              <el-option
                v-for="item in tageTypeArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top:30px;">
            <el-button
              type="primary"
              @click="resetForm('ruleForm')"
              style="background:#18223A;color:#209CDF;border: 1px solid #209CDF;width:108px!important"
            >取消</el-button>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              style="width:108px!important"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :visible.sync="cutDialogVisible"
        class="cutDialog"
        :close-on-click-modal="false"
        :show-close="false"
        :before-close="clearRemark"
        :append-to-body="false"
      >
        <img :src="`${picUrl}${cutImgUrl}`" width="743px" height="428px" alt />
        <span slot="footer" class="dialog-footer">
          <div class="remark">
            <div class="replain">
              <span>说明：</span>
              <el-input v-model.trim="remark" placeholder="请输入" :maxlength="27"></el-input>
            </div>
            <div>
              <el-button @click="clearRemark" style="width:87px;">取 消</el-button>
              <el-button type="primary" @click.stop="confirm" style="width:87px;">确 定</el-button>
            </div>
          </div>
        </span>
      </el-dialog>
    </LivePlayer>
  </div>
</template>
<script>
import LivePlayer from '@liveqing/liveplayer'
import droneInfoMixin from '../../../utils/droneInfoMixin'
import canvasArea from './canvasArea'
import { debounce, throttle } from '../../../utils/public.js'
import globalApi from '../../../utils/globalApi'
import { api } from '@/api/videoSystem/realVideo'
import { timeFormat } from '@/utils/date'
import MqttService from '@/utils/mqttService'
export default {
  data () {
    return {
      arPositionList: [
        {
          top: '144.67',
          left: '834.67',
          width: '66.67',
          label: '0',
          labelName: '标签名称',
          height: '79.33'
        }
      ],
      picUrl: globalApi.baseUrl + '/video-service2', // 图片前缀
      showCutImg: false, // 是否显示抓拍的图片 默认不显示
      cutImgUrl: '', // 显示抓取的图片
      cutDialogVisible: false, // 抓取弹窗
      isAdd: true, // 默认是添加说明
      imgId: '', // 保存抓取图片id
      remark: '', // 说明文字
      active: '', // 动态显示悬停相关图标
      showAR: false, // 显示AR
      showCurindex: 1000, // 显示弹框
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
      curSelectedIcon: 0, // 云台变倍或变焦 默认选中 0变倍 1变焦
      showMarkForm: false,
      curPositionObj: {}, // 保存当前位置相关坐标
      // showTagInfo: false, // 标签弹框 默认不显示
      // showPicStorage: false, // 图库弹框 默认不显示
      // showSetting: false, // 设置弹框
      tagName: '', // 标签名称
      deviceName: '', // 设备名称
      tagType: '', // 标签类型
      tagArray: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      status: '0', // 启用类型
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      // 图库的分页信息
      pageInfo: {
        total: 1000,
        currentPage: 1,
        pageSize: 15
      },
      dateRange: [], // 保存图库日期的数组
      picStorageArray: [], // 保存图库数据
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
          id: '0',
          name: '高点监控'
        },
        {
          id: '1',
          name: '建筑大厦'
        },
        {
          id: '2',
          name: '河流'
        }
      ],
      showNotification: false,
      infoObj: {
        title: '',
        isWarning: false,
        isSuccess: false,
        isError: false,
        msg: ''
      }, // 提示信息
      isSub: false, // 是否监听播放进度改变
      isUpdateTime: true,
      curTime: 0,
      curUrl: '',
      activeCurIcon: '', // 默认选中云台的图标
      zoomSpeed: 0, // 变倍
      focusSpeed: 0, // 变焦
      lrisSpeed: 0, // 光圈
      step: 4, // 步速值
      bIsFullScreenVideo: false, // 播放器是否全屏
      bIsFullscreenMap: false, // 小地图是否全屏
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
    LivePlayer,
    canvasArea
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
    },
    'videoInfo.isShowOperate' (nv, ov) {
      if (nv) {
        if (this.videoInfo.deviceTypeCode === 'GDJK') {
          // 开启人员识别
          new MqttService().client.send(
            'video/start/algorithm',
            JSON.stringify({
              deviceCode: this.videoInfo.deviceCode,
              channelId: this.videoInfo.streamType,
              streamUrl: this.videoInfo.streamUrl,
              isOpen: 1
            })
          )
          console.log('开启人员识别')
        }
      } else {
        if (this.videoInfo.deviceTypeCode === 'GDJK') {
          // 关闭人员识别
          new MqttService().client.send(
            'video/stop/algorithm',
            JSON.stringify({
              deviceCode: this.videoInfo.deviceCode,
              channelId: this.videoInfo.streamType,
              streamUrl: this.videoInfo.streamUrl,
              isOpen: 0
            })
          )
          console.log('关闭人员识别')
        }
      }
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
  },

  methods: {
    // 点击步速
    addStep () {
      ++this.step
      this.step = this.step > 8 ? 1 : this.step
    },
    // 鼠标悬停显示的图片
    showActive (index) {
      this.active = index
    },
    // 显示与隐藏AR
    changeAR () {
      this.showAR = !this.showAR
      if (this.showAR) {
        // 开启AR
        new MqttService().client.send(
          'video/start/arAlgorithm',
          JSON.stringify({
            deviceCode: this.videoInfo.deviceCode,
            channelId: this.videoInfo.streamType,
            streamUrl: this.videoInfo.streamUrl,
            isOpen: 1
          })
        )
      } else {
        // 关闭AR
        new MqttService().client.send(
          'video/stop/arAlgorithm',
          JSON.stringify({
            deviceCode: this.videoInfo.deviceCode,
            channelId: this.videoInfo.streamType,
            streamUrl: this.videoInfo.streamUrl,
            isOpen: 0
          })
        )
      }
    },
    // 点击抓取，显示抓拍图片
    showImg: throttle(function () {
      // 显示抓取的图片
      const params = {
        deviceCode: this.videoInfo.deviceCode,
        channleId: this.videoInfo.streamType
      }
      this.$axios.post(api.deviceSnap, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.showNotification = true
          this.infoObj.isWarning = false
          this.infoObj.isError = false
          this.infoObj.isSuccess = true
          this.infoObj.title = '成功'
          this.infoObj.msg = '抓取成功！'
          setTimeout(() => {
            this.showNotification = false
          }, 3000)
          this.showCutImg = true
          this.imgId = res.data.data.id
          this.cutImgUrl = res.data.data.filePath
          setTimeout(() => {
            this.showCutImg = false
          }, 4000)
        }
      })
    }, 5000),
    // 点击确定按钮
    confirm () {
      // 防止此时设备下线
      if (Object.keys(this.videoInfo).length === 0) {
        this.showNotification = true
        this.infoObj.isWarning = true
        this.infoObj.isError = false
        this.infoObj.isSuccess = false
        this.infoObj.title = '警告'
        this.infoObj.msg = '请先选择设备！'
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
        return
      }
      const params = {
        id: this.imgId,
        deviceCode: this.videoInfo.deviceCode,
        filePath: this.cutImgUrl,
        channelId: this.videoInfo.streamType,
        remark: this.remark
      }
      this.$axios.post(api.deviceUpdate, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          if (!this.isAdd) {
            this.pageInfo.currentPage = 1
            this.getSnapList()
          }
          this.showNotification = true
          this.infoObj.isWarning = false
          this.infoObj.isError = false
          this.infoObj.isSuccess = true
          this.infoObj.title = '成功'
          this.infoObj.msg = this.isAdd ? '添加说明成功！' : '修改说明成功'
          setTimeout(() => {
            this.showNotification = false
          }, 3000)
          this.clearRemark()
        }
      })
    },
    // 重置抓拍弹框
    clearRemark () {
      this.cutDialogVisible = false
      this.isAdd = true
      this.remark = ''
    },
    // 点击图库 显示图库弹框 获取图库数据
    getPicStorage () {
      this.showCurindex = 3
      this.pageInfo.currentPage = 1
      this.getSnapList()
    },
    // 获取图库列表
    getSnapList () {
      console.log(this.dateRange)
      const params = {
        deviceCode: this.videoInfo.deviceCode,
        channelId: this.videoInfo.streamType,
        currentPage: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize,
        dates: this.dateRange
      }
      this.$axios.get(api.getSnapList, { params }).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.picStorageArray = res.data.data.data
          this.pageInfo.total = res.data.data.paginator.totalCount
        } else {
          this.picStorageArray = []
          this.pageInfo.total = 0
        }
      })
    },
    // 选择图库时间
    getTimeRange () {
      console.log(this.dateRange)
      this.pageInfo.currentPage = 1
      this.getSnapList()
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      console.log(`当前页: ${val}`)
      this.getSnapList()
    },
    // 编辑当前图片
    editCurPic (item) {
      this.isAdd = false
      this.cutDialogVisible = true
      const curData = JSON.parse(JSON.stringify(item))
      this.cutImgUrl = curData.filePath
      this.remark = curData.remark || ''
      this.imgId = curData.id
    },
    // 删除当前图片
    deleteCurPic (item) {
      this.$axios
        .get(api.deleteSnapList, { params: { id: item.id } })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            this.showNotification = true
            this.infoObj.isWarning = false
            this.infoObj.isError = false
            this.infoObj.isSuccess = true
            this.infoObj.title = '成功'
            this.infoObj.msg = '删除成功'
            setTimeout(() => {
              this.showNotification = false
            }, 3000)
            this.pageInfo.currentPage = 1
            this.getSnapList()
          }
        })
    },
    setPlayerSizeListener () {
      var me = this
      this.erd.listenTo(this.$refs.playerArea, function (element) {
        var width = element.offsetWidth
        // var height = element.offsetHeight
        // console.log(width, element.clientWidth, element.clientWidth, element.style.width)
        // if (width === window.screen.width && height === window.screen.height) {
        if (width === window.screen.width) {
          me.bIsFullScreenVideo = true
          me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: true })
        } else {
          me.bIsFullScreenVideo = false
          me.$refs.gduMap.closeAllPopover()

          // 都不显示
          me.showCurindex = 1000
          me.clearRemark()
          me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: false })
          me.resetForm('ruleForm')
          // 关闭AR
          if (me.showAR) {
            new MqttService().client.send(
              'video/stop/arAlgorithm',
              JSON.stringify({
                deviceCode: me.videoInfo.deviceCode,
                channelId: me.videoInfo.streamType,
                streamUrl: me.videoInfo.streamUrl,
                isOpen: 0
              })
            )
            console.log('关闭AR')
          }
          me.showAR && (me.showAR = false)
        }
      })
    },
    // 获取位置信息
    getPosition (curPosition) {
      if (curPosition.width > 0) {
        const curArea = JSON.parse(JSON.stringify(curPosition))
        this.curPositionObj = {
          x: Math.round((curArea.x / 1920) * 1280 * 100) / 100,
          y: Math.round((curArea.y / 1080) * 720 * 100) / 100,
          width: Math.round((curArea.width / 1920) * 1280 * 100) / 100,
          height: Math.round((curArea.height / 1080) * 720 * 100) / 100
        }
        console.log(this.curPositionObj)
        this.showMarkForm = true
      }
    },
    // 创建元素
    createTag (ruleForm, positionObj) {
      console.log('传递过来的顶部距离', positionObj)
      const div = document.createElement('div')
      div.className = 'pic'
      div.style.position = 'absolute'
      div.style.left = positionObj.x + 'px'
      div.style.top = positionObj.y + 'px'
      const span = document.createElement('span')
      span.innerHTML = 'x'
      span.style.color = '#ccc'
      span.addEventListener('click', function (e) {
        e.target.parentNode.remove()
      })
      const input = document.createElement('input')
      input.style.width = '100px'
      input.value = ruleForm.tagName
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
          // this.$refs.drawArea.customQuery(this.ruleForm)
          // 标签名称和标签类型校验成功之后 调接口  获取数据  无需手动创建dom结构
          // this.showNotification = true
          // this.infoObj.isSuccess = true
          // this.infoObj.isError = false
          // this.infoObj.msg = 'SDFSDFSDF'
          // setTimeout(() => {
          //   this.showNotification = false
          // }, 3000)

          // this.createTag(this.ruleForm, this.curPositionObj)
          new MqttService().client.send(
            'video/add/arAlgorithm',
            JSON.stringify({
              deviceCode: this.videoInfo.deviceCode,
              channelId: this.videoInfo.streamType,
              streamUrl: this.videoInfo.streamUrl,
              label: this.ruleForm.tagType,
              labelName: this.ruleForm.tagName,
              x: this.curPositionObj.x,
              y: this.curPositionObj.y,
              width: this.curPositionObj.width,
              height: this.curPositionObj.height,
              isOpen: 1
            })
          )
          console.log({
            deviceCode: this.videoInfo.deviceCode,
            channelId: this.videoInfo.streamType,
            streamUrl: this.videoInfo.streamUrl,
            label: this.ruleForm.tagType,
            labelName: this.ruleForm.tagName,
            x: this.curPositionObj.x,
            y: this.curPositionObj.y,
            width: this.curPositionObj.width,
            height: this.curPositionObj.height
          })
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
      if (this.bIsFullScreenVideo === true) {
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

    // 退出全屏
    exitFullScreen () {
      this.$refs.playerCtrl.player.exitFullscreen()
    },

    /**
     * 响应地图双击样式改变事件
     */
    mapDbClickEventCB (bFullscreenMap) {
      this.changeVideoAndMap()
    },

    /**
     * 地图与视频全屏切换
     */
    changeVideoAndMap () {
      this.bIsFullscreenMap = !this.bIsFullscreenMap
      this.$refs.gduMap.setBasicHighBottom(this.bIsFullscreenMap)
      this.$refs.gduMap.setPopoverAppendStyle(!this.bIsFullscreenMap)
      const tmpMap = this.$refs.gduMap.map2D
      setTimeout(() => {
        tmpMap._map.updateSize()
      }, 10)
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
    // 鼠标按下
    startChange: debounce(function (index) {
      const params = {
        device_id: this.videoInfo.deviceCode,
        channel_id: this.videoInfo.streamType
      }
      switch (index) {
        case 0:
          // 上移
          params.cmd_type = 0
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1:
          // 右上
          params.cmd_type = 33
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 2:
          // 右移
          params.cmd_type = 3
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 3:
          // 右下
          params.cmd_type = 35
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 4:
          // 下
          params.cmd_type = 1
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 5:
          // 左下
          params.cmd_type = 34
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 6:
          // 左
          params.cmd_type = 2
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 7:
          // 左上
          params.cmd_type = 32
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        // 加号
        case 999:
          if (this.curSelectedIcon === 0) {
            // 变倍+
            params.cmd_type = 4
          } else {
            // 变焦+
            params.cmd_type = 6
          }
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        // 减号
        case 9999:
          if (this.curSelectedIcon === 0) {
            // 变倍-
            params.cmd_type = 5
          } else {
            // 变焦-
            params.cmd_type = 7
          }
          params.step = this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        // case 1004:
        //   // 光圈+
        //   params.cmd_type = 8
        //   params.step = this.step
        //   params.stop = 0
        //   console.dir(params)
        //   this.changeViewVideo(params)
        //   break
        // case 1005:
        //   // 光圈-
        //   params.cmd_type = 9
        //   params.step = this.step
        //   params.stop = 0
        //   console.dir(params)
        //   this.changeViewVideo(params)
        //   break
        default:
          break
      }
    }, 500),
    // 鼠标松开
    stopChange: debounce(function (index) {
      const params = {
        device_id: this.videoInfo.deviceCode,
        channel_id: this.videoInfo.streamType,
        stop: 1,
        step: 0,
        cmd_type: ''
      }
      switch (index) {
        case 0:
          // 上
          params.cmd_type = 0
          break
        case 1:
          // 右上
          params.cmd_type = 33
          break
        case 2:
          // 右
          params.cmd_type = 3
          break
        case 3:
          // 右下
          params.cmd_type = 35
          break
        case 4:
          // 下
          params.cmd_type = 1
          break
        case 5:
          // 左下
          params.cmd_type = 34
          break
        case 6:
          // 左
          params.cmd_type = 2
          break
        case 7:
          // 左上
          params.cmd_type = 32
          break
        // 加号
        case 999:
          if (this.curSelectedIcon === 0) {
            // 变倍+
            params.cmd_type = 4
          } else {
            // 变焦+
            params.cmd_type = 6
          }
          break
        // 减号
        case 9999:
          if (this.curSelectedIcon === 0) {
            // 变倍-
            params.cmd_type = 5
          } else {
            // 变焦-
            params.cmd_type = 7
          }
          break
        // case 1004:
        //   // 光圈+
        //   params.cmd_type = 8
        //   break
        // case 1005:
        //   // 光圈-
        //   params.cmd_type = 9
        //   break
      }

      console.log(params)
      this.changeViewVideo(params)
    }, 500),
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
  filters: {
    timeFormat
  },
  created () {}
}
</script>
<style lang="less" >
.playerStyle {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
  .selectStyle {
    position: absolute !important;
    top: 30px !important;
  }
  .cutDialog {
    background: rgba(0, 0, 0, 0.6);
    /deep/.el-dialog {
      width: 803px;
      height: 549px;
      background: url(../../../assets/images/dialog-bg.png) no-repeat;
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
            border: 1px solid #dcdfe6;
          }
          .el-button--primary {
            background: #1eb0fc;
          }
        }
      }
    }
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
        z-index: 20;
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
          img.cutImg {
            position: absolute;
            top: -210px;
            left: 20px;
            width: 200px;
            height: 200px;
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
        > img {
          position: absolute;
          right: 18px;
          top: 18px;
          cursor: pointer;
        }
      }
      .tagInfo {
        position: absolute;
        bottom: 114px;
        left: 924px;
        width: 338px;
        height: 126px;
        background: url(../../../assets/images/AR/tag_bg.png) no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: text;
        > div {
          text-align: center;
        }
        div:nth-child(2) {
          margin: 0 20px;
        }
        div:nth-child(2),
        div:nth-child(3) {
          img {
            margin: 5px 0;
          }
        }
        > img {
          position: absolute;
          top: 15px;
          right: 14px;
          cursor: pointer;
        }
      }
      .picStorage {
        position: absolute;
        z-index: 20;
        top: 94px;
        left: 50%;
        transform: translateX(-50%);
        width: 800px;
        height: 676px;
        background: url(../../../assets/images/AR/pic_storage.png) no-repeat;
        box-sizing: border-box;
        padding: 26px 0px 24px 26px;
        cursor: text;
        > img {
          position: absolute;
          top: 18px;
          right: 25px;
          cursor: pointer;
        }
        .el-date-editor {
          .el-input__icon,
          .el-range-separator {
            line-height: 26px;
          }
        }
        .el-picker-panel {
          position: absolute !important;
          width: 576px;
          .el-picker-panel__icon-btn {
            margin-top: 0;
          }
          button {
            font-size: 14px;
          }
        }
        .box {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: left;
          height: 495px;
          .item {
            width: 123px;
            margin-right: 31px;
            padding-bottom: 10px;
            // height:173px;
            text-align: center;
            font-size: 12px;
            .container {
              width: 123px;
              height: 123px;
              position: relative;
              > img {
                width: 100%;
                height: 100%;
              }
              .mask {
                position: absolute;
                bottom: -23px;
                width: 100%;
                padding: 0 10px;
                height: 23px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                background: #000;
                opacity: 0;
                transition: all 1s ease-in-out;
                i {
                  color: #fff;
                  cursor: pointer;
                }
              }
            }
            .container:hover .mask {
              bottom: 0px;
              opacity: 0.7;
            }
            > p {
              margin-top: 8px;
            }
          }
          .empty {
            width: 100%;
            height: 100%;
            line-height: 495px;
            text-align: center;
          }
        }
        .tablePagination {
          margin-top: 5px;
          text-align: end;
          padding-right: 18px;
          position: absolute;
          bottom: 0px;
          button.btn-next,
          button.btn-prev {
            background: transparent !important;
          }
          button.btn-prev {
            margin-right: 0px;
          }
        }
      }
      .settingInfo {
        position: absolute;
        top: 170px;
        left: 50%;
        transform: translateX(-50%);
        width: 690px;
        height: 440px;
        cursor: text;
        background: url(../../../assets/images/AR/setting_bg.png) no-repeat;
        box-sizing: border-box;
        padding: 16px 20px;
        .settingTitle {
          width: 202px;
          height: 45px;
          background: url(../../../assets/images/device/info-title.png)
            no-repeat;
          padding-left: 26px;
          line-height: 36px;
          font-size: 16px;
        }
        > img {
          position: absolute;
          top: 18px;
          right: 25px;
          cursor: pointer;
        }
        .operateBox {
          font-size: 14px;
          font-weight: 400;
          // color: #1eb0fc;
          position: relative;
          > div {
            display: inline-block;
          }
          div.icon {
            position: relative;
            top: 10px;
            left: 35px;
            > img {
              margin-right: 15px;
              cursor: pointer;
            }
          }
        }
        .el-table thead tr th {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          background: #3688b1;
          padding: 1px 0 !important;
        }
        .el-table__row {
          height: 38px;
          background: #326680;
          td div.cell {
            color: #fff;
          }
          td {
            padding: 7px 0 !important;
          }
        }
        .el-table__row.el-table__row--striped td {
          background: #3688b1;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #27354d !important;
          opacity: 0.5;
        }
        .tablePagination {
          text-align: right;
          button.btn-next,
          button.btn-prev {
            background: transparent !important;
          }
          .btn-prev {
            margin-right: 0;
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
    z-index: 5;
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
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
    }
  }
  .fullScreenFace {
    span {
      position: absolute;
      z-index: 10;
      // background: url(../../../assets/images/person.png) no-repeat center center;
      // background-size:100% 100%;
      border: 2px solid #00ff00;
      background: rgba(0, 255, 0, 0.3);
    }
    span.ship {
      border: 2px solid #00e4ff;
      background: rgba(0, 228, 255, 0.3);
    }
  }
  .fullScreenAr {
    > div {
      position: absolute;
      box-sizing: border-box;
      height: 103px;
      width: 102px;
      div {
        font-size: 12px;
        text-align: center;
        line-height: 44px;
      }
    }
    > div.river,
    div.build {
      width: 145px;
      height: 59px;
      padding-left: 48px;
    }
    div.river {
      background: url(../../../assets/images/AR/river.png) no-repeat;
    }
    div.build {
      background: url(../../../assets/images/AR/build.png) no-repeat;
    }
    div.high {
      background: url(../../../assets/images/AR/high.png) no-repeat;
    }
  }
  .fullScreenOperate {
    position: absolute;
    z-index: 20;
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
  .droneControl {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
    .stretchIMG {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
    }
    .header {
      position: absolute;
      top: 0px;
      width: 100%;
      height: 125px;
      background-image: url("../../../assets/images/drone/header-bg.png");
      z-index: 3;
      .exitFullScreen {
        pointer-events: visible;
        position: absolute;
        display: flex;
        height: 33px;
        line-height: 33px;
        right: 20px;
        top: 3px;
        z-index: 5;
        :nth-child(1) {
          margin-top: 3px;
          width: 33px;
          height: 33px;
          background-image: url("../../../assets/images/drone/size-back.png");
        }
        :nth-child(2) {
          height: 33px;
          line-height: 33px;
          font-size: 16px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          margin-left: 8px;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 209px;
      background-image: url("../../../assets/images/drone/bottom-bg.png");
      z-index: 3;
    }
    .menu {
      visibility: hidden;
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 73px;
      background-image: url("../../../assets/images/AR/ar_footer.png");
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
      .itemBtn {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-right: 32px;
        pointer-events: visible;
      }
      .itemBtn:hover {
        opacity: 0.65;
      }
      .detectBtn {
        background-image: url("../../../assets/images/drone/detect.png");
      }
      .detectBtnActive {
        background-image: url("../../../assets/images/drone/detect-active.png");
      }
      .puzzleBtn {
        background-image: url("../../../assets/images/drone/puzzle.png");
      }
      .puzzleBtn:active {
        background-image: url("../../../assets/images/drone/puzzle-active.png");
      }
      .scanningStyle {
        background: url("../../../assets/images/drone/scanning.png") center
          center no-repeat;
        width: 40px;
        height: 40px;
        animation: scanning 4s steps(32) infinite;
      }
      @keyframes scanning {
        0% {
          transform: rotateX(0deg);
          background-position: 0px -10px;
        }
        50% {
          transform: rotateX(0deg);
          background-position: 0px 40px;
        }
        50.0001% {
          transform: rotateX(180deg);
          background-position: 0px -10px;
        }
        100% {
          transform: rotateX(180deg);
          background-position: 0px 40px;
        }
      }
      .pointBtn {
        background-image: url("../../../assets/images/drone/point.png");
      }
      .pointBtnActive {
        background-image: url("../../../assets/images/drone/point-active.png");
      }
      .routeBtn {
        background-image: url("../../../assets/images/drone/route.png");
      }
      .routeBtnActive {
        background-image: url("../../../assets/images/drone/route-active.png");
      }
    }
    .mapOuterBox,
    .smallVideoStyle {
      z-index: 3;
      position: absolute;
      left: 60px;
      bottom: 60px;
      width: 283px;
      height: 183px;
      background-image: url("../../../assets/images/drone/map-box.png");
      pointer-events: visible;
      .mapArea,
      .smallVideoArea {
        position: relative;
        margin-left: 18px;
        margin-top: 21px;
        width: 246px;
        height: 143px;
        .smallVideoBox {
          width: 100%;
          height: 100%;
        }
        .sizeChange {
          position: absolute;
          top: 0px;
          right: 0px;
          height: 41px;
          width: 41px;
          background-image: url("../../../assets/images/drone/size-change.png");
        }
        .sizeChange:hover {
          opacity: 0.8;
        }
        .sizeChange:active {
          opacity: 0.9;
        }
      }
    }
    .mapOuterBoxFullScreen {
      z-index: 2;
      position: relative;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      width: 100%;
      height: 100%;
      background-image: none;
      .mapAreaFullScreen {
        margin-left: 0px;
        margin-top: 0px;
        width: 100%;
        height: 100%;
        background-color: whitesmoke;
      }
    }
  }
  .fullScreenMark {
    position: absolute;
    z-index: 20;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 386px;
    height: 250px;
    cursor: text;
    background: url(../../../assets/images/AR/tag_add.png) no-repeat;
    background-size: 100% 100%;
    > img {
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
    }
    form {
      margin-top: 20px;
    }
    // .el-form-item__content,
    // .el-form-item__label,
    // .el-input__inner,
    // .el-input__icon {
    //   height: 22px;
    //   line-height: 22px !important;
    // }
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-select-dropdown__item {
      height: 28px !important;
      line-height: 28px !important;
    }
    .el-button.el-button--primary {
      padding: 0;
      width: 68px !important;
      height: 36px !important;
      line-height: 36px !important;
      background: #409eff;
    }
  }
  div.operate {
    position: absolute;
    z-index: 20;
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
        z-index: 10000;
      }
      div:nth-child(1) {
        left: 50%;
        top: 5px;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/up.png) no-repeat center;
      }
      div:nth-child(1):hover {
        background: url(../../../assets/images/operate/up_selected.png)
          no-repeat center;
      }
      div:nth-child(2) {
        left: 74%;
        top: 24px;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/right_up.png) no-repeat
          center;
      }
      div:nth-child(2):hover {
        background: url(../../../assets/images/operate/right_up_selected.png)
          no-repeat center;
      }
      div:nth-child(3) {
        left: 88%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url(../../../assets/images/operate/right.png) no-repeat
          center;
      }
      div:nth-child(3):hover {
        background: url(../../../assets/images/operate/right_selected.png)
          no-repeat center;
      }
      div:nth-child(4) {
        left: 78%;
        top: 62%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/right_bottom.png)
          no-repeat center;
      }
      div:nth-child(4):hover {
        background: url(../../../assets/images/operate/right_bottom_selected.png)
          no-repeat center;
      }
      div:nth-child(5) {
        left: 52%;
        top: 78%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/down.png) no-repeat
          center;
      }
      div:nth-child(5):hover {
        background: url(../../../assets/images/operate/down_selected.png)
          no-repeat center;
      }
      div:nth-child(6) {
        left: 26%;
        top: 62%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/left_down.png) no-repeat
          center;
      }
      div:nth-child(6):hover {
        background: url(../../../assets/images/operate/left_down_selected.png)
          no-repeat center;
      }
      div:nth-child(7) {
        left: 14%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url(../../../assets/images/operate/left.png) no-repeat
          center;
      }
      div:nth-child(7):hover {
        background: url(../../../assets/images/operate/left_selected.png)
          no-repeat center;
      }
      div:nth-child(8) {
        left: 25%;
        top: 16%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/left_up.png) no-repeat
          center;
      }
      div:nth-child(8):hover {
        background: url(../../../assets/images/operate/left_up_selected.png)
          no-repeat center;
      }
    }
    .extra {
      position: absolute;
      top: 0;
      right: 0;
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
      div:nth-child(1).selected {
        background: url(../../../assets/images/operate/zoom_selected.png)
          no-repeat center;
      }
      div:nth-child(2) {
        left: 22px;
        top: -60px;
        background: url(../../../assets/images/operate/focus.png) no-repeat
          center;
      }
      div:nth-child(2).selected {
        background: url(../../../assets/images/operate/focus_selected.png)
          no-repeat center;
      }
      div:nth-child(3) {
        width: 51px;
        height: 63px;
        left: 54px;
        top: -54px;
        background: url(../../../assets/images/operate/add.png) no-repeat center;
      }
      div:nth-child(3):hover {
        background: url(../../../assets/images/operate/add_selected.png)
          no-repeat center;
      }
      div:nth-child(4) {
        left: 64px;
        top: -44px;
        background: #1477ab;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        border: 2px solid #2eccee;
      }
      div:nth-child(4):hover {
        background: #004469;
      }
      div:nth-child(5) {
        width: 59px;
        height: 48px;
        left: 20px;
        top: -42px;
        background: url(../../../assets/images/operate/minus.png) no-repeat
          center;
      }
      div:nth-child(5):hover {
        background: url(../../../assets/images/operate/minus_selected.png)
          no-repeat center;
      }
    }
  }
}
</style>
