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
                       :key="item.enterpriseId"
                       @click="selectModel(item)"
                  >{{ item.enterpriseName }}</div>
                </div>
              </div>
              <div slot="reference" class="selectModel" title="关联三维预案">
                <div></div>
                <div>{{ selectModelName }}</div>
              </div>
            </el-popover>
          </div>
          <el-form
            ref="addBattleRef"
            :inline="true"
            :model="fireData"
            :rules="addBattleRules"
          >
            <div class="itemComm">
              <span style="color:red;">*</span>
              <span style="margin-right:15px">火灾名称</span>
              <el-form-item prop="fireItem">
                <el-select
                  v-model="fireData.fireItem"
                  placeholder="请选择火灾"
                  class="fireSelectStyle baseInfoInput"
                >
                  <el-option
                    v-for="item in fireList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <span style="margin-left:15px;color:red;">*</span>
              <span style="margin-right:15px;">火灾时间</span>
              <el-form-item prop="dateRange">
                <el-date-picker
                  v-model="fireData.dateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="datePickerStyle baseInfoInput"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="itemComm">
              <span style="color:red;vertical-align:top;">*</span>
              <span style="margin-right:15px;vertical-align:top;">火灾描述</span>
              <el-form-item prop="fireDescribe">
                <el-input type="textarea"
                          resize="none"
                          v-model="fireData.fireDescribe"
                          maxlength="200"
                          class="describeInputStyle"
                ></el-input>
              </el-form-item>
            </div>
            <div class="itemComm">
              <span style="color:red;">*</span>
              <span style="margin-right:15px;vertical-align:top;">火灾地址</span>
              <el-form-item prop="fireAddress">
                <el-input v-model="fireData.fireAddress"
                          class="addressInputStyle baseInfoInput"
                ></el-input>
              </el-form-item>
            </div>
            <div class="itemComm">
              <span style="color:red;vertical-align:top;">*</span>
              <span style="margin-right:15px;vertical-align:top;">火灾经纬</span>
              <el-form-item prop="lonLat">
                <div class="fireMap">
                  <gMap
                    ref="gduMap"
                    handleType="devMap"
                    :bShowSimpleSearchTools="true"
                    :bMiniSearchStyle="true"
                    :bShowBasic="false"
                    :bShowMeasure="false"
                    :bAutoLocate="false"
                    :bShowLonLat="false"
                  ></gMap>
                </div>
              </el-form-item>
            </div>
            <div style="margin-left:15px;margin-top:25px;">
              <div class="imgFlag"></div>
              <span class="titleText">出勤总数</span>
            </div>
            <div class="itemComm">
              <span style="color:red;">*</span>
              <span style="margin-right:15px">出勤车辆</span>
              <el-form-item prop="attendanceVehicle">
                <el-input type="number"
                          v-model="fireData.attendanceVehicle"
                          @blur="fireData.attendanceVehicle = onlyPositiveInt(fireData.attendanceVehicle)"
                          style="width:112px;"
                          class="baseInfoInput"
                ></el-input>
              </el-form-item>
              <span style="margin-left:31px;color:red;">*</span>
              <span style="margin-right:15px">出勤人数</span>
              <el-form-item prop="attendancePeople">
                <el-input type="number"
                          v-model="fireData.attendancePeople"
                          @blur="fireData.attendancePeople = onlyPositiveInt(fireData.attendancePeople)"
                          style="width:112px;"
                          class="baseInfoInput"
                ></el-input>
              </el-form-item>
              <span style="margin-left:31px;color:red;">*</span>
              <span style="margin-right:15px">出勤无人机</span>
              <el-form-item prop="attendanceUav">
                <el-input type="number"
                          v-model="fireData.attendanceUav"
                          @blur="fireData.attendanceUav = onlyPositiveInt(fireData.attendanceUav)"
                          style="width:112px;"
                          class="baseInfoInput"
                ></el-input>
              </el-form-item>
            </div>
            <div class="itemComm">
              <span style="color:red;">*</span>
              <span style="margin-right:15px">受灾面积</span>
              <el-form-item prop="damageArea">
                <el-input type="number"
                          v-model="fireData.damageArea"
                          @blur="fireData.damageArea = onlyPositiveFloat(fireData.damageArea)"
                          style="width:112px;"
                          class="baseInfoInput"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div class="btnComm disable-user-select btnCancel" @click="addCancel">取消</div>
          <div class="btnComm disable-user-select btnConfirm" @click="addNext">下一步</div>
        </div>
        <commentStep2 v-show="bNext" :combatId="combatId"></commentStep2>
      </div>
    </div>
  </div>
</template>

