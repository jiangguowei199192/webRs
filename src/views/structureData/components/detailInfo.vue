<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="21.25%"
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

    <el-form :model="detailInfo" :inline="true" class="device-info-form">
      <el-form-item
        v-for="(item, index) in detailInfoItems"
        :key="index"
        :label="item.categorZH"
      >
        <span>{{ item.valueStr }}</span>
      </el-form-item>
    </el-form>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">关闭</div>
    </div>
    <el-dialog
      custom-class="el-dialog-custom"
      class="browserScroll"
      :visible.sync="imgDlgVis"
      :show-close="false"
      center
      :append-to-body="true"
    >
      <div style="position: relative">
        <img :src="bigImg" style="height: 100%; width: 100%" />
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
  watch: {
    isShow (newS) {
      if (newS) {
        switch (this.type) {
          case '人': {
            this.title = '人员信息'
            // this.detailInfoItems = [
            //   { label: '性别:', prop: 'six' },
            //   { label: '年龄组:', prop: 'age' },
            //   { label: '上衣:', prop: 'coat' },
            //   { label: '下衣:', prop: 'dowm' },
            //   { label: '发色:', prop: 'hairColor' }
            // ]
            break
          }
          case '车': {
            this.title = '车信息'
            // this.detailInfoItems = [
            //   { label: '类型:', prop: 'carType' },
            //   { label: '品牌:', prop: 'carBrand' },
            //   { label: '款式:', prop: 'carStyle' },
            //   { label: '颜色:', prop: 'carColor' },
            //   { label: '车牌号:', prop: 'carNumber' }
            // ]
            break
          }
          case '船': {
            this.title = '船信息'
            // this.detailInfoItems = [
            //   { label: '类型:', prop: 'boatType' },
            //   { label: '方向:', prop: 'boatDirection' }
            // ]
            break
          }
          default:
            break
        }
        // this.$nextTick(() => {
        //   this.setRectPosition()
        // })
      }
    },
    info (newI) {
      if (newI) {
        this.deviceInfo.deviceName = newI.camera.name
        this.deviceInfo.address =
          newI.camera.latitude + ',' + newI.camera.longitude
        this.deviceInfo.time = newI.captureTime

        // this.detailInfo.six = newI.pedestrian.attributeMap.genderCode.valueStr
        // this.detailInfo.age = newI.pedestrian.attributeMap.ageType.valueStr
        // this.detailInfo.coat = newI.pedestrian.attributeMap.coatColor.valueStr
        // this.detailInfo.dowm = newI.pedestrian.attributeMap.pantsColor.valueStr
        // this.detailInfo.hairColor = newI.pedestrian.attributeMap.hairColor.valueStr
        this.detailInfoItems = []
        let num = 0
        if (!newI.pedestrian) return
        const attrs = newI.pedestrian.attributeMap
        for (const item in attrs) {
          num += 1
          if (num > 21) {
            return
          }
          this.detailInfoItems.push(attrs[item])
        }
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
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px;
      width: 100%;
      border: 1px solid #00a7e8;
      background-color: #004157;
      min-width: 400px;
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
        margin-left: 20px;
        margin-right: 20px;
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
          span {
            position: absolute;
            display: inline-block;
            border: 1px solid red;
            pointer-events: none;
          }
        }
      }
      .device-info-form {
        margin-top: 20px;
        .el-form-item__label {
          color: #00d1ff;
          margin-left: 20px;
        }
        .el-form-item {
          margin-top: -20px;
          font-size: 16px;
          span {
            color: white;
          }
        }
      }
      .confirm-tool {
        height: 32px;
        margin: 0 20px 20px 0;
        .confirm-btn {
          float: right;
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
