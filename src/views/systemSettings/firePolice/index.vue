<template>
  <div>
    <button type="button" class="back" @click="back">
      <img :src="backImg" />
      火情报警
    </button>
    <div class="rightBox">
      <div class="dateBox">
        <el-date-picker
          v-model="date1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          class="datePickerStyle"
          @change="dateSearch"
          popper-class="chooseDateStyle"
        ></el-date-picker>
        <button type="button" class="more" @click="addressSearch()">
          <img :src="searchImg" />
        </button>
        <el-input
          v-model="pageData.alarmAddress"
          class="searchInput"
          @keyup.enter.native="addressSearch()"
        >
          <template slot="prepend">地点：</template>
        </el-input>
      </div>
      <div class="tableBox">
        <el-table
          class="webFsScroll"
          v-if="firePoliceList"
          @row-click="ClickTableRow"
          :data="firePoliceList"
          stripe
          empty-text="暂无数据"
          tooltip-effect="light"
        >
          <el-table-column label width="33" align="center" :resizable="false">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index">{{
                ""
              }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="报警时间"
            prop="alarmTime"
            width="180px"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            label="报警地点"
            prop="alarmAddress"
            width="200px"
            title="alarmAddress"
          >
            <template slot-scope="scope">
              <div
                style="
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                "
              >
                {{ scope.row.alarmAddress }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类型"
            prop="alarmTypeName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="报警图片"
            prop="alarmPicList"
            width="100px"
          >
            <template slot-scope="scope">
              <el-image
                fit="fill"
                :src="scope.row.alarmPicList[0].picPath"
                style="width: 30px; height: 30px; margin-top: 7px"
              >
                <div slot="placeholder"></div>
                <!-- 图片未加载时的占位内容 -->
                <div slot="error"></div>
                <!-- 图片加载失败时的占位内容 -->
              </el-image>
              <el-image
                fit="fill"
                :src="scope.row.alarmPicList[1].picPath"
                style="width: 30px; height: 30px; margin-left: 10px"
              >
                <div slot="placeholder"></div>
                <!-- 图片未加载时的占位内容 -->
                <div slot="error"></div>
                <!-- 图片加载失败时的占位内容 -->
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="报警设备"
            prop="deviceName"
            width="200px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="状态"
            prop="alarmStatus"
          ></el-table-column>
          <el-table-column
            align="center"
            label="确认时间"
            prop="updateTime"
            width="180px"
          ></el-table-column>
        </el-table>
        <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageData.total"
          :page-size="pageData.pageSize"
          :current-page.sync="pageData.currentPage"
          layout="total, prev, pager, next, jumper"
          @current-change="currentPageChange"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      v-if="fireDetailInfo"
      title="火情详情"
      :visible.sync="showFireDetail"
      width="30%"
      class="dialogStyle"
    >
      <div class="fireDetailDialogContent">
        <div class="textDiv1">
          <div class="textDiv2">接警时间：</div>
          <div class="textDiv3">{{ fireDetailInfo.alarmTime }}</div>
        </div>
        <div class="textDiv1">
          <div class="textDiv2">类型：</div>
          <div class="textDiv3">{{ fireDetailInfo.alarmTypeName }}</div>
        </div>
        <div class="textDiv1">
          <div class="textDiv2">报警设备：</div>
          <div class="textDiv3">{{ fireDetailInfo.deviceName }}</div>
        </div>
        <div>
          <div class="textDiv4">报警图片</div>
          <div class="textDiv5">
            <el-image
              @click="tipShow(1)"
              fit="fill"
              :src="fireDetailInfo.image1"
              style="
                width: 196px;
                height: 151px;
                margin-top: 3px;
                margin-left: 5px;
              "
            >
              <div slot="placeholder"></div>
              <!-- 图片未加载时的占位内容 -->
              <div slot="error"></div>
              <!-- 图片加载失败时的占位内容 -->
            </el-image>
            <el-image
              @click.stop="tipShow(2)"
              fit="fill"
              :src="fireDetailInfo.image2"
              style="
                width: 196px;
                height: 151px;
                margin-top: 3px;
                margin-left: 5px;
              "
            >
              <div slot="placeholder"></div>
              <!-- 图片未加载时的占位内容 -->
              <div slot="error"></div>
              <!-- 图片加载失败时的占位内容 -->
            </el-image>
          </div>
        </div>
        <div>
          <div class="textDiv6">
            报警地点：{{ fireDetailInfo.alarmAddress }}
          </div>
          <div class="textDiv5">
            <div
              style="
                width: 395px;
                height: 147px;
                background-color: gray;
                margin: 6px 8px 5px 7px;
              "
            >
              <gMap
                ref="gduMap"
                handleType="devMap"
                :bShowSimpleSearchTools="false"
                :bShowBasic="false"
                :bShowMeasure="false"
                :bShowLonLat="false"
                :bAutoLocate="false"
              ></gMap>
            </div>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        v-show="fireDetailInfo.showConfirm"
      >
        <el-button
          type="primary"
          @click="confirmFireDetail('confirmed')"
          class="trueBtn"
          >确 认</el-button
        >
        <el-button @click="confirmFireDetail('mistaken')" class="falseBtn"
          >误 报</el-button
        >
      </span>
    </el-dialog>

    <!-- 单击图片放大弹框 -->
    <el-dialog
      :visible.sync="cutDialogVisible"
      class="cutDialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <img :src="clickImgUrl" alt />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          @click="cutDialogVisible = false"
          style="width: 87px"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fireApi } from '@/api/videoSystem/fireAlarm.js'
