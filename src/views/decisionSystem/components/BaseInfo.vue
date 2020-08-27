<template>
  <div class="divStyle">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="85%"
      center
      class="dialogStyle"
    >
      <div class="containerStyle1">
        <div class="containerStyle2">
          <button type="button" class="backStyle" @click="backClick">
            <img :src="backImg" />
            返回
          </button>
          <div class="containerStyle3">
            <div style="width: 50px; height: 50px; display: inline-block;">
              <button
                v-show="showLeft"
                type="button"
                class="leftRightStyle"
                @click="leftRightClick('left')"
              >
                <i class="el-icon-arrow-left"></i>
              </button>
            </div>

            <div style="width: 50px; display: inline-block;"></div>
            <div class="rightPreviewStyle">
              <img :src="currentImg" class="imgStyle" />
            </div>
            <div style="width: 50px; display: inline-block;"></div>

            <div style="width: 50px; height: 50px; display: inline-block;">
              <button
                v-show="showRight"
                type="button"
                class="leftRightStyle"
                @click="leftRightClick('right')"
              >
                <i class="el-icon-arrow-right" style="margin-left: 12px;"></i>
              </button>
            </div>
          </div>
          <div class="bottomItemStyle">
            <button
              type="button"
              class="itemStyle"
              :class="item.selected ? 'itemStyleSelected' : 'itemStyleNormal' "
              @click="itemClicked(index)"
              v-for="(item, index) in info"
              :key="index"
            >{{item.title}}</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Array,
      required: true
    }
  },
  created () {
    this.currentImg = this.info[0].image
    this.checkLeftRightStatus()
  },
  data () {
    return {
      dialogVisible: false,
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      currentImg: '',
      currentIndex: 0,
      showLeft: true,
      showRight: true
    }
  },
  methods: {
    show (index) {
      this.dialogVisible = true
      this.currentIndex = index
      this.checkLeftRightStatus()
    },

    backClick () {
      this.dialogVisible = false
    },

    itemClicked (index) {
      this.currentIndex = index
      this.checkLeftRightStatus()
    },

    leftRightClick (direction) {
      if (direction === 'left') {
        this.currentIndex--
      }

      if (direction === 'right') {
        this.currentIndex++
      }

      this.checkLeftRightStatus()
    },

    checkLeftRightStatus () {
      if (this.currentIndex <= 0) {
        this.showLeft = false
      } else {
        this.showLeft = true
      }

      if (this.currentIndex >= this.info.length - 1) {
        this.showRight = false
      } else {
        this.showRight = true
      }

      if (this.currentIndex >= 0 && this.currentIndex <= this.info.length - 1) {
        this.info.forEach((item) => {
          item.selected = false
        })
        this.info[this.currentIndex].selected = true

        this.currentImg = this.info[this.currentIndex].image
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.divStyle /deep/ .el-dialog__wrapper {
  background-color: rgba($color: #040404, $alpha: 0.86);
}
.dialogStyle {
  overflow: auto;
  /deep/.el-dialog {
    background-color: transparent;
  }
  /deep/.el-dialog--center {
    margin-top: 5vh;
  }
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    background-color: transparent;
    padding: 0;
  }
}
.containerStyle1 {
  width: 100%;
  margin: 0 auto;
}
.containerStyle2 {
  height: 800px;
  width: 1474px;
  margin: 0 auto;
}
.backStyle {
  width: 140px;
  height: 46px;
  border: solid 1px #39a4dd;
  font-size: 24px;
  color: #ffffff;
  background-color: transparent;
  outline: none;
  display: block;
  cursor: pointer;
}
.containerStyle3 {
  margin: 10px auto 0 auto;
  text-align: center;
  .leftRightStyle {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: solid 1px #39a4dd;
    background-color: #086484;
    font-size: 24px;
    color: #ffffff;
    outline: none;
    cursor: pointer;
  }
}
.bottomItemStyle {
  width: 800px;
  margin: 20px auto 0 auto;
  .itemStyle {
    width: 140px;
    height: 40px;
    border: solid 1px #39a4dd;
    font-size: 14px;
    color: #ffffff;
    outline: none;
    display: inline-block;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
  }
  .itemStyleNormal {
    background-color: #086484;
  }
  .itemStyleSelected {
    background-color: #00d0f9;
  }
}
.rightPreviewStyle {
  display: inline-block;
  height: 676px;
  width: 1020px;
  background: url("../../../assets/images/Setting/setting-rightBox.png")
    no-repeat;
  background-size: 100% 100%;
  text-align: center;
  vertical-align: middle;
  .imgStyle {
    width: 992px;
    height: 638px;
    margin-top: 19px;
  }
}
</style>
