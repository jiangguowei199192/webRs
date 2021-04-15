<template>
  <div class="canvasDraw">
    <canvas id="cvs">不支持canvas</canvas>
  </div>
</template>

<script >
let illegalIntrusionAreaPix = []
let flag = false
let index = 0
// const curPoints = []
// let cvsClientRect = ''

export default {
  props: {
    areaArray: {
      type: Array
    }
  },
  data () {
    return {
      cvs: '',
      ctx: ''
    }
  },
  methods: {
    // 鼠标按下方法
    mousedownHandler (event) {
      if (event.button === 0 && !flag) {
        illegalIntrusionAreaPix[index].points.push({
          pointX: event.offsetX,
          pointY: event.offsetY
        })
        // 只要有一个坐标
        if (illegalIntrusionAreaPix[index].points.length >= 1) {
          this.cvs.addEventListener('mousemove', this.mousemoveHandler, false)
        }
        this.drawPolygon(illegalIntrusionAreaPix[index].points)
      }
    },
    // 鼠标双击
    mousedbclick (event) {
      // const cvs = document.getElementById('cvs')
      this.ctx.beginPath()
      // 文字
      this.ctx.font = '12px bold Arial'
      this.ctx.fillStyle = '#fff'
      this.ctx.textBaseline = 'bottom'
      const curPoints = illegalIntrusionAreaPix[index].points
      this.ctx.fillText(
        '区域一',
        curPoints[curPoints.length - 1].x,
        curPoints[curPoints.length - 1].y - 3
      )

      flag = true
      this.cvs.removeEventListener('mousemove', this.mousemoveHandler)
      this.$emit('drawEnd', illegalIntrusionAreaPix)
    },

    // 绘制方法
    drawPolygon (points, fillText = false) {
      console.log('前端当前绘制的坐标结构', points)
      // 先清空
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
      // 再绘制
      // if (index >= 1) {
      //   for (let j = 0; j < index; j++) {
      //     curPoints = points[j].points
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
      // 文字
      if (fillText) {
        this.ctx.font = '12px bold Arial'
        this.ctx.fillStyle = '#fff'
        this.ctx.textBaseline = 'bottom'
        const curPoints = illegalIntrusionAreaPix[index].points
        this.ctx.fillText(
          '区域一',
          curPoints[curPoints.length - 1].x,
          curPoints[curPoints.length - 1].y - 3
        )
      }

      this.ctx.strokeStyle = '#ffde00'
      this.ctx.lineWidth = 3
      this.ctx.beginPath()
      this.ctx.moveTo(points[0].pointX, points[0].pointY)
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].pointX, points[i].pointY)
      }

      this.ctx.closePath()
      this.ctx.stroke()
    },
    // 鼠标移动的方法 contact
    mousemoveHandler (event) {
      this.drawPolygon(
        illegalIntrusionAreaPix[index].points.concat({
          pointX: event.offsetX,
          pointY: event.offsetY
        })
      )
    },
    // 继续绘制
    startDraw () {
      // 点击继续绘制，清空所有数据
      illegalIntrusionAreaPix = []
      this.$emit('drawEnd', illegalIntrusionAreaPix)
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)

      flag = false
      illegalIntrusionAreaPix.push({
        points: []
      })
      index = illegalIntrusionAreaPix.length - 1
      this.cvs.addEventListener('mousedown', this.mousedownHandler, false)
      this.cvs.addEventListener('dblclick', this.mousedbclick, false)
    },
    // 清除所有
    clearAllDraw () {
      // const ctx = this.cvs.getContext('2d')
      illegalIntrusionAreaPix = []
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
      this.$emit('drawEnd', illegalIntrusionAreaPix)
    },
    // 清除当前
    clearCurDraw (index) {
      illegalIntrusionAreaPix.splice(index, 1)
      this.$emit('drawEnd', illegalIntrusionAreaPix)
      this.drawPolygonAll()
    },
    drawPolygonAll () {
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
      if (illegalIntrusionAreaPix && illegalIntrusionAreaPix.length > 0) {
        for (let j = 0; j < illegalIntrusionAreaPix.length; j++) {
          const curPointArray = illegalIntrusionAreaPix[j].points
          this.ctx.strokeStyle = '#ffde00'
          this.ctx.lineWidth = 3
          this.ctx.beginPath()
          this.ctx.moveTo(curPointArray[0].pointX, curPointArray[0].pointY)
          for (let i = 1; i < curPointArray.length; i++) {
            this.ctx.lineTo(curPointArray[i].pointX, curPointArray[i].pointY)
          }
          this.ctx.closePath()
          this.ctx.stroke()
        }
      }
    },
    resizeCanvas () {
      const parentStyle = window.getComputedStyle(this.cvs.parentNode)
      this.cvs.width = parseInt(parentStyle.width)
      this.cvs.height = parseInt(parentStyle.height)
    }
  },
  mounted () {
    this.cvs = document.getElementById('cvs')
    this.ctx = this.cvs.getContext('2d')
    this.resizeCanvas()
    setTimeout(() => {
      illegalIntrusionAreaPix = JSON.parse(JSON.stringify(this.areaArray))
      this.drawPolygonAll()
    }, 300)

    // window.addEventListener('resize', () => {
    //   this.resizeCanvas()
    //   // 等待 canvas 变换好，再延时绘制，不然可能会没有内容
    //   setTimeout(() => {
    //     if (
    //       illegalIntrusionAreaPix[0] &&
    //       illegalIntrusionAreaPix[0].points &&
    //       illegalIntrusionAreaPix[0].points.length > 0
    //     ) {
    //       this.drawPolygon(illegalIntrusionAreaPix[0].points, true)
    //     }
    //   }, 100)
    // })
  },
  watch: {
    points () {}
  }
}

// 添加区域按钮 绑定鼠标按下及双击事件
// document.getElementById('btn_add').onclick = function () {
//   const cvs = document.getElementById('cvs')
//   flag = false
//   points.push({
//     points: []
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
