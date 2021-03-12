<template>
  <div class="gEllipsis" :class="isMultiLine ? 'mltiLine' : 'singleLine'">
    <div :class="contentClass" :style="lineClamp">
      <el-tooltip
        effect="dark"
        :disabled="isElTooltipShow"
        :content="contentText"
        :placement="placement"
        :open-delay="500"
      >
        <span @mouseenter="hanldeElTooltip">
          {{ contentText }}
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gEllipsis',
  props: {
    placement: {
      // Tooltip 出现位置。位置汇总：top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
      type: String,
      default: 'top'
    },
    contentClass: {
      type: String,
      default: 'contentCls'
    },
    contentText: {
      // 文本内容
      type: String,
      default: ''
    },
    isMultiLine: {
      // 多行省略
      type: Boolean,
      default: false
    },
    webkitLineClamp: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      isElTooltipShow: true, // Tooltip 是否可用
      lineClamp: ''
    }
  },
  mounted () {
    this.lineClamp = this.isMultiLine
      ? '-webkit-line-clamp:' + this.webkitLineClamp
      : ''
  },
  methods: {
    hanldeElTooltip (val) {
      const dom = document.querySelector('.gEllipsis')
      if (dom) {
        if (this.isMultiLine) {
          if (val.target.offsetHeight > dom.offsetHeight) {
            // 作比较：文本实际的高度与外层壳的高度
            this.isElTooltipShow = false
          } else this.isElTooltipShow = true
        } else {
          if (val.target.offsetWidth > dom.offsetWidth) {
            // 作比较：文本实际的宽度与外层壳的宽度
            this.isElTooltipShow = false
          } else this.isElTooltipShow = true
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.gEllipsis {
  box-sizing: border-box;
  font-size: 12px;
  > div {
    width: 100%;
  }
  .contentCls {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #22fcfe;
  }
  .addr {
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #00d1fe;
  }
  .caseTxt {
    color: #fff;
  }
  .caseName {
    box-sizing: border-box;
    font-size: 12px;
    color: #82f3fa;
  }
  .reportAddr {
    font-size: 12px;
  }
}

.gEllipsis.singleLine {
  > div {
    // 单行文本溢出显示省略号处理
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
.gEllipsis.mltiLine {
  > div {
    // 多行文本溢出显示省略号处理
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
}
</style>
