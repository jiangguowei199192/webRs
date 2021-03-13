<template>
  <div
    class="gEllipsis"
    :class="isMultiLine ? 'mltiLine' : 'singleLine'"
    ref="editor"
  >
    <div :class="contentClass" :style="lineClamp">
      <el-tooltip
        effect="dark"
        :disabled="!isElTooltipShow"
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
      type: String
      // default: 'contentCls'
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
      const width = this.$refs.editor.offsetWidth
      const height = this.$refs.editor.offsetHeight
      // 作比较：文本实际的高度与外层壳的高度
      if (this.isMultiLine && val.target.offsetHeight > height) {
        this.isElTooltipShow = true
      } else if (
        // 作比较：文本实际的宽度与外层壳的宽度
        !this.isMultiLine &&
        val.target.offsetWidth > width
      ) {
        this.isElTooltipShow = true
      } else this.isElTooltipShow = false
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