<script>
import { isNotNull, limitLength } from '@/utils/validate'
import commentStep2 from './commentStep2.vue'
import { battleApi } from '@/api/battle'
import { timeFormat } from '@/utils/date'
export default {
  name: 'addBattle',
  data () {
    return {
      combatId: 0,
      showPopover: false,
      inputModelName: '',
      selectModelName: '',
      modelList: [],
      bNext: false,
      fireList: [],
      fireData: {
        fireItem: '',
        fireId: '',
        fireName: '',
        // dateRange: [new Date(), new Date()],
        dateRange: '',
        fireTimeStart: '',
        fireTimeEnd: '',
        fireDescribe: '',
        fireAddress: '',
        lonLat: '',
        fireLongitude: '',
        fireLatitude: '',
        attendanceVehicle: '',
        attendancePeople: '',
        attendanceUav: '',
        damageArea: '',
        enterpriseId: '',
        enterpriseName: ''
      },
      addBattleRules: {
        fireItem: isNotNull('请选择火灾名称'),
        dateRange: isNotNull('请输入火灾时间'),
        fireDescribe: isNotNull('请输入火灾描述'),
        fireAddress: isNotNull('请输入火灾地址').concat(limitLength(1, 60)),
        lonLat: isNotNull('请点选火灾经纬度位置'),
        attendanceVehicle: isNotNull('请输入总车辆'),
        attendancePeople: isNotNull('请输入总人数'),
        attendanceUav: isNotNull('请输入总无人机数'),
        damageArea: isNotNull('请输入受灾面积')
      }
    }
  },
  components: {
    commentStep2
  },

  mounted () {
    const tmpMap = this.$refs.gduMap.map2D
    tmpMap.clickEvent.addEventListener((lonlat) => {
      this.fireData.lonLat = lonlat
      this.fireData.fireLongitude = lonlat[0]
      this.fireData.fireLatitude = lonlat[1]
      const tmpName = this.fireData.fireAddress === '' ? null : this.fireData.fireAddress
      tmpMap.customMarkerLayerManager.clear()
      tmpMap.customMarkerLayerManager.addMarker({
        name: tmpName,
        lon: lonlat[0],
        lat: lonlat[1],
        _bWgs2Gcj: false
      })
    })

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
    this.getEnterpriseModelList()
  },
  beforeDestroy () {
  },
  methods: {
    // 获取火灾列表
    getFireCaseList () {
      const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
      this.$axios.post(battleApi.getFireCaseList, { }, config).then(res => {
        if (res.data.code === 0) {
          if (res.data.code === 0 && res.data.data) {
            const tmpDatas = res.data.data
            console.log('getFireCaseList:', tmpDatas)
          }
        }
      }).catch((error) => {
        console.log('battleApi.getFireCaseList Err : ' + error)
      })
    },
    // 获取三维预案列表
    getEnterpriseModelList (name = '') {
      this.modelList = []
      this.$axios.post(battleApi.getEnterprise3dInfoList, { enterpriseName: name }).then(res => {
        if (res.data.code === 0) {
          if (res.data.code === 0 && res.data.data) {
            this.modelList = res.data.data
            console.log('getEnterpriseModelList:', this.modelList)
          }
        }
      }).catch((error) => {
        console.log('battleApi.getEnterprise3dInfoList Err : ' + error)
      })
    },
    // 取消，回退到战评列表页面
    addCancel () {
      this.$router.push({ path: '/battleReview' })
    },
    // 新增一个战评并显示新增事件页面
    addNext () {
      this.$refs.addBattleRef.validate((valid) => {
        if (!valid) return

        this.fireData.fireId = this.fireData.fireItem.id
        this.fireData.fireName = this.fireData.fireItem.name
        this.fireData.fireTimeStart = timeFormat(this.fireData.dateRange[0])
        this.fireData.fireTimeEnd = timeFormat(this.fireData.dateRange[1])
        console.log('addNewBattleReview.fireData:', this.fireData)
        const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
        this.$axios.post(battleApi.addNewBattleReview, this.fireData, config).then(res => {
          if (res.data.code === 0) {
            console.log('addNewBattleReview.Ok:', res)
            this.combatId = res.data.data
            this.bNext = true
          } else {
            console.log('addNewBattleReview.Err:', res)
          }
        }).catch((error) => {
          console.log('battleApi.addNewBattleReview Err : ' + error)
        })
      })
    },
    // 搜索三维预案
    searchModel () {
      this.getEnterpriseModelList(this.inputModelName)
    },
    // 选择一个三维预案
    selectModel (info) {
      this.selectModelName = info.enterpriseName
      this.fireData.enterpriseId = info.enterpriseId
      this.fireData.enterpriseName = info.enterpriseName
      this.showPopover = false
    },
    // 限制输入框输入大于等于0的整数
    onlyPositiveInt (value) {
      if (value !== '' && value !== undefined && value !== null) {
        const val = value
        const newValue = val.toString().replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        return Math.abs(parseInt(newValue === '' ? 0 : newValue))
      } else return ''
    },
    // 限制输入框输入大于等于0的浮点数
    onlyPositiveFloat (value) {
      if (value !== '' && value !== undefined && value !== null) {
        return Math.abs(parseFloat(value))
      } else return ''
    },
    // 获取地图中选择的经纬度，没有选择时返回null
    getSelectedLocation () {
      const tmpMap = this.$refs.gduMap
      const tmpFs = tmpMap.map2D.customMarkerLayerManager._source.getFeatures()
      if (tmpFs.length > 0) {
        return tmpFs[0].getGeometry().getCoordinates()
      } else {
        return null
      }
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
          bottom: 16px;
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
  width: 179px;
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
  width: 584px;
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
  width: 584px;
  height: 26px;
}
.fireMap {
  width: 584px;
  height: 160px;
  display: inline-block;
}

/deep/ .el-form--inline .el-form-item {
  margin-right: 0px;
}
/deep/ .el-form-item {
  margin-bottom: 0px;
  .el-form-item__content {
    line-height: 26px;
    .el-input__inner {
      border-color: #1daffb;
    }
    .el-form-item__error {
      padding-top: 2px;
    }
  }
}
</style>
