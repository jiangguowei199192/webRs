<template>
  <!-- <div
    class="ar"
    @mouseup="mouseuphandler"
    @mousemove="mousemovehandler($event)"
    @mousedown="mousedownHandler($event)"
  >-->
  <div class="ar" v-if="showAR" @dblclick.stop="stopEvent">
    <canvas id="myCanvas" width="1920" height="1080">您的浏览器不支持 HTML5 canvas 标签。</canvas>
    <img src="@/assets/images/AR/location.png" alt="" id="canvasImg" style="display:none">
  </div>
</template>

<script>
import { EventBus } from '@/utils/eventBus.js'
let startX, startY
let isdown = 0
let points = []

export default {
  props: {
    canDraw: {
      type: Boolean,
      default: false
    },
    showAR: {
      type: Boolean,
      default: false
    },
    showMarkForm: {
      type: Boolean,
      default: false
    },
    tagType: {
      type: String,
      default: '0'
    },
    pointsArray: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    // 清除画布
    clearReact () {
      const myCanvas = document.getElementById('myCanvas')
      const ctx = myCanvas.getContext('2d')
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
    },
    // 正在绘制时（showCurIndex=4），阻止鼠标双击退出全屏默认事件
    stopEvent () {
      event.stopPropagation()
      return false
    },
    // 鼠标按下记录起始坐标
    mousedownHandler ($event) {
      if (this.showMarkForm) {
        this.$emit('closeMarkForm')
        return
      }
      startX = $event.screenX
      startY = $event.screenY

      // isdown = 1
      // this.$emit('canvasStart')
      console.log(startX + ',,,,' + startY)
      if (
        this.tagType === '0' ||
        this.tagType === '1' ||
        this.tagType === '2' ||
        this.tagType === '3' ||
        this.tagType === '4'
      ) {
        this.drawImg(startX, startY)
        const curPositionObj = { x: startX, y: startY }
        const arr = []
        arr.push(curPositionObj)
        this.$emit('canvasEnd', arr)
        return
      }
      isdown = 0
      if (event.button === 0 && !isdown) {
        points.push({
          x: event.screenX,
          y: event.screenY
        })
        console.log(points)
        this.drawPolygon(points)
      }
    },
    // 绘制图片
    drawImg (x, y) {
      var mycanvas = document.getElementById('myCanvas')
      var ctx = mycanvas.getContext('2d')

      // 内存中先加载，然后当内存加载完毕时，再把内存中的数据填充到我们的 dom元素中，这样能够快速的去
      // 反应，比如网易的图片
      var img = document.querySelector('#canvasImg')
      ctx.drawImage(img, x - 30, y - 30)
    },
    drawPolygon (points, bool, item) {
      const myCanvas = document.getElementById('myCanvas')
      const ctx = myCanvas.getContext('2d')
      const newPoints = []
      if (bool) {
        console.log('转换之前收到后台的多个点的坐标', points)
        points.forEach(item => {
          newPoints.push({
            left: Math.round((item.left / 1280) * 1920 * 100) / 100,
            top: Math.round((item.top / 720) * 1080 * 100) / 100
          })
        })
        console.log('转换之后收到后台的多个点的坐标', newPoints)
      }
      // 如果是面，则必须清除之前画布，否则之前绘制的内容存在
      if (this.tagType === '22') {
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
      }
      if (bool) {
        ctx.strokeStyle = item.lineColor || '#ffde00'
        ctx.lineWidth = item.lineWidth || 3
      } else {
        ctx.strokeStyle = '#ffde00'
        ctx.lineWidth = 3
      }
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.beginPath()

      // 虚线
      if (bool) {
        ctx.setLineDash([item.lineType])
      } else {
        ctx.setLineDash([])
      }
      if (bool) {
        ctx.moveTo(newPoints[0].left, newPoints[0].top)
      } else {
        ctx.moveTo(points[0].x, points[0].y)
      }

      if (bool) {
        for (let i = 1; i < newPoints.length; i++) {
          ctx.lineTo(newPoints[i].left, newPoints[i].top)
        }
      } else {
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
      }
      // 形成闭合 如果是面
      if (this.tagType === '22' || (bool && item.label === '22')) {
        ctx.closePath()
      }
      // 绘制空心(前端绘制线和面，及展示线)
      if (
        this.tagType === '11' ||
        (bool && item.label === '11') ||
        this.tagType === '22'
      ) {
        ctx.stroke()
      }
      // 绘制实心（展示面）
      if (bool && item.label === '22') {
        ctx.fillStyle =
          this.hexToRgba(item.fillColor, item.opacity / 100) || '#00ff48' // 填充颜色
        ctx.fill()
      }
      // 若有文字则后绘制不会被覆盖
      if (bool) {
        ctx.font = '12px bold Arial'
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'bottom'
        ctx.fillText(item.labelName, newPoints[0].left, newPoints[0].top - 3)
      }
      // 下面是单独绘制轮廓线
      if (bool && item.label === '22') {
        ctx.strokeStyle = item.lineColor || '#ffde00'
        ctx.lineWidth = item.lineWidth
        ctx.beginPath()
        // 虚线
        ctx.setLineDash([item.lineType])
        ctx.moveTo(newPoints[0].left, newPoints[0].top)

        for (var i = 1; i < points.length; i++) {
          ctx.lineTo(newPoints[i].left, newPoints[i].top)
        }
        // 形成闭合
        ctx.closePath()
        // 绘制空心
        ctx.stroke()
      }
    },
    // 鼠标双击结束绘制
    mousedbclick (event) {
      // const myCanvas = document.getElementById('myCanvas')
      // const ctx = myCanvas.getContext('2d')
      isdown = 1
      this.$emit('canvasEnd', points)
      points = []
      // const div = document.getElementsByClassName('ar')[0]
      // div.removeEventListener(
      //   'mousedown',
      //   this.mousedownHandler,
      //   // (e) => {
      //   //   if (!this.showMarkForm) {
      //   //     this.mousedownHandler()
      //   //   }
      //   // },
      //   false
      // )
      // 绘制结束时清空画布，若不清空则之前绘制的图形依然存在

      // ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
      // cvs.removeEventListener("mousemove", mousemoveHandler);
    },
    // // 鼠标移动先清除之前画布 再重新绘制
    // mousemovehandler (e) {
    //   if (isdown) {
    //     // console.log(e.pageX+","+e.pageY)
    //     // 更新 box 尺寸
    //     // ab.style.width = e.pageX - startX + 'px';
    //     // ab.style.height = e.pageY - startY + 'px';
    //     // 获取页面中的canvas画布容器，通常为一个div
    //     var c = document.getElementById('myCanvas')
    //     // height = c.offsetHeight
    //     // width = c.offsetWidth
    //     endX = e.offsetX
    //     endY = e.offsetY
    //     var ctx = c.getContext('2d')
    //     ctx.lineWidth = 1
    //     ctx.strokeStyle = '#0f0'
    //     ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight)

    //     ctx.beginPath()
    //     ctx.moveTo(startX, startY)
    //     ctx.lineTo(e.pageX, startY) // shang
    //     ctx.lineTo(e.pageX, e.pageY) // you
    //     ctx.lineTo(startX, e.pageY) // xia
    //     ctx.closePath()
    //     ctx.stroke()
    //   }
    // },
    // 鼠标弹起 清除画布
    // mouseuphandler () {
    //   isdown = 0
    //   const c = document.getElementById('myCanvas')
    //   // const height = c.offsetHeight
    //   // const width = c.offsetWidth
    //   var ctx = c.getContext('2d')
    //   ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight)
    //   // 获取矩形框距离左边cLeft，cWidth'
    //   let cLeft = 0
    //   let cWidth = 0
    //   if (startX > endX) {
    //     cLeft = endX
    //     cWidth = startX - endX
    //   } else {
    //     cLeft = startX
    //     cWidth = endX - startX
    //   }

    //   // 获取矩形顶部Top，Height
    //   let cTop = 0
    //   let cHeight = 0
    //   if (startY > endY) {
    //     cTop = endY
    //     cHeight = startY - endY
    //   } else {
    //     cTop = startY
    //     cHeight = endY - startY
    //   }
    //   // 获取矩形框Top，Height
    //   console.log(endX, startX)
    //   console.log(cLeft, cTop, cWidth, cHeight)
    //   const positionObj = { x: cLeft, y: cTop, width: cWidth, height: cHeight }
    //   this.$emit('canvasEnd', positionObj)
    // }
    // 十六进制转rgb
    hexToRgba (hex, opacity) {
      return (
        'rgba(' +
        parseInt('0x' + hex.slice(1, 3)) +
        ',' +
        parseInt('0x' + hex.slice(3, 5)) +
        ',' +
        parseInt('0x' + hex.slice(5, 7)) +
        ',' +
        opacity +
        ')'
      )
    }
  },
  watch: {
    canDraw (nv) {
      if (nv) {
        this.$nextTick(() => {
          // 始终只会找到当前开启ar的视频
          const div = document.getElementsByClassName('ar')[0]
          console.log(div)
          div.addEventListener(
            'mousedown',
            // e => {
            //   if (!this.showMarkForm) {
            //     this.mousedownHandler()
            //   }
            // },
            this.mousedownHandler,
            false
          )
          div.addEventListener(
            'dblclick',
            // e => {
            //   if (!this.showMarkForm) {
            //     this.mousedbclick()
            //   }
            // },
            this.mousedbclick,
            false
          )
          // div.addEventListener(
          //   'mousemove',
          //   $event => {
          //     if (!this.showMarkForm) {
          //       // 弹框没有显示时才可以绘制
          //       this.mousemovehandler($event)
          //     }
          //   },
          //   false
          // )
          // div.addEventListener(
          //   'mouseup',
          //   $event => {
          //     if (!this.showMarkForm) {
          //       this.mouseuphandler($event)
          //     }
          //   },
          //   false
          // )
        })
      } else {
        // 防止直接关闭esc退出全屏
        points = []
        const div = document.getElementsByClassName('ar')[0]
        console.log(div)
        if (div) {
          div.removeEventListener(
            'mousedown',
            this.mousedownHandler,
            // (e) => {
            //   if (!this.showMarkForm) {
            //     this.mousedownHandler()
            //   }
            // },
            false
          )
          div.removeEventListener(
            'dblclick',
            this.mousedbclick,
            // (e) => {
            //   if (!this.showMarkForm) {
            //     this.blclickHandler()
            //   }
            // },
            false
          )
        }
      }
    },
    // 收到的多个点的数据
    pointsArray: {
      handler () {
        if (this.showAR) {
          const myCanvas = document.getElementById('myCanvas')
          const ctx = myCanvas.getContext('2d')
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
          this.pointsArray.forEach(item => {
            this.drawPolygon(item.pointsArray, true, item)
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    EventBus.$on('typeChange', info => {
      // const myCanvas = document.getElementById('myCanvas')
      // const ctx = myCanvas.getContext('2d')
      // ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
      // 若绘制时不结束直接切换类型或点击其它地方（调resetFrom 先重置到最新的一个点 然后若切换则清空了之前的数据） 清空数据
      points = []
    })
  }
}
</script>
<style>
div.ar {
  position: fixed;
}
</style>
