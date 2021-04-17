<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-30 11:45:51
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-04-17 11:13:50
-->
<template>
  <div class="container">
    <!-- 多条件筛选栏 -->
    <div class="date-tool">
      <div class="fl">
        <!-- <el-select
          placeholder="告警设备"
          class="select-input"
          v-model="query.alarmType"
          @change="searchList"
          clearable
        >
          <el-option
            v-for="(item, device_index) in caseDevice"
            :key="device_index"
            :label="item.deviceName"
            :value="item.deviceCode"
          ></el-option>
        </el-select>-->
        <el-select
          placeholder="等级"
          class="select-input"
          v-model="query.alarmLevel"
          clearable
          @change="searchList"
        >
          <el-option
            v-for="(item, level_index) in caseLevel"
            :key="level_index"
            :label="item.levelName"
            :value="item.levelCode"
          ></el-option>
        </el-select>
        <el-select
          placeholder="告警类型"
          class="select-input"
          v-model="query.alarmStatus"
          clearable
          @change="searchList"
        >
          <el-option
            v-for="(item, status_index) in caseStatus"
            :key="status_index"
            :label="item.statusName"
            :value="item.statusCode"
          ></el-option>
        </el-select>
        <el-date-picker
          class="datePickerStyle"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="dateRange"
          @change="dateSearchChange"
          value-format="timestamp"
          :clearable="false"
        ></el-date-picker>
      </div>
      <div class="resetBtn fl" @click.stop="resetSearchParams">
        <img :src="resetIcon" />
        <span>重置</span>
      </div>
    </div>
    <!-- 列表展示栏 -->
    <div class="list listScroll">
      <div
        class="list-item"
        v-for="(item, list_index) in list"
        :key="list_index"
        @click.stop="showDetailInfoClick(item, list_index)"
      >
        <div class="header-info">
          <div class="info-title">{{ item.alarmTypeName || "-" }}</div>
          <div class="info-status">
            <span
              :class="{
                undispose: item.alarmStatus == 1,
                abnormal: item.alarmStatus == 2,
                distort: item.alarmStatus == 3
              }"
            >
              {{
                `${item.alarmStatus == 1 ? "未处理" : ""}${
                  item.alarmStatus == 2 ? "异常" : ""
                }${item.alarmStatus == 3 ? "误报" : ""}`
              }}
            </span>
            <span>|</span>
            <span
              :class="{
                red_alert: item.alarmLevel == 1,
                orange_alert: item.alarmLevel == 2,
                yellow_alert: item.alarmLevel == 3,
                blue_alert: item.alarmLevel == 4
              }"
            >
              {{
                `${item.alarmLevel == 1 ? "红色预警" : ""}${
                  item.alarmLevel == 2 ? "橙色预警" : ""
                }${item.alarmLevel == 3 ? "黄色预警" : ""}${
                  item.alarmLevel == 4 ? "蓝色预警" : ""
                }`
              }}
            </span>
          </div>
        </div>
        <div class="content-wrap">
          <div class="bigImage" ref="bigImage">
            <img :src="item.imageUrl || noPic" />
          </div>
          <div class="text-base">
            <div class="base-equipment">
              <span class="item-text1">告警设备：</span>
              <EllipsisTooltip
                class="item-text2"
                :contentText="item.deviceName || '-'"
              ></EllipsisTooltip>
            </div>
            <div class="base-time">
              <span class="item-text1">时间：</span>
              <EllipsisTooltip
                class="item-text2"
                :contentText="item.captureTime || '-'"
              ></EllipsisTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页栏 -->
    <div class="page-base">
      <el-pagination
        class="tablePagination"
        popper-class="pageSelect"
        :total="pageTotal"
        :page-size="pageSize"
        :page-sizes="[15, 30, 50, 100]"
        :current-page.sync="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentPageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </div>
    <DetailInfo
      :dialogVisible="showDetailInfo"
      :info="detailInfo"
      @close="
        showDetailInfo = false;
        getList();
      "
    ></DetailInfo>
  </div>
</template>
<script>
import { structureApi } from '@/api/structureData.js'
import DetailInfo from './warningDetail'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import { timeFormat, timeFormat3 } from '@/utils/date'
import { EventBus } from '@/utils/eventBus.js'
import globalApi from '../../utils/globalApi'

