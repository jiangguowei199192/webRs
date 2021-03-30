<template>
  <div class="container">
    <!-- 多条件筛选栏 -->
    <div class="date-tool">
      <el-select placeholder="告警设备" class="select-input" clearable>
        <el-option
          v-for="(item, index) in caseStatus"
          :key="index"
          :label="item.typeName"
          :value="item.typeCode"
        ></el-option>
      </el-select>
      <el-select placeholder="等级" class="select-input" clearable>
        <el-option
          v-for="(item, index) in caseStatus"
          :key="index"
          :label="item.typeName"
          :value="item.typeCode"
        ></el-option>
      </el-select>
      <el-select placeholder="告警类型" class="select-input" clearable>
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
    <!-- 详情栏 -->
    <div class="list listScroll">
      <div
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="showDetailInfoClick(item, index)"
      >
        <div class="header-info">
          <div>人员滞留</div>
          <div><span>正常</span><span> | </span><span>橙色警告</span></div>
        </div>
        <div class="content-wrap">
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
          <!-- <img :src="(item.pedestrian && item.pedestrian.image.url) || noPic" /> -->
          <div class="text-base">
            <div class="base-equipment">
              <span class="item-text1">告警设备：</span>
              <span class="item-text2" :title="item.camera.name">{{
                item.camera.name
              }}</span>
            </div>
            <div class="base-time">
              <span class="item-text1">时间：</span>
              <span class="item-text2" :title="item.captureTime">{{
                item.captureTime
              }}</span>
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
  </div>
</template>
<script>
import { structureApi } from '@/api/structureData.js'
import { timeFormat } from '@/utils/date'

export default {
  name: 'warningInfo',

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
      noPic: require('../../assets/images/gisDispatch/no-pic.svg'),
      caseStatus: [
        { typeCode: 0, typeName: '未处置' },
        { typeCode: 1, typeName: '已处置' }
      ]
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
      var capType = 1
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
              const bWidth = this.$refs.bigImage[0].clientWidth
              const bHeigth = this.$refs.bigImage[0].clientHeight
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
                const ratio = (bWidth * 1.0) / imgW
                const ratio2 = (bHeigth * 1.0) / imgH
                item.rect = { width: '', height: '', top: '', left: '' }
                item.rect.width = (w * 100.0 * ratio) / bWidth
                item.rect.height = (h * 100.0 * ratio2) / bHeigth
                item.rect.left = (left * 100.0) / imgW
                item.rect.top = (top * 100.0) / imgH
                item.rect.show = true
              })
            })
          }
        })
        .catch(err => {
          console.log('structureApi.dataList Err : ' + err)
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
        font-size: 14px;
        .base-equipment,
        .base-time {
          margin-top: 10px;
        }
        .item-text1 {
          color: #00d1ff;
        }
        .item-text2 {
          color: #fff;
          vertical-align: bottom;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span {
          max-width: 160px;
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
