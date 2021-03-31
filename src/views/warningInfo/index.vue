<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-03-30 11:45:51
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-03-30 19:46:48
-->
<template>
  <div class="container">
    <!-- 多条件筛选栏 -->
    <div class="date-tool">
      <el-select placeholder="告警设备" class="select-input" v-model="query.alarmEquipment" clearable>
        <el-option
          v-for="(item, index) in caseStatus"
          :key="index"
          :label="item.typeName"
          :value="item.typeCode"
        ></el-option>
      </el-select>
      <el-select placeholder="等级" class="select-input" v-model="query.alarmLevel" clearable>
        <el-option
          v-for="(item, index) in caseStatus"
          :key="index"
          :label="item.typeName"
          :value="item.typeCode"
        ></el-option>
      </el-select>
      <el-select placeholder="告警类型" class="select-input" v-model="query.alarmType" clearable>
        <el-option
          v-for="(item, index) in caseStatus"
          :key="index"
          :label="item.typeName"
          :value="item.typeCode"
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
    <!-- 列表展示栏 -->
    <div class="list listScroll">
      <div
        class="list-item"
        v-for="(item, list_index) in list"
        :key="list_index"
        @click.stop="showDetailInfoClick(item, list_index)"
      >
        <div class="header-info">
          <div class="info-title">{{ item.alarmTypeName }}</div>
          <div class="info-status">
            <span>正常</span>
            <span>|</span>
            <span>橙色警告</span>
          </div>
        </div>
        <div class="content-wrap">
          <div class="bigImage" ref="bigImage">
            <img :src="item.imageUrl || noPic" />
            <span
              v-for="(list,index) in item.rect.points"
              :key="index"
              :style="
                'left:' +
                  list.left +
                  '%;' +
                  'top:' +
                  list.top +
                  '%;' +
                  'width:' +
                  list.width +
                  '%;' +
                  'height:' +
                 list.height +
                  '%;'
              "
            ></span>
          </div>
          <div class="text-base">
            <div class="base-equipment">
              <span class="item-text1">告警设备：</span>
              <EllipsisTooltip class="item-text2" :contentText="item.deviceId.deviceName"></EllipsisTooltip>
            </div>
            <div class="base-time">
              <span class="item-text1">时间：</span>
              <EllipsisTooltip class="item-text2" :contentText="item.captureTime"></EllipsisTooltip>
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
        :page-sizes="[18, 30, 50, 100]"
        :current-page.sync="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentPageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </div>
    <DetailInfo :dialogVisible="showDetailInfo" :info="detailInfo" @close="showDetailInfo = false"></DetailInfo>
  </div>
</template>
<script>
// import { structureApi } from '@/api/structureData.js'
import DetailInfo from './warningDetail'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import { timeFormat } from '@/utils/date'
import axios from 'axios'
import qs from 'qs'

export default {
  name: 'warningInfo',

  components: {
    EllipsisTooltip,
    DetailInfo
  },

  data () {
    return {
      dateRange: [],
      list: [],
      pageTotal: 100,
      pageSize: 18,
      currentPage: 1,
      showDetailInfo: false,
      detailInfo: { rect: { show: false } },
      noPic: require('../../assets/images/gisDispatch/no-pic.svg'),
      caseStatus: [
        { typeCode: 0, typeName: '未处置' },
        { typeCode: 1, typeName: '已处置' }
      ],
      // 查询条件
      query: {
        alarmEquipment: '',
        alarmLevel: '',
        alarmType: ''
      }
    }
  },

  created () {
    // 默认的日期范围，最近一周
    var start = new Date()
    var end = new Date()
    this.dateRange[0] = start.getTime() - 1000 * 60 * 60 * 24 * 7
    this.dateRange[1] = end.getTime()

    this.getList()
  },

  methods: {
    getList () {
      var xsRequest = axios.create({
        baseURL: 'http://172.16.63.43:8080',
        timeout: 10000,
        withCredentials: true,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
      xsRequest.interceptors.request.use(config => {
        config.data = qs.stringify({ ...config.data })
        return config
      })
      var params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }
      xsRequest
        .post('/structuration/spaceTimeQuery/queryAlarms', params)
        .then(res => {
          // console.log('设备列表返回:', res)
          if (res.data.code === 0) {
            res.data.data.forEach(item => {
              item.captureTime = timeFormat(item.captureTime)
              item.rect = {
                points: [],
                show: false
              }
            })
            this.list = res.data.data
            this.$nextTick(() => {
              this.list.forEach(item => {
                if (!item.sectionLocations) {

                } else {
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

    currentPageChange (curPage) {
      this.currentPage = curPage
      this.getList()
    },

    sizeChange (size) {
      this.pageSize = size
      this.currentPage = 1
      this.getList()
    },

    showDetailInfoClick (item, index) {
      console.dir(item)
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
  height: 885px;
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
  height: 760px;
  margin: 20px 10px 0 10px;
  overflow: auto;
  .list-item {
    box-sizing: border-box;
    display: inline-block;
    width: 340px;
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
      .info-status > span:nth-child(1) {
        color: #4eff00;
      }
      .info-status > span:nth-child(3) {
        color: #ef4e22;
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
