<template>
  <div class="reviewMain">
    <div class="reviewBox">
      <div class="reviewHeader">
        <div class="title disable-user-select">战评列表</div>
        <div class="addReview disable-user-select" @click="addBattleReview">
          <span style="color:#1EB0FC;margin-left:15px">+</span>
          <span style="margin-left:20px">新增战评</span>
        </div>
      </div>
      <!-- <span class="webFsScroll"></span> -->
      <div class="reviewList browserScroll">
        <div class="reviewItem" v-for="(item, index) in reviewList" :key="index">
          <div class="item">
            <img class="img" :src="item.imgUrl"/>
            <div class="info1">
              <div class="name">{{ item.name }}</div>
              <div class="time">时间: {{ item.time }}</div>
              <div class="address">地点: {{ item.address }}</div>
            </div>
            <div class="info2">
              <div class="infoCom">
                <div class="img"><img src="../../assets/images/fireBattle/duration.png"/></div>
                <div class="text">
                  <div class="title">作战时间</div>
                  <div class="value">{{ item.duration }}</div>
                </div>
              </div>
              <div class="infoCom">
                <div class="img"><img src="../../assets/images/fireBattle/vehicle.png"/></div>
                <div class="text">
                  <div class="title">出勤车辆</div>
                  <div class="value">{{ item.vehicle }}辆</div>
                </div>
              </div>
              <div class="infoCom">
                <div class="img"><img src="../../assets/images/fireBattle/area.png"/></div>
                <div class="text">
                  <div class="title">受灾面积</div>
                  <div class="value">{{ item.area }}m²</div>
                </div>
              </div>
              <div class="infoCom">
                <div class="img"><img src="../../assets/images/fireBattle/people.png"/></div>
                <div class="text">
                  <div class="title">出勤人数</div>
                  <div class="value">{{ item.people }}人</div>
                </div>
              </div>
            </div>
            <div class="show" @click="showReviewDetail(item)"></div>
          </div>
        </div>
      </div>
      <div class="reviewPages">
        <el-pagination
          background
          :page-sizes="[8, 16, 32, 64]"
          layout="total, sizes, prev, pager, next"
          :total="reviewPageInfo.total"
          class="tablePagination"
          :page-size="reviewPageInfo.pageSize"
          @size-change="handleSizeChange"
          @current-change="reviewCurrentPageChange"
          :current-page.sync="reviewPageInfo.currentPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'evaluation',
  data () {
    return {
      reviewList: [],
      // 战评的分页信息
      reviewPageInfo: {
        total: 10,
        currentPage: 1,
        pageSize: 8
      }
    }
  },
  components: {

  },

  mounted () {
    this.reviewList = [
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道2222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      },
      {
        imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607676053840&di=9d781057ef302167873578b29e28bd24&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F06%2F02%2F19300534106437134465026151672.jpg',
        name: '*******大型火灾战评',
        time: '2020-12-12',
        address: '武昌区沙湖大道222号',
        duration: '3h21min',
        vehicle: 13,
        area: 132,
        people: 33
      }
    ]
  },
  beforeDestroy () {

  },
  methods: {
    // 新增战评
    addBattleReview () {
      console.log('addBattleReview-------------------------')
    },
    // 显示战评
    showReviewDetail (item) {
      console.log('showReviewDetail:', item)
      this.$router.push({ path: '/fireBattle' })
    },
    // 每页显示记录改变
    handleSizeChange (val) {
      this.reviewPageInfo.pageSize = val
      console.log(`reviewCurrentPageChange.pageSize: ${val}`)
      // get selected page info ...
    },
    // 列表页面改变
    reviewCurrentPageChange (val) {
      this.reviewPageInfo.currentPage = val
      console.log(`reviewCurrentPageChange.currentPage: ${val}`)
      // get selected page info ...
    }
  }
}
</script>

<style lang="scss" scoped>
.reviewMain {
  position: relative;
  height: 899px;
  margin-top: -5px;
  padding: 0 40px 0px 40px;
  .reviewBox {
    position: relative;
    height: 882px;
    background: url(../../assets/images/fireBattle/reviewBox.png) no-repeat;
    background-size: 100% 100%;
    padding: 10px 32px 0px 32px;
    .reviewHeader {
      position: relative;
      width: 100%;
      height: 42px;
      margin: 10px 0px;
      .title {
        position: absolute;
        width: 196px;
        height: 34px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 34px;
        padding-left: 24px;
        left: 0px;
      }
      .addReview {
        position: absolute;
        right: 0px;
        width: 134px;
        height: 34px;
        line-height: 34px;
        border: 1px solid #1EB0FC9C;
        cursor: pointer;
      }
    }
    .reviewList {
      width: 100%;
      height: 725px;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid #00CCFF;
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      .reviewItem {
        margin: 32px 0px 0px 32px;
        width: 47%;
        height: 132px;
        border: 1px solid #00CCFF;
        .item {
          margin: 12px;
          width: 782px;
          display: flex;
          flex-wrap: wrap;
          justify-content: left;
          .img {
            width: 150px;
            height: 108px;
          }
          .info1 {
            margin-left: 20px;
            width: 180px;
            height: 108px;
            color: #FFFFFF;
            font-size: 14px;
            .name,.time,.address {
              margin-bottom: 10px;
            }
          }
          .info2 {
            margin-left: 40px;
            width: 300px;
            height: 108px;
            color: #FFFFFF;
            font-size: 14px;
            display: flex;
            flex-wrap: wrap;
            .infoCom {
              width: 150px;
              height: 54px;
              display: flex;
              flex-wrap: wrap;
              align-items:center;
              .img {
                width: 36px;
                height: 36px;
              }
              .text {
                margin-left: 10px;
                .title {
                  color: #999999;
                }
                .value {
                  color: #AEF0F4;
                }
              }
            }
          }
          .show {
            margin-left: 46px;
            margin-top: 32px;
            width: 44px;
            height: 44px;
            background: url(../../assets/images/fireBattle/play.png) no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
        }
      }
    }
    .reviewPages {
      position: relative;
      width: 100%;
      .tablePagination {
        position: absolute;
        right: 0px;
        /deep/ button.btn-next,
        /deep/ button.btn-prev {
          background: transparent !important;
        }
        /deep/ button.btn-prev {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
