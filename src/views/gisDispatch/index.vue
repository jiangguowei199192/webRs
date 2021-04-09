<template>
  <CaseMain ref="caseMain">
    <div class="gisDispatch" slot="main">
      <div class="resBox">
        <div class="title">
          <span>资源总览</span>
        </div>
        <div class="data">
          <template v-for="(item, index) in resInfos">
            <div :key="index" style="color: #20f2f5">
              <img :src="item.img" />
              <span>{{ item.name }}</span>
              <span>
                <span
                  style="background: #20f2f5"
                  :style="{ width: item.width + '%' }"
                  class="rect"
                ></span>
              </span>
              <span>{{ item.num }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="bottomTool">
        <div
          class="btn"
          @click.stop="rotateClick"
          :class="[rotate ? 'rotate' : 'rotate2']"
        ></div>
        <div>
          <transition name="showContent">
            <div v-show="!isfoldTool" class="toolBox">
              <template v-for="(item, index) in tools">
                <div
                  :key="index"
                  @click.stop="showOrHideLayer(item, index)"
                  :class="{ unselect: !item.showLayer }"
                >
                  <img :src="item.img" />
                </div>
              </template>
            </div>
          </transition>
        </div>
      </div>
      <div class="caseBox1">
        <transition name="showCases">
          <div class="caseList" v-show="!caseFold">
            <div class="title">案件列表</div>
            <div class="btns">
              <span @click.stop="addCase" class="add"></span>
              <span @click.stop="getCaseList" class="refresh"></span>
            </div>
            <div class="caseNum">
              <template v-for="(item, index) in caseNums">
                <div :key="index">
                  <div>{{ item.num }}</div>
                  <span>{{ item.status }}</span>
                  <span :style="{ background: item.color }"></span>
                </div>
              </template>
            </div>
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="一"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="caseDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="getCaseList"
            ></el-date-picker>
            <div class="list listScroll">
              <template v-for="(item, index) in cases">
                <div
                  :key="index"
                  @click.stop="jumpCase(item)"
                  :class="{
                    green: item.caseStatus === '1',
                    yellow: item.caseStatus === '2',
                  }"
                >
                  <EllipsisTooltip
                    :contentText="item.caseName"
                    class="caseName"
                  ></EllipsisTooltip>
                  <div class="caseInfo">
                    <div class="left">
                      <!-- <img :src="item.img || noPic" /> -->
                      <img :src="noPic" />
                      <span
                        :class="{
                          green: item.caseStatus === '1',
                          yellow: item.caseStatus === '2',
                        }"
                        >{{ formatCaseStatus(item.caseStatus) }}</span
                      >
                    </div>
                    <div class="right">
                      <EllipsisTooltip
                        :contentText="item.caseDesc"
                        class="caseDesc"
                        :isMultiLine="true"
                      ></EllipsisTooltip>
                      <div class="time">
                        <img src="../../assets/images/gisDispatch/time.svg" />
                        <span>{{ item.createTime }}</span>
                      </div>
                      <div class="time">
                        <img src="../../assets/images/gisDispatch/addr.svg" />
                        <EllipsisTooltip
                          :contentText="item.reportAddr"
                          class="reportAddr"
                        ></EllipsisTooltip>
                      </div>
                    </div>
                  </div>
                  <img
                    src="../../assets/images/gisDispatch/jump.svg"
                    @click.stop="jumpCase(item)"
                  />
                  <div
                    class="tag"
                    :class="{
                      green: item.caseStatus === '1',
                      yellow: item.caseStatus === '2',
                    }"
                  >
                    {{ formatCaseStatus(item.caseStatus) }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </transition>
        <div
          class="foldBox"
          @click.stop="caseFold = !caseFold"
          :class="{ unfold: caseFold }"
        ></div>
      </div>
      <AddCase :isShow.sync="showCaseDlg" @addCaseOK="addCaseOK"></AddCase>
    </div>
  </CaseMain>
</template>

<script>
import AddCase from './components/addCase.vue'
import CaseMain from './components/caseMain'
import { caseApi } from '@/api/case'
import EllipsisTooltip from '../../components/ellipsisTooltip'
import { timeFormat } from '@/utils/date'
import caseMixin from './mixins/caseMixin'
import globalApi from '../../utils/globalApi'
export default {
  data () {
    return {
      mapResList: [],
      showCaseDlg: false,
      caseFold: false,
      dateRange: [],
      rotate: false,
      isfoldTool: true, // 是否折叠底部工具栏
      tools: [
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/institutionL.svg')
        },
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/peopleL.svg')
        },
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/droneL.svg')
        },
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/cameraL.svg')
        },
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/areaL.svg')
        },
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/routeL.svg')
        },
        {
          showLayer: true,
          img: require('../../assets/images/gisDispatch/pointL.svg')
        }
      ],
      caseNums: [
        {
          num: 0,
          status: '案件总数',
          color: '#00D2FF'
        },
        {
          num: 0,
          status: '待处置',
          color: '#FF0000'
        },
        {
          num: 0,
          status: '处置中',
          color: '#EAFF00'
        },
        {
          num: 0,
          status: '已处置',
          color: '#6DD23E'
        }
      ],
      cases: [],
      refreshTimeout: ''
    }
  },
  mixins: [caseMixin],
  components: {
    AddCase,
    CaseMain,
    EllipsisTooltip
  },
  created () {},
  mounted () {
    this.initDateRange()
    this.getCaseList()
    const me = this
    // 每隔10分钟刷新一次案件列表
    this.refreshTimeout = setTimeout(() => {
      me.getCaseList()
    }, 10 * 60 * 1000)
  },
  beforeDestroy () {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }
  },
  methods: {
    /**
     * 获取无人机资源完毕回调
     */
    getDronesDone () {
      this.resInfos[2].num = this.drones ? this.drones.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addDatas(this.drones)
      // this.mapResList = this.mapResList.concat(this.drones)
      // this.$refs.caseMain.zoomToExtent(this.mapResList)
    },
    /**
     * 获取高点监控资源完毕回调
     */
    getCamerasDone () {
      this.resInfos[3].num = this.cameras ? this.cameras.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addDatas(this.cameras)
      // this.mapResList = this.mapResList.concat(this.cameras)
      // this.$refs.caseMain.zoomToExtent(this.mapResList)
    },
    /**
     * 获取面资源完毕回调
     */
    getAreasDone () {
      this.resInfos[4].num = this.areas ? this.areas.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addRouteOrLineDatas(this.areas)
    },
    /**
     * 获取线资源完毕回调
     */
    getLinesDone () {
      this.resInfos[5].num = this.lines ? this.lines.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addRouteOrLineDatas(this.lines)
    },
    /**
     * 获取点资源完毕回调
     */
    getPointsDone () {
      this.resInfos[6].num = this.points ? this.points.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addDatas(this.points)
      // this.mapResList = this.mapResList.concat(this.points)
      // this.$refs.caseMain.zoomToExtent(this.mapResList)
    },
    /**
     * 获取组织机构完毕回调
     */
    getDeptsDone () {
      this.resInfos[0].num = this.organs ? this.organs.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addDatas(this.organs)
      this.mapResList = this.mapResList.concat(this.organs)
      this.$refs.caseMain.zoomToExtent(this.mapResList)
    },
    /**
     * 获取组织人员完毕回调
     */
    getMembersDone () {
      this.resInfos[1].num = this.members ? this.members.length : 0
      this.getResDataWidth()
      this.$refs.caseMain.addDatas(this.members)
      // this.mapResList = this.mapResList.concat(this.members)
      // this.$refs.caseMain.zoomToExtent(this.mapResList)
    },
    /**
     * 隐藏/显示图层
     */
    showOrHideLayer (item, id) {
      item.showLayer = !item.showLayer
      this.$refs.caseMain.showOrHideLayer(item.showLayer, id)
    },
    /**
     * 初始化时间
     */
    initDateRange () {
      // 今日0点
      const time = new Date(new Date().toLocaleDateString()).getTime()
      // 今日 23:59:59
      const end = new Date(time + 24 * 60 * 60 * 1000 - 1)
      const start = new Date(time - 6 * 24 * 60 * 60 * 1000)
      this.dateRange = [timeFormat(start), timeFormat(end)]
    },
    /**
     * 格式化案件状态
     */
    formatCaseStatus (caseStatus) {
      if (caseStatus === '0') return '未处置'
      else if (caseStatus === '1') return '已处置'
      else if (caseStatus === '2') return '处置中'
    },
    /**
     * 新增案件成功
     */
    addCaseOK () {
      this.showCaseDlg = false
      this.getCaseList()
    },
    /**
     * 刷新地图尺寸
     */
    mapUpdateSize () {
      if (this.$refs.gduMap) {
        this.$refs.gduMap.map2D._map.updateSize()
      }
    },
    /**
     * 获取资源总览种每个资源的宽度
     */
    getResDataWidth () {
      const max = Math.max.apply(
        Math,
        this.resInfos.map(function (o) {
          return o.num
        })
      )
      this.resInfos.forEach((r) => {
        r.width = (r.num / max) * 100
      })
    },
    /**
     * 底部工具栏展开/收缩
     */
    rotateClick () {
      this.isfoldTool = !this.isfoldTool
      this.rotate = !this.rotate
    },
    /**
     * 新增案件
     */
    addCase () {
      this.showCaseDlg = true
    },
    /**
     * 跳转到案件处理
     */
    jumpCase (item) {
      const data = {
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude
      }
      const newpage = this.$router.resolve({
        path: '/gisDispatchDispose',
        query: {
          data: JSON.stringify(data)
        }
      })
      window.open(newpage.href, '_blank')
    },
    /**
     * 获取案件列表
     */
    getCaseList () {
      this.$axios
        .post(
          caseApi.selectPage,
          {
            currentPage: 1,
            pageSize: 1000,
            startTime:
              this.dateRange && this.dateRange.length > 0
                ? this.dateRange[0]
                : '',
            endTime:
              this.dateRange && this.dateRange.length > 1
                ? this.dateRange[2]
                : ''
          },
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.cases = res.data.data.records
            this.caseNums[0].num = res.data.data.total
            this.cases.forEach((c) => {
              c.type = 'RP_Case'
              const img = this.getCaseImg(c.disFinishAttachment)
              if (img) {
                c.img = globalApi.headImg + img
              }
            })
            this.$refs.caseMain.addCaseMarker(this.cases)
            this.caseNums[1].num = this.cases.filter(
              (c) => c.caseStatus === '0'
            ).length
            this.caseNums[2].num = this.cases.filter(
              (c) => c.caseStatus === '2'
            ).length
            this.caseNums[3].num = this.cases.filter(
              (c) => c.caseStatus === '1'
            ).length
          }
        })
        .catch((err) => {
          console.log('caseApi.selectPage Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.gisDispatch {
  height: 100%;
  position: relative;
  //资源总览
  .resBox {
    pointer-events: auto;
    font-size: 14px;
    width: 286px;
    height: 235px;
    box-sizing: border-box;
    position: absolute;
    top: 156px;
    left: 17px;
    margin-left: 17px;
    background: url(../../assets/images/gisDispatch/res-box.svg) no-repeat;
    background-size: 100% 100%;
    .data {
      position: relative;
      width: 266px;
      height: 215px;
      background-color: rgba($color: #004157, $alpha: 0.9);
      margin-top: 9px;
      margin-left: 9px;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      line-height: 20px;
      padding: 14px 0px 0px 15px;
      box-sizing: border-box;
      > div {
        height: 20px;
        margin-bottom: 8px;
        img {
          width: 16px;
          height: 16px;
          margin-right: 10px;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }
        span:nth-child(2) {
          display: inline-block;
          width: 70px;
        }
        span:nth-child(3) {
          display: inline-block;
          height: 100%;
          width: 95px;
        }
        span:nth-child(4) {
          position: absolute;
          right: 19px;
        }
        .rect {
          display: inline-block;
          height: 2px;
          position: relative;
          top: -4px;
        }
      }
    }
    .title {
      left: 9px;
      top: -11px;
      position: absolute;
      width: 135px;
      height: 22px;
      background: url(../../assets/images/gisDispatch/res-title.svg) no-repeat;
      background-size: 100% 100%;
      span {
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #00b8ff;
        margin-left: 15px;
      }
    }
  }
  //底部撒点工具栏
  .bottomTool {
    pointer-events: auto;
    height: 88px;
    position: absolute;
    left: 48px;
    top: 949px;
    display: flex;
    align-items: center;
    .btn {
      width: 88px;
      height: 88px;
      cursor: pointer;
      margin-right: 22px;
      background: url(../../assets/images/gisDispatch/layer.png) no-repeat;
      background-size: 100% 100%;
    }
    .btn.rotate2 {
      transition: all 1s;
    }
    .btn.rotate {
      transform: rotate(360deg);
      transition: all 1s;
    }
    > div {
      overflow: hidden;
      .toolBox {
        display: flex;
        > div {
          width: 51px;
          height: 44px;
          margin-right: 20px;
          background: url(../../assets/images/gisDispatch/box.svg) no-repeat;
          background-size: 100% 100%;
          text-align: center;
          cursor: pointer;
          position: relative;
          img {
            position: absolute;
            width: 28px;
            height: 28px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        > div.unselect {
          background: url(../../assets/images/gisDispatch/box-unselect.svg)
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    font-size: 12px;

    .showContent-enter-active,
    .showContent-leave-active {
      transition: all 0.8s;
    }
    .showContent-enter,
    .showContent-leave-active {
      transform: translate3d(-474px, 0, 0);
      opacity: 0;
    }
  }

  .caseBox1 {
    pointer-events: auto;
    display: flex;
    font-size: 12px;
    position: absolute;
    top: 124px;
    right: 0px;
    box-sizing: border-box;
    height: 910px;
    overflow: hidden;
    .showCases-enter-active,
    .showCases-leave-active {
      transition: all 0.8s;
    }
    .showCases-enter,
    .showCases-leave-active {
      transform: translate3d(528px, 0, 0);
      opacity: 0;
    }
    //案件列表
    .caseList {
      width: 528px;
      height: 100%;
      background: url(../../assets/images/gisDispatch/case-box.svg) no-repeat;
      background-size: 100% 100%;
      position: relative;
      left: 37px;
      .title {
        width: 218px;
        height: 30px;
        background: linear-gradient(
          90deg,
          #00d2ff 0%,
          rgba(0, 210, 255, 0) 100%
        );
        margin-top: 22px;
        margin-left: 23px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #fefefe;
        padding-left: 17px;
        line-height: 30px;
      }
      .btns {
        position: absolute;
        top: 22px;
        right: 30px;
        span {
          display: inline-block;
          width: 30px;
          height: 30px;
          background: url(../../assets/images/gisDispatch/+.svg) no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          margin-left: 20px;
        }
        .add:active {
          background: url(../../assets/images/gisDispatch/+-press.svg) no-repeat;
          background-size: 100% 100%;
        }
        span:nth-child(2) {
          background: url(../../assets/images/gisDispatch/refresh.svg) no-repeat;
          background-size: 100% 100%;
        }
        .refresh:active {
          background: url(../../assets/images/gisDispatch/refresh-press.svg)
            no-repeat;
          background-size: 100% 100%;
        }
      }
      //案件数目
      .caseNum {
        display: flex;
        margin-left: 37px;
        margin-top: 5px;
        > div {
          display: flex;
          flex-direction: column;
          margin-right: 18px;
          align-items: center;
          div:nth-child(1) {
            width: 91px;
            height: 103px;
            background: url(../../assets/images/gisDispatch/num-box.png)
              no-repeat;
            background-size: 100% 100%;
            font-size: 24px;
            font-family: Orbitron;
            font-weight: bold;
            color: #fefefe;
            line-height: 118px;
            text-align: center;
          }
          span:nth-child(2) {
            margin-top: 17px;
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #fefefe;
          }
          span:nth-child(3) {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-top: 3px;
          }
        }
      }
      .list {
        width: 442px;
        box-sizing: border-box;
        margin-top: 6px;
        margin-left: 40px;
        height: 600px;
        overflow-y: scroll;
        //每个案件
        > div {
          position: relative;
          box-sizing: border-box;
          width: 427px;
          height: 190px;
          background: url(../../assets/images/gisDispatch/red-case.svg)
            no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          margin-top: 10px;
          padding: 8px 0px 0px 14px;
          > img {
            width: 34px;
            height: 34px;
            position: absolute;
            right: 11px;
            bottom: 14px;
          }
          .tag {
            position: absolute;
            width: 76px;
            height: 55px;
            top: -7px;
            right: -12px;
            background: url(../../assets/images/gisDispatch/red-tag.svg)
              no-repeat;
            background-size: 100% 100%;
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 55px;
          }
          .tag.green {
            background: url(../../assets/images/gisDispatch/green-tag.svg)
              no-repeat;
            background-size: 100% 100%;
          }
          .tag.yellow {
            background: url(../../assets/images/gisDispatch/yellow-tag.svg)
              no-repeat;
            background-size: 100% 100%;
          }
          .caseName {
            height: 21px;
            line-height: 21px;
            width: 160px;
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #22fcfe;
          }
          .caseInfo {
            margin-top: 5px;
            display: flex;
            .left {
              display: flex;
              flex-direction: column;
              margin-right: 12px;
              align-items: center;
              img {
                width: 170px;
                height: 124px;
              }
              span {
                font-size: 14px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #f30203;
                margin-top: 2px;
              }
              span.green {
                color: #6dd23e;
              }
              span.yellow {
                color: #eaff00;
              }
            }
            .right {
              display: flex;
              flex-direction: column;
              margin-top: 8px;
              width: 216px;
              line-height: 18px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #00d1fe;
              .caseDesc {
                max-height: 54px;
                line-height: 18px;
              }
              .time {
                margin-top: 10px;
                display: flex;
                align-items: center;
                img {
                  width: 14px;
                  height: 14px;
                  margin-right: 7px;
                }
                .reportAddr {
                  line-height: 18px;
                  height: 18px;
                  width: 160px;
                }
              }
            }
          }
        }
        > div.green {
          background: url(../../assets/images/gisDispatch/green-case.svg)
            no-repeat;
          background-size: 100% 100%;
        }
        > div.yellow {
          background: url(../../assets/images/gisDispatch/yellow-case.svg)
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .caseDate {
      margin-left: 40px;
      margin-top: 11px;
      width: 436px;
      height: 40px;
      background-color: rgba($color: #004157, $alpha: 0.9);
      border: 1px solid rgba($color: #00d1fe, $alpha: 0.9);
      /deep/.el-range-input {
        background: transparent;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #00d1fe;
        width: 41%;
      }
      /deep/.el-range-separator {
        color: #00d1fe;
      }
    }
    /deep/.caseDate.el-input__inner {
      border-radius: 0px;
    }
    //折叠
    .foldBox {
      width: 60px;
      height: 596px;
      margin-top: 175px;
      cursor: pointer;
      z-index: 100;
      background: url(../../assets/images/gisDispatch/fold.svg) no-repeat;
      background-size: 100% 100%;
    }
    .foldBox.unfold {
      background: url(../../assets/images/gisDispatch/unfold.svg) no-repeat;
      background-size: 100% 100%;
    }
  }

  /deep/.people-selec-Popper {
    .el-input__inner {
      color: #00caf6;
      width: 190px;
      height: 26px;
      line-height: 26px;
      border: 1px solid #00d2ff;
      border-radius: 0px;
    }
  }
}
</style>
