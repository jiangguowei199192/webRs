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
            <img class="img" :src="item.eventFileUrl" />
            <div class="info1">
              <div class="name">{{ item.fireName }}</div>
              <div class="time">时间: {{ item.fireTimeStart }}</div>
              <div class="address">地点: {{ item.fireAddress }}</div>
            </div>
            <div class="info2">
              <div class="infoCom">
                <div class="img">
                  <img src="../../assets/images/fireBattle/duration.png" />
                </div>
                <div class="text">
                  <div class="title">作战时间</div>
                  <div class="value">{{ item.durationStr }}</div>
                </div>
              </div>
              <div class="infoCom">
                <div class="img">
                  <img src="../../assets/images/fireBattle/vehicle.png" />
                </div>
                <div class="text">
                  <div class="title">出勤车辆</div>
                  <div class="value">{{ item.attendanceVehicle }}辆</div>
                </div>
              </div>
              <div class="infoCom">
                <div class="img">
                  <img src="../../assets/images/fireBattle/area.png" />
                </div>
                <div class="text">
                  <div class="title">受灾面积</div>
                  <div class="value">{{ item.damageArea }}m²</div>
                </div>
              </div>
              <div class="infoCom">
                <div class="img">
                  <img src="../../assets/images/fireBattle/people.png" />
                </div>
                <div class="text">
                  <div class="title">出勤人数</div>
                  <div class="value">{{ item.attendancePeople }}人</div>
                </div>
              </div>
            </div>
            <div class="show">
              <div class="listBtn play" @click="showReviewDetail(item)"></div>
              <div class="listBtn edit" @click="editBattleReview(item)"></div>
              <div class="listBtn del" @click="delBattleReview(item)"></div>
            </div>
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
import { battleApi } from '@/api/battle'
import globalApi from '@/utils/globalApi'
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
  components: {},

  mounted () {
    this.getBattleReviewList()
  },
  beforeDestroy () {},
  methods: {
    // 获取战评列表
    getBattleReviewList () {
      const config = {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
      this.$axios
        .post(battleApi.getBattleReviewList, this.reviewPageInfo, config)
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.code === 0 && res.data.data) {
              const tmpDatas = res.data.data.records
              tmpDatas.forEach(d => {
                d.eventFileUrl = globalApi.headImg + d.eventFileUrl
                if (d.damageArea === null) {
                  d.damageArea = 0
                }
                const tmpH = Math.floor(parseFloat(d.combatDuration) / 60)
                const tmpM = Math.floor(parseFloat(d.combatDuration) % 60)
                d.durationStr = ''
                if (tmpH > 0) {
                  d.durationStr = tmpH + 'h'
                }
                if (tmpM > 0) {
                  d.durationStr += tmpM + 'm'
                }
                if (d.durationStr === '') {
                  d.durationStr = '0m'
                }
              })
              console.log('getBattleReviewList:', tmpDatas)
              this.reviewList = tmpDatas
              this.reviewPageInfo.total = res.data.data.total
            }
          }
        })
        .catch(error => {
          console.log('battleApi.getBattleReviewList Err : ' + error)
        })
    },
    // 删除指定战评
    delBattleReview (item) {
      console.log('delBattleReview:', item)
      if (item) {
        return
      }
      const config = {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
      this.$axios
        .post(battleApi.deleteBattleReview, { id: item.id }, config)
        .then(res => {
          if (res.data.code === 0) {
            const size = this.reviewList.length
            for (let i = size - 1; i >= 0; i--) {
              if (this.reviewList[i].id === item.id) {
                this.reviewList.splice(i, 1)
                break
              }
            }
          } else {
            console.log('delete failed : ', res)
          }
        })
        .catch(error => {
          console.log('battleApi.deleteBattleReview Err : ' + error)
        })
    },
    // 编辑战评
    editBattleReview (item) {
      this.$router.push({
        path: '/addBattleReview',
        query: {
          id: item.id
        }
      })
    },
    // 新增战评
    addBattleReview () {
      this.$router.push({ path: '/addBattleReview' })
    },
    // 显示战评
    showReviewDetail (item) {
      this.$axios
        .post(battleApi.getBattleReviewDetail, { id: item.id })
        .then(res => {
          if (res.data.code === 0) {
            this.$router.push({
              path: '/fireBattle',
              query: {
                detail: res.data.data,
                duration: item.combatDuration
              }
            })
          }
        })
        .catch(error => {
          console.log('battleApi.getBattleReviewDetail Err : ' + error)
        })
    },
    // 每页显示记录改变
    handleSizeChange (val) {
      this.reviewPageInfo.pageSize = val
      console.log(`reviewCurrentPageChange.pageSize: ${val}`)
      // get selected page info ...
      this.getBattleReviewList()
    },
    // 列表页面改变
    reviewCurrentPageChange (val) {
      this.reviewPageInfo.currentPage = val
      console.log(`reviewCurrentPageChange.currentPage: ${val}`)
      // get selected page info ...
      this.getBattleReviewList()
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
        border: 1px solid #1eb0fc9c;
        cursor: pointer;
      }
    }
    .reviewList {
      width: 100%;
      height: 725px;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid #00ccff;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .reviewItem {
        margin: 32px 0px 0px 32px;
        width: 47%;
        height: 132px;
        border: 1px solid #00ccff;
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
            color: #ffffff;
            font-size: 14px;
            .name,
            .time,
            .address {
              margin-bottom: 10px;
            }
          }
          .info2 {
            margin-left: 40px;
            width: 300px;
            height: 108px;
            color: #ffffff;
            font-size: 14px;
            display: flex;
            flex-wrap: wrap;
            .infoCom {
              width: 150px;
              height: 54px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
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
                  color: #aef0f4;
                }
              }
            }
          }
          .show {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            margin-top: -4px;
            margin-left: 24px;
            .listBtn {
              margin-top: 8px;
              width: 28px;
              height: 28px;
              background-size: 100% 100%;
              cursor: pointer;
            }
            .listBtn:active {
              opacity: 0.8;
            }
            .play {
              background: url(../../assets/images/fireBattle/listPlay.png)
                no-repeat;
            }
            .edit {
              background: url(../../assets/images/fireBattle/listEdit.png)
                no-repeat;
            }
            .del {
              background: url(../../assets/images/fireBattle/listDelete.png)
                no-repeat;
            }
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
