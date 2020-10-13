<template>
  <!-- <div
    class="ar"
    @mouseup="mouseuphandler"
    @mousemove="mousemovehandler($event)"
    @mousedown="mousedownHandler($event)"
  >-->
  <div class="ar" v-if="showAR">
    <canvas id="myCanvas" width="1920" height="1080">您的浏览器不支持 HTML5 canvas 标签。</canvas>
  </div>
</template>

<script>
var startX, startY, endX, endY
var isdown = 0
export default {
  props: {
    showAR: {
      type: Boolean,
      default: false
    },
    showMarkForm: {
      type: Boolean,
      default: false
    }

  },
  methods: {
    // 鼠标按下记录起始坐标
    mousedownHandler (e) {
      startX = e.pageX
      startY = e.pageY
      endX = e.pageX
      endY = e.pageY
      isdown = 1
      this.$emit('canvasStart')
      console.log(startX + ',,,,' + startY)
      console.log('endX', endX)
    },
    // 鼠标移动先清除之前画布 再重新绘制
    mousemovehandler (e) {
      if (isdown) {
        // console.log(e.pageX+","+e.pageY)
        // 更新 box 尺寸
        // ab.style.width = e.pageX - startX + 'px';
        // ab.style.height = e.pageY - startY + 'px';
        // 获取页面中的canvas画布容器，通常为一个div
        var c = document.getElementById('myCanvas')
        // height = c.offsetHeight
        // width = c.offsetWidth
        endX = e.offsetX
        endY = e.offsetY
        var ctx = c.getContext('2d')
        ctx.lineWidth = 1
        ctx.strokeStyle = '#0f0'
        ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(e.pageX, startY) // shang
        ctx.lineTo(e.pageX, e.pageY) // you
        ctx.lineTo(startX, e.pageY) // xia
        ctx.closePath()
        ctx.stroke()
      }
    },
    // 鼠标弹起 清除画布
    mouseuphandler () {
      isdown = 0
      const c = document.getElementById('myCanvas')
      // const height = c.offsetHeight
      // const width = c.offsetWidth
      var ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight)
      // 获取矩形框距离左边cLeft，cWidth'
      let cLeft = 0
      let cWidth = 0
      if (startX > endX) {
        cLeft = endX
        cWidth = startX - endX
      } else {
        cLeft = startX
        cWidth = endX - startX
      }

      // 获取矩形顶部Top，Height
      let cTop = 0
      let cHeight = 0
      if (startY > endY) {
        cTop = endY
        cHeight = startY - endY
      } else {
        cTop = startY
        cHeight = endY - startY
      }
      // 获取矩形框Top，Height
      console.log(endX, startX)
      console.log(cLeft, cTop, cWidth, cHeight)
      const positionObj = { x: cLeft, y: cTop, width: cWidth, height: cHeight }
      this.$emit('canvasEnd', positionObj)
    }
  },
  watch: {
    showAR (nv) {
      if (nv) {
        this.$nextTick(() => {
          // 始终只会找到当前开启ar的视频
          const div = document.getElementsByClassName('ar')[0]
          console.log(div)
          div.addEventListener(
            'mousedown',
            e => {
              if (!this.showMarkForm) {
                this.mousedownHandler(e)
              }
            },
            false
          )
          div.addEventListener(
            'mousemove',
            $event => {
              if (!this.showMarkForm) {
                // 弹框没有显示时才可以绘制
                this.mousemovehandler($event)
              }
            },
            false
          )
          div.addEventListener(
            'mouseup',
            $event => {
              if (!this.showMarkForm) {
                this.mouseuphandler($event)
              }
            },
            false
          )
        })
      }
    }
  },
  mounted () {}
}
</script>
<style>
div.ar {
  position: fixed;
}
</style>