export default {
  name: 'warningInfo',

  components: {
    EllipsisTooltip,
    DetailInfo
  },

  data () {
    return {
      resetIcon: require('../../assets/images/backgroundManagement/reset.svg'),
      dateRange: [],
      list: [],
      pageTotal: 100,
      pageSize: 15,
      currentPage: 1,
      showDetailInfo: false,
      detailInfo: { rect: { show: false, points: [] } },
      noPic: require('../../assets/images/gisDispatch/no-pic.svg'),
      caseDevice: [
        { deviceCode: 1, deviceName: '人' },
        { deviceCode: 2, deviceName: '船' },
        { deviceCode: 3, deviceName: '车' }
      ],
      caseStatus: [
        { statusCode: 1, statusName: '未处理' },
        { statusCode: 2, statusName: '异常' },
        { statusCode: 3, statusName: '误报' }
      ],
      caseLevel: [
        { levelCode: 1, levelName: '红色预警' },
        { levelCode: 2, levelName: '橙色预警' },
        { levelCode: 3, levelName: '黄色预警' },
        { levelCode: 4, levelName: '蓝色预警' }
      ],
      // 查询条件
      query: {
        alarmStatus: '',
        alarmLevel: '',
        alarmType: ''
      }
    }
  },

  created () {
    this.setDateRange()
  },

  mounted () {
    // 刷新告警设备列表
    EventBus.$on('deviceUpdate', info => {
      if (info) {
        this.getList()
      }
    })
    this.setTitle()
  },

  destroyed () {
    EventBus.$off('deviceUpdate')
  },

  methods: {
    // 替换算法的图片和视频地址
    replaceUrl (srcUrl) {
      if (globalApi.viedoServer) {
        let s = srcUrl.indexOf('//')
        const str = srcUrl.slice(s + 2)
        s = str.indexOf('/')
        const url = globalApi.viedoServer + str.slice(s)
        return url
      } else return srcUrl
    },

    // 默认日期范围(最近一周)
    setDateRange () {
      var start = new Date()
      var end = new Date()
      this.dateRange[0] = start.getTime() - 1000 * 60 * 60 * 24 * 7
      this.dateRange[1] = end.getTime()
      this.$set(this.dateRange, [this.dateRange[0], this.dateRange[1]])
      this.getList()
    },

    getList () {
      var params = {
        startTime: timeFormat3(this.dateRange[0]),
        endTime: timeFormat3(this.dateRange[1]),
        currentPage: this.currentPage,
        sizeOfPage: this.pageSize,
        alarmStatus: this.query.alarmStatus,
        alarmLevel: this.query.alarmLevel
      }
      this.$axios
        .post(structureApi.queryAlarmList, params)
        .then(res => {
          // console.log('设备列表返回:', res)
          if (res.data.code === 0) {
            res.data.data.data.forEach(item => {
              if (item.captureTime === 0) {
                item.captureTime = timeFormat(new Date())
              } else {
                item.captureTime = timeFormat(item.captureTime)
              }
              item.imageUrl = this.replaceUrl(item.imageUrl)
              item.rect = {
                points: [],
                show: false
              }
            })
            this.list = res.data.data.data
            this.pageTotal = res.data.data.total
            this.$nextTick(() => {
              this.list.forEach(item => {
                if (item.sectionLocations) {
                  item.rect = {
                    show: false,
                    points: []
                  }
                  const imgW = item.imgeWidth
                  const imgH = item.imgeHeight
                  item.sectionLocations.forEach(r => {
                    item.rect.points.push({
                      width: (r.width * 100.0) / imgW,
                      height: (r.height * 100.0) / imgH,
                      left: (r.left * 100.0) / imgW,
                      top: (r.top * 100.0) / imgH
                    })
                  })
                  item.rect.show = true
                }
              })
            })
          }
        })
        .catch(err => {
          console.log('structureApi.alarmList Err : ' + err)
        })
    },

    dateSearchChange () {
      this.startTime = this.dateRange[0]
      this.endTime = this.dateRange[1]
      this.currentPage = 1
      this.getList()
    },

    searchList () {
      this.currentPage = 1
      this.getList()
    },

    resetSearchParams () {
      this.currentPage = 1
      this.query.alarmStatus = this.query.alarmLevel = this.query.alarmType =
        ''
      this.setDateRange()
    },

    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getList()
      this.setTitle()
    },

    sizeChange (size) {
      this.pageSize = size
      this.currentPage = 1
      this.getList()
      this.setTitle()
    },

    setTitle () {
      const pages = document.querySelectorAll('.number')
      pages.forEach(t => {
        setTimeout(() => {
          t.setAttribute('title', t.childNodes[0].nodeValue)
        }, 300)
      })
    },

    showDetailInfoClick (item, index) {
      // console.dir(item)
      this.showDetailInfo = true
      this.detailInfo = item
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 12px;
  background: url(../../assets/images/structureData/bg.png) no-repeat;
  background-size: 100% 100%;
  height: 864px;
  margin: 0px 29px 37px 29px;
  padding-top: 21px;
}
.date-tool {
  .select-input {
    margin-left: 21px;
    /deep/.el-input__inner {
      color: #c5f3ff;
      border: solid 1px #1eb0fc;
      border-radius: 0;
      background-color: rgba(9, 84, 109, 0.3);
      font-size: 15px;
      height: 36px;
    }
  }
  .resetBtn {
    box-sizing: border-box;
    width: 80px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: linear-gradient(120deg, #086384, #0b779e);
    margin-left: 15px;
    cursor: pointer;
    img {
      width: 20px;
      height: 18px;
      margin-right: 10px;
      vertical-align: text-bottom;
    }
    span {
      font-size: 15px;
    }
  }
  .datePickerStyle {
    width: 400px;
    height: 36px;
    background-color: rgba(9, 84, 109, 0.3);
    border-color: #39a4dd;
    border-radius: 0px;
    border: 1px solid #1eb0fc;
    vertical-align: top;
    padding: 3px 5px;
    margin-left: 15px;
  }
  /deep/.el-date-editor .el-range-input {
    color: #fff;
    background: transparent;
    font-size: 14px;
  }
  /deep/.el-range-separator {
    color: #fff;
    font-size: 12px;
    line-height: 28px;
  }
  /deep/.el-input__prefix,
  /deep/.el-input__icon {
    line-height: 28px;
  }
  /deep/.el-cascader .el-input .el-input__inner {
    background-color: rgba(9, 84, 109, 0.3);
    border-color: #39a4dd;
    border-radius: 0px;
    width: 400px;
  }
}

.list {
  // width: 100%;
  height: 740px;
  margin: 56px 10px 0 10px;
  overflow: auto;
  .list-item {
    box-sizing: border-box;
    display: inline-block;
    width: 342px;
    height: 180px;
    border: 1px solid #39a4dd;
    margin: 0 12px 20px 12px;
    padding: 0 10px;
    cursor: pointer;
    img {
      width: 124px;
      height: 124px;
    }
    .header-info {
      display: flex;
      justify-content: space-between;
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid #39a4dd;
      font-size: 14px;
      .info-title {
        color: #00d1ff;
      }
      .info-status > .undispose {
        color: #09eebc;
      }
      .info-status > .abnormal {
        color: #f00e0e;
      }
      .info-status > .distort {
        color: #f0670c;
      }
      .info-status > .red_alert {
        color: #c52509;
      }
      .info-status > .orange_alert {
        color: #e7a61b;
      }
      .info-status > .yellow_alert {
        color: #e4e71b;
      }
      .info-status > .blue_alert {
        color: #1b51e7;
      }
    }

    .content-wrap {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      position: relative;
      .bigImage {
        display: inline-block;
        position: relative;
        width: 124px;
        height: 124px;
        margin-right: 10px;
        span {
          position: absolute;
          display: inline-block;
          border: 1px solid red;
        }
      }
      .text-base {
        position: absolute;
        right: 0;
        bottom: 6px;
        .base-equipment,
        .base-time {
          margin-top: 10px;
        }
        .item-text1 {
          display: inline-block;
          font-size: 14px;
          color: #00d1ff;
        }
        .item-text2 {
          display: inline-block;
          max-width: 135px;
          font-size: 14px;
          color: #fff;
          vertical-align: top;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.page-base {
  float: right;
  margin: 5px 55px 0 0;
}
</style>
