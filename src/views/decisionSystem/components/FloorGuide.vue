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
            <div style="width: 1213px; height: 66px;">
              <div class="titleStyle">{{title}}</div>
            </div>

            <div>
              <div class="leftItemStyle webFsScroll">
                <div v-for="(item, index) in info" :key="index" class="floorItemStyle">
                  <button type="button" class="itemStyle" :class="item.selected ? 'itemStyleSelected' : 'itemStyleNormal' " @click="itemClicked(index)">{{item.title}}</button>
                </div>
              </div>
              <div class="rightPreviewStyle">
                <img
                  :src=currentImg
                  class="imgStyle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    info: {
      type: Array,
      required: true
    }
  },
  created () {
    // this.currentImg = this.info[0].image
  },
  data () {
    return {
      dialogVisible: false,
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      currentImg: this.info[0].image
    }
  },
  methods: {
    show (index) {
      this.dialogVisible = true
      this.checkStatus(index)
    },
    backClick () {
      this.dialogVisible = false
    },
    itemClicked (index) {
      this.checkStatus(index)
    },
    checkStatus (index) {
      this.currentImg = this.info[index].image
      this.info.forEach(item => {
        item.selected = false
      })
      this.info[index].selected = true
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
  // overflow: hidden;
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
  width: 1213px;
  height: 743px;
  margin: 0 auto;
}
.titleStyle {
  height: 66px;
  float: right;
  width: 1020px;
  line-height: 66px;
  font-size: 30px;
  color: #1fb0fc;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
}
.leftItemStyle {
  float: left;
  height: 676px;
  width: 155px;
  overflow: auto;
  .floorItemStyle {
    height: 40px;
    // background-color: gray;
    border-top: solid 12px transparent;
    border-bottom: solid 12px transparent;
    .itemStyle {
      width: 140px;
      height: 40px;
      border: solid 1px #39a4dd;
      font-size: 14px;
      color: #ffffff;
      outline: none;
      display: block;
      cursor: pointer;
    }
    .itemStyleNormal {
      background-color: #086484;
    }
    .itemStyleSelected {
      background-color: #00d0f9;
    }
  }
}
.rightPreviewStyle {
  float: right;
  height: 676px;
  width: 1020px;
  background: url("../../../assets/images/Setting/setting-rightBox.png")
    no-repeat;
  background-size: 100% 100%;
  text-align: center;
  .imgStyle {
    width: 992px;
    height: 638px;
    margin-top: 19px;
  }
}
</style>
