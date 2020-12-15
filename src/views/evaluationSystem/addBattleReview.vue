<template>
  <div class="addBattleMain">
    <div class="addBattleBox">
      <div class="addBattleHeader">
        <div class="title disable-user-select">新增战评</div>
      </div>
      <div class="addBattleWork">
        <div class="battleTotal" v-show="!bNext">
          <div style="margin-left:15px;margin-top:15px;">
            <div class="imgFlag"></div>
            <span class="titleText">火灾描述</span>
            <el-popover
              placement="bottom"
              trigger="click"
              popper-class="iconPopover"
              v-model="showPopover"
            >
              <div class="selectBox">
                <el-input placeholder="输入三维数据名称进行搜索"
                          v-model="inputModelName"
                          class="searchModel">
                  <el-button @click="searchModel" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <div class="modelList webFsScroll">
                  <div class="modelItem" v-for="item in modelList"
                       :key="item.id"
                       @click="selectModel(item)"
                  >{{ item.name }}</div>
                </div>
              </div>
              <div slot="reference" class="selectModel">
                <div></div>
                <div>{{ modelInfo.name }}</div>
              </div>
            </el-popover>
          </div>
          <div class="itemComm">
            <span style="margin-right:15px">火灾名称</span>
            <el-select
              :popper-append-to-body="false"
              v-model="fireData.fireName"
              placeholder="请选择火灾"
              class="fireSelectStyle baseInfoInput"
            >
              <el-option
                v-for="item in fireList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span style="margin-left:15px;margin-right:15px;">火灾时间</span>
            <el-date-picker
              v-model="fireData.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="datePickerStyle baseInfoInput"
            >
            </el-date-picker>
          </div>
          <div class="itemComm">
            <span style="margin-right:15px;vertical-align:top;">火灾描述</span>
            <el-input type="textarea"
                      resize="none"
                      v-model="fireData.fireDescribe"
                      maxlength="200"
                      class="describeInputStyle"
            ></el-input>
          </div>
          <div class="itemComm">
            <span style="margin-right:15px;vertical-align:top;">火灾地址</span>
            <el-input v-model="fireData.fireAddress"
                      class="addressInputStyle baseInfoInput"
            ></el-input>
          </div>
          <div class="itemComm">
            <span style="margin-right:15px;vertical-align:top;">火灾经纬</span>
            <div class="fireMap">
              <gMap
                ref="gduMap"
                handleType="devMap"
                :bShowSimpleSearchTools="false"
                :bShowBasic="false"
                :bShowMeasure="false"
                :bShowLonLat="false"
                :bAutoLocate="false"
              ></gMap>
            </div>
          </div>
          <div style="margin-left:15px;margin-top:25px;">
            <div class="imgFlag"></div>
            <span class="titleText">出勤总数</span>
          </div>
          <div class="itemComm">
            <span style="margin-right:15px">出勤车辆</span>
            <el-input v-model="fireData.vehicle" style="width:112px;" class="baseInfoInput"></el-input>
            <span style="margin-left:40px;margin-right:15px">出勤人数</span>
            <el-input v-model="fireData.people" style="width:112px;" class="baseInfoInput"></el-input>
            <span style="margin-left:40px;margin-right:15px">出勤无人机</span>
            <el-input v-model="fireData.drone" style="width:112px;" class="baseInfoInput"></el-input>
          </div>
          <div class="btnComm disable-user-select btnCancel" @click="addCancel">取消</div>
          <div class="btnComm disable-user-select btnConfirm" @click="addNext">下一步</div>
        </div>
        <!-- <div class="battleEvents" v-show="bNext"></div> -->
        <commentStep2 v-show="bNext"></commentStep2>
      </div>
    </div>
  </div>
</template>

<script>
import commentStep2 from './commentStep2.vue'
export default {
  name: 'addBattle',
  data () {
    return {
      showPopover: false,
      inputModelName: '',
      modelInfo: {
        id: 1,
        name: '高德红外园区三维'
      },
      modelList: [],
      bNext: false,
      fireList: [],
      fireData: {
        fireName: '',
        dateRange: [new Date(2020, 12, 15, 16, 14, 52), new Date(2020, 12, 16, 16, 14, 52)],
        fireDescribe: '',
        fireAddress: '',
        lonLat: '',
        vehicle: '',
        people: '',
        drone: ''
      }
    }
  },
  components: {
    commentStep2
  },

  mounted () {
    this.fireList = [
      {
        id: 1,
        name: '孝感小森林火灾'
      },
      {
        id: 2,
        name: '孝感大森林火灾'
      }
    ]
    this.modelList = [
      {
        id: 1,
        name: '高德红外三维模型1'
      },
      {
        id: 2,
        name: '高德红外三维模型2'
      },
      {
        id: 3,
        name: '高德红外三维模型3'
      },
      {
        id: 4,
        name: '高德红外三维模型4'
      },
      {
        id: 5,
        name: '高德红外三维模型5'
      },
      {
        id: 6,
        name: '高德红外三维模型6'
      },
      {
        id: 7,
        name: '高德红外三维模型7'
      },
      {
        id: 8,
        name: '高德红外三维模型8'
      }
    ]
  },
  beforeDestroy () {
  },
  methods: {
    addCancel () {
      this.$router.push({ path: '/battleReview' })
    },
    addNext () {
      this.bNext = true
    },
    searchModel () {
      console.log('searchModel:', this.inputModelName)
    },
    selectModel (info) {
      this.modelInfo = info
      this.showPopover = false
    }
  }
}
</script>