import globalApi from '@/utils/globalApi'
import { Notification } from 'element-ui'
export default {
  created () {
    this.getFirePoliceList()
  },
  data () {
    return {
      cutDialogVisible: false,
      clickImgUrl: '',
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      firePoliceList: [],
      date1: [],
      radio: -1,
      pageData: {
        total: 0, // 总条目数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1, // 当前页
        beginTime: '',
        endTime: '',
        alarmAddress: ''
      },
      showFireDetail: false,
      fireDetailInfo: {
        id: 0,
        alarmTime: 0,
        alarmTypeName: '',
        deviceName: '',
        alarmAddress: '',
        alarmStatus: '',
        updateTime: 0,
        image1: '',
        image2: '',
        showConfirm: true
      },
      searchImg: require('../../../assets/images/Setting/setting-search.png')
    }
  },
  methods: {
    tipShow (index) {
      this.cutDialogVisible = !this.cutDialogVisible
      if (index === 1) {
        this.clickImgUrl = this.fireDetailInfo.image1
      } else this.clickImgUrl = this.fireDetailInfo.image2
    },

    back () {
      this.$router.push({ path: '/systemSettings' })
    },
    // 获取火情列表
    async getFirePoliceList () {
      var param = {
        timeBegin: this.pageData.beginTime,
        timeEnd: this.pageData.endTime,
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        alarmAddress: this.pageData.alarmAddress
      }
      this.$axios
        .get(fireApi.getDurationFireAlarmInfos, { params: param })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.firePoliceList = res.data.data.data
            for (let index = 0; index < this.firePoliceList.length; index++) {
              const element = this.firePoliceList[index]
              // 时间戳转时间
              if (element.alarmTime) {
                element.alarmTime = this.dateFormat(element.alarmTime)
              }
              if (element.updateTime) {
                element.updateTime = this.dateFormat(element.updateTime)
              }
              // 状态码转中文
              if (element.alarmStatus === 'confirmed') {
                element.alarmStatus = '确认'
              } else if (element.alarmStatus === 'mistaken') {
                element.alarmStatus = '误报'
              } else {
                element.alarmStatus = ''
              }
              // 图片URL添加baseURL
              if (element.alarmPicList === null) {
                // 没有图片
                element.alarmPicList = [{ picPath: '' }, { picPath: '' }]
              } else {
                if (element.alarmPicList.length === 1) {
                  // 只有一张图片
                  element.alarmPicList[0].picPath =
                    globalApi.baseUrl +
                    '/video-service2' +
                    element.alarmPicList[0].picPath
                  element.alarmPicList[1] = { picPath: '' }
                } else if (element.alarmPicList.length >= 2) {
                  // 两张和两张以上
                  for (
                    let picIndex = 0;
                    picIndex < element.alarmPicList.length;
                    picIndex++
                  ) {
                    const pic = element.alarmPicList[picIndex]
                    pic.picPath =
                      globalApi.baseUrl + '/video-service2' + pic.picPath
                  }
                }
              }
            }

            this.pageData.total = res.data.data.paginator.totalCount
          }
        })
    },
    Appendzero (obj) {
      if (obj < 10) {
        return '0' + obj
      } else {
        return obj
      }
    },
    dateFormat (timestamp) {
      var date = new Date(timestamp)
      var M =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var dateFormat =
        date.getFullYear() +
        '/' +
        M +
        '/' +
        this.Appendzero(date.getDate()) +
        ' ' +
        this.Appendzero(date.getHours()) +
        ':' +
        this.Appendzero(date.getMinutes()) +
        ':' +
        this.Appendzero(date.getSeconds())
      return dateFormat
    },
    // 点击表格行
    ClickTableRow (row) {
      this.radio = this.firePoliceList.indexOf(row)
      var detail = this.firePoliceList[this.radio]
      if (detail.alarmPicList) {
        this.fireDetailInfo.image1 = detail.alarmPicList[0].picPath
        this.fireDetailInfo.image2 = detail.alarmPicList[1].picPath
      }
      this.fireDetailInfo.alarmTime = detail.alarmTime
      this.fireDetailInfo.alarmTypeName = detail.alarmTypeName
      this.fireDetailInfo.deviceName = detail.deviceName
      this.fireDetailInfo.alarmAddress = detail.alarmAddress
      this.fireDetailInfo.alarmStatus = detail.alarmStatus
      this.fireDetailInfo.updateTime = detail.updateTime
      this.fireDetailInfo.id = detail.id
      if (detail.alarmStatus === '确认' || detail.alarmStatus === '误报') {
        this.fireDetailInfo.showConfirm = false
      } else {
        this.fireDetailInfo.showConfirm = true
      }
      this.showFireDetail = true

      const p = this
      setTimeout(() => {
        const tmpMap = p.$refs.gduMap.map2D
        tmpMap._map.updateSize()
        tmpMap.zoomToCenter(detail.alarmLongitude, detail.alarmLatitude)
        tmpMap.customMarkerLayerManager.addMarker({
          lon: detail.alarmLongitude,
          lat: detail.alarmLatitude
        })
        tmpMap.setZoom(16)
      }, 500)
    },
    // 确认、误报
    confirmFireDetail (isTrue) {
      this.$axios
        .post(
          fireApi.confirmFireAlarmInfo +
            '/' +
            this.fireDetailInfo.id +
            '/' +
            isTrue
        )
        .then((res) => {
          if (res.data.code === 0) {
            this.showFireDetail = false
            this.getFirePoliceList()
          } else {
            Notification({
              title: '提示',
              message: '操作失败',
              type: 'warning',
              duration: 5 * 1000
            })
          }
        })
    },
    // 日期搜索
    dateSearch () {
      if (this.date1) {
        this.pageData.currentPage = 1
        var beginDate = new Date(this.date1[0])
        var beginTime = beginDate.getTime()
        var endDate = new Date(this.date1[1])
        var endTime = endDate.getTime()
        this.pageData.beginTime = beginTime
        this.pageData.endTime = endTime
        this.getFirePoliceList()
      } else {
        this.pageData.beginTime = ''
        this.pageData.endTime = ''
        this.getFirePoliceList()
      }
    },
    // 分页页数改变
    currentPageChange () {
      this.getFirePoliceList()
    },
    // 地址搜索
    addressSearch () {
      if (this.pageData.alarmAddress.length <= 0) {
        Notification({
          title: '提示',
          message: '请输入地址后查询',
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }
      this.pageData.currentPage = 1
      this.getFirePoliceList()
    }
  }
}
</script>

