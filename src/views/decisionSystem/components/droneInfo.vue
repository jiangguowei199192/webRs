<template>
  <div class="droneBox">
    <div class="titleBox">
      <span></span>
      <span>无人机信息</span>
      <span @click="close"></span>
    </div>
    <div class="playerBox">
      <LivePlayer
      v-if="dataInfo.isOnline"
      ref="playerCtrl"
      :videoUrl="dataInfo.url"
      :show-custom-button="false"
      :muted="false"
      :controls="false"
      :autoplay="true"
      oncontextmenu="return false"
      fluent
      :stretch="true"
      :live="true"
      aspect="fullscreen"
      :poster="poster"
      ></LivePlayer>
    </div>
    <div class="droneDetail">
      <ul>
        <li>
          <span></span>
          <span>基本信息</span>
        </li>
        <li>
          <span>名称： {{dataInfo.name}}</span>
        </li>
        <li>
          <span>SN码： {{dataInfo.id}}</span>
        </li>
        <li>
          <span></span>
          <span>飞行状态</span>
        </li>
        <li>
          <span>经度：</span>
        </li>
        <li>
          <span>纬度：</span>

        </li>
        <li>
          <span>水平速度：</span>
          <span>高度：</span>
        </li>
        <li>
          <span>垂直速度：</span>
          <span>航向角：</span>
        </li>
        <li>
          <span>电量：</span>
          <span>飞手：</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  name: 'droneInfo',
  data () {
    return {
      info: {
        streamUrl: 'ws://122.112.217.132:8888/live/6C01728PA4A9A6F0.flv'
      },
      poster: require('../../../assets/images/loading.gif')
    }
  },
  props: {
    dataInfo: {
      default: () => {}
    }
  },
  components: {
    LivePlayer
  },
  mounted () {

  },
  methods: {
    close () {
      if (this.closeOverlay) {
        this.closeOverlay()
      }
    }

  }
}
</script>

<style lang="less" scoped>

.droneBox {
  width: 546px;
  height: 276px;
  padding: 0px 14px;
  border: 1px solid #1EB0FC;
  background-color: #121E3AD8;
  color: #FFFFFF;
  font-size: 14px;
  box-sizing: border-box;
  .titleBox{
    width: 100%;
    height: 35px;
    box-sizing: border-box;
    border-bottom: 1px solid #1EB0FC;
    span:nth-child(1)
    {
      position: absolute;
      width: 21px;
      height: 16px;
      top:10px;
      background-image: url('../../../assets/images/fire_title.png');
    }
    span:nth-child(2)
    {
      position: absolute;
      line-height: 35px;
      left: 48px;
    }
    span:nth-child(3)
    {
      position: absolute;
      width: 12px;
      height: 12px;
      top:11px;
      right: 11px;
      background-image: url('../../../assets/images/3d/close.png');
      cursor: pointer;
    }
  }

  .playerBox{
    position: absolute;
    width: 297px;
    height: 200px;
    top:52px;
    left:16px;
    background-image: url('../../../assets/images/droneOffline.png');
  }

  .droneDetail{
    position: absolute;
    top:52px;
    left:336px;
    font-size: 12px;
    ul li span{
       line-height: 22px;
    }
    li:nth-child(1),li:nth-child(4){
      margin-bottom: 4px;
      span:nth-child(1){
        position: relative;
        top: 3px;
        display: inline-block;
        width: 21px;
        height: 16px;
        background-image: url('../../../assets/images/fire_title.png');
        margin-right: 11px;
      }
      span:nth-child(2){
        font-size: 14px;
      }
    }
    li:nth-child(7),li:nth-child(8),li:nth-child(9){
      span:nth-child(1){
        display: inline-block;
        width: 110px;
      }
    }
  }
}

</style>
