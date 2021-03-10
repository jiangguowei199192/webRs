<template>
  <div class="camerBox">
    <div class="gisTitle">
      <span>高点信息</span>
    </div>
    <div class="content">
      <div class="playerBox" @dblclick="showDialog">
        <LivePlayer
          v-if="dataInfo.urls && dataInfo.urls.length > 0"
          :videoUrl="streamUrl"
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
        <span
          class="change"
          @click="changeStream"
          v-if="dataInfo.urls && dataInfo.urls.length > 1"
        ></span>
      </div>
      <div class="ulBox">
        <ul>
          <li>
            <span>设备名称：</span>
            <span>{{ dataInfo.name }}</span>
          </li>
          <li>
            <span>设备编码：</span>
            <span>{{ dataInfo.id }}</span>
          </li>
          <li>
            <span>设备品牌：</span>
            <span>{{ dataInfo.brand }}</span>
          </li>
          <li>
            <span>所在地区： </span>
            <span>{{ dataInfo.address }}</span>
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
        :videoUrl="streamUrl"
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
export default {
  name: 'camerBox',
  data () {
    return {
      streamUrl: '',
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
    if (this.dataInfo.urls && this.dataInfo.urls.length > 0) {
      this.streamUrl = this.dataInfo.urls[0]
    }
  },
  methods: {
    /**
     *  显示视频放大对话框窗口
     */
    showDialog () {
      if (this.dataInfo.urls && this.dataInfo.urls.length > 0) { this.dialogVisible = true }
    },
    /**
     *  关闭vue overlay
     */
    close () {
      if (this.closeOverlay) {
        this.closeOverlay()
      }
    },
    /**
     *  切换视频（高点监控可见光/红外切换）
     */
    changeStream () {
      const url = this.dataInfo.urls.find((u) => u !== this.streamUrl)
      this.streamUrl = url
    }
  }
}
</script>

<style lang="scss" scoped>
.camerBox {
  width: 486px;
  height: 173px;
  background: url(../../../assets/images/gisDispatch/camera-box.svg) no-repeat;
  background-size: 100% 100%;
  .content {
    width: 466px;
    height: 153px;
    box-sizing: border-box;
    background-color: rgba($color: #0179a2, $alpha: 0.95);
    display: flex;
    padding-left: 23px;
    padding-top: 15px;
    .playerBox {
      position: relative;
      width: 189px;
      height: 126px;
      background: url(../../../assets/images/gisDispatch/no-video.svg) no-repeat;
      background-size: 100% 100%;
      margin-right: 23px;
      .change {
        display: inline-block;
        position: absolute;
        width: 28px;
        height: 28px;
        bottom: 0px;
        right: 0px;
        background: url(../../../assets/images/gisDispatch/video-change.svg)
          no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
    .ulBox {
      padding-top: 10px;
    }
  }
}
</style>
