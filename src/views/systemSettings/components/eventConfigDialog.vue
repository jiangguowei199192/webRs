<template>
  <div>
    <el-dialog :visible.sync="isShow" :close-on-click-modal="false" class="config-dlg dialog-wrap">
      <div class="config-header">
        {{ title }}
        <img src="../../../assets/images/backgroundManagement/X.svg" @click.stop="$emit('updateList')" />
      </div>
      <div class="config-content">
        <el-tabs :tab-position="tabPosition" v-model="activeType" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.title"
            :name="item.name"
          >
            <div class="tab-pane-header">
              <span>{{ item.title }}</span>
              <span>{{ item.describe }}</span>
            </div>
            <div class="tab-pane-detail" v-if="index==activeType">
              <div class="descript">
                <span>事件状态：</span>
                <el-switch
                  v-model="curEventObj.status"
                  active-color="#1EB0FC"
                  inactive-color="#DCDFE6"
                ></el-switch>
              </div>
              <div class="descript">
                <span>检测区域：</span>
                <span>点击“绘制区域”绘制闭合的凸多边形区域，最多绘制20个区域点坐标。默认为全部区域。</span>
              </div>
              <div class="drawCanvas">
                <div class="left">
                  <div class="content" ref="content">
                    <!-- <img src="../../../assets/images/Login/video-bg.jpg"  /> -->
                    <div
                      class="canvas"
                      v-if="isShowCapture"
                      :style="{backgroundImage:'url('+ (coverImgUrl ? coverImgUrl : baseImg) +')'}"
                    >
                      <!-- :style="{backgroundImage:'url('+caputrePic+')'}" -->
                      <canvas-draw ref="mychild" @drawEnd="getPoints" :areaArray="areaArray"></canvas-draw>
                    </div>
                    <LivePlayer
                      v-else
                      :videoUrl="streamUrl"
                      :show-custom-button="false"
                      :muted="false"
                      :controls="false"
                      :autoplay="true"
                      oncontextmenu="return false"
                      fluent
                      :stretch="true"
                      :live="true"
                      aspect="fullscreen"
                      class="playerStyle"
                    ></LivePlayer>
                  </div>
                  <div class="tools">
                    <div class="left">
                      <img
                        src="../../../assets/images/backgroundManagement/play.svg"
                        alt
                        title="播放"
                        @click.stop="showVideoOrCapture"
                      />
                      <img
                        src="../../../assets/images/backgroundManagement/capture.svg"
                        title="截取"
                        @click.stop="isShowCapture=true"
                        alt
                      />
                      <template>
                        <img
                          src="../../../assets/images/backgroundManagement/visible-selected.svg"
                          title="可见光"
                          alt
                          v-if="isVisibleSelected"
                        />
                        <img
                          src="../../../assets/images/backgroundManagement/visible.svg"
                          title="可见光"
                          @click.stop="isVisibleSelected=true"
                          alt
                          v-else
                        />
                      </template>
                      <template v-if="activeType!=='1'">
                        <img
                          src="../../../assets/images/backgroundManagement/infrared.svg"
                          title="红外光"
                          alt
                          v-if="isVisibleSelected"
                          @click.stop="isVisibleSelected = false"
                        />
                        <img
                          src="../../../assets/images/backgroundManagement/infrared-selected.svg"
                          title="红外光"
                          alt
                          v-else
                        />
                      </template>
                    </div>
                  </div>
                </div>
                <div class="right" v-if="isShowCapture">
                  <div class="btns">
                    <el-button @click="goDraw">继续绘制</el-button>
                    <el-button @click="clearAllDraw">清除全部</el-button>
                  </div>
                  <div class="areas" v-if="areaArray&&areaArray.length>0">
                    <p>已绘制区域：</p>
                    <div class="btns">
                      <el-button
                        v-for="(item,index) in areaArray"
                        :key="index"
                        @click="deleteCurArea"
                      >
                        区域{{index+1}}
                        <i class="el-icon-close el-icon-right"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="selectBox">
                <div class="select">
                  <span>有效时间：</span>
                  <el-date-picker
                    v-model="curEventObj.validTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </div>

                <div class="select">
                  <span>事件等级：</span>
                  <el-select v-model="curEventObj.eventLevel" placeholder="请选择">
                    <el-option
                      v-for="item in eventLevelData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="handelBtns">
        <span @click.stop="cancel">取消</span>
        <span @click="confirmAjax">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