<style lang="scss" scoped>
.addBattleMain {
  position: relative;
  height: 899px;
  margin-top: -5px;
  padding: 0 214px 0px 214px;
  .addBattleBox {
    position: relative;
    height: 882px;
    background: url(../../assets/images/fireBattle/reviewBox.png) no-repeat;
    background-size: 100% 100%;
    padding: 10px 32px 0px 32px;
    .addBattleHeader {
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
    .addBattleWork {
      width: 100%;
      height: 786px;
      display: flex;
      justify-content: center;
      align-items: center;
      .battleTotal {
        position: relative;
        width: 749px;
        height: 540px;
        border: 1px solid #00CCFF;
        background: linear-gradient(90deg, #08111F80, #13396380);
        .imgFlag {
          height: 16px;
          width: 26px;
          margin-right: 10px;
          display: inline-block;
          background-image: url(../../assets/images/drone/popupTitleImg.png);
          background-size: 100% 100%;
        }
        .titleText {
          font-size: 18px;
          color: #FFFFFF;
          height: 16px;
          line-height: 16px;
        }
        .selectModel {
          position: absolute;
          right: 30px;
          top: 16px;
          height: 16px;
          line-height: 16px;
          cursor: pointer;
          div:nth-child(1) {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url("../../assets/images/fireBattle/modelLink.png")
              no-repeat;
          }
          div:nth-child(2) {
            display: inline-block;
            margin-left: 10px;
            padding: 1px 0px;
            font-size: 12px;
            height: 16px;
            line-height: 16px;
            vertical-align: top;
            background: #27BCE5;
            border-radius: 2px;
          }
        }
        .itemComm {
          margin-left:51px;
          margin-top:15px;
          width:670px;
        }

        .btnComm {
          position: absolute;
          border: 1px solid #1EB0FC;
          border-radius: 4px;
          width: 87px;
          height: 32px;
          line-height: 32px;
          bottom: 30px;
          text-align: center;
          cursor: pointer;
        }
        .btnComm:active {
          opacity: 0.8;
        }
        .btnCancel {
          right: 137px;
          color: #1EB0FC;
        }
        .btnConfirm {
          right: 28px;
          background-color: #1EB0FC;
          color: #ffffff;
        }
      }
      .battleEvents {
        width: 749px;
        height: 540px;
        border: 1px solid #00CCFF;
        background: linear-gradient(90deg, #701e70, #133963);
        opacity: 0.5;
      }
    }
  }
}

.fireSelectStyle {
  width: 190px;
  height: 26px;
  font-size: 16px;
}

/* 输入框样式 */
.baseInfoInput {
  /deep/.el-input__inner {
    background-color: transparent;
    height: 26px;
    color: white;
    border-color: #1daffb;
    border-radius: 4px;
    font-size: 16px;
  }
}

.datePickerStyle {
  width: 305px;
  height: 26px;
  background-color: transparent;
  border-color: #39a4dd;
  vertical-align:top;
  padding: 3px 5px;
}
/deep/.el-date-editor .el-range-input {
  color: white;
  background: transparent;
  font-size: 12px;
}
/deep/.el-range-separator {
  color: white;
  font-size: 12px;
  line-height: 26px;
}
/deep/ .el-input__prefix,
/deep/ .el-input__icon {
  line-height: 26px;
}
/deep/ .el-date-editor .el-range__icon {
  margin-top: -8px;
}
/deep/ .el-date-editor .el-range-separator {
  margin-top: -8px;
}
/deep/ .el-date-editor .el-range__close-icon {
  margin-top: -8px;
}

.describeInputStyle {
  width: 590px;
  height: 52px;
  /deep/ .el-textarea__inner {
    height: 100%;
    background-color: transparent;
    border-radius: 4px;
    border: 1px solid #27bce5;
    color: #ffffff;
    line-height: 26px;
    overflow-y: hidden;
  }
}
.addressInputStyle {
  width: 590px;
  height: 26px;
}
.fireMap {
  width: 590px;
  height: 160px;
  display: inline-block;
}
</style>
