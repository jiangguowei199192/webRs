<template>
  <div class="container">
    <div class="title">
      <span>日历</span>
    </div>
    <div class="btnContainer">
      <div>
        <span class="btn pre" @click="calendarPre(true, false)"></span>
        <span class="month">{{ dateInfo.curYear }}</span>
        <span class="btn next" @click="calendarPre(true, true)"></span>
      </div>
      <div>
        <span class="btn pre" @click="calendarPre(false, false)"></span>
        <span class="month">{{ dateInfo.curMonth }}</span>
        <span class="btn next" @click="calendarPre(false, true)"></span>
      </div>
    </div>
    <el-calendar v-model="showDate">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div style="position: relative">
          <span class="dayText">{{ data.day.split("-").slice(2).join() }}</span>
          <template v-for="(item, index) in markData">
            <span v-if="item === data.day" class="mark" :key="index"></span>
          </template>
        </div>
      </template>
    </el-calendar>
    <!-- <div class="search" @click="searchRecord">
      <span></span>
      <span>查找</span>
    </div>-->
    <div class="picContainer">
      <div class="title">
        <span>图片</span>
      </div>
      <div class="picList">
        <template v-for="(item, index) in snapList">
          <div
            :style="{
              background: 'url(' + serverUrl + item.filePath + ') no-repeat',
            }"
            :key="index"
            @click="showSnapDlg(item)"
          ></div>
        </template>
      </div>
    </div>
    <el-dialog :visible.sync="picDlgVisible" width="803px" class="editDlg">
      <div class="picContainer2">
        <div
          :style="{
            background: 'url(' + serverUrl + curSnap.filePath + ') no-repeat',
          }"
          @click="showBigImage"
        ></div>
        <div>
          <span>说明:</span>
          <el-input
            v-model="describe"
            placeholder="请输入图片说明"
            maxlength="50"
          ></el-input>
          <button @click="closeDlg">取消</button>
          <button class="btn-confirm" @click="addDescribe">确定</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="el-dialog-custom"
      :visible.sync="imgDialogVisible"
      :show-close="false"
      type="primary"
      :append-to-body="true"
      @click.native="imgDialogVisible = false"
      center
    >
      <img class="dialogImg" :src="imgSrc" />
    </el-dialog>
  </div>