<style lang="scss">
.chooseDateStyle.el-picker-panel {
  width: 350px;
  height: 230px;
}
.chooseDateStyle {
  .el-date-range-picker__content {
    width: 175px;
  }
  .el-date-range-picker__header {
    height: 15px;
    margin: 0;
  }
  .el-date-range-picker__header div {
    font-size: 10px;
  }
  .el-date-range-picker__content .el-date-range-picker__header div {
    margin: 0;
  }
  .el-date-table td,
  .el-date-table td div {
    height: 15px;
  }
  .el-date-table td span {
    width: 20px;
    height: 20px;
  }
}
</style>

<style lang="scss" scoped>
.back {
  width: 120px;
  height: 40px;
  border: solid 1px #39a4dd;
  font-size: 18px;
  color: #ffffff;
  background-color: transparent;
  outline: none;
  display: block;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 30px;
}

.rightBox {
  width: 796px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  margin: 50px auto 0 auto;
}
.dateBox {
  width: 760px;
  margin: 20px auto 0 auto;
  .datePickerStyle {
    background-color: transparent;
    border-color: #39a4dd;
  }
  /deep/.el-date-editor .el-range-input {
    color: white;
    background: transparent;
    font-size: 12px;
  }
  /deep/.el-range-separator {
    color: white;
    font-size: 12px;
    margin-top: -5px;
  }
}
.tableBox {
  width: 760px;
  height: 600px;
  // margin: 12px auto 20px auto;
  margin: 30px 0 0 18px;
  overflow: hidden;
  .tablePagination {
    padding-top: 30px;
    text-align: center;
  }
}
.el-table::before {
  height: 0px;
}
.el-table {
  color: white;
  font-size: 14px;
  background-color: transparent;
  /* 表格表头样式 */
  /deep/.el-table__header-wrapper th {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    height: 26px;
    padding: 0;
    background-color: rgba(54, 143, 187, 1);
  }
  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
  }
  /deep/.el-table__body tr {
    background-color: rgba(51, 105, 132, 1);
  }
  /* 鼠标hover每行的样式*/
  /deep/.el-table__body tr:hover > td {
    background-color: rgba(51, 105, 132, 1);
  }
  /deep/td,
  /deep/th {
    border: none;
  }
  //单选框样式
  /deep/ .el-radio__inner {
    border: 1px solid rgba(255, 255, 255, 1);
    background: transparent;
  }

  //单选框选中样式
  /deep/ .el-radio__input.is-checked .el-radio__inner::after {
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 1);
  }
}
/* 修改偶数行颜色*/
/deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: rgba(54, 143, 187, 1);
}
/deep/.el-table .cell {
  white-space: pre-line;
}

