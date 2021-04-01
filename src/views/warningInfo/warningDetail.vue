<template>
  <el-dialog
    class="detailInfo"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    :show-close="false"
  >
    <div class="content-title">
      告警详情
      <img :src="X" alt @click="closeDialog" />
    </div>
    <div class="info">
      <div class="leftInfo">
        <ul class="baseInfo">
          <li>
            <span class="title">告警类型：</span>
            <span>{{info.alarmTypeName||'-'}}</span>
          </li>
          <li>
            <span class="title">告警设备：</span>
            <span>{{info.deviceId?info.deviceId.deviceName:'-'}}</span>
          </li>
          <li>
            <span class="title">告警时间：</span>
            <span>{{info.captureTime}}</span>
          </li>
        </ul>
        <div class="content-title">案件核实</div>
        <div class="btns">
          <div>正常</div>
          <div>异常</div>
        </div>
        <div class="remark">
          <div>备注：</div>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="textarea"
            maxlength="30"
            show-word-limit
            class="word"
          ></el-input>
          <div class="btns">
            <div>取消</div>
            <div>确定</div>
          </div>
          <div class="warningBox webFsScroll">
            <div class="list">
              <div class="circle">1</div>
              <div class="extra">
                <span class="descrip">这是一条很长很长很长的内容这是一条很长很长很长的内容这是一条很长很长很长的内容</span>
                <div class="time">2021-05-16 08:21:33</div>
              </div>
            </div>
            <div class="list">
              <div class="circle">1</div>
              <div class="extra">
                <span class="descrip">这是一条很长很长很长的内容这是一条很长很长很长的内容这是一条很长很长很长的内容</span>
                <div class="time">2021-05-16 08:21:33</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightInfo">
        <div class="bigImg">
          <img :src="info.imageUrl" alt />
          <span
              v-for="(list,index) in info.rect.points"
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
        <!-- <div class="tools">
          <span>区域检测</span>
          <el-switch v-model="areaWatch" active-color="#00D1FD" inactive-color="#AEAEAE"></el-switch>
          <span>事件检测</span>
          <el-switch v-model="eventWatch" active-color="#00D1FD" inactive-color="#AEAEAE"></el-switch>
        </div> -->
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    }
  },
  data () {
    return {
      X: require('../../assets/images/X.svg'),
      textarea: '',
      areaWatch: true,
      eventWatch: true
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close')
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.detailInfo {
  /deep/.el-dialog {
    width: 908px;
    height: 600px;
    border: 1px solid #00a7e8;
    background: #00394c;
    .content-title {
      img {
        position: absolute;
        right: 12px;
        top: 14px;
        cursor: pointer;
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      ul.baseInfo {
        font-family: Source Han Sans CN;
        font-size: 16px;
        margin-top: 20px;
        font-weight: 500;
        color: #fff;
        li {
          margin-bottom: 12px;
          span.title {
            color: #00bde7;
          }
        }
      }
      div.btns {
        margin-top: 12px;
        div {
          display: inline-block;
          width: 88px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border: 1px solid #39a4dd;
          color: #39a4dd;
          cursor: pointer;
        }
        div:nth-child(1) {
          margin-right: 10px;
        }
        div:nth-child(2) {
          background: #39a4dd;
          color: #fff;
        }
      }
      div.remark {
        margin-top: 10px;
        .word {
          width: 337px;
          .el-textarea__inner {
            background: transparent;
            border: 1px solid #00a7e8;
            color: #00a7e8;
          }
        }
        > div:nth-child(1) {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #fefefe;
          margin-bottom: 10px;
        }
        .btns {
          width: 337px;
          text-align: right;
        }
        div.warningBox {
          box-sizing: border-box;
          width: 334px;
          background: #004157;
          padding: 9px;
          max-height: 184px;
          overflow-y: auto;
          margin-top: 10px;
          div.list {
            display: flex;
            justify-content: space-between;
            div.circle {
              width: 20px;
              height: 20px;
              text-align: center;
              line-height: 20px;
              background: #39a4dd;
              border-radius: 70%;
              font-size: 16px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #fefefe;
            }
            div.extra {
              width: 280px;
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              .descrip {
                color: #fefefe;
              }
              .time {
                color: #39a4dd;
                text-align: right;
                margin-top: 8px;
                margin-bottom: 15px;
              }
            }
          }
        }
      }
      div.rightInfo {
        .bigImg {
          width: 489px;
          height: 516px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          span {
            position: absolute;
            border: 1px solid red;
          }
        }
        div.tools {
          padding-left: 8px;
          height: 40px;
          line-height: 40px;
          background: rgba(0, 0, 0, 0.8);
          span {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #ffffff;
            margin-right: 9px;
          }
        }
      }
    }
    .el-dialog__header {
      padding: 0;
      .el-dialog__close {
        color: #fff;
        font-size: 18px;
      }
    }
    .el-dialog__body {
      padding: 22px;
    }
  }
}
</style>
