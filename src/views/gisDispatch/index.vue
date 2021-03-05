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
      <img
        class="btn"
        src="../../assets/images/gisDispatch/layer.png"
        @click.stop="isfoldTool = !isfoldTool"
      />
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
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      ]
    }
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
  },
  beforeDestroy () {
    window.onresize = null
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
  }
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
      opacity: 0.8;
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
  .bottomTool {
    height: 88px;
    position: absolute;
    left: 48px;
    bottom: 43px;
    display: flex;
    align-items: center;
    .btn {
      width: 88px;
      height: 88px;
      cursor: pointer;
      margin-right: 22px;
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
      transition: all 0.4s;
    }
    .showContent-enter,
    .showContent-leave-active {
      transform: translate3d(-474px, 0, 0);
      opacity: 0;
    }
  }
}
</style>
