<template>
  <CaseMain ref="caseMain" :showTool="true">
    <div class="caseDetail" slot="main">
      <div class="singleCase">
        <div class="gisTitle">
          <span>案件信息</span>
        </div>
        <div class="caseInfo">
          <div class="switch">
            <span :class="{ select: active === 0 }" @click.stop="active = 0"
              >基础信息</span
            >
            <span>|</span>
            <span :class="{ select: active === 1 }" @click.stop="active = 1"
              >推送信息</span
            >
          </div>
          <div class="info" v-show="active === 0">
            <img
              src="../../assets/images/gisDispatch/no-pic.svg"
              class="left"
            />
            <div class="right">
              <EllipsisTooltip
                class="caseName"
                :contentText="caseInfo.caseName"
              ></EllipsisTooltip>
              <EllipsisTooltip
                :contentText="'报案人：' + caseInfo.reportMan"
                class="txt"
              ></EllipsisTooltip>
              <EllipsisTooltip
                :contentText="'联系电话：' + caseInfo.reportTel"
                class="txt"
              ></EllipsisTooltip>
              <EllipsisTooltip
                :contentText="'案件描述：' + caseInfo.caseDesc"
                class="caseDesc"
                :isMultiLine="true"
                :webkitLineClamp="2"
              ></EllipsisTooltip>
              <div class="time">
                <img src="../../assets/images/gisDispatch/time.svg" />
                <EllipsisTooltip
                  :contentText="caseInfo.reportTime"
                  class="reportAddr"
                ></EllipsisTooltip>
              </div>
              <div class="time">
                <img src="../../assets/images/gisDispatch/addr.svg" />
                <EllipsisTooltip
                  :contentText="caseInfo.reportAddr"
                  class="reportAddr"
                ></EllipsisTooltip>
              </div>
            </div>
          </div>
          <div v-show="active === 1" class="pushBox listScroll">
            <template v-for="(item, index) in pushList">
              <div :key="index" class="push">
                <span>{{ index + 1 }}</span>
                <span>{{ item.time }}</span>
                <EllipsisTooltip
                  :contentText="item.txt"
                  class="names"
                ></EllipsisTooltip>
              </div>
            </template>
          </div>
          <div class="btns">
            <span></span>
            <span></span>
            <span @click.stop="showDispose = true"></span>
          </div>
        </div>
      </div>
      <div class="disposeBox">
        <div class="gisTitle">
          <span>案件信息</span>
        </div>
        <div class="disposeInfo"></div>
      </div>
      <div class="resAround">
        <div class="gisTitle">
          <span>周边资源</span>
        </div>
        <div class="resBox">
          <div class="head">
            <span>总计:</span>
            <span>详情</span>
          </div>
          <div class="data">
            <div class="left">
              <template v-for="(item, index) in resInfos">
                <div
                  :key="index"
                  :style="{ color: item.color }"
                  @click.stop="selResIdx = index"
                  :class="{ select: selResIdx === index }"
                >
                  <img :src="selResIdx === index ? item.imgS : item.img" />
                  <span>{{ item.name }}</span>
                  <span>{{ item.num }}</span>
                  <span
                    :class="{ unview: !item.view }"
                    @click.stop="visibleResInMap(item)"
                  ></span>
                </div>
              </template>
            </div>
            <div class="right listScroll">
              <template v-for="(item, index) in resDetails">
                <div :key="index">
                  <div class="rTxt" v-show="selResIdx != 2">
                    <EllipsisTooltip
                      class="name"
                      :contentText="item.name"
                    ></EllipsisTooltip>
                    <EllipsisTooltip
                      class="des"
                      :contentText="item.des"
                    ></EllipsisTooltip>
                  </div>
                  <div class="drone" v-show="selResIdx === 2">
                    <EllipsisTooltip
                      class="name"
                      :contentText="item.name"
                      :isMultiLine="true"
                      :webkitLineClamp="2"
                    ></EllipsisTooltip>
                    <div class="latLng">
                      <EllipsisTooltip
                        class="lat"
                        :contentText="'经度：' + item.lon"
                      ></EllipsisTooltip>
                      <EllipsisTooltip
                        class="lat"
                        :contentText="'纬度：' + item.lon"
                      ></EllipsisTooltip>
                    </div>
                  </div>
                  <div
                    class="distance"
                    v-show="selResIdx != 4 && selResIdx != 5 && selResIdx != 6"
                  >
                    <img src="../../assets/images/gisDispatch/distance.svg" />
                    <span>{{ item.dist + "m" }}</span>
                  </div>
                </div>
              </template>
            </div>
            <div class="plan">
              <div class="header">
                <img
                  src="../../assets/images/gisDispatch/plan-unfold.svg"
                  @click.stop="showPlans = !showPlans"
                  :class="{ fold: showPlans }"
                />
                <span>预案</span>
              </div>
              <transition name="showPlans">
                <div class="stepBox" v-show="showPlans">
                  <template v-for="(item, index) in planSteps">
                    <el-popover
                      :key="index"
                      placement="right"
                      trigger="click"
                      v-model="item.visible"
                      popper-class="planPopover"
                    >
                      <div>
                        <span
                          class="close"
                          @click.stop="item.visible = false"
                        ></span>
                        <span>{{ item.content }}</span>
                      </div>
                      <div
                        slot="reference"
                        @click.stop="clickStep(item, index)"
                        class="step"
                        :class="{ select: selStepIdx === index }"
                      >
                        {{ item.name }}
                        <img
                          :src="selStepIdx === index ? item.imgS : item.img"
                        />
                      </div>
                    </el-popover>
                  </template>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="tools">
        <template v-for="(item, index) in tools">
          <div :key="index" @click.stop="toolClick(index)">
            <img :src="item.img" />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </div>
      <!-- 处置记录弹窗 -->
      <DisposeRecDialog
        :isShow.sync="showDispose"
        title="处置记录"
        class="dispose"
        :clickRowId="caseId"
      ></DisposeRecDialog>
    </div>
  </CaseMain>
