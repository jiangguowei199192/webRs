<template>
  <div class="droneBox">
    <div class="gisTitle">
      <span>无人机信息</span>
    </div>
    <div class="content">
      <div class="playerBox" @dblclick="showDialog">
        <LivePlayer
          v-if="dataInfo.url"
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
      <div class="ulBox">
        <ul class="row1">
          <li>
            <span>名称：</span>
            <span>{{ dataInfo.name }}</span>
          </li>
          <li>
            <span>SN码：</span>
            <span>{{ dataInfo.id }}</span>
          </li>
          <li>
            <span>状态：</span>
            <span>{{ dataInfo.brand }}</span>
          </li>
          <li>
            <span>品牌： </span>
            <span>{{ dataInfo.address }}</span>
          </li>
        </ul>
        <ul>
          <li>
            <span>经度：</span>
            <span>{{ info.longitude }}</span>
          </li>
          <li>
            <span>纬度：</span>
            <span>{{ info.latitude }}</span>
          </li>
          <li>
            <span>高度：</span>
            <span>{{ info.height ? info.height + "m" : info.height }}</span>
            <span>水平速度：</span>
            <span class="speed">{{
              info.hSpeed ? info.hSpeed + "m" : info.hSpeed
            }}</span>
          </li>
          <li>
            <span class="speedV">垂直速度：</span>
            <span>{{ info.vSpeed ? info.vSpeed + "m/s" : info.vSpeed }}</span>
          </li>
          <li>
            <span>电量： </span>
            <span>{{
              info.batteryLeft ? info.batteryLeft + "%" : info.batteryLeft
            }}</span>
            <span>航向角：</span>
            <span class="speed"> {{ info.directionAngle }}</span>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      custom-class="el-dialog-custom"
      :visible.sync="dialogVisible"
      :show-close="false"
      center
      :append-to-body="true"
    >
      <LivePlayer
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
    </el-dialog>
    <div class="arrow"></div>
    <span class="close" @click.stop="close"></span>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
import { EventBus } from '@/utils/eventBus.js'
import { copyData } from '@/utils/public'
export default {
  name: 'camerBox',
  data () {
    return {
      info: {
        longitude: '',
        latitude: '',
        height: '',
        hSpeed: '',
        vSpeed: '',
        batteryLeft: '',
        directionAngle: ''
      },
      poster: require('../../../assets/images/loading.gif'),
      dialogVisible: false
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
    EventBus.$on('droneRealtimeInfo', (obj) => {
      if (obj.snCode !== this.dataInfo.id) return
      // 更新飞机数据
      obj.longitude = parseFloat(obj.longitude).toFixed(7)
      obj.latitude = parseFloat(obj.latitude).toFixed(7)
      obj.hSpeed = parseFloat(obj.hSpeed).toFixed(1)
      obj.vSpeed = parseFloat(obj.vSpeed).toFixed(1)
      obj.directionAngle = parseFloat(obj.directionAngle).toFixed(2)
      copyData(obj, this.info)
    })
  },
  beforeDestroy () {
    EventBus.$off('droneRealtimeInfo')
  },
  methods: {
    /**
     *  显示视频放大对话框窗口
     */
    showDialog () {
      if (this.dataInfo.url) {
        this.dialogVisible = true
      }
    },
    /**
     *  关闭vue overlay
     */
    close () {
      if (this.closeOverlay) {
        this.closeOverlay()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.droneBox {
  .content {
    width: 496px;
    height: 283px;
    box-sizing: border-box;
    background-color: rgba($color: #0179a2, $alpha: 0.95);
    display: flex;
    padding-left: 25px;
    padding-top: 17px;
    .playerBox {
      position: relative;
      width: 215px;
      height: 252px;
      background: url(../../../assets/images/gisDispatch/no-videoL.svg)
        no-repeat;
      background-size: 100% 100%;
      margin-right: 23px;
    }
    .ulBox {
      box-sizing: border-box;
      margin-top: 15px;
      padding-right: 8px;
      ul li {
        height: 20px;
        line-height: 20px;
        display: flex;
         span {
          min-width: 60px;
          margin-right: 0px;
        }
        span:nth-child(2) {
        min-width: 30px;
      }
      }
      .row1 {
        border-bottom: 1px solid #00a7e8;
        margin-bottom: 10px;
      }
      .speed {
        color: #fff;
      }
      .speedV {
        min-width: 90px;
      }
    }
  }
}
</style>
