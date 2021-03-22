<template>
  <div :class="[isGisDispatch ? 'caseMap' : 'caseBox']">
    <div class="gisTitle">
      <span>案件信息</span>
    </div>
    <div class="ulBox">
      <ul>
        <li>
          <span class="left">案件名称：</span>
          <EllipsisTooltip
            :contentText="dataInfo.caseName"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">报案地址：</span>
          <EllipsisTooltip
            :contentText="dataInfo.reportAddr"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">报警时间：</span>
          <span class="right">{{ dataInfo.reportTime }}</span>
        </li>
        <li>
          <span class="left">案件描述：</span>
          <EllipsisTooltip
            :contentText="dataInfo.caseDesc"
            class="txt"
          ></EllipsisTooltip>
        </li>
        <li>
          <span class="left">案件状态：</span>
          <span class="right caseStatus">{{
            formatCaseStatus(dataInfo.caseStatus)
          }}</span>
        </li>
        <li v-if="!isGisDispatch">
          <span class="left">周边范围：</span>
          <el-input v-model="radius" @change="radiusChange"></el-input>
          <span>km</span>
        </li>
      </ul>
    </div>
    <div class="arrow"></div>
    <span class="close" @click.stop="close"></span>
  </div>
</template>

<script>
import EllipsisTooltip from '../../../components/ellipsisTooltip'
import { EventBus } from '@/utils/eventBus.js'
export default {
  name: 'caseBox',
  data () {
    return {
      isGisDispatch: true,
      radius: 5
    }
  },
  props: {
    dataInfo: {
      default: () => {}
    }
  },
  components: {
    EllipsisTooltip
  },
  destroyed () {
    EventBus.$off('setCaseRadius')
  },
  mounted () {
    if (this.$route.path !== '/gisDispatch') {
      this.isGisDispatch = false
    }
    if (this.dataInfo.radius !== undefined) this.radius = this.dataInfo.radius
    const me = this
    EventBus.$on('setCaseRadius', (radius) => {
      me.radius = radius
    })
  },
  methods: {
    /**
     *  关闭vue overlay
     */
    close () {
      if (this.closeOverlay) {
        this.closeOverlay()
      }
    },
    /**
     * 格式化案件状态
     */
    formatCaseStatus (caseStatus) {
      if (caseStatus === '0' || caseStatus === 0) return '未处置'
      else if (caseStatus === '1' || caseStatus === 1) return '已处置'
    },
    /**
     * 范围改变
     */
    radiusChange () {
      if (!isNaN(this.radius)) {
        EventBus.$emit('caseRadiusChange', this.radius)
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
      padding: 0 5px;
      text-align: center;
    }
  }
}
.caseMap,
.caseBox {
  .txt {
    width: 160px;
    display: inline-block;
    font-size: 14px;
  }
  .caseStatus {
    padding: 0px 10px;
    background: #c2ac16;
    border-radius: 10px;
  }
}

.caseMap,
.caseBox {
  .left,
  .right {
    font-family: Source Han Sans CN;
  }
  .left {
    color: #00b8ff;
    margin-right: 6px;
    display: inline-block;
    min-width: 70px;
  }
}
</style>
