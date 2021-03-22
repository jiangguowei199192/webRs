<template>
  <div class="gEllipsis">
    <div class="contentCls" :style="{ width: width }">
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
    outerShellWidth: {
      // Tooltip 外层壳的宽度,default自定义设置
      type: Number,
      default: 134
    },
    contentText: {
      // 文本内容
      type: String,
      default: ''
    }
  },
  computed: {
    width () {
      // Tooltip 外层壳宽度自动填充px
      return this.outerShellWidth + 'px'
    }
  },
  data () {
    return {
      isElTooltipShow: true // Tooltip 是否可用
    }
  },
  mounted () {},
  methods: {
    hanldeElTooltip (val) {
      // /debugger
      if (val.target.offsetWidth > this.outerShellWidth) {
        // 作比较：文本实际的宽度与外层壳的宽度
        this.isElTooltipShow = false
      } else this.isElTooltipShow = true
    }
  }
}
</script>

<style scoped lang="scss">
.gEllipsis {
  width: 100%;
  padding: 0px 8px;
  box-sizing: border-box;
  border: 1px solid #209cdf55;
  font-size: 14px;
  height: 24px;
  line-height: 22px;
  position: relative;
  top: 8px;
  color: #c0c4cc;
  .contentCls {
    // 外层壳已做单行文本溢出显示省略号处理
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
