<template>
  <div class="container">
    <div class="date-tool">
      <el-radio-group
        v-model="radio"
        size="small"
        class="radio-group"
        @change="radioChange"
      >
        <el-radio-button label="人"></el-radio-button>
        <el-radio-button label="车"></el-radio-button>
        <el-radio-button label="船"></el-radio-button>
      </el-radio-group>

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

    <div class="list listScroll">
      <div
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="showDetailInfoClick(item, index)"
      >
        <div>
          <div class="bigImage" ref="bigImage">
            <img :src="item.bigImage.url || noPic" />
            <span
              v-show="item.rect.show"
              :style="
                'left:' +
                  item.rect.left +
                  '%;' +
                  'top:' +
                  item.rect.top +
                  '%;' +
                  'width:' +
                  item.rect.width +
                  '%;' +
                  'height:' +
                  item.rect.height +
                  '%;'
              "
            ></span>
          </div>
          <img :src="(item.pedestrian && item.pedestrian.image.url) || noPic" />
        </div>
        <div class="text-base">
          <div>
            <span class="item-text1">监控设备：</span>
            <span class="item-text2" :title="item.camera.name">{{
              item.camera.name
            }}</span>
          </div>
          <div class="address">
            <span class="item-text1">地址：</span>
            <span
              class="item-text2"
              :title="item.camera.latitude + ',' + item.camera.longitude"
              >{{ item.camera.latitude + "," + item.camera.longitude }}</span
            >
          </div>
          <div class="address">
            <span class="item-text1">时间：</span>
            <span class="item-text2" :title="item.captureTime">{{
              item.captureTime
            }}</span>
          </div>
        </div>
      </div>
    </div>
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

    <DetailInfo
      :isShow="showDetailInfo"
      :type="radio"
      :info="detailInfo"
      @close="showDetailInfo = false"
      @confirmClick="showDetailInfo = false"
    ></DetailInfo>
  </div>
</template>
<script>
import DetailInfo from './components/detailInfo'
// import axios from 'axios'
// import qs from 'qs'
import { structureApi } from '@/api/structureData.js'
import { timeFormat } from '@/utils/date'

export default {
  name: 'structureData',
  components: { DetailInfo },
  data () {
    return {
      radio: '人',
      dateRange: [],
      list: [],
      pageTotal: 100,
      pageSize: 18,
      currentPage: 1,
      showDetailInfo: false,
      detailInfo: '',
      noPic: require('../../assets/images/gisDispatch/no-pic.svg')
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
    async getList () {
      // var xsRequest = axios.create({
      //   baseURL: 'http://172.16.63.246:8005', // http://127.0.0.1:8005
      //   timeout: 10000,
      //   withCredentials: true,
      //   paramsSerializer: function (params) {
      //     return qs.stringify(params, { arrayFormat: 'repeat' })
      //   }
      // })
      // xsRequest.interceptors.request.use((config) => {
      //   config.data = qs.stringify({ ...config.data })
      //   return config
      // })

      var capType = 1
      if (this.radio === '人') {
        capType = 1
      } else if (this.radio === '车') {
        capType = 2
      } else if (this.radio === '船') {
        capType = 3
      }
      var param = {
        captureType: capType,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        timeType: 0,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }
      this.$axios
        .post(structureApi.dataList, param)
        .then(res => {
          if (res.data.code === 0) {
            res.data.data.captures.forEach(item => {
              item.captureTime = timeFormat(item.captureTime)
              item.rect = {
                width: 0,
                height: 0,
                top: '',
                left: '',
                show: false
              }
            })
            this.list = res.data.data.captures
            this.pageTotal = res.data.data.page.total
            this.$nextTick(() => {
              // 计算识别框的位置和尺寸
              // const bWidth = this.$refs.bigImage[0].clientWidth
              // const bHeigth = this.$refs.bigImage[0].clientHeight
              this.list.forEach(item => {
                if (!item.pedestrian) {
                  return
                }
                const w = item.pedestrian.position.width
                const h = item.pedestrian.position.height
                const left = item.pedestrian.position.start.x
                const top = item.pedestrian.position.start.y
                const imgW = item.bigImage.width
                const imgH = item.bigImage.height
                // const ratio = (bWidth * 1.0) / imgW
                // const ratio2 = (bHeigth * 1.0) / imgH
                item.rect = { width: '', height: '', top: '', left: '' }
                item.rect.width = (w * 100.0) / imgW
                item.rect.height = (h * 100.0) / imgH
                // item.rect.width = (w * 100.0 * ratio) / bWidth
                // item.rect.height = (h * 100.0 * ratio2) / bHeigth
                item.rect.left = (left * 100.0) / imgW
                item.rect.top = (top * 100.0) / imgH
                item.rect.show = true
              })
            })
          }
        })
        .catch(err => {
          console.log('structureApi.dataList           a Err : ' + err)
        })
    },

    radioChange (radio) {
      this.getList()
    },

    // 按日期搜索列表
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
.radio-group {
  margin-left: 21px;
  /deep/ {
    .el-radio-button__inner {
      border: none;
      background: #194a6f;
      color: white;
      height: 36px;
      line-height: 20px;
      width: 70px;
      border-radius: 2px;
      font-size: 16px;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: #39a4dd;
      color: white;
    }
  }
}
.date-tool {
  .datePickerStyle {
    width: 400px;
    height: 36px;
    background-color: rgba(9, 84, 109, 0.3);
    border-color: #39a4dd;
    border-radius: 0px;
    border: 1px solid #1eb0fc;
    vertical-align: top;
    padding: 3px 5px;
    margin-left: 10px;
  }
  /deep/.el-input__inner {
    color: white;
  }
  /deep/.el-date-editor .el-range-input {
    color: white;
    background: transparent;
    font-size: 14px;
  }
  /deep/.el-range-separator {
    color: white;
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
  height: 750px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: auto;
  .list-item {
    box-sizing: border-box;
    display: inline-block;
    width: 280px;
    height: 230px;
    border: 1px solid #39a4dd;
    margin-left: 12px;
    margin-right: 12px;
    margin-top: 20px;
    padding: 10px 0 0 10px;
    cursor: pointer;
    img {
      width: 124px;
      height: 124px;
    }
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
      margin-left: 10px;
      margin-right: 10px;
    }
    .address {
      margin-top: 5px;
    }
    .item-text1 {
      font-size: 16px;
      color: #00d1ff;
    }
    .item-text2 {
      display: inline-block;
      font-size: 16px;
      color: white;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: top;
    }
    span {
      max-width: 160px;
    }
  }
}
.page-base {
  float: right;
  margin-top: 20px;
  margin-right: 55px;
}
</style>
