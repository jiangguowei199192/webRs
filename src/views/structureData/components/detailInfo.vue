<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="detail-info browserScroll"
  >
    <div class="title">{{ title }}</div>
    <div class="img-box" v-if="info">
      <div class="bigImage" ref="bigImage">
        <img
          :src="info.bigImage.url || noPic"
          @click.stop="showBigImg(info.bigImage.url, info.rect)"
        />
        <span
          v-show="info.rect.show"
          :style="
            'left:' +
            info.rect.left +
            '%;' +
            'top:' +
            info.rect.top +
            '%;' +
            'width:' +
            info.rect.width +
            '%;' +
            'height:' +
            info.rect.height +
            '%;'
          "
        ></span>
      </div>
      <img
        style="float: right"
        :src="(info.pedestrian && info.pedestrian.image.url) || noPic"
        @click.stop="
          showBigImg(
            (info.pedestrian && info.pedestrian.image.url) || null,
            null
          )
        "
      />
    </div>

    <el-form :model="deviceInfo" class="device-info-form">
      <el-form-item label="监控设备:" prop="deviceName">
        <span>{{ deviceInfo.deviceName }}</span>
      </el-form-item>
      <el-form-item label="地址:" prop="address">
        <span>{{ deviceInfo.address }}</span>
      </el-form-item>
      <el-form-item label="时间:" prop="time">
        <span>{{ deviceInfo.time }}</span>
      </el-form-item>
    </el-form>
    <span class="decorate" v-show="detailInfoItems.length > 0"></span>
    <div class="infoList listScroll" ref="list">
      <template v-for="(item, index) in detailInfoItems">
        <div :key="index">
          <span class="txt">{{ item.categorZH + ":" }}</span>
          <EllipsisTooltip
            :contentText="item.valueStr"
            class="valueStr"
          ></EllipsisTooltip>
        </div>
      </template>
      <!-- <el-form
        :model="detailInfo"
        :inline="true"
        class="device-info-form people-info"
      >
        <el-form-item
          v-for="(item, index) in detailInfoItems"
          :key="index"
          :label="item.categorZH"
        >
          <span>{{ item.valueStr }}</span>
        </el-form-item>
      </el-form> -->
    </div>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">关闭</div>
    </div>
    <el-dialog
      custom-class="el-dialog-struct"
      class="browserScroll"
      :visible.sync="imgDlgVis"
      :show-close="false"
      center
      :append-to-body="true"
    >
      <div style="position: relative; text-align: center">
        <img :src="bigImg" class="structImg" />
        <span
          class="detectBox"
          style="position: absolute"
          v-show="rect"
          :style="
            'left:' +
            rect.left +
            '%;' +
            'top:' +
            rect.top +
            '%;' +
            'width:' +
            rect.width +
            '%;' +
            'height:' +
            rect.height +
            '%;'
          "
        ></span>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import EllipsisTooltip from '../../../components/ellipsisTooltip'
