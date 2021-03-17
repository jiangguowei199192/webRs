<template>
  <CaseMain ref="caseMain">
    <div class="gisDispatch" slot="main">
      <div class="resBox">
        <div class="title">
          <span>资源总览</span>
        </div>
        <div class="data">
          <template v-for="(item, index) in resInfos">
            <div :key="index" :style="{ color: item.color }">
              <img :src="item.img" />
              <span>{{ item.name }}</span>
              <span>
                <span
                  :style="{ background: item.color, width: item.width + '%' }"
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
                <div :key="index">
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
              <span @click.stop="addCase"></span>
              <span @click.stop="getCaseList"></span>
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
                  :class="{ green: item.caseStatus === '1' }"
                >
                  <EllipsisTooltip
                    :contentText="item.caseName"
                    class="caseName"
                  ></EllipsisTooltip>
                  <div class="caseInfo">
                    <div class="left">
                      <img src="../../assets/images/gisDispatch/no-pic.svg" />
                      <span :class="{ green: item.caseStatus === '1' }">{{
                        formatCaseStatus(item.caseStatus)
                      }}</span>
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
                  <div class="tag" :class="{ green: item.caseStatus === '1' }">
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
import videoMixin from '../videoSystem/mixins/videoMixin'
import CaseMain from './components/caseMain'
import { caseApi } from '@/api/case'
import EllipsisTooltip from '../../components/ellipsisTooltip'
import { timeFormat } from '@/utils/date'
export default {
  data () {
    return {
      showCaseDlg: false,
      caseFold: false,
      dateRange: [],
      rotate: false,
      isfoldTool: true, // 是否折叠底部工具栏
      resInfos: [
        {
          name: '组织机构',
          img: require('../../assets/images/gisDispatch/institution.svg'),
          num: 0,
          color: '#20F2F5',
          width: 0
        },
        {
          name: '组织人员',
          img: require('../../assets/images/gisDispatch/people.svg'),
          num: 0,
          color: '#CCFF00',
          width: 0
        },
        {
          name: '无人机',
          img: require('../../assets/images/gisDispatch/drone.svg'),
          num: 4,
          color: '#EF4E22',
          width: 0
        },
        {
          name: '高点监控',
          img: require('../../assets/images/gisDispatch/camera.svg'),
          num: 15,
          color: '#49EF22',
          width: 0
        },
        {
          name: '重点区域',
          img: require('../../assets/images/gisDispatch/area.svg'),
          num: 3,
          color: '#E92D2D',
          width: 0
        },
        {
          name: '重要路线',
          img: require('../../assets/images/gisDispatch/route.svg'),
          num: 7,
          color: '#CCFF00',
          width: 0
        },
        {
          name: '关注点位',
          img: require('../../assets/images/gisDispatch/point.svg'),
          num: 7,
          color: '#82F3FA',
          width: 0
        }
      ],
      tools: [
        {
          img: require('../../assets/images/gisDispatch/institutionL.svg')
        },
        {
          img: require('../../assets/images/gisDispatch/peopleL.svg')
        },
        {
          img: require('../../assets/images/gisDispatch/droneL.svg')
        },
        {
          img: require('../../assets/images/gisDispatch/cameraL.svg')
        },
        {
          img: require('../../assets/images/gisDispatch/areaL.svg')
        },
        {
          img: require('../../assets/images/gisDispatch/routeL.svg')
        },
        {
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
      cases: []
    }
  },
  mixins: [videoMixin],
  components: {
    AddCase,
    CaseMain,
    EllipsisTooltip
  },
  created () {},
  mounted () {
    this.initDateRange()
    this.getCaseList()
    this.getUserList()
    this.getDeptList()
  },
  beforeDestroy () {},
  methods: {
    setclass () {
      return 'addr'
    },
    addCamera () {
      this.onlineArray.forEach((o) => {
        o.longitude = o.deviceLongitude
        o.latitude = o.deviceLatitude
        o.type = 'RP_Case'
        o.url = o.children[0].streamUrl
        // if (o.onlineStatus === 'online' && o.children && o.children.length > 0) {
        //   o.urls = []
        //   o.children.forEach((l) => {
        //     o.urls.push(l.streamUrl)
        //   })
        // }
      })
      this.$refs.caseMain.addDatas(this.onlineArray)
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
     * 在地图上添加案件标记
     */
    addCaseMarker () {
      this.cases.forEach((c) => {
        c.type = 'RP_Case'
      })
      this.$refs.caseMain.addCaseMarker(this.cases)
    },
    /**
     * 格式化案件状态
     */
    formatCaseStatus (caseStatus) {
      if (caseStatus === '0') return '未处置'
      else if (caseStatus === '1') return '已处置'
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
      this.$axios
        .post(
          caseApi.selectDetail,
          {
            id: item.id
          },
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            const data = JSON.stringify(res.data.data)
            this.$router.push({
              path: '/gisDispatchDispose',
              query: {
                data: data
              }
            })
          }
        })
        .catch((err) => {
          console.log('caseApi.selectDetail Err : ' + err)
        })
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
            this.addCaseMarker()
            this.caseNums[1].num = this.cases.filter(
              (c) => c.caseStatus === '0'
            ).length
            this.caseNums[3].num = this.cases.filter(
              (c) => c.caseStatus === '1'
            ).length
          }
        })
        .catch((err) => {
          console.log('caseApi.selectPage Err : ' + err)
        })
    },
    /**
     * 获取组织人员
     */
    getUserList () {
      this.$axios
        .post(caseApi.selectUsers, { content: '' }, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            let list = res.data.data
            this.resInfos[1].num = list ? list.length : 0
            this.getResDataWidth()
            list = JSON.parse(
              JSON.stringify(list).replace(/userLongitude/g, 'longitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/userLatitude/g, 'latitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/employeeId/g, 'id')
            )
            list.forEach((c) => {
              c.type = 'RP_Member'
            })
            this.$refs.caseMain.addDatas(list)
          }
        })
        .catch((err) => {
          console.log('caseApi.selectUsers Err : ' + err)
        })
    },
    /**
     * 获取组织机构
     */
    getDeptList () {
      this.$axios
        .post(caseApi.selectDepts, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            let list = res.data.data
            this.resInfos[0].num = list ? list.length : 0
            this.getResDataWidth()
            list = JSON.parse(
              JSON.stringify(list).replace(/deptLongitude/g, 'longitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/deptLatitude/g, 'latitude')
            )
            list.forEach((c) => {
              c.type = 'RP_Institution'
            })
            this.$refs.caseMain.addDatas(list)
          }
        })
        .catch((err) => {
          console.log('caseApi.selectDepts Err : ' + err)
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
        span:nth-child(2) {
          background: url(../../assets/images/gisDispatch/refresh.svg) no-repeat;
          background-size: 100% 100%;
        }
      }
      //案件数目
      .caseNum {
        display: flex;
        margin-left: 55px;
        margin-top: 28px;
        > div {
          display: flex;
          flex-direction: column;
          margin-right: 38px;
          align-items: center;
          div:nth-child(1) {
            width: 72px;
            height: 72px;
            background: url(../../assets/images/gisDispatch/num-box.svg)
              no-repeat;
            background-size: 100% 100%;
            font-size: 24px;
            font-family: Orbitron;
            font-weight: bold;
            color: #fefefe;
            line-height: 72px;
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