</template>
<script>
import { api } from '@/api/videoSystem/videoRecord.js'
import globalApi from '@/utils/globalApi'
var that
export default {
  data () {
    return {
      showDate: new Date(),
      dateInfo: { curYear: '', curMonth: '' },
      picDlgVisible: false, // 图片弹窗
      imgDialogVisible: false,
      describe: '', // 图片描述
      curSnap: '',
      serverUrl: globalApi.baseUrl + '/video-service2',
      imgSrc: ''
    }
  },

  props: {
    markData: {
      type: Array,
      default: () => []
    },
    snapList: {
      type: Array,
      default: () => []
    },
    player: {
      default: () => ''
    }
  },
  watch: {
    showDate (val) {
      this.getYear()
    }
  },

  mounted () {
    that = this
    this.getYear()
    // 给日历按钮添加点击事件
    const divs = document.querySelectorAll('.el-calendar-day')
    for (let i = 0; i < divs.length; i++) {
      divs[i].addEventListener('click', function (event) {
        // that.picDlgVisible = true
        // 如果当前正在回放，阻止事件冒泡
        if (that.isStopPlayerFirst()) {
          event.stopPropagation()
          return false
        }
      })
    }
  },

  methods: {
    /**
     * 关闭对话框
     */
    closeDlg () {
      this.picDlgVisible = false
      this.describe = ''
    },

    /**
     * 显示放大图片对话框
     */
    showBigImage () {
      this.imgDialogVisible = true
      this.imgSrc = this.serverUrl + this.curSnap.filePath
    },

    /**
     * 显示抓图对话框
     * @param {Object} snap 抓图信息
     */
    showSnapDlg (snap) {
      this.picDlgVisible = true
      this.curSnap = snap
      this.describe = snap.remark
    },

    /**
     * 添加图片描述
     */
    addDescribe () {
      this.picDlgVisible = false
      this.$axios
        .post(api.updateSnap, {
          id: this.curSnap.id,
          remark: this.describe
        })
        .then((res) => {
          var rs = res.data
          if (rs && rs.code === 0) {
            var snap = this.snapList.find((s) => s.id === this.curSnap.id)
            if (snap !== undefined) snap.remark = this.describe
          }
        })
    },

    /**
     * 设置日期
     * @param {String} data //YYYY-MM-DD
     */
    setDate (date) {
      // 为了保证年月会改变
      this.dateInfo.curYear = ''
      this.showDate = new Date(date + ' 08:00:00')
    },

    /**
     * 获取当前显示的年
     */
    getYear () {
      var year = this.showDate.getYear()
      year = year < 2000 ? year + 1900 : year
      year = year.toString().substr(2, 2)
      var month = this.showDate.getMonth() + 1
      var day = this.showDate.getDate()
      let yearUpdate = false
      if (year !== this.dateInfo.curYear || month !== this.dateInfo.curMonth) {
        yearUpdate = true
        this.$emit(
          'dateChangeEvent',
          this.getYYMM(this.showDate),
          this.getYYMMDD()
        )
      }

      if (yearUpdate || day !== this.dateInfo.curDay) {
        this.$emit('searchRecordEvent', this.getYYMMDD())
      }
      this.dateInfo.curYear = year
      this.dateInfo.curMonth = month
      this.dateInfo.curDay = day
    },

    /**
     * 获取格式化的时间YYYY-MM
     */
    getYYMM () {
      var month = this.showDate.getMonth() + 1
      var year = this.showDate.getFullYear()
      if (month.toString().length < 2) month = '0' + month
      var yyyyMM = year + '-' + month
      return yyyyMM
    },

    /**
     * 获取格式化的时间YYYY-MM-DD
     */
    getYYMMDD () {
      var day = this.showDate.getDate()
      if (day.toString().length < 2) day = '0' + day
      var yyyyMM = this.getYYMM() + '-' + day
      return yyyyMM
    },

    /**
     * 上一年/月，下一年/月
     * @param {Boolean} isYear
     * @param {Boolean} isNext
     */
    calendarPre (isYear, isNext) {
      if (this.isStopPlayerFirst()) return
      var time
      var step = isNext === true ? 1 : -1

      if (isYear) {
        time = new Date().setFullYear(this.showDate.getFullYear() + step)
      } else {
        time = new Date(this.showDate).setMonth(
          this.showDate.getMonth() + step
        )
      }

      this.showDate = new Date(time)
    },

    /**
     * 查找记录
     */
    searchRecord () {
      this.$emit('searchRecordEvent', this.getYYMMDD())
    },

    /**
     * 是否需要停止回放
     */
    isStopPlayerFirst () {
      if (this.player) {
        this.$notify.closeAll()
        this.$notify.warning({ title: '警告', message: '请先停止当前回放' })
        return true
      }

      return false
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  font-size: 12px;
  padding: 15px 0px 0px 0px;
}

.btnContainer {
  margin-top: 10px;
  height: 17px;
  padding: 0px 35px 0px 23px;
  display: flex;
  justify-content: space-between;

  .month {
    font-size: 13px;
    font-family: Orbitron;
    font-weight: bold;
    color: rgba(0, 207, 249, 1);
    line-height: 17px;
    padding: 0px 20px;
    position: relative;
    top: -3px;
  }

  .btn {
    display: inline-block;
    width: 9px;
    height: 17px;
    cursor: pointer;
  }

  .pre {
    background: url(../../../assets/images/calendar-pre.png) no-repeat;
  }

  .next {
    background: url(../../../assets/images/calendar-next.png) no-repeat;
  }
}

.title {
  background: url(../../../assets/images/header-bg.png) no-repeat;
  width: 202px;
  height: 45px;
  margin-left: 10px;
  span {
    font-size: 18px;
    color: white;
    line-height: 45px;
    margin-left: 30px;
  }
}

.editDlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    background: transparent;
    .el-dialog__body {
      display: inline-block;
      padding: 0px;
      width: 100%;
      height: 549px;
      background: url(../../../assets/images/picture-box.png) no-repeat;
      .picContainer2 {
        padding: 26px 30px;
        div:nth-child(1) {
          width: 743px;
          height: 428px;
          background-size: 100% 100% !important;
          cursor: pointer;
        }

        div:nth-child(2) {
          margin-top: 20px;
          span {
            font-size: 16px;
            color: rgba(255, 255, 255, 1);
          }
          button {
            cursor: pointer;
            width: 87px;
            height: 32px;
            border: 1px solid rgba(30, 176, 252, 1);
            border-radius: 4px;
            font-size: 16px;
            background-color: transparent;
            color: rgba(30, 176, 252, 1);
            margin-left: 20px;
          }

          //按钮按下
          button:active {
            opacity: 0.5;
          }

          //去掉按钮点击出现的边框
          button:focus {
            outline: none;
          }

          .btn-confirm {
            background: rgba(30, 176, 252, 1);
            color: #fff;
          }
        }
      }
    }
  }
}

