<template>
  <div class="box">
    <div class="leftNav">
      <div class="left" v-show="showLeft">
        <slot name="left"></slot>
      </div>
      <span @click.stop="operateNav(1)" class="iconRight" v-if="showLeft"></span>
      <span @click.stop="operateNav(2)" class="iconLeft" v-else></span>
    </div>

    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="rightInfo">
      <span @click.stop="operateInfo(1)" class="iconLeft" v-if="showRight"></span>
      <span @click.stop="operateInfo(2)" class="iconRight" v-else></span>
      <div class="right" v-show="showRight">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'box',
  props: {
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    operateNav (type) {
      this.$emit('hideLeftNav', type)
    },
    operateInfo (type) {
      this.$emit('hideRightInfo', type)
    }
  },
  created () {}
}
</script>
<style lang="less">
.box {
  display: flex;
  justify-content: space-between;

  .leftNav,
  .rightInfo {
    position: relative;
  }
  .leftNav,
  .rightInfo {
    height: 899px;
    .iconRight,
    .iconLeft {
      width: 25px;
      height: 70px;
      position: absolute;
      top: 50%;
      cursor: pointer;
      transform: translateY(-50%);
    }
  }
  .leftNav .iconRight {
    left: 100%;
    background: url(../../../assets/images/arrow-right.png) no-repeat;
    margin-left: -9px;
  }
  .leftNav .iconLeft {
    background: url(../../../assets/images/arrow-left.png) no-repeat;
  }
  .rightInfo .iconRight {
    right: 0px;
    background: url(../../../assets/images/arrow-right-info.png) no-repeat;
  }
  .rightInfo .iconLeft {
    background: url(../../../assets/images/arrow-left-info.png) no-repeat;
    left: -18px;
  }
  .leftNav .left {
    width: 283px;
    height: 899px;
    background: url(../../../assets/images/nav-left.png) no-repeat;
  }
  .rightInfo .right {
    width: 283px;
    height: 899px;
    background: url(../../../assets/images/nav-right.png) no-repeat;
  }
  .center {
    flex: 1;
    margin: 0 40px;
  }
}
</style>
