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
      <!-- <div class="data">
        <template v-for="(item, index) in resInfos">
          <div :key="index">
            <img :src="item.img" />
            <span>{{ item.name }}</span>
            <span></span>
            <span>{{ item.num }}</span>
          </div>
        </template>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resInfos: [
        {
          name: '组织机构',
          img: require('../../assets/images/gisDispatch/institution.svg'),
          num: 8
        },
        {
          name: '组织人员',
          img: require('../../assets/images/gisDispatch/people.svg'),
          num: 12
        },
        {
          name: '无人机',
          img: require('../../assets/images/gisDispatch/drone.svg'),
          num: 4
        },
        {
          name: '高点监控',
          img: require('../../assets/images/gisDispatch/camera.svg'),
          num: 15
        },
        {
          name: '重点区域',
          img: require('../../assets/images/gisDispatch/area.svg'),
          num: 3
        },
        {
          name: '重要路线',
          img: require('../../assets/images/gisDispatch/institution.svg'),
          num: 7
        },
        {
          name: '关注单位',
          img: require('../../assets/images/gisDispatch/institution.svg'),
          num: 7
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
    }
  }
}
</script>

<style lang="scss" scoped>
.gisDispatch {
  height: 1080px;
  position: relative;
  .overlayer {
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
      > div {
        height: 16px;
        background: red;
        span:nth-child(2),
        span:nth-child(4) {
          font-size: 12px;
          line-height: 16px;
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
}
</style>
