<template>
  <div class="container">
    <el-radio-group v-model="radio" size="small" class="radio-group">
      <el-radio-button label="人"></el-radio-button>
      <el-radio-button label="车"></el-radio-button>
      <el-radio-button label="船"></el-radio-button>
    </el-radio-group>
    <div class="list webFsScroll">
      <div
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="showDetailInfo = true"
      >
        <div>
          <img src="../../../public/assets/images/camera_type.png" />
          <img src="../../../public/assets/images/camera_type.png" />
        </div>
        <div style="margin-left: 10px; margin-right: 10px">
          <div>
            <span class="item-text1">监控设备：</span>
            <span class="item-text2" :title="item.deviceName">{{
              item.deviceName
            }}</span>
          </div>
          <div style="margin-top: 5px">
            <span class="item-text1">地址：</span>
            <span class="item-text2" :title="item.address">{{
              item.address
            }}</span>
          </div>
          <div style="margin-top: 5px">
            <span class="item-text1">时间：</span>
            <span class="item-text2" :title="item.time">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="float: right; margin-top: 20px; margin-right: 55px">
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
      @close="showDetailInfo = false"
      @confirmClick="showDetailInfo = false"
    ></DetailInfo>
  </div>
</template>
<script>
import DetailInfo from './components/detailInfo'

export default {
  name: 'structureData',
  components: { DetailInfo },
  data () {
    return {
      radio: '人',
      list: [
        {
          deviceName: '样例样例样例样例样例样例样例样例样例',
          address: '样例样例样例样例样例样例样例样例样例',
          time: '2021-03-18 15:09:06'
        },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' },
        { deviceName: '样例', address: '样例', time: '2021-03-18 15:09:06' }
      ],
      pageTotal: 100,
      pageSize: 18,
      currentPage: 1,
      showDetailInfo: false
    }
  },
  methods: {
    currentPageChange () {},
    sizeChange () {}
  },
  created () {}
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
.list {
  height: 760px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: auto;
  .list-item {
    display: inline-block;
    width: 280px;
    height: 230px;
    border: 1px solid #39a4dd;
    margin-left: 12px;
    margin-right: 12px;
    margin-top: 20px;
    cursor: pointer;
    img {
      width: 124px;
      height: 124px;
      margin: 10px 0 0 10px;
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
</style>
