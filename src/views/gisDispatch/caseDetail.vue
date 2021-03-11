<template>
  <caseMain ref="caseMain">
    <div class="caseDetail" slot="main">
      <div class="singleCase">
        <div class="gisTitle">
          <span>案件信息</span>
        </div>
        <div class="caseInfo">
          <div class="switch">
            <span :class="{ select: active === 0 }" @click.stop="active = 0"
              >基础信息</span
            >
            <span>|</span>
            <span :class="{ select: active === 1 }" @click.stop="active = 1"
              >推送信息</span
            >
          </div>
          <div class="info" v-show="active === 0">
            <img
              src="../../assets/images/gisDispatch/no-pic.svg"
              class="left"
            />
            <div class="right">
              <span class="name">{{ caseInfo.caseName }}</span>
              <span>报案人：{{ caseInfo.reportMan }}</span>
              <span>联系电话：{{ caseInfo.reportTel }}</span>
              <span>案件描述：{{ caseInfo.caseDesc }}</span>
              <div class="time">
                <img src="../../assets/images/gisDispatch/time.svg" />
                <span>{{ caseInfo.reportTime }}</span>
              </div>
              <div class="time">
                <img src="../../assets/images/gisDispatch/addr.svg" />
                <span>{{ caseInfo.reportAddr }}</span>
              </div>
            </div>
          </div>
          <div v-show="active === 1">
            <template v-for="(item, index) in pushList">
              <div :key="index" @click.stop="jumpCase">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </caseMain>
</template>

<script>
import { copyData } from '@/utils/public'
import caseMain from './components/caseMain'
export default {
  name: 'caseDetail',
  data () {
    return {
      active: 0, // 0-基础信息 1-推送信息
      caseInfo: {
        caseName: '',
        reportMan: '',
        caseDesc: '',
        reportAddr: '',
        reportTel: '',
        reportTime: ''
      },
      pushList: []
    }
  },
  components: {
    caseMain
  },
  mounted () {
    const data = this.$route.query.data
    copyData(data, this.caseInfo)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.caseDetail {
  height: 100%;
  position: relative;
  .singleCase {
    width: 349px;
    height: 208px;
    pointer-events: auto;
    position: absolute;
    top: 157px;
    left: 17px;
    background: url(../../assets/images/gisDispatch/single-case.svg) no-repeat;
    background-size: 100% 100%;
    .caseInfo {
      box-sizing: border-box;
      width: 329px;
      height: 188px;
      background-color: rgba($color: #004157, $alpha: 0.8);
      font-size: 12px;
      padding-top: 6px;
      padding-left: 14px;
      padding-right: 8px;
      .switch {
        span {
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #82f3fa;
          cursor: pointer;
        }
        span:nth-child(1),
        span:nth-child(2) {
          margin-right: 5px;
        }
        span.select {
          color: #6ed340;
        }
      }
      .info {
        display: flex;
        margin-top: 8px;
        .left {
          width: 116px;
          height: 140px;
          margin-right: 11px;
        }
        .right {
          display: flex;
          flex-direction: column;
          width: 216px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #fff;
          > span {
            margin-bottom: 7px;
          }
          .name {
            color: #82f3fa;
          }
          .time {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            img {
              width: 14px;
              height: 14px;
              margin-right: 7px;
            }
          }
        }
      }
    }
  }
}
</style>