/deep/.el-input {
  margin-left: 15px;
  margin-right: 60px;
  display: inline-block;
  width: 410px;
}

/deep/.el-input__inner {
  background-color: transparent;
  border: none;
  border-radius: 0px;
  border-bottom: 1px solid rgba(153, 153, 153, 1);
  font-size: 15px;
  color: rgba(255, 255, 255, 1);
}

.picContainer {
  width: 100%;
  position: absolute;
  bottom: 20px;
  overflow: hidden;
  .picList {
    //解决ie和谷歌等出现滚动条问题
    width: calc(100% + 17px);
    margin-top: 30px;
    height: 351px;
    overflow-y: scroll;

    > div {
      margin-left: 40px;
      display: inline-block;
      cursor: pointer;
      width: 190px;
      height: 107px;
      background-size: 100% 100% !important;
      margin-bottom: 10px;
    }
  }
}

.el-calendar {
  margin-top: 10px;
  margin-left: 15px;
  width: 240px;
}

.dayText {
  font-size: 9px;
  color: rgba(174, 240, 244, 1);
  line-height: 16px;
  font-weight: bold;
  font-family: Orbitron;
}

.mark {
  width: 4px;
  height: 4px;
  background: rgba(255, 0, 0, 1);
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 22px;
  left: 3px;
}

.search {
  cursor: pointer;
  margin-left: 60px;
  width: 150px;
  height: 30px;
  border: 1px solid rgba(57, 164, 221, 1);
  margin-top: 13px;
  :nth-child(1) {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(../../../assets/images/search-white.png) no-repeat;
    position: relative;
    top: 5px;
    left: 36px;
  }

  :nth-child(2) {
    font-size: 15px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
    position: relative;
    left: 56px;
  }
}

.dialogImg {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/deep/.el-calendar {
  background-color: transparent;
}

/deep/.el-calendar-table {
  border-collapse: separate;
  border-spacing: 3px 3px;
}

/deep/.el-calendar-table .el-calendar-day:hover {
  cursor: pointer;
  background-color: transparent;
}

/deep/.el-calendar-table td.is-selected {
  background: rgba(0, 207, 249, 0.5);
  color: rgba(174, 240, 244, 1);
  border-radius: 4px;
}

/deep/.el-calendar-table tr:first-child td {
  border: none;
}

/deep/.el-calendar-table tr td:first-child {
  border: none;
}

/deep/.el-calendar-table td {
  border: none;
  text-align: right;
}

/deep/.el-calendar__header {
  visibility: hidden;
  height: 0px;
  padding: 0px;
}

/deep/.el-calendar-table thead th {
  padding: 0;
  font-size: 9px;
  font-weight: bold;
  color: rgba(174, 240, 244, 1);
  line-height: 16px;
}

/deep/.el-calendar__body {
  padding: 0px;
}

/deep/.el-calendar-table .el-calendar-day {
  box-sizing: border-box;
  padding: 0px;
  width: 31px;
  height: 31px;
  border: 1px solid rgba(0, 207, 249, 1);
  border-radius: 4px;
  padding: 0px 2px 0px 0px;
}

/deep/ .el-calendar-table:not(.is-range) td.prev {
  color: rgba(174, 240, 244, 1);
  opacity: 0.3;
}

/deep/.el-calendar-table:not(.is-range) td.next {
  color: rgba(174, 240, 244, 1);
  opacity: 0.3;
}
</style>
