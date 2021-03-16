<template>
  <div class="box">
    <div class="leftNav">
      <transition name="normal-expand">
        <div class="left" v-show="showLeft">
          <slot name="left"></slot>
        </div>
      </transition>
      <span @click.stop="operateNav(1)" class="iconRight" v-if="showLeft"></span>
      <span @click.stop="operateNav(2)" class="iconLeft" v-else></span>
    </div>

    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="rightInfo" v-show="isShowRight">
      <span @click.stop="operateInfo(1)" class="iconLeft" v-if="showRight"></span>
      <span @click.stop="operateInfo(2)" class="iconRight" v-else></span>
      <transition name="normal-expand">
        <div class="right" v-show="showRight">
          <slot name="right"></slot>
        </div>
      </transition>
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
    },
    // 是否显示整体右侧部分
    isShowRight: {
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
.normal-expand-enter-active,
.normal-expand-leave-active {
  transition: all 0.08s linear;
  width: 286px !important;
}
.normal-expand-enter,
.normal-expand-leave-to {
  width: 0 !important;
}
.box {
  display: flex;
  justify-content: space-between;
  .leftNav,
  .rightInfo {
    position: relative;
  }
  .leftNav,
  .rightInfo {
    height: 885px;
    .iconRight,
    .iconLeft {
      width: 22px;
      height: 68px;
      position: absolute;
      top: 50%;
      cursor: pointer;
      transform: translateY(-50%);
    }
  }
  .leftNav .iconRight {
    left: 100%;
    background: url(../../../assets/images/arrow-right.svg) no-repeat;
    margin-left: -5px;
    background-size: 100% 100%;
  }
  .leftNav .iconLeft {
    background: url(../../../assets/images/arrow-left.svg) no-repeat;
    left: -24px;
    background-size: 100% 100%;
  }
  .rightInfo .iconRight {
    right: -24px;
    background: url(../../../assets/images/arrow-left.svg) no-repeat;
    transform: rotate(-180deg);
    background-size: 100% 100%;
  }
  .rightInfo .iconLeft {
    background: url(../../../assets/images/arrow-right.svg) no-repeat;
    left: -19px;
    transform: rotate(-180deg);
    background-size: 100% 100%;
  }
  .leftNav .left {
    width: 286px;
    height: 885px;
    background: url(../../../assets/images/nav-left.svg) no-repeat;
    background-size: 100% 100%;
  }
  .rightInfo .right {
    width: 286px;
    height: 885px;
    background: url(../../../assets/images/nav-right.svg) no-repeat;
    background-size: 100% 100%;
  }
  .center {
    flex: 1;
    margin: 0 27px;
    // width: 1240px;
    height: 885px;
    background: url(../../../assets/images/video-bg.svg) no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
}
</style>
