<template>
  <CaseMain ref="caseMain" :showTool="true" @clearScreen="clearScreen">
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
            <img :src="caseInfo.img || noPic" class="left" />
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
                :contentText="'联系电话：' + (caseInfo.reportTel || '')"
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
            <span
              @click.stop="showAssign = true"
              v-show="caseInfo.caseStatus !== 1"
            ></span>
            <span @click.stop="showChatBox = true"></span>
            <span
              @click.stop="showDispose = true"
              v-show="caseInfo.caseStatus !== 1"
            ></span>
          </div>
        </div>
      </div>
      <div class="disposeBox">
        <div class="gisTitle">
          <span>处置记录</span>
        </div>
        <div class="disposeInfo">
          <CaseStep class="record"></CaseStep>
        </div>
      </div>
      <div class="resAround">
        <div class="gisTitle">
          <span>周边资源</span>
        </div>
        <div class="resBox">
          <div class="head">
            <span>总计: {{ totalRes }}</span>
            <span>详情</span>
          </div>
          <div class="data">
            <div class="left">
              <template v-for="(item, index) in resInfos">
                <div
                  :key="index"
                  :style="{ color: item.color }"
                  @click.stop="changeDetailList(index)"
                  :class="{ select: selResIdx === index }"
                >
                  <img :src="selResIdx === index ? item.imgS : item.img" />
                  <span>{{ item.name }}</span>
                  <span>{{ item.num }}</span>
                  <span
                    :class="{ unview: !item.view }"
                    @click.stop="visibleResInMap(item, index)"
                  ></span>
                </div>
              </template>
            </div>
            <div class="right listScroll">
              <template v-for="(item, index) in resList[selResIdx]">
                <div
                  :key="index"
                  :class="{
                    hasBorder: index !== resList[selResIdx].length - 1,
                  }"
                >
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
                    v-show="selResIdx != 4 && selResIdx != 5"
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
        :clickRowId="caseInfo.id"
        :reportTime="caseInfo.reportTime"
        @finishCaseSuccess="finishCaseSuccess"
      ></DisposeRecDialog>
      <ChatBox :isShow.sync="showChatBox" :caseId="caseInfo.id"></ChatBox>
      <CaseAssign
        :isShow.sync="showAssign"
        :caseInfo="caseInfo"
        @assignSuccess="assignSuccess"
      ></CaseAssign>
    </div>
  </CaseMain>
</template>