export default {
  props: ['isShow', 'type', 'info'],
  data () {
    return {
      bigImg: '',
      rect: '',
      imgDlgVis: false,
      title: '',
      deviceInfo: {
        deviceName: '',
        address: '',
        time: ''
      },
      detailInfo: {
        six: '',
        age: '',
        coat: '',
        dowm: '',
        hairColor: '',

        carType: '',
        carBrand: '',
        carStyle: '',
        carColor: '',
        carNumber: '',

        boatType: '',
        boatDirection: ''
      },
      detailInfoItems: [],
      noPic: require('../../../assets/images/gisDispatch/no-pic.svg')
    }
  },
  components: {
    EllipsisTooltip
  },
  watch: {
    isShow (newS) {
      if (newS) {
        this.detailInfoItems = []
        switch (this.type) {
          case '人': {
            this.title = '人员信息'
            break
          }
          case '车': {
            this.title = '车信息'
            break
          }
          case '船': {
            this.title = '船信息'
            break
          }
          default:
            break
        }
        const newI = this.info
        this.deviceInfo.deviceName = newI.camera.name
        this.deviceInfo.address =
          newI.camera.longitude + ',' + newI.camera.latitude
        this.deviceInfo.time = newI.captureTime

        if (!newI.pedestrian) return
        const attrs = newI.pedestrian.attributeMap
        for (const item in attrs) {
          this.detailInfoItems.push(attrs[item])
        }
        this.$nextTick(() => {
          this.$refs.list.scrollTop = 0
        })
      }
    }
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    },
    showBigImg (url, rect) {
      if (!url) return
      this.imgDlgVis = true
      this.bigImg = url
      if (!rect || !rect.show) this.rect = ''
      else this.rect = rect
    },
    /**
     * 计算识别框尺寸
     */
    setRectPosition () {
      // 计算识别框的位置和尺寸
      const bWidth = this.$refs.bigImage.clientWidth
      const bHeigth = this.$refs.bigImage.clientHeight
      if (!this.info.pedestrian) {
        return
      }
      const w = this.info.pedestrian.position.width
      const h = this.info.pedestrian.position.height
      const left = this.info.pedestrian.position.start.x
      const top = this.info.pedestrian.position.start.y
      const imgW = this.info.bigImage.width
      const imgH = this.info.bigImage.height
      const ratio = (bWidth * 1.0) / imgW
      const ratio2 = (bHeigth * 1.0) / imgH
      this.info.rect = { width: '', height: '', top: '', left: '' }
      this.info.rect.width = (w * 100.0 * ratio) / bWidth
      this.info.rect.height = (h * 100.0 * ratio2) / bHeigth
      this.info.rect.left = (left * 100.0) / imgW
      this.info.rect.top = (top * 100.0) / imgH
      this.info.rect.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-info.el-dialog__wrapper {
  /deep/.el-dialog {
    width: 670px;
    height: 510px;
    border: 1px solid #00a7e8;
    background-color: #004157;
    box-sizing: border-box;
    position: relative;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px;
      width: 100%;
      height: 100%;
      .title {
        width: 218px;
        height: 30px;
        line-height: 35px;
        background: linear-gradient(
          to right,
          #00d2ff,
          rgba($color: #00d2ff, $alpha: 0)
        );
        margin-top: 20px;
        margin-left: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #fefefe;
        text-indent: 17px;
      }
      .img-box {
        margin-top: 13px;
        margin-left: 23px;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        width: 174px;
        img {
          width: 174px;
          height: 174px;
          cursor: pointer;
        }
        .bigImage {
          display: inline-block;
          position: relative;
          width: 174px;
          height: 174px;
          margin-bottom: 10px;
          span {
            position: absolute;
            display: inline-block;
            border: 1px solid red;
            pointer-events: none;
          }
        }
      }
      .decorate {
        position: absolute;
        display: inline;
        width: 395px;
        height: 1px;
        background: #00caf6;
        left: 224px;
        top: 162px;
      }
      .infoList {
        width: 442px;
        max-height: 260px;
        overflow-y: auto;
        position: absolute;
        left: 226px;
        top: 163px;
        color: #00d1ff;
        font-size: 16px;
        display: flex;
        flex-wrap: wrap;
        padding-top: 20px;
        > div {
          width: 203px;
          height: 30px;
          line-height: 30px;
          display: flex;
          margin-right: 15px;
          .txt {
            //display: inline-block;
            //width: 90px;
            //text-align: right;
            margin-right: 10px;
          }
          .valueStr {
            color: #fff;
            font-size: 16px;
            max-width: 110px;
          }
        }
      }
      .device-info-form {
        width: 440px;
        position: absolute;
        left: 226px;
        top: 58px;
        .el-form-item__label {
          color: #00d1ff;
          line-height: 30px;
          font-size: 16px;
        }
        .el-form-item__content {
          line-height: 30px;
          position: relative;
          font-size: 16px;
        }
        .el-form-item {
          margin-bottom: 0px;
          span {
            color: white;
          }
        }
      }
      .confirm-tool {
        height: 32px;
        position: absolute;
        right: 26px;
        bottom: 24px;
        .confirm-btn {
          width: 87px;
          height: 32px;
          line-height: 32px;
          background-color: #00a7e8;
          border-radius: 2px;
          color: #fff;
          font-size: 18px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
