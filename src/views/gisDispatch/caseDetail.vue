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
              <EllipsisTooltip
                class="txt"
                :contentText="caseInfo.caseName"
                :contentClass="'caseName'"
              ></EllipsisTooltip>
              <EllipsisTooltip
                :contentText="'报案人：' + caseInfo.reportMan"
                class="txt"
                :contentClass="'reportAddr'"
              ></EllipsisTooltip>
              <EllipsisTooltip
                :contentText="'联系电话：' + caseInfo.reportTel"
                class="txt"
                :contentClass="'reportAddr'"
              ></EllipsisTooltip>
              <EllipsisTooltip
                :contentText="'案件描述：' + caseInfo.caseDesc"
                class="caseDesc"
                :contentClass="'reportAddr'"
                :isMultiLine="true"
                :webkitLineClamp="2"
              ></EllipsisTooltip>
              <div class="time">
                <img src="../../assets/images/gisDispatch/time.svg" />
                <EllipsisTooltip
                  :contentText="caseInfo.reportTime"
                  class="reportAddr"
                  :contentClass="'reportAddr'"
                ></EllipsisTooltip>
              </div>
              <div class="time">
                <img src="../../assets/images/gisDispatch/addr.svg" />
                <EllipsisTooltip
                  :contentText="caseInfo.reportAddr"
                  :contentClass="'reportAddr'"
                  class="reportAddr"
                ></EllipsisTooltip>
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
      <div class="disposeBox">
        <div class="gisTitle">
          <span>案件信息</span>
        </div>
        <div class="disposeInfo"></div>
      </div>
    </div>
  </caseMain>
</template>

<script>
import { copyData } from '@/utils/public'
import caseMain from './components/caseMain'
import EllipsisTooltip from '../../components/ellipsisTooltip'
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
    caseMain,
    EllipsisTooltip
  },
  mounted () {
    const data = JSON.parse(this.$route.query.data)
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
          width: 180px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #fff;
          .txt {
            height: 16px;
            line-height: 16px;
            margin-bottom: 5px;
          }
          .caseDesc {
            height: 36px;
            line-height: 18px;
            margin-bottom: 5px;
          }
          .time {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            img {
              width: 14px;
              height: 14px;
              margin-right: 6px;
            }
            .reportAddr {
              width: 160px;
              height: 16px;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
  .disposeBox {
    width: 349px;
    height: 608px;
    pointer-events: auto;
    position: absolute;
    top: 397px;
    left: 17px;
    background: url(../../assets/images/gisDispatch/dispose-box.svg) no-repeat;
    background-size: 100% 100%;
    .disposeInfo {
      box-sizing: border-box;
      width: 329px;
      height: 588px;
      background-color: rgba($color: #0179a2, $alpha: 0.95);
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