import canvasDraw from './canvasDraw'
import { settingApi } from '@/api/setting'
import { timeFormat } from '@/utils/date'
export default {
  components: {
    LivePlayer,
    canvasDraw
  },
  props: {
    isShow: { type: Boolean, required: true },
    title: {
      type: String,
      default: '事件配置'
    },
    curData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      pickerOptions: {
        // 设置时分秒范围
        selectableRange: (() => {
          const data = new Date()
          const hour = data.getHours()
          const minute = data.getMinutes()
          const second = data.getSeconds()
          return [`${hour}:${minute}:${second} - 23:59:59`]
        })(),
        disabledDate (time) {
          // 小于昨天此刻全部禁用（今天可选）
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      baseImg: require('../../../assets/images/backgroundManagement/canvas-bg.png'),
      coverImgUrl: '',
      isVisibleSelected: true,
      isShowCapture: true,
      curEventObj: {
        status: false,
        validTime: '',
        eventLevel: ''
      }, // 保存当前数据
      streamUrl: '',
      eventLevelData: [
        { value: 1, label: '蓝色预警' },
        { value: 2, label: '黄色预警' },
        { value: 3, label: '橙色预警' },
        { value: 4, label: '红色预警' }
      ],
      activeType: 0,
      areaArray: [
      ], // 传递给后台的数据
      tabPosition: 'left',
      // tabs 内容
      tabList: [
        {
          name: '0',
          title: '船舶出现',
          describe:
            '在监控图像或二维地图中设定检测区域，检测船舶在指定区域内出现的事件'
        },
        {
          name: '1',
          title: '钓鱼行为',
          describe:
            '在监控图像或二维地图中设定检测区域，检测钓鱼行为在指定区域内出现的事件'
        },
        {
          name: '2',
          title: '人员滞留',
          describe:
            '在监控图像中设定检测区域和人员滞留时长，检测人员在警戒区域滞留超过设定时长的事件'
        },
        {
          name: '3',
          title: '人员入侵',
          describe: '在监控图像中设定检测区域，检测人员进入警戒区域的事件'
        }
      ]
    }
  },

  methods: {
    // 继续绘制
    goDraw () {
      console.log(this.$refs.mychild)
      this.$refs.mychild[0].startDraw()
    },
    clearAllDraw () {
      this.$refs.mychild[0].clearAllDraw()
      // this.areaArray = []
      console.dir(this.areaArray)
    },
    showVideoOrCapture () {
      this.isShowCapture = false
      const streamObj = this.getCurVideoObj()

      this.streamUrl = `ws://${streamObj.ip}:${streamObj.wsPort}/${streamObj.app}/${streamObj.stream}.flv`
      console.log('当前播放地址', this.streamUrl)
    },
    getCurVideoObj () {
      for (let i = 0; i < this.curEventObj.videoUrls.length; i++) {
        if (
          (this.isVisibleSelected &&
            this.curEventObj.videoUrls[i].streamType === '0') ||
          (!this.isVisibleSelected &&
            this.curEventObj.videoUrls[i].streamType === '1')
        ) {
          return this.curEventObj.videoUrls[i]
        }
      }
    },
    // 更新isShow状态
    cancel () {
      this.$emit('update:isShow', false)
      this.activeType = '0'
    },
    // tab 切换
    handleClick (tab, event) {
      this.isShowCapture = true
      this.isVisibleSelected = true
      this.areaArray = []
      this.getConfigInfo()
    },
    getPoints (points) {
      console.log('组件绘制的原始坐标', points)
      this.areaArray = JSON.parse(JSON.stringify(points))
      console.log(this.areaArray)
    },
    deleteCurArea (index) {
      // this.areaArray.splice(index, 1)
      this.$refs.mychild[0].clearCurDraw(index)
    },
    getConfigInfo () {
      const params = {
        accessType: this.curData.accessType,
        channelInfo: this.curData.channelInfo,
        deviceCode: this.curData.deviceCode,
        deviceTypeCode: this.curData.deviceTypeCode
        // type: 2
      }
      switch (Number(this.activeType)) {
        case 0:
          params.algorithmType = 4
          break
        case 1:
          params.algorithmType = 3
          break
        case 2:
          params.algorithmType = 6
          break
        case 3:
          params.algorithmType = 5
          break
        default:
          break
      }

      this.$axios.post(settingApi.queryDeviceConfig, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          const obj = res.data.data[0]
          obj.status = obj.status === 1
          obj.validTime = obj.validTime ? timeFormat(obj.validTime) : ''
          this.curEventObj = obj
          this.coverImgUrl = obj.backImgUrl ? obj.backImgUrl : ''
          this.areaArray = obj.area ? this.transferToAlgorithmPix(JSON.parse(obj.area), false) : []
        }
      })
    },
    transferToAlgorithmPix (pointsArray, isAlgorithm = true) {
      const contentStyle = window.getComputedStyle(this.$refs.content[0])
      const width = parseInt(contentStyle.width)
      const height = parseInt(contentStyle.height)
      console.log('width', width)
      console.log('height', height)

      pointsArray.forEach(area => {
        area.points.forEach(pixObj => {
          pixObj.pointX = isAlgorithm
            ? Math.round((pixObj.pointX / width) * 1280 * 100) / 100
            : Math.round((pixObj.pointX / 1280) * width * 100) / 100
          pixObj.pointY = isAlgorithm
            ? Math.round((pixObj.pointY / height) * 720 * 100) / 100
            : Math.round((pixObj.pointY / 720) * height * 100) / 100
        })
      })
      return pointsArray
    },
    confirmAjax () {
      console.dir(this.curEventObj)
      if (!this.curEventObj.eventLevel) {
        return this.$notify({
          title: '提示',
          message: '请选择事件等级！',
          type: 'warning'
        })
      }
      const params = {
        area: JSON.stringify(this.transferToAlgorithmPix(JSON.parse(JSON.stringify(this.areaArray)))),
        backImgUrl: this.coverImgUrl ? this.coverImgUrl : '',
        deviceCode: this.curData.deviceCode,
        drawType: 1,
        eventLevel: this.curEventObj.eventLevel,
        status: this.curEventObj.status ? 1 : 0,
        streamType: this.isVisibleSelected ? '0' : '1',
        // type: 2,
        validTime: this.curEventObj.validTime
      }
      switch (Number(this.activeType)) {
        case 0:
          params.algorithmType = 4
          break
        case 1:
          params.algorithmType = 3
          break
        case 2:
          params.algorithmType = 6
          break
        case 3:
          params.algorithmType = 5
          break
        default:
          break
      }
      this.$axios.post(settingApi.addDeviceConfig, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.$notify({
            title: '提示',
            message: '操作成功！',
            type: 'success'
          })
          this.$emit('updateList')
        }
      })
    }
  },
  watch: {
    isShow (nv, ov) {
      if (this.isShow) {
        this.getConfigInfo()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.config-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 1168px;
    background-color: transparent;
    .el-dialog__body {
      color: #fff;
      height: 720px;
      position: relative;
    }
    .config-header {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      line-height: 30px;
      padding: 0 20px;
      margin-top: 18px;
      img {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
    .config-content {
      margin-top: 20px;
      .el-tabs__header {
        width: 150px;
        height: 640px;
        border-right: 1px solid #00a7e8;
      }
      .el-tabs__active-bar {
        background-color: transparent;
        // background-color: #00d1ff;
        height: 30px !important;
        margin-top: 7.5px;
      }
      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }
      .el-tabs__item.is-left {
        text-align: center;
        margin-right: 20px;
        font-size: 16px;
        color: #00d1ff;
        height: 45px;
        line-height: 45px;
      }
      .el-tabs__item.is-left.is-active {
        color: #fff;
      }
      #tab-boat {
        margin-top: 15px;
      }
      .el-tab-pane {
        padding-left: 20px;
        // background-color: #03585e44;
      }
      .tab-pane-header {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #00a7e8;
        span:nth-child(1) {
          font-size: 20px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #00d1ff;
        }
        span:nth-child(2) {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #ffffff;
          line-height: 14px;
          opacity: 0.4;
          margin-left: 20px;
        }
      }
      .tab-pane-detail {
        margin-top: 20px;
        div.descript {
          > span:nth-child(1) {
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #00d1ff;
            margin-right: 17px;
          }
        }
        div.descript:nth-child(2) {
          margin-top: 17px;
          span:nth-child(2) {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #ffffff;
            line-height: 14px;
            opacity: 0.4;
          }
        }
        div.drawCanvas {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
          display: flex;
          margin-top: 13px;
          .left {
            width: 680px;
            .content {
              position: relative;
              height: 390px;
              div.canvas {
                width: 100%;
                height: 100%;
                background-size: 100% 100%;
              }
            }
            .tools {
              height: 40px;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              .left {
                padding-left: 15px;
                > img {
                  margin-top: 7px;
                  margin-right: 15px;
                  width: 26px;
                  height: 26px;
                  cursor: pointer;
                }
              }
            }
          }
          .right {
            flex: 1;
            > div.btns {
              padding-left: 28px;
              .el-button {
                width: 100px;
                height: 30px;
                background: #39a4dd;
                border: none;
                padding: 0;
                font-size: 16px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #ffffff;
              }
            }
            .areas {
              > p {
                margin-top: 20px;
                margin-bottom: 17px;
                padding-left: 15px;
                font-size: 16px;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: #00d1ff;
              }
              div.btns {
                padding-left: 15px;
                .el-button + .el-button {
                  margin: 0;
                }
                .el-button {
                  width: 72px;
                  height: 25px;
                  background: #39a4dd;
                  border-radius: 2px;
                  border: none;
                  padding: 0;
                  font-size: 12px;
                  font-family: Source Han Sans CN;
                  font-weight: bold;
                  color: #ffffff;
                  margin-right: 10px !important;
                  margin-top: 10px !important;
                  i {
                    position: relative;
                    left: 4px;
                    top:-2px;
                    font-size: 12px;
                  }
                }
              }
            }
          }
        }
        div.selectBox {
          margin-top: 10px;
          .select {
            display: inline-block;
            > span {
              margin-right: 18px;
              font-weight: 500;
              color: #00d1ff;
              font-size: 16px;
            }

            .el-input__inner {
              border-radius: 0;
              border: 1px solid #1eb0fc;
              background: #034157;
              color: #C4F2FE;
            }
          }
          .select:nth-child(1) {
            > div {
              width: 255px;
            }
          }
          .select:nth-child(2) {
            margin-left: 50px;
            > div {
              width: 140px;
            }
          }
        }
      }
    }
    .handelBtns {
      position: absolute;
      right: 0;
      bottom: 0;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background-color: transparent;
        font-size: 16px;
        color: #1eb0fc;
        cursor: pointer;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #00b7ff;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
