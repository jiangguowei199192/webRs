<template>
  <div class="camerBox gisBox">
    <div class="gisTitle">
      <span>高点信息</span>
    </div>
    <div class="content">
      <div class="playerBox" @dblclick="showDialog">
        <LivePlayer
          v-if="urls && urls.length > 0"
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
          v-if="urls && urls.length > 1"
        ></span>
      </div>
      <div class="ulBox">
        <ul>
          <li>
            <span class="left">设备名称：</span>
            <EllipsisTooltip
              :contentText="dataInfo.deviceName || ''"
              class="txt"
            ></EllipsisTooltip>
          </li>
          <li>
            <span class="left">设备编码：</span>
            <EllipsisTooltip
              :contentText="dataInfo.id || ''"
              class="txt"
            ></EllipsisTooltip>
          </li>
          <li>
            <span class="left">设备品牌：</span>
            <EllipsisTooltip
              :contentText="dataInfo.brand || ''"
              class="txt"
            ></EllipsisTooltip>
          </li>
          <li>
            <span class="left">所在地区：</span>
            <EllipsisTooltip
              :contentText="dataInfo.address || ''"
              class="txt"
            ></EllipsisTooltip>
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
import streamMixin from '../mixins/streamMixin'
import EllipsisTooltip from '../../../components/ellipsisTooltip'
export default {
  name: 'camerBox',
  data () {
    return {
      poster: require('../../../assets/images/loading.gif'),
      dialogVisible: false
    }
  },
  components: {
    LivePlayer,
    EllipsisTooltip
  },
  mixins: [streamMixin],
  mounted () {},
  methods: {
    /**
     *  显示视频放大对话框窗口
     */
    showDialog () {
      if (this.urls && this.urls.length > 0) {
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
    },
    /**
     *  切换视频（高点监控可见光/红外切换）
     */
    changeStream () {
      const url = this.urls.find((u) => u !== this.streamUrl)
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