</template>

<script>
import { copyData } from '@/utils/public'
import CaseMain from './components/caseMain'
import EllipsisTooltip from '../../components/ellipsisTooltip'
import DisposeRecDialog from '../caseCenter/components/disposeRecDialog'
export default {
  name: 'caseDetail',
  data () {
    return {
      caseId: '',
      showDispose: false,
      showPlans: true,
      active: 0, // 0-基础信息 1-推送信息
      caseInfo: {
        caseName: '',
        reportMan: '',
        caseDesc: '',
        reportAddr: '',
        reportTel: '',
        reportTime: ''
      },
      selResIdx: -1,
      selStepIdx: -1,
      tools: [
        {
          name: '清屏',
          img: require('../../assets/images/gisDispatch/clear.svg')
        },
        {
          name: '测距',
          img: require('../../assets/images/gisDispatch/measure-len.svg')
        }
      ],
      planSteps: [
        {
          name: '接警',
          content:
            '认真接听案情。在接线员接案后第一时间 问清相关信息，重点询问发生时间、地址、 人数、携带工具',
          visible: false,
          img: require('../../assets/images/gisDispatch/accept-police.svg'),
          imgS: require('../../assets/images/gisDispatch/accept-police-select.svg')
        },
        {
          name: '推送',
          content: '推送相关信息到附近执法人员或附近单位',
          visible: false,
          img: require('../../assets/images/gisDispatch/push.svg'),
          imgS: require('../../assets/images/gisDispatch/push-select.svg')
        },
        {
          name: '侦查',
          content: '查看周围视频，查看案件周围情况',
          visible: false,
          img: require('../../assets/images/gisDispatch/detect.svg'),
          imgS: require('../../assets/images/gisDispatch/detect-select.svg')
        },
        {
          name: '跟踪',
          content: '实时跟踪处置信，与一线执法人员进行沟通',
          visible: false,
          img: require('../../assets/images/gisDispatch/trace.svg'),
          imgS: require('../../assets/images/gisDispatch/trace-select.svg')
        },
        {
          name: '结案',
          content: '上报案件处置结果',
          visible: false,
          img: require('../../assets/images/gisDispatch/finish-case.svg'),
          imgS: require('../../assets/images/gisDispatch/finish-case-select.svg')
        }
      ],
      resDetails: [
        {
          dist: 222,
          name: '武汉市渔业渔政处22222222222',
          des: '武汉市江汉区沿江大道33333333333333',
          lat: '30.1234567',
          lon: '114.654317'
        },
        {
          dist: 222,
          name: '武汉市渔业渔政处',
          des: '武汉市江汉区沿江大道33333333333333',
          lat: '',
          lon: ''
        },
        {
          dist: 222,
          name: '武汉市渔业渔政处22222222222',
          des: '武汉市江汉区沿江大道',
          lat: '',
          lon: ''
        },
        {
          dist: 222,
          name: '武汉市渔业渔政处22222222222',
          des: '武汉市江汉区沿江大道33333333333333',
          lat: '',
          lon: ''
        },
        {
          dist: 333,
          name: '武汉市渔业渔政处22222222222',
          des: '武汉市江汉区沿江大道33333333333333',
          lat: '',
          lon: ''
        }
      ],
      resInfos: [
        {
          name: '组织机构',
          img: require('../../assets/images/gisDispatch/institution.svg'),
          imgS: require('../../assets/images/gisDispatch/institution-select.svg'),
          num: 8,
          color: '#20F2F5',
          view: true
        },
        {
          name: '组织人员',
          img: require('../../assets/images/gisDispatch/people.svg'),
          imgS: require('../../assets/images/gisDispatch/people-select.svg'),
          num: 12,
          color: '#CCFF00',
          view: true
        },
        {
          name: '无人机',
          img: require('../../assets/images/gisDispatch/drone.svg'),
          imgS: require('../../assets/images/gisDispatch/drone-select.svg'),
          num: 4,
          color: '#EF4E22',
          view: true
        },
        {
          name: '高点监控',
          img: require('../../assets/images/gisDispatch/camera.svg'),
          imgS: require('../../assets/images/gisDispatch/camera-select.svg'),
          num: 15,
          color: '#49EF22',
          view: true
        },
        {
          name: '重点区域',
          img: require('../../assets/images/gisDispatch/area.svg'),
          imgS: require('../../assets/images/gisDispatch/area-select.svg'),
          num: 3,
          color: '#E92D2D',
          view: true
        },
        {
          name: '重要路线',
          img: require('../../assets/images/gisDispatch/route.svg'),
          imgS: require('../../assets/images/gisDispatch/route-select.svg'),
          num: 7,
          color: '#CCFF00',
          view: true
        },
        {
          name: '关注点位',
          img: require('../../assets/images/gisDispatch/point.svg'),
          imgS: require('../../assets/images/gisDispatch/point-select.svg'),
          num: 7,
          color: '#82F3FA',
          view: true
        }
      ],
      pushList: [
        {
          time: '2020-03-04 16:21:33',
          txt: '张三 李四 王五'
        },
        {
          time: '2020-03-04 16:21:33',
          txt: '张三 李四 王五2233333355555555'
        },
        {
          time: '2020-03-04 16:21:33',
          txt: '张三 李四 王五'
        },
        {
          time: '2020-03-04 16:21:33',
          txt: '张三 李四 王五'
        },
        {
          time: '2020-03-04 16:21:33',
          txt: '张三 李四 王五'
        },
        {
          time: '2020-03-04 16:21:33',
          txt: '张三 李四 王五'
        }
      ]
    }
  },
  components: {
    CaseMain,
    EllipsisTooltip,
    DisposeRecDialog
  },
  mounted () {
    const data = JSON.parse(this.$route.query.data)
    copyData(data, this.caseInfo)
    this.caseId = data.id
    setTimeout(() => {
      data.type = 'RP_Case'
      this.$refs.caseMain.addCaseMarker([data])
      this.$refs.caseMain.zoomToCenter(data.longitude, data.latitude)
    }, 200)
  },
  methods: {
    /**
     * 地图上显隐资源
     */
    visibleResInMap (item) {
      item.view = !item.view
    },
    /**
     * 点击预案
     */
    clickStep (item, index) {
      this.selStepIdx = index
      this.planSteps.forEach((p) => {
        if (p.name !== item.name) {
          p.visible = false
        }
      })
    },
    /**
     * 点击工具栏
     */
    toolClick (index) {
      if (index === 0) {
        this.$refs.caseMain.clearScreen()
      } else if (index === 1) {
        this.$refs.caseMain.measureLenStart()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.caseDetail {
  height: 100%;
  position: relative;
  .dispose {
    pointer-events: auto;
  }
  .singleCase {
    width: 349px;
    height: 208px;
    pointer-events: auto;
    position: absolute;
    top: 157px;
    left: 17px;
    background: url(../../assets/images/gisDispatch/single-case.svg) no-repeat;
    background-size: 100% 100%;
    .caseInfo {
      position: relative;
      box-sizing: border-box;
      width: 329px;
      height: 188px;
      background-color: rgba($color: #004157, $alpha: 0.8);
      font-size: 12px;
      padding-top: 6px;
      padding-left: 14px;
      padding-right: 8px;
      .btns {
        position: absolute;
        top: 4px;
        right: 2px;
        span {
          display: inline-block;
          cursor: pointer;
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        span:nth-child(1) {
          background: url(../../assets/images/gisDispatch/assign.svg) no-repeat;
          background-size: 100% 100%;
        }
        span:nth-child(2) {
          background: url(../../assets/images/gisDispatch/chat.svg) no-repeat;
          background-size: 100% 100%;
        }
        span:nth-child(3) {
          background: url(../../assets/images/gisDispatch/dispose.svg) no-repeat;
          background-size: 100% 100%;
          margin-right: 0px;
        }
      }
      .switch {
        span {
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #82f3fa;
          cursor: pointer;
        }
        span:nth-child(1),
        span:nth-child(2) {
          margin-right: 5px;
        }
        span.select {
          color: #6ed340;
        }
      }
      .info {
        display: flex;
        margin-top: 8px;
        .left {
          width: 116px;
          height: 140px;
          margin-right: 11px;
        }
        .right {
          display: flex;
          flex-direction: column;
          width: 180px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #fff;
          .caseName {
            color: #82f3fa;
          }
          .txt {
            height: 16px;
            line-height: 16px;
            margin-bottom: 5px;
          }
          .caseDesc {
            height: 36px;
            line-height: 18px;
            margin-bottom: 5px;
          }
          .time {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            img {
              width: 14px;
              height: 14px;
              margin-right: 6px;
            }
            .reportAddr {
              width: 160px;
              height: 16px;
              line-height: 16px;
            }
          }
        }
      }
      .pushBox {
        box-sizing: border-box;
        padding: 0px 13px 0px 0px;
        height: 150px;
        overflow-y: scroll;
        font-size: 12px;
        .push {
          position: relative;
          height: 16px;
          line-height: 16px;
          margin-top: 14px;
          span:nth-child(1) {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #00b7ff;
            border-radius: 50%;
            line-height: 18px;
            text-align: center;
            margin-right: 9px;
          }
          span:nth-child(2) {
            color: #82f3fa;
          }
          .names {
            display: inline-block;
            width: 100px;
            position: absolute;
            right: 0px;
            text-align: right;
            color: #82f3fa;
          }
        }
      }
    }
  }
  .disposeBox {
    width: 349px;
    height: 608px;
    pointer-events: auto;
    position: absolute;
    top: 397px;
    left: 17px;
    background: url(../../assets/images/gisDispatch/dispose-box.svg) no-repeat;
    background-size: 100% 100%;
    .disposeInfo {
      box-sizing: border-box;
      width: 329px;
      height: 588px;
      background-color: rgba($color: #0179a2, $alpha: 0.95);
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .resAround {
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    width: 420px;
    height: 235px;
    pointer-events: auto;
    position: absolute;
    top: 151px;
    right: 23px;
    background: url(../../assets/images/gisDispatch/around-box.svg) no-repeat;
    background-size: 100% 100%;
    .resBox {
      box-sizing: border-box;
      width: 400px;
      height: 215px;
      background-color: rgba($color: #0179a2, $alpha: 0.95);
      padding: 5px 0px 5px 0px;
      .head {
        padding: 0px 10px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #00a7e8;
        margin-bottom: 5px;
      }
      .data {
        display: flex;
        .left {
          width: 170px;
          box-sizing: border-box;
          border-right: 1px solid #00b7ff;
          cursor: pointer;
          > div {
            height: 26px;
            display: flex;
            align-items: center;
            padding-left: 10px;
            img {
              width: 16px;
              height: 16px;
              margin-right: 10px;
              vertical-align: middle;
            }
            span:nth-child(2) {
              display: inline-block;
              width: 70px;
              margin-right: 8px;
            }
            span:nth-child(3) {
              margin-right: 10px;
              display: inline-block;
              width: 20px;
            }
            span:nth-child(4) {
              cursor: pointer;
              display: inline-block;
              width: 18px;
              height: 14px;
              background: url(../../assets/images/gisDispatch/view.svg)
                no-repeat;
              background-size: 100% 100%;
            }
            span:nth-child(4).unview {
              background: url(../../assets/images/gisDispatch/unview.svg)
                no-repeat;
              background-size: 100% 100%;
            }
          }
          > div.select {
            background: #00b7ff;
            color: #fff !important;
            span:nth-child(4) {
              background: url(../../assets/images/gisDispatch/view-select.svg)
                no-repeat;
              background-size: 100% 100%;
            }
            span:nth-child(4).unview {
              background: url(../../assets/images/gisDispatch/unview-select.svg)
                no-repeat;
              background-size: 100% 100%;
            }
          }
        }
        .right {
          box-sizing: border-box;
          margin-left: 10px;
          width: 220px;
          height: 180px;
          padding-right: 10px;
          overflow-y: scroll;
          > div {
            box-sizing: border-box;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #00b7ff;
            .rTxt {
              width: 130px;
              display: flex;
              flex-direction: column;
              .name {
                color: #82f3fa;
              }
              .des {
                color: #cdcdcd;
                font-weight: 500;
              }
            }
            .distance {
              display: flex;
              align-items: center;
              img {
                margin-right: 5px;
              }
            }
            .drone {
              display: flex;
              .name {
                color: #82f3fa;
                width: 24px;
                box-sizing: border-box;
                margin-right: 8px;
              }
              .latLng {
                display: flex;
                width: 98px;
                flex-direction: column;
                font-weight: 500;
                color: #cdcdcd;
              }
            }
          }
        }
        .plan {
          width: 134px;
          position: absolute;
          top: 514px;
          right: 23px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 12px;

          .showPlans-enter-active,
          .showPlans-leave-active {
            transition: all 0.8s;
          }
          .showPlans-enter,
          .showPlans-leave-active {
            transform: translate3d(104px, 0, 0);
            opacity: 0;
          }

          .header {
            height: 30px;
            background: #00b7ff;
            display: flex;
            align-items: center;
            img {
              margin-left: 20px;
              margin-right: 28px;
              cursor: pointer;
            }
            img.fold {
              transform: rotate(180deg);
            }
            span {
              font-size: 16px;
              color: #ffffff;
            }
          }
          .stepBox {
            .step {
              box-sizing: border-box;
              width: 104px;
              height: 30px;
              border: 1px solid #00b7ff;
              background-color: rgba($color: #00b7ff, $alpha: 0.2);
              margin-top: 10px;
              font-size: 16px;
              color: #00b7ff;
              padding: 0px 12px 0px 21px;
              line-height: 30px;
              cursor: pointer;
              img {
                position: relative;
                top: -2px;
                left: 15px;
                vertical-align: middle;
              }
            }
            .step.select {
              background: #00b7ff;
              color: #fff;
            }
            .step:focus {
              outline: none;
            }
          }
        }
      }
    }
  }
  .tools {
    display: flex;
    position: absolute;
    bottom: 20px;
    left: 860px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    > div {
      pointer-events: auto;
      width: 90px;
      height: 43px;
      background: url(../../assets/images/gisDispatch/clear-box.svg) no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 19px;
      img {
        margin-left: 12px;
        margin-right: 6px;
      }
    }
  }
}
</style>
