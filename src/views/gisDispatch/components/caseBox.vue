<template>
  <div :class="[isGisDispatch ? 'routeBox' : 'caseBox']">
    <div class="gisTitle">
      <span>案件信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span>案件名称：</span>
          <span>{{ dataInfo.deptName }}</span>
        </li>
        <li>
          <span>报案地址：</span>
          <span>{{ dataInfo.deptAddress }}</span>
        </li>
        <li>
          <span>报警时间：</span>
          <span>{{ dataInfo.deptAddress }}</span>
        </li>
        <li>
          <span>案件描述：</span>
          <span>{{ dataInfo.deptAddress }}</span>
        </li>
        <li>
          <span>案件状态：</span>
          <span>{{ dataInfo.deptAddress }}</span>
        </li>
        <li v-if="!isGisDispatch">
          <span>周边范围：</span>
          <el-input v-model="radius"></el-input>
          <span>km</span>
        </li>
      </ul>
    </div>
    <div class="arrow"></div>
    <span class="close" @click.stop="close"></span>
  </div>
</template>

<script>
export default {
  name: 'caseBox',
  data () {
    return {
      isGisDispatch: false,
      radius: 5
    }
  },
  props: {
    dataInfo: {
      default: () => {}
    }
  },
  mounted () {
    if (this.$route.path !== '/gisDispatch') {
      this.isGisDispatch = false
    }
  },
  methods: {
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
.caseBox {
  /deep/.el-input {
    width: 40px;
    margin-right: 9px;
    .el-input__inner {
      background-color: transparent;
      border-radius: 0px;
      border: none;
      border-bottom: 1px solid #00b8ff;
      box-sizing: border-box;
      color: #00b8ff;
      height: 20px;
    }
  }
}
</style>
