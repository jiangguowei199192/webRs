<template>
  <div>
    <el-dialog :visible.sync="isShow" :close-on-click-modal="false" class="config-dlg dialog-wrap">
      <div class="config-header">
        {{ title }}
        <img src="../../../assets/images/backgroundManagement/X.svg" />
      </div>
      <div class="config-content">
        <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
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
            <div class="tab-pane-detail">
              <div class="descript">
                <span>事件状态：</span>
                <el-switch v-model="value" active-color="#1EB0FC" inactive-color="#DCDFE6"></el-switch>
              </div>
              <div class="descript">
                <span>检测区域：</span>
                <span>点击“绘制区域”绘制闭合的凸多边形区域，最多绘制20个区域点坐标。默认为全部区域。</span>
              </div>
              <div class="drawCanvas">
                <div class="left">
                  <div class="content">
                    <img src="../../../assets/images/Login/video-bg.jpg" v-if="isShowCapture" />
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
                        @click="showVideoOrCapture"
                      />
                      <img
                        src="../../../assets/images/backgroundManagement/capture.svg"
                        title="截取"
                         @click="isShowCapture=true"
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
                          @click.stop="isVisibleSelected=!isVisibleSelected"
                          alt
                          v-else
                        />
                      </template>
                      <template>
                        <img
                          src="../../../assets/images/backgroundManagement/infrared.svg"
                          title="红外光"
                          alt
                          v-if="isVisibleSelected"
                          @click.stop="isVisibleSelected = !isVisibleSelected"
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
                <div class="right">
                  <div class="btns">
                    <el-button>继续绘制</el-button>
                    <el-button>清除全部</el-button>
                  </div>
                  <div class="areas">
                    <p>已绘制区域：</p>
                    <div class="btns">
                      <el-button v-for="(item,index) in 5" :key="index">
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
                  <el-date-picker v-model="date" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </div>

                <div class="select">
                  <span>事件等级：</span>
                  <el-select v-model="alarmLevel" placeholder="请选择">
                    <el-option
                      v-for="item in alarmLevelData"
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
        <span @click.stop=" cancel()">取消</span>
        <span>确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  components: {
    LivePlayer
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
      isVisibleSelected: true,
      isShowCapture: true,
      value: true,
      date: '',
      alarmLevel: '',
      alarmLevelData: [
        { value: 1, label: '红色预警' },
        { value: 2, label: '橙色预警' },
        { value: 3, label: '黄色预警' },
        { value: 4, label: '蓝色预警' }
      ],
      activeName: 'boat',
      tabPosition: 'left',
      // tabs 内容
      tabList: [
        {
          name: 'boat',
          title: '船舶出现',
          describe:
            '在监控图像或二维地图中设定检测区域，检测船舶在指定区域内出现的事件'
        },
        {
          name: 'fish',
          title: '钓鱼行为',
          describe:
            '在监控图像或二维地图中设定检测区域，检测钓鱼行为在指定区域内出现的事件'
        },
        {
          name: 'stranded',
          title: '人员滞留',
          describe:
            '在监控图像中设定检测区域和人员滞留时长，检测人员在警戒区域滞留超过设定时长的事件'
        },
        {
          name: 'invade',
          title: '人员入侵',
          describe: '在监控图像中设定检测区域，检测人员进入警戒区域的事件'
        }
      ]
    }
  },
  watch: {
    isShow (val) {}
  },

  mounted () {},

  methods: {
    showVideoOrCapture () {
      this.isShowCapture = false
      this.streamUrl = 'ws://122.112.217.132:8888/live/6C01728PA4A9A760.flv'
    },
    // 更新isShow状态
    cancel () {
      this.$emit('update:isShow', false)
    },

    handleClick (tab, event) {
      console.log(tab, event)
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
              img {
                width: 100%;
                height: 100%;
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
                  width:26px;
                  height:26px;
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
                    right: -8px;
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
