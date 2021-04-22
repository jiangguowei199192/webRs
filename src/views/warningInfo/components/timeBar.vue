<template>
  <div class="control">
    <div class="numContainer">
      <template v-for="(item, index) in points">
        <!-- <span
          v-if="index % 2 != 0"
          :key="index"
          class="point"
          ref="circle"
          :style="'left:' + item.point + '%;'"
        ></span>
        <span
          v-if="index % 2 == 0"
          :key="index"
          class="num"
          ref="num"
          :style="'left:' + item.num + '%;'"
          >{{ formatTime(index) }}</span -->
        <span
          :key="index"
          class="num"
          ref="num"
          :style="'left:' + item.num + '%;'"
          >{{ item.time }}</span
        >
      </template>
    </div>
    <div class="barContainer">
      <div ref="bar" class="bar">
        <span
          class="segment"
          :style="
            'width:' +
            (duration * secondWidth * 100.0) / barWidth +
            '%;' +
            'left:0%'
          "
        ></span>
        <div class="pointer" ref="pointer">
          <span>{{ formatCurtime(curTime) }}</span>
          <span class="icon" ref="icon"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date'
export default {
  data () {
    return {
      step: 0,
      secondWidth: 0,
      pointerW: 0, // pointer宽度
      pointerLeft: 0, // pointer左边距
      points: [],
      barWidth: 1,
      pointerIconW: 1, // pointer icon宽度
      circleWidth: 1, // 圆形刻度的宽度
      numWidth: 1 // 数字刻度的宽度
    }
  },

  props: {
    segments: {
      type: Array,
      default: () => []
    },
    curTime: {
      type: Number,
      default: () => ''
    },
    duration: {
      type: Number,
      default: () => ''
    },
    startTime: {
      type: String,
      default: () => ''
    }
  },
  mounted () {
    // this.points = [
    //   { point: 0, num: 0 },
    //   { point: 0, num: 0 }
    // ]
    this.points = [
      { num: 0, time: formatDate(new Date(this.startTime), 'HH:mm:ss') }
    ]
    window.onresize = () => {
      this.calculateStep()
      this.setPointerPosition(this.curTime)
    }
  },

  destroyed () {
    window.onresize = null
  },
  watch: {
    curTime () {
      this.setPointerPosition(this.curTime)
    },
    duration () {
      this.init()
    }
  },

  methods: {
    setPointerPosition (seconds) {
      const max = this.barWidth - this.pointerW + this.pointerIconW
      const left =
        seconds >= this.duration
          ? max
          : seconds * this.secondWidth - this.pointerW + this.pointerIconW

      this.$refs.pointer.style.left = (left * 100.0) / this.barWidth + '%'
    },
    /**
     * 初始化
     */
    init () {
      this.$nextTick(() => {
        this.calculateStep()
        this.setPointerPosition(this.curTime)
      })
    },
    /**
     * 计算刻度尺
     */
    calculateStep () {
      this.pointerW = this.$refs.pointer.clientWidth
      this.pointerLeft = -this.pointerW + this.pointerIconW
      this.barWidth = this.$refs.bar.clientWidth
      this.pointerIconW = this.$refs.icon.clientWidth / 2
      // this.numWidth = this.$refs.num[0].clientWidth / 2
      this.numWidth = this.$refs.num[0].clientWidth
      // this.circleWidth = this.$refs.circle[0].clientWidth / 2
      // this.step = this.barWidth / 8.0
      this.secondWidth = (this.barWidth * 1.0) / this.duration
      this.points = []
      // for (let i = 0; i < 9; i++) {
      //   const left =
      //     ((i * this.step - this.circleWidth) * 100.0) / this.barWidth
      //   if (i === 0) {
      //     this.numWidth = 0
      //   } else if (i === 8) {
      //     this.numWidth = this.$refs.num[0].clientWidth
      //   } else this.numWidth = this.$refs.num[0].clientWidth / 2
      //   const left2 = ((i * this.step - this.numWidth) * 100.0) / this.barWidth
      //   const n = { point: left, num: left2 }
      //   this.points.push(n)
      // }
      for (let i = 0; i < 2; i++) {
        let left2 = 0
        let time = formatDate(new Date(this.startTime), 'HH:mm:ss')
        if (i === 1) {
          left2 = ((this.barWidth - this.numWidth) * 100.0) / this.barWidth
          const span =
            new Date(this.startTime).getTime() + this.duration * 1000
          time = formatDate(new Date(span), 'HH:mm:ss')
        }
        const n = { num: left2, time: time }
        this.points.push(n)
      }
    },
    /**
     * 格式化时间
     * @param {Integer}} time 时间
     */
    formatTime (index) {
      const span = new Date(this.startTime).getTime() - (4 - index) * 1000 * 10
      const time = new Date(span)
      return formatDate(time, 'HH:mm:ss')
    },
    /**
     * 格式化时间
     * @param {Integer}} time 时间
     */
    formatCurtime (time) {
      const span = new Date(this.startTime).getTime() + time * 1000
      return formatDate(new Date(span), 'HH:mm:ss')
    }
  }
}
</script>
<style lang="less" scoped>
.control {
  font-size: 12px;
  //以下四行取消双击选中文字效果
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.numContainer {
  height: 18px;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  .num {
    font-size: 12px;
    font-family: PingFang SC;
    color: rgba(209, 209, 209, 1);
    position: absolute;
  }
  .point {
    width: 3px;
    height: 3px;
    background: rgba(209, 209, 209, 1);
    border-radius: 50%;
    position: absolute;
  }
}

.barContainer {
  height: 22px;
  margin: 0px;
  padding: 0px;
  .bar {
    position: relative;
    height: 100%;
    background: url(../../../assets/images/timebar.png) no-repeat;
    background-size: 100% 100%;
    .segment {
      position: absolute;
      height: 100%;
      background: #00d8ff;
      opacity: 0.65;
    }
  }

  .pointer {
    pointer-events: none;
    display: flex;
    position: absolute;
    height: 22px;
    justify-content: space-between;
    align-items: center;
    min-width: 67px;
    :nth-child(1) {
      padding: 1px 3px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      background: rgba(239, 128, 24, 0.8);
      border-radius: 2px;
    }
    :nth-child(2) {
      pointer-events: auto;
      display: inline-block;
      width: 12px;
      height: 22px;
      background: url(../../../assets/images/warningCenter/time-pointer.svg)
        no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
