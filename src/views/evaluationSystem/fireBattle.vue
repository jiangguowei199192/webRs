<template>
  <div class="battleBox" :style="'height:'+fullHeight+'px;'">
    <div class="marsBox" :class="{marsBoxSmallScreen:fullscreenMap}" @dblclick.capture="masDbClick">
      <Map :url="configUrl" :showOpenAnimation="false" :showCompass="false" @onload="onMapload" />
    </div>
    <div class="mapBox" :class="{mapBoxFullScreen:fullscreenMap}">
      <div class="map" @dblclick.capture="mapDbClick">
        <gMap
          ref="gduMap"
          :baseMapIndex="0"
          :bShowSimpleSearchTools="false"
          :bShowBasic="fullscreenMap"
          :bShowSelLayer="false"
          :bShowMeasure="false"
          :bShowLonLat="false"
        ></gMap>
      </div>
    </div>
    <div class="list webFsScroll">
      <div v-for="(item,index) in commentList" :key="index" :class="{active:activeIndex==index}">
        <span></span>
        <span></span>
        <span>发现灾情</span>
      </div>
    </div>
    <div class="describeBox">
      <div class="title">
        <span></span>
        <span>第一阶段</span>
      </div>
      <span class="txt">现场发现起火后，保安人员立即使用灭火器和室内消防栓系统灭火，向119指挥中心报警，同时疏散现场观众</span>
      <span class="img"></span>
    </div>
    <span class="ball"></span>
    <div class="titleBox">
      <span>2020/05/04 14:02</span>
      <span></span>
      <span>武汉国际会展中心</span>
    </div>
    <span class="more"></span>
    <div class="dataBox">
      <div class="total">
        <span>总用时</span>
        <span></span>
        <span>当前</span>
        <span></span>
      </div>
      <div class="time" style="margin-right:40px;">135min</div>
      <div class="time">74min</div>
      <ul>
        <li>
          <div>
            <span class="img"></span>
            <div>
              <span>出勤车辆</span>
              <span>11辆</span>
            </div>
            <div>
              <span>未到</span>
              <span class="redTxt">1辆</span>
            </div>
          </div>
        </li>
        <li>
          <div>
            <span class="img fireman"></span>
            <div>
              <span>出勤人数</span>
              <span>63人</span>
            </div>
            <div>
              <span>未到</span>
              <span class="redTxt">11人</span>
            </div>
          </div>
        </li>
        <li>
          <div>
            <span class="img drone"></span>
            <div>
              <span>出勤无人机</span>
              <span>8架</span>
            </div>
            <div>
              <span>未到</span>
              <span class="redTxt">2架</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="title">
        <span></span>
        <span>救援物资统计</span>
      </div>
      <div class="chartBox" id="chart"></div>
    </div>
    <div class="backDiv" @click.stop="back">
      <span></span>
      <span>返回</span>
    </div>
  </div>
</template>

