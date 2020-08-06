<template>
  <div class="control">
    <div class="numContainer">
      <template v-for="(item,index) in 25">
        <span
          @click="jumpHour(index)"
          v-if="index % 3 != 0"
          :key="index"
          class="point"
          :style="'left:' + (index * step - 2) + 'px;'"
        ></span>
        <span
          @click="jumpHour(index)"
          v-if="index % 3 == 0"
          :key="index"
          class="num"
          :style="'left:' + (index * step - 15) + 'px;'"
        >{{formatTime(index)}}</span>
      </template>
    </div>
    <div class="barContainer">
      <div ref="bar" class="bar" @mousedown="barClick">
        <template v-for="(item,index) in segments">
          <span
            :key="index"
            class="segment"
            :style="'width:' + item.duration * minuteWidth + 'px;' + 'left:' + item.start * minuteWidth + 'px;'"
          ></span>
        </template>
        <div class="pointer" ref="pointer" v-drag="me">
          <span>{{curTime}}</span>
          <span class="icon"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatSeconds } from '@/utils/date'
export default {
  data () {
    return {
      step: 0,
      minuteWidth: 0,
      pointerW: 0, // pointer宽度
      pointerLeft: 0, // pointer左边距
      me: '',
      isDrag: false
    }
  },

  // 注册局部组件指令
  directives: {
    drag: function (el, binding) {
      const me = binding.value
      const dragBox = el // 获取当前元素
      dragBox.onmousedown = e => {
        me.isDrag = true
        // 阻止事件冒泡
        if (e.stopPropagation) e.stopPropagation()
        else e.cancelBubble = true

        // 算出鼠标相对元素的位置
        const disX = e.clientX - dragBox.offsetLeft
        document.onmousemove = e => {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          const maxLeft = me.$refs.bar.clientWidth + me.pointerLeft
          // 左边界限制
          if (left < me.pointerLeft) { left = me.pointerLeft }
          // 右边限制
          if (left > maxLeft) {
            left = maxLeft
          }
          // 移动当前元素
          dragBox.style.left = left + 'px'
          me.toHourMinute((left - me.pointerLeft) / me.minuteWidth)
        }
        document.onmouseup = e => {
          me.$emit('jumpEvent', '')
          // 鼠标弹起来的时候不再移动
          document.onmousemove = null
          // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null
          me.isDrag = false
        }
      }
    }
  },

  props: {
    segments: {
      type: Array,
      default: () => []
    },
    curTime: {
      type: String,
      default: () => ''
    }
  },

  created () {
    this.me = this
  },

  mounted () {
    this.pointerW = this.$refs.pointer.clientWidth
    this.pointerLeft = -this.pointerW + 5
    this.$refs.pointer.style.left = this.pointerLeft + 'px'
    this.calculateStep()
    window.onresize = () => {
      this.calculateStep()
      var arry = this.curTime.split(':')
      var minute = parseInt(arry[0]) * 60 + parseInt(arry[1]) + parseInt(arry[2]) / 60
      this.$refs.pointer.style.left = minute * this.minuteWidth - this.pointerW + 5 + 'px'
    }
  },

  destroyed () {
    window.onresize = null
  },

  methods: {
    /**
     * 计算刻度尺
     */
    calculateStep () {
      var w = this.$refs.bar.clientWidth
      this.step = w / 24
      this.minuteWidth = w / (24 * 60)
    },

    /**
     * 格式化时间
     * @param {Integer}} time 时间
     */
    formatTime (time) {
      if (time < 10) return '0' + time.toString() + ':00'
      else return time.toString() + ':00'
    },

    /**
     * 跳转到X小时
     * @param {Integer}} hour 小时
     */
    jumpHour (hour) {
      this.jumpMinute(hour * 60)
      this.$emit('jumpEvent', '')
    },

    /**
     * 将分钟转换为小时和分钟字符串
     * @param {Integer}} minute 分钟
     */
    toHourMinute (minutes) {
      const time = formatSeconds(minutes * 60)
      this.$emit('update:curTime', time)
    },

    /**
     * 跳转到X分钟
     * @param {Integer}} minute 分钟
     */
    jumpMinute (minute) {
      if (this.isDrag) return
      this.$refs.pointer.style.left = minute * this.minuteWidth - this.pointerW + 5 + 'px'
      this.toHourMinute(minute)
    },

    /**
     * 点击时间轴
     */
    barClick: function (event) {
      var x = event.offsetX
      this.$refs.pointer.style.left = x - this.pointerW + 5 + 'px'
      this.toHourMinute(x / this.minuteWidth)
      this.$emit('jumpEvent', '')
    }
  }
}
</script>
<style lang="less" scoped>
.control {
  //以下四行取消双击选中文字效果
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.numContainer {
  height: 20px;
  position: relative;
}

.num {
  font-size: 12px;
  font-family: PingFang SC;
  color: rgba(209, 209, 209, 1);
  position: absolute;
  top: -2px;
  cursor: pointer;
}

.barContainer {
  height: 28px;
  background: rgba(63, 119, 155, 1);
  border-radius: 4px;
  margin: 0px -15px;
  padding: 0px 15px;
  .bar {
    position: relative;
    height: 100%;
    background: url(../../../assets/images/timebar.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    .segment {
      position: absolute;
      height: 100%;
      background: rgba(0, 215, 255, 1);
      opacity: 0.65;
      pointer-events: none;
    }
  }

  .pointer {
    pointer-events: none;
    display: flex;
    position: absolute;
    height: 42px;
    width: 70px;
    top: -7px;
    justify-content: space-between;
    align-items: center;
    :nth-child(1) {
      padding: 1px 3px;
      font-size: 13px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      background: rgba(239, 128, 24, 1);
      border-radius: 4px;
    }
    :nth-child(2) {
      pointer-events: auto;
      display: inline-block;
      width: 10px;
      height: 42px;
      background: url(../../../assets/images/time-pointer.png) no-repeat;
    }
  }
}

.point {
  width: 4px;
  height: 4px;
  background: rgba(209, 209, 209, 1);
  border-radius: 50%;
  position: absolute;
  top: 5px;
  cursor: pointer;
}
</style>
