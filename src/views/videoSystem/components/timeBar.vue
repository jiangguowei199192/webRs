<template>
  <div>
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
      <div ref="bar" class="bar" @click="barClick">
        <template v-for="(item,index) in segments">
          <span
            :key="index"
            class="segment"
            :style="'width:' + item.duration * minuteWidth + 'px;' + 'left:' + item.start * minuteWidth + 'px;'"
          ></span>
        </template>
        <div class="pointer" ref="pointer" :style="'left:' + pointerLeft + 'px;'">
          <span>{{curTime}}</span>
          <span class="icon"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      step: 0,
      minuteWidth: 0,
      pointerW: 0,
      pointerLeft: -64
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

  mounted () {
    this.pointerW = this.$refs.pointer.clientWidth
    this.calculateStep()
    window.onresize = () => {
      this.calculateStep()
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
     * 格式化时间
     * @param {Integer}} minutes 时间
     */
    formatMinutes (minutes) {
      if (minutes < 10) return '0' + minutes.toString()
      else return minutes.toString()
    },

    /**
     * 跳转到X小时
     * @param {Integer}} hour 小时
     */
    jumpHour (hour) {
      this.jumpMinute(hour * 60)
    },

    /**
     * 将分钟转换为小时和分钟字符串
     * @param {Integer}} minute 分钟
     */
    toHourMinute (minutes) {
      // var hour = Math.floor(minutes / 60)
      // var minute = Math.floor(minutes % 60)
      // hour = this.formatMinutes(hour)
      // minute = this.formatMinutes(minute)
      // this.$emit('update:curTime', hour + ':' + minute)

      this.formatSeconds(minutes * 60)
    },

    /**
     * 将秒数转换为时分秒格式
     * @param {Integer}} value 秒
     */
    formatSeconds (value) {
      var sTime = parseInt(value) // 秒
      var mTime = 0 // 分
      var hTime = 0 //

      if (sTime > 60) {
        // 获取分钟，除以60取整数，得到整数分钟
        mTime = parseInt(sTime / 60)
        // 获取秒数，秒数取佘，得到整数秒数
        sTime = parseInt(sTime % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (mTime > 60) {
          // 获取小时，获取分钟除以60，得到整数小时
          hTime = parseInt(mTime / 60)
          // 获取小时后取佘的分，获取分钟除以60取佘的分
          mTime = parseInt(mTime % 60)
        }
      }
      var result = this.formatMinutes(hTime) + ':' + this.formatMinutes(mTime) + ':' + this.formatMinutes(sTime)
      this.$emit('update:curTime', result)
    },

    /**
     * 跳转到X分钟
     * @param {Integer}} minute 分钟
     */
    jumpMinute (minute) {
      this.pointerLeft = minute * this.minuteWidth - this.pointerW + 5
      this.toHourMinute(minute)
    },

    /**
     * 点击时间轴
     */
    barClick: function (event) {
      var x = event.offsetX
      this.pointerLeft = x - this.pointerW + 5
      this.toHourMinute(x / this.minuteWidth)
      this.$emit('jumpEvent', '')
    }
  }
}
</script>
<style lang="less" scoped>
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
    display: inline-block;
    position: absolute;
    height: 42px;
    width: 68.05px;
    top: -7px;
    :nth-child(1) {
      position: relative;
      top: -16px;
      padding: 1px 3px;
      font-size: 13px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      background: rgba(239, 128, 24, 1);
      border-radius: 4px;
    }
    :nth-child(2) {
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