<script>
import Map from '../decisionSystem/components/marsMap.vue'
export default {
  name: 'evaluation',
  data () {
    return {
      minHeight: 929,
      fullHeight: 0,
      configUrl: 'config/config.json',
      commentList: 2,
      activeIndex: 0,
      fullscreenMap: false
    }
  },
  components: {
    Map
  },

  mounted () {
    this.setMapHeight()
    const me = this
    window.onresize = () => {
      me.setMapHeight()
    }
    this.setChartData()
  },
  beforeDestroy () {
    window.onresize = null
  },
  methods: {
    // 设置地图高度，避免F11全屏时，底部有空白
    setMapHeight () {
      var h = document.documentElement.clientHeight - 96
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
    },
    /**
     *  三维地图构造完成回调
     */
    onMapload (viewer) {
      this.viewer = viewer
    },
    /**
     *  返回
     */
    back () {
      // this.$router.go(-1)
    },
    /**
     * 二维地图、三维地图切换
     */
    changeMap () {
      this.fullscreenMap = !this.fullscreenMap
      this.$nextTick(() => {
        this.$refs.gduMap.map2D._map.updateSize()
      })
    },
    /**
     * 二维地图双击事件
     */
    mapDbClick (bFullscreenMap) {
      if (this.fullscreenMap) return
      this.changeMap()
    },
    /**
     * 三维地图双击事件
     */
    masDbClick () {
      if (!this.fullscreenMap) return
      this.changeMap()
    },
    /**
     *  设置图表数据
     */
    setChartData () {
      const lineStyle = {
        color: '#27bce5',
        width: 1,
        type: 'solid',
        opacity: 0.2
      }
      const textStyle = {
        color: '#27BCE5',
        fontSize: 14
      }
      const data = [45, 18, 10, 43]
      const mainChart = this.$echarts.init(document.getElementById('chart'))
      const option = {
        tooltip: {},
        grid: {
          top: 10,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          data: ['水源', '泡沫', '干粉', '灭火器'],
          // 坐标轴刻度
          axisTick: {
            show: false
          },
          // 坐标轴线
          axisLine: {
            lineStyle: lineStyle
          },
          // 坐标轴文本标签
          axisLabel: {
            margin: 12,
            textStyle: textStyle
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 20,
          interval: 20,
          // 分隔线
          splitLine: {
            show: true,
            lineStyle: lineStyle
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: lineStyle
          },
          axisLabel: {
            textStyle: textStyle
          },
          // 分隔区域
          splitArea: {
            show: true,
            areaStyle: {
              color: 'rgba(39, 188, 229, 0.2)'
            }
          }
        },
        series: [
          {
            type: 'pictorialBar',
            symbolSize: [23, 12],
            z: 12,
            itemStyle: {
              normal: {
                color: '#62d8f9',
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#fff',
                    fontSize: 14
                  }
                }
              },
              // 高亮样式
              emphasis: {
                color: '#62d8f9'
              }
            },
            symbolPosition: 'end',
            data: data
          },
          {
            type: 'pictorialBar',
            symbolSize: [23, 12],
            symbolOffset: [0, 6],
            z: 12,
            itemStyle: {
              normal: {
                color: '#289bba'
              },
              // 高亮样式
              emphasis: {
                color: '#289bba'
              }
            },
            data: data
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#27BCE5'
              },
              // 高亮样式
              emphasis: {
                color: '#27BCE5'
              }
            },
            // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件
            silent: false,
            barWidth: 23,
            data: [43, 16, 8, 41]
          }
        ]
      }
      mainChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.battleBox {
  position: relative;
  .list {
    position: absolute;
    box-sizing: border-box;
    height: 414px;
    top: 70px;
    left: 37px;
    overflow-y: auto;
    > div {
      width: 229px;
      height: 44px;
      box-sizing: border-box;
      border: 1px solid #00ccff;
      opacity: 0.85;
      background: #0a2549;
      border-radius: 6px;
      margin-bottom: 9px;
      display: flex;
      align-items: center;
      padding: 5px 12px;
      cursor: pointer;
      span:nth-child(1) {
        display: inline-block;
        width: 34px;
        height: 34px;
        background: url(../../assets/images/fireBattle/fire.png) no-repeat;
      }
      span:nth-child(2) {
        margin-left: 12px;
        display: inline-block;
        width: 2px;
        height: 42px;
        background: url(../../assets/images/3d/rect.png) no-repeat;
      }
      span:nth-child(3) {
        display: inline-block;
        font-size: 16px;
        color: #aeaeae;
        flex-grow: 1;
        text-align: center;
      }
    }
    > div.active {
      opacity: 1;
      span:nth-child(3) {
        color: #00ccff;
      }
    }
  }
  .describeBox {
    display: flex;
    flex-direction: column;
    position: absolute;
    box-sizing: border-box;
    width: 363px;
    height: 359px;
    top: 544px;
    left: 37px;
    background: url(../../assets/images/fireBattle/box.png) no-repeat;
    padding: 0px 30px;
    .txt {
      font-size: 14px;
      line-height: 24px;
    }
    .img {
      margin-top: 10px;
      display: inline-block;
      width: 293px;
      height: 170px;
      background-image: url("../../assets/images/fireBattle/layer.png");
    }
  }
  .ball {
    position: absolute;
    width: 122px;
    height: 121px;
    top: 23px;
    right: 283px;
    background: url(../../assets/images/fireBattle/ball.png) no-repeat;
  }
  .titleBox {
    position: absolute;
    width: 239px;
    height: 95px;
    top: 37px;
    right: 46px;
    background: url(../../assets/images/fireBattle/title-box.png) no-repeat;
    display: flex;
    flex-direction: column;
    color: #00ccff;
    text-align: center;
    span:nth-child(1) {
      font-size: 14px;
      margin-top: 19px;
    }
    span:nth-child(2) {
      margin-top: 9px;
      margin-left: 44px;
      display: inline-block;
      width: 156px;
      height: 1px;
      background: #00ccff;
    }
    span:nth-child(3) {
      margin-top: 6px;
      font-size: 18px;
    }
  }
  .more {
    position: absolute;
    width: 15px;
    height: 12px;
    top: 44px;
    right: 53px;
    background: url(../../assets/images/fireBattle/more.png) no-repeat;
  }
  .dataBox {
    box-sizing: border-box;
    padding: 30px 25px;
    position: absolute;
    width: 361px;
    height: 730px;
    top: 169px;
    right: 41px;
    background: url(../../assets/images/fireBattle/data-box.png) no-repeat;
    .total {
      font-size: 16px;
      color: #00cff9;
      span:nth-child(1) {
        margin-right: 10px;
      }
      span:nth-child(3) {
        margin-right: 20px;
        margin-left: 50px;
      }
      span:nth-child(2),
      span:nth-child(4) {
        display: inline-block;
        width: 48px;
        height: 2px;
        background: #00cff9;
      }
    }
    .time {
      margin-top: 3px;
      display: inline-block;
      font-size: 26px;
      color: #aef0f4;
      height: 35px;
      width: 110px;
      border-bottom: 2px solid #00cff9;
      text-shadow: #00cff9 1px 1px 4px;
    }
    ul {
      margin-top: 30px;
      margin-bottom: 30px;
      li {
        margin-bottom: 38px;
        .img {
          display: inline-block;
          width: 74px;
          height: 75px;
          background-image: url("../../assets/images/fireBattle/car.png");
        }
        .fireman {
          background-image: url("../../assets/images/fireBattle/fireman.png");
        }
        .drone {
          background-image: url("../../assets/images/fireBattle/drone.png");
        }
      }
      li > div {
        display: flex;
        > div {
          min-width: 70px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 14px;
          color: #999999;
          margin-left: 33px;
          margin-right: 20px;
          span:nth-child(2) {
            margin-top: 8px;
            font-size: 20px;
            color: #dfdfdf;
          }
        }
        .redTxt {
          font-size: 14px !important;
          color: #ff0000 !important;
          margin-top: 15px !important;
          position: relative;
          top: -3px;
        }
      }
    }
  }
  .marsBox {
    height: 100%;
    background: none;
  }
  .marsBoxSmallScreen,
  .mapBox {
    position: absolute;
    box-sizing: border-box;
    right: 425px;
    top: 721px;
    width: 283px;
    height: 183px;
    background: url("../../assets/images/drone/map-box.png") no-repeat;
    padding: 17px 17px;
  }
  .marsBoxSmallScreen {
    z-index: 10;
  }
  .mapBox {
    .map {
      height: 100%;
    }
  }
  .mapBoxFullScreen {
    right: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    background: none;
  }
  .title {
    width: 100%;
    height: 21px;
    box-sizing: border-box;
    margin-top: 22px;
    margin-bottom: 10px;
    span:nth-child(1) {
      display: inline-block;
      width: 21px;
      height: 16px;
      background-image: url("../../assets/images/fire_title.png");
      margin-right: 18px;
      position: relative;
      top: 2px;
    }
    span:nth-child(2) {
      line-height: 21px;
    }
  }
  .chartBox {
    position: relative;
    top: 10px;
    width: 312px;
    height: 168px;
    box-sizing: border-box;
  }
}
</style>