.dialogStyle {
  position: fixed;
  // top: 10%;
  right: 0;
  bottom: 0;
  left: 13%;
  overflow: auto;
  margin: 0;
  min-width: 1500px;
  /deep/.el-dialog__header {
    background-color: #39a4dd;
  }
  /deep/.el-dialog__title {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    background-color: #336984;
  }
  /deep/.el-dialog__footer {
    background-color: #336984;
  }
  /deep/.el-icon-close:before {
    color: white;
  }
  .trueBtn {
    background-color: #1eb0fc;
    font-size: 14px;
    color: white;
    width: 66px;
    height: 30px;
    padding: 0;
  }
  .falseBtn {
    background-color: transparent;
    font-size: 14px;
    color: #1eb0fc;
    width: 66px;
    height: 30px;
    padding: 0;
    border-color: #1eb0fc;
  }
  .fireDetailDialogContent {
    // background-color: burlywood;
    width: 410px;
    margin: 0 auto;
  }
  .textDiv1 {
    height: 47px;
    line-height: 47px;
    display: flex;
  }
  .textDiv2 {
    width: 70px;
    min-width: 70px;
    color: white;
    font-size: 14px;
    text-align: left;
  }
  .textDiv3 {
    height: 40px;
    width: 340px;
    border-bottom: solid 1px white;
    color: white;
    font-size: 14px;
  }
  .textDiv4 {
    width: 56px;
    color: white;
    font-size: 14px;
    margin-top: 10px;
  }
  .textDiv5 {
    height: 158px;
    margin-top: 7px;
    border: solid 1px #39a4dd;
    border-radius: 4px;
    cursor: pointer;
  }
  .textDiv6 {
    color: white;
    font-size: 14px;
    margin-top: 10px;
  }
}

.searchInput {
  width: 253px;
  float: right;
  /deep/ .el-input__inner {
    background-color: transparent;
    font-size: 12px;
    color: white;
    border-radius: 0;
    border: 0;
    border-bottom: solid 1px #368fbb;
  }
  /deep/ .el-input-group__prepend {
    background-color: transparent;
    font-size: 12px;
    color: white;
    border-radius: 0;
    border: 0;
    border-bottom: solid 1px #368fbb;
  }
}
.more {
  width: 25px;
  height: 25px;
  background-color: transparent;
  outline: none;
  float: right;
  margin-top: 9px;
  border: 0;
}

.cutDialog {
  background: rgba(0, 0, 0, 0.6);
  img {
    width: 743px;
    height: 428px;
  }
  /deep/.el-dialog {
    width: 803px;
    height: 549px;
    background: url(../../../assets/images/dialog-bg.png) no-repeat;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 26px 30px;
    }
    .el-dialog__footer {
      padding: 0 30px;
      .remark {
        display: flex;
        justify-content: space-between;
        .replain {
          text-align: left;
          span {
            color: #fff;
          }
          .el-input {
            width: 410px;
            .el-input__inner {
              color: #fff;
              border: none;
              border-bottom: 1px solid rgb(153, 153, 153);
              background: transparent;
            }
            input::-webkit-input-placeholder {
              color: #999;
            }
          }
        }
        .el-button--default {
          background: transparent;
          color: rgba(30, 176, 252, 1);
        }
        .el-button--primary {
          background: #1eb0fc;
        }
      }
    }
  }
}
</style>
