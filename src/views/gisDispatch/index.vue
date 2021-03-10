<template>
  <div class="gisDispatch">
    <gMap
      ref="gduMap"
      handleType="devMap"
      :bShowAllTools="false"
      :baseMapIndex="2"
      :bAutoLocate="false"
      class="map"
    ></gMap>
    <div class="overlayer"></div>
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
            <span></span>
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
          ></el-date-picker>
          <div class="list browserScroll">
            <template v-for="(item, index) in cases">
              <div :key="index">
                <div class="caseName">{{ item.name }}</div>
                <div class="caseInfo">
                  <div class="left">
                    <img src="../../assets/images/gisDispatch/no-pic.svg" />
                    <span>待处理</span>
                  </div>
                  <div class="right">
                    <span class="des">{{ item.des }}</span>
                    <div class="time">
                      <img src="../../assets/images/gisDispatch/time.svg" />
                      <span>{{ item.time }}</span>
                    </div>
                    <div class="time">
                      <img src="../../assets/images/gisDispatch/addr.svg" />
                      <span>{{ item.address }}</span>
                    </div>
                  </div>
                </div>
                <img src="../../assets/images/gisDispatch/jump.svg" />
                <div class="tag">待处理</div>
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
    <AddCase :isShow.sync="showCaseDlg"></AddCase>
  </div>
</template>

<script>
import AddCase from './components/addCase.vue'
import camerBox from './components/camerBox'
import droneBox from './components/droneBox'
import caseBox from './components/caseBox'
import videoMixin from '../videoSystem/mixins/videoMixin'
import createVueCompFunc from '@/utils/createVueComp'
export default {
  data () {
    return {
      showCaseDlg: false,
      caseFold: false,
      dateRange: '',
      rotate: false,
      isfoldTool: true, // 是否折叠底部工具栏
      resInfos: [
        {
          name: '组织机构',
          img: require('../../assets/images/gisDispatch/institution.svg'),
          num: 8,
          color: '#20F2F5',
          width: 0
        },
        {
          name: '组织人员',
          img: require('../../assets/images/gisDispatch/people.svg'),
          num: 12,
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
          name: '关注单位',
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
          num: 23,
          status: '案件总数',
          color: '#00D2FF'
        },
        {
          num: 10,
          status: '待处置',
          color: '#FF0000'
        },
        {
          num: 10,
          status: '处置中',
          color: '#EAFF00'
        },
        {
          num: 3,
          status: '已处置',
          color: '#6DD23E'
        }
      ],
      cases: [
        {
          name: '群众举报非法捕捞事件',
          time: '2020-11-09 09:08:00',
          address: '武汉长江二桥',
          des:
            '情况说明：汉口江滩长江二桥附近发现非 法捕捞人员，可能携带电鱼装备，请相关 人员前往核查处置'
        },
        {
          name: '群众举报非法捕捞事件',
          time: '2020-11-09 09:08:00',
          address: '武汉长江二桥',
          des:
            '情况说明：汉口江滩长江二桥附近发现非 法捕捞人员，可能携带电鱼装备，请相关 人员前往核查处置'
        },
        {
          name: '群众举报非法捕捞事件',
          time: '2020-11-09 09:08:00',
          address: '武汉长江二桥',
          des:
            '情况说明：汉口江滩长江二桥附近发现非 法捕捞人员，可能携带电鱼装备，请相关 人员前往核查处置'
        },
        {
          name: '群众举报非法捕捞事件',
          time: '2020-11-09 09:08:00',
          address: '武汉长江二桥',
          des:
            '情况说明：汉口江滩长江二桥附近发现非 法捕捞人员，可能携带电鱼装备，请相关 人员前往核查处置'
        }
      ]
    }
  },
  mixins: [videoMixin],
  components: {
    AddCase
  },
  created () {},
  mounted () {
    const me = this
    window.onresize = () => {
      me.mapUpdateSize()
    }
    this.$nextTick(() => {
      this.mapUpdateSize()
    })
    this.getResDataWidth()
    this.$refs.gduMap.map2D.gisDispatchManager.setCreateVueCompFunc(
      this.createVueCom
    )
    setTimeout(() => {
      me.addCamera()
    }, 3000)
  },
  beforeDestroy () {
    if (this.$refs.gduMap) {
      this.$refs.gduMap.map2D.gisDispatchManager.removeAll()
    }
    window.onresize = null
  },
  methods: {
    addCamera () {
      if (!this.$refs.gduMap) return
      this.onlineArray.forEach((o) => {
        o.longitude = o.deviceLongitude
        o.latitude = o.deviceLatitude
        o.type = 'RP_Drone'
        o.url = o.children[0].streamUrl
        // if (o.onlineStatus === 'online' && o.children && o.children.length > 0) {
        //   o.urls = []
        //   o.children.forEach((l) => {
        //     o.urls.push(l.streamUrl)
        //   })
        // }
      })
      this.$refs.gduMap.map2D.gisDispatchManager.addDatas(this.onlineArray)
    },
    /**
     *  动态创建vue组件
     */
    createVueCom (props) {
      if (props.dataInfo.type === 'RP_Camera') {
        return createVueCompFunc(camerBox, props)
      } else if (props.dataInfo.type === 'RP_Case') {
        return createVueCompFunc(caseBox, props)
      } else if (props.dataInfo.type === 'RP_Drone') {
        return createVueCompFunc(droneBox, props)
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  position: absolute;
  left: 300px;
  top: 200px;
}
.gisDispatch {
  height: 1080px;
  position: relative;
  .overlayer {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: url(../../assets/images/gisDispatch/bg.svg) no-repeat;
    pointer-events: none;
  }
  //资源总览
  .resBox {
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

  // .listScroll::-webkit-scrollbar {
  //   width: 2px;
  // }
  // .listScroll::-webkit-scrollbar-thumb {
  //   /*滚动条里面小方块*/
  //   border-radius: 3px;
  //   background: #00b7ff;
  // }
  // .listScroll::-webkit-scrollbar-track {
  //   /*滚动条里面轨道*/
  //   background: transparent;
  // }

  .caseBox1 {
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
        box-sizing: border-box;
        margin-top: 16px;
        margin-left: 43px;
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
          margin-top: 5px;
          margin-bottom: 10px;
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
            top: -4px;
            right: -10px;
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
          .caseName {
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
            }
            .right {
              margin-top: 10px;
              display: inline-block;
              width: 216px;
              line-height: 18px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #00d1fe;
              .des {
                max-height: 54px;
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
              }
            }
          }
        }
      }
    }
    .caseDate {
      margin-left: 48px;
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