<script>
import { copyData } from '@/utils/public'
import CaseMain from './components/caseMain'
import ChatBox from './components/chatBox'
import CaseAssign from './components/caseAssign'
import CaseStep from '@/components/caseStep'
import EllipsisTooltip from '../../components/ellipsisTooltip'
import DisposeRecDialog from '../caseCenter/components/disposeRecDialog'
import { EventBus } from '@/utils/eventBus.js'
import caseMixin from './mixins/caseMixin'
import { caseApi } from '@/api/case'
import globalApi from '../../utils/globalApi'
export default {
  name: 'caseDetail',
  data () {
    return {
      radius: 5000,
      detailTimeout: '',
      showAssign: false,
      showChatBox: false,
      showDispose: false,
      showPlans: true,
      active: 0, // 0-基础信息 1-推送信息
      caseInfo: {
        caseName: '',
        reportMan: '',
        caseDesc: '',
        reportAddr: '',
        reportTel: '',
        reportTime: '',
        longitude: '',
        latitude: '',
        type: '',
        caseStatus: '',
        img: '',
        id: ''
      },
      selResIdx: 0,
      selStepIdx: -1,
      totalRes: 0,
      resList: [[], [], [], [], [], [], []],
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
          name: '接案',
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
      pushList: []
    }
  },
  mixins: [caseMixin],
  components: {
    CaseMain,
    EllipsisTooltip,
    DisposeRecDialog,
    ChatBox,
    CaseAssign,
    CaseStep
  },
  destroyed () {
    EventBus.$off('caseRadiusChange')
    EventBus.$off('web/river/caseNotice')
    if (this.detailTimeout) {
      clearTimeout(this.detailTimeout)
    }
  },
  created () {
    const data = JSON.parse(this.$route.query.data)
    this.caseInfo.id = data.id
    this.caseInfo.type = 'RP_Case'
    this.caseInfo.hasFence = true
    this.caseInfo.longitude = data.longitude
    this.caseInfo.latitude = data.latitude
    this.getCaseDetail()
    this.getPushList()
    const me = this
    // 每隔10分钟刷新一次案件详情
    this.detailTimeout = setTimeout(() => {
      me.getPushList()
      // me.getCaseDetail()
      // me.getCaseRecord()
    }, 10 * 60 * 1000)
  },
  mounted () {
    const me = this
    // 案件范围改变
    EventBus.$on('caseRadiusChange', (radius) => {
      this.radius = radius * 1000
      me.$refs.caseMain.clearAllOtherFeatures()
      me.$refs.caseMain.addOrUpdateFence(me.caseInfo, radius * 1000)
      me.getDeptsDone()
      me.getMembersDone()
      me.getPointsDone()
      me.getLinesDone()
      me.getAreasDone()
      me.getCamerasDone()
      me.getDronesDone()
    })
    EventBus.$on('web/river/caseNotice', (info) => {
      if (info) {
        let caseId = ''
        for (const item in info) {
          caseId = info[item].substr(3)
          break
        }
        if (caseId === me.caseInfo.id) {
          me.getCaseDetail()
          me.getCaseRecord()
        }
      }
    })
    this.getCaseRecord()
  },
  methods: {
    /**
     * 处置案件成功
     */
    finishCaseSuccess () {
      this.getCaseDetail()
      this.getCaseRecord()
    },
    /**
     * 分派成功
     */
    assignSuccess () {
      this.getPushList()
    },
    /**
     * 更新案件范围
     */
    clearScreen () {
      this.$refs.caseMain.updateCaseRadius(this.caseInfo, 0)
    },
    /**
     * 获取案件处置记录
     */
    getCaseRecord () {
      this.$axios
        .post(
          caseApi.selectCaseRecord,
          { id: this.caseInfo.id },
          { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            EventBus.$emit('selectedCaseRecord', res.data.data.records)
          }
        })
        .catch((err) => {
          console.log('caseApi.selectCaseRecord Err : ' + err)
        })
    },
    /**
     * 获取案件推送列表
     */
    getPushList () {
      this.$axios
        .post(
          caseApi.selectPushList,
          { id: this.caseInfo.id },
          { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const list = res.data.data
            this.pushList = []
            list.forEach((l) => {
              if (l.pushMans && l.pushMans.length > 0) {
                let txt = ''
                for (let i = 0; i < l.pushMans.length; i++) {
                  const s =
                    i === l.pushMans.length.length - 1
                      ? l.pushMans[i].employeeName
                      : l.pushMans[i].employeeName + ' '
                  txt += s
                }
                const p = {
                  time: l.pushTime,
                  txt: txt
                }
                this.pushList.push(p)
              }
            })
          }
        })
        .catch((err) => {
          console.log('caseApi.selectPushList Err : ' + err)
        })
    },
    /**
     * 获取案件详情
     */
    getCaseDetail () {
      this.$axios
        .post(
          caseApi.selectDetail,
          {
            id: this.caseInfo.id
          },
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const data = res.data.data
            delete data.latitude
            delete data.longitude
            copyData(data, this.caseInfo)
            const img = this.getCaseImg(data.disFinishAttachment)
            if (img) {
              this.caseInfo.img = globalApi.headImg + img
            }
            setTimeout(() => {
              this.$refs.caseMain.addCaseMarker([this.caseInfo])
              this.$refs.caseMain.zoomToCenter(
                this.caseInfo.longitude,
                this.caseInfo.latitude,
                13
              )
              this.$refs.caseMain.addOrUpdateFence(this.caseInfo, 5000)
            }, 200)
          }
        })
        .catch((err) => {
          console.log('caseApi.selectDetail Err : ' + err)
        })
    },
    /**
     * 地图上显隐资源
     */
    visibleResInMap (item, id) {
      item.view = !item.view
      this.$refs.caseMain.showOrHideLayer(item.view, id)
    },
    /**
     * 切换周边资源列表
     */
    changeDetailList (index) {
      this.selResIdx = index
    },
    /**
     * 获取资源总数
     */
    getTotalRes () {
      this.totalRes = 0
      this.resList.forEach((l) => {
        this.totalRes += l.length
      })
    },
    /**
     * 获取无人机资源完毕回调
     */
    getDronesDone () {
      const count = this.$refs.caseMain.addDatasInRadius(
        this.drones,
        this.caseInfo,
        this.radius
      )
      this.resInfos[2].num = count
      this.resList[2] = []
      this.drones.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.deviceName,
            lat: l.latitude,
            lon: l.longitude,
            dist: parseInt(l.distance)
          }
          this.resList[2].push(o)
        }
      })
      this.getTotalRes()
    },
    /**
     * 获取高点监控资源完毕回调
     */
    getCamerasDone () {
      const count = this.$refs.caseMain.addDatasInRadius(
        this.cameras,
        this.caseInfo,
        this.radius
      )
      this.resInfos[3].num = count
      this.resList[3] = []
      this.cameras.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.deviceName,
            des: l.deviceAddress,
            dist: parseInt(l.distance)
          }
          this.resList[3].push(o)
        }
      })
      this.getTotalRes()
    },
    /**
     * 获取面资源完毕回调
     */
    getAreasDone () {
      const count = this.$refs.caseMain.addDatasInRadius(
        this.areas,
        this.caseInfo,
        this.radius
      )
      this.resInfos[4].num = count
      this.resList[4] = []
      this.areas.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.resourcesName,
            des: l.resourcesAddr,
            dist: parseInt(l.distance)
          }
          this.resList[4].push(o)
        }
      })
      this.getTotalRes()
    },
    /**
     * 获取线资源完毕回调
     */
    getLinesDone () {
      const count = this.$refs.caseMain.addDatasInRadius2(
        this.lines,
        this.caseInfo,
        this.radius
      )
      this.resInfos[5].num = count
      this.resList[5] = []
      this.lines.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.resourcesName,
            des: l.resourcesAddr,
            dist: parseInt(l.distance)
          }
          this.resList[5].push(o)
        }
      })
      this.getTotalRes()
    },
    /**
     * 获取点资源完毕回调
     */
    getPointsDone () {
      const count = this.$refs.caseMain.addDatasInRadius(
        this.points,
        this.caseInfo,
        this.radius
      )
      this.resInfos[6].num = count
      this.resList[6] = []
      this.points.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.resourcesName,
            des: l.resourcesAddr,
            dist: parseInt(l.distance)
          }
          this.resList[6].push(o)
        }
      })
      this.getTotalRes()
    },
    /**
     * 获取组织机构完毕回调
     */
    getDeptsDone () {
      const count = this.$refs.caseMain.addDatasInRadius(
        this.organs,
        this.caseInfo,
        this.radius
      )
      this.resInfos[0].num = count
      this.resList[0] = []
      this.organs.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.deptName,
            des: l.deptAddress,
            dist: parseInt(l.distance)
          }
          this.resList[0].push(o)
        }
      })
      this.getTotalRes()
    },
    /**
     * 获取组织人员完毕回调
     */
    getMembersDone () {
      const count = this.$refs.caseMain.addDatasInRadius(
        this.members,
        this.caseInfo,
        this.radius
      )
      this.resInfos[1].num = count
      this.resList[1] = []
      this.members.forEach((l) => {
        if (l.inRadius) {
          const o = {
            name: l.employeeName,
            des: l.deptName,
            dist: parseInt(l.distance)
          }
          this.resList[1].push(o)
        }
      })
      this.getTotalRes()
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
        EventBus.$emit('setCaseRadius', 0)
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
    //top: 157px;
    top: 87px;
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
    //top: 397px;
    top: 327px;
    left: 17px;
    background: url(../../assets/images/gisDispatch/dispose-box.svg) no-repeat;
    background-size: 100% 100%;
    .disposeInfo {
      box-sizing: border-box;
      width: 329px;
      height: 588px;
      background-color: rgba($color: #004157, $alpha: 0.8);
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      padding: 20px 0 20px 10px;
      .record {
        margin: 0px;
        height: 548px;
      }
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
    //top: 151px;
    top: 87px;
    right: 23px;
    background: url(../../assets/images/gisDispatch/around-box.svg) no-repeat;
    background-size: 100% 100%;
    .resBox {
      box-sizing: border-box;
      width: 400px;
      height: 215px;
      background-color: rgba($color: #004157, $alpha: 0.8);
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
          > div.hasBorder {
            border-bottom: 1px solid #00b7ff;
          }
        }
        .plan {
          width: 134px;
          position: absolute;
          //top: 514px;
          top: 444px;
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
