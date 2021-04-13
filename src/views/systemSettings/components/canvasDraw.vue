<template>
  <div class="canvasDraw" >
    <canvas id="cvs" width="680" height="390">不支持canvas</canvas>
  </div>
</template>

<script >
let points = []
let flag = false
let index = 0
// const curPoints = []
let cvs = ''
// let cvsClientRect = ''

export default {
  props: {},
  data () {
    return {}
  },
  methods: {
    // 鼠标按下方法
    mousedownHandler (event) {
      console.log('点击时坐标', event)
      if (event.button === 0 && !flag) {
        console.log('points', points)
        points[index].pointsArray.push({
          x: event.offsetX,
          y: event.offsetY
        })
        console.log(points[index].pointsArray)
        // 只要有一个坐标
        if (points[index].pointsArray.length >= 1) {
          cvs.addEventListener('mousemove', this.mousemoveHandler, false)
        }
        this.drawPolygon(points[index].pointsArray)
      }
    },
    // 鼠标双击
    mousedbclick (event) {
      const cvs = document.getElementById('cvs')
      flag = true
      cvs.removeEventListener('mousemove', this.mousemoveHandler)
    },

    // 绘制方法
    drawPolygon (pointsArray) {
      console.log('收到的坐标', pointsArray)
      const cvs = document.getElementById('cvs')
      const ctx = cvs.getContext('2d')
      // 先清空
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      // 再绘制
      // if (index >= 1) {
      //   for (let j = 0; j < index; j++) {
      //     curPoints = points[j].pointsArray
      //     ctx.strokeStyle = '#ffde00'
      //     ctx.lineWidth = 3
      //     ctx.beginPath()
      //     ctx.moveTo(curPoints[0].x, curPoints[0].y)
      //     for (let i = 1; i < curPoints.length; i++) {
      //       ctx.lineTo(curPoints[i].x, curPoints[i].y)
      //     }
      //     ctx.closePath()
      //     ctx.stroke()
      //   }
      // }
      ctx.strokeStyle = '#ffde00'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(pointsArray[0].x, pointsArray[0].y)
      for (let i = 1; i < pointsArray.length; i++) {
        ctx.lineTo(pointsArray[i].x, pointsArray[i].y)
      }
      ctx.closePath()
      ctx.stroke()
    },
    // 鼠标移动的方法 contact
    mousemoveHandler (event) {
      // this.drawPolygon(
      //   points[index].pointsArray.concat({
      //     x: event.pageX - cvsClientRect.x,
      //     y: event.pageY - cvsClientRect.y
      //   })
      // )
      this.drawPolygon(
        points[index].pointsArray.concat({
          x: event.offsetX,
          y: event.offsetY
        })
      )
    },
    startDraw () {
      const cvs = document.getElementById('cvs')
      flag = false
      points.push({
        pointsArray: []
      })
      index = points.length - 1
      cvs.addEventListener('mousedown', this.mousedownHandler, false)
      cvs.addEventListener('dblclick', this.mousedbclick, false)
    },
    clearAllDraw () {
      const cvs = document.getElementById('cvs')
      const ctx = cvs.getContext('2d')
      points = []
      ctx.clearRect(0, 0, cvs.width, cvs.height)
    }
  },
  mounted () {
    cvs = document.getElementById('cvs')
    // cvsClientRect = cvs.getClientRects()[0]
    this.drawPolygon([
      { x: 5, y: 5 },
      { x: 677, y: 348 },
      { x: 340, y: 155 }
    ])
  }
}

// 添加区域按钮 绑定鼠标按下及双击事件
// document.getElementById('btn_add').onclick = function () {
//   const cvs = document.getElementById('cvs')
//   flag = false
//   points.push({
//     pointsArray: []
//   })
//   index = points.length - 1
//   cvs.addEventListener('mousedown', this.mousedownHandler, false)
//   cvs.addEventListener('dblclick', this.mousedbclick, false)
// }
// 清理全部区域
// document.getElementById('btn_create').onclick = function () {
//   const cvs = document.getElementById('cvs')
//   const ctx = cvs.getContext('2d')
//   points = []
//   ctx.clearRect(0, 0, cvs.width, cvs.height)
// }
</script>
<style lang="less">
.canvasDraw {
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>
