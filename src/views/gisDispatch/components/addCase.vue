<template>
  <el-dialog :visible="isShow" class="caseDlg browserScroll">
    <div>
      <gMap
        ref="gduMap"
        handleType="devMap"
        :bShowBasic="false"
        :bShowMeasure="false"
        :bShowLonLat="false"
        :bAutoLocate="false"
        :bUseimpleSearch="true"
        :baseMapIndex="2"
        @searchAddrOk="searchAddrOk"
        class="map"
      ></gMap>
      <div class="overlayer"></div>
      <div class="title">新增案件</div>
      <div class="formBox">
        <div class="form listScroll" ref="form">
          <el-form
            ref="caseForm"
            :model="caseForm"
            :inline="true"
            class="caseForm"
            :rules="formRules"
          >
            <div class="step1">
              <span>1</span>
              <span>报案信息</span>
            </div>
            <el-form-item label="案件名称 :" prop="caseName">
              <el-input
                v-model="caseForm.caseName"
                :placeholder="placeholder"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="案件来源 :" prop="infoSource" class="time">
              <el-select
                v-model="caseForm.infoSource"
                :popper-append-to-body="false"
                placeholder="请选择案件来源"
              >
                <el-option
                  v-for="item in caseSources"
                  :key="item.typeCode"
                  :label="item.typeName"
                  :value="item.typeCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案发时间 :" prop="caseStartTime">
              <el-date-picker
                v-model="caseForm.caseStartTime"
                type="datetime"
                :placeholder="placeholder"
                class="timeStyle"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="startTimeChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="报警时间 :" prop="reportTime" class="time">
              <el-date-picker
                v-model="caseForm.reportTime"
                type="datetime"
                :placeholder="placeholder"
                class="timeStyle"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="reportTimeChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="举报人 :" prop="reportMan">
              <el-input
                v-model="caseForm.reportMan"
                :placeholder="placeholder"
                maxlength="10"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别 :" class="sex" prop="reporterGender">
              <el-radio v-model="caseForm.reporterGender" label="男"
                >男</el-radio
              >
              <el-radio v-model="caseForm.reporterGender" label="女"
                >女</el-radio
              >
            </el-form-item>
            <el-form-item label="身份证号 :" prop="reporterIdentity">
              <el-input
                v-model="caseForm.reporterIdentity"
                :placeholder="placeholder"
              ></el-input>
            </el-form-item>
            <el-form-item label="举报电话 :" class="time" prop="reportTel">
              <el-tooltip
                effect="dark"
                :disabled="!stringIsNullOrEmpty(caseForm.reportTel)"
                content="示例：135XXXXXXXX或027（区号）12345678"
                placement="top"
                :open-delay="500"
              >
                <el-input
                  v-model.trim="caseForm.reportTel"
                  placeholder="示例：135XXXXXXXX或027（区号）12345678"
                  maxlength="11"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="举报地址 :" prop="reportAddr">
              <el-input
                v-model="caseForm.reportAddr"
                :placeholder="placeholder"
                class="caseName"
                maxlength="50"
                @change="reportAddrChange()"
              ></el-input>
            </el-form-item>
            <el-form-item label="案件描述 :" prop="caseDesc" class="des">
              <el-input
                v-model="caseForm.caseDesc"
                :placeholder="placeholder"
                type="textarea"
                resize="none"
                maxlength="200"
              ></el-input>
            </el-form-item>
            <div class="step1">
              <span>2</span>
              <span>接案信息</span>
            </div>
            <el-form-item
              label="接警人 :"
              prop="receivingAlarmMan"
              class="acceptPeople"
            >
              <el-input
                v-model="caseForm.receivingAlarmMan"
                :placeholder="placeholder"
                maxlength="10"
              ></el-input>
            </el-form-item>
            <div class="step1">
              <span>3</span>
              <span>指派信息</span>
            </div>
            <el-form-item label="指派人 :" prop="designateMan">
              <div class="select listScroll">
                <template v-for="(item, index) in selectList">
                  <div :key="index">
                    <EllipsisTooltip
                      :contentText="item.employeeName"
                      class="name"
                    ></EllipsisTooltip>
                    <span class="close" @click.stop="deleteSelect(item)"></span>
                  </div>
                </template>
              </div>
              <div class="userBox">
                <el-input
                  @change="getUserList()"
                  v-model="search"
                  class="search"
                  placeholder="请输入人员姓名/组织名称进行搜索"
                >
                  <i slot="suffix" @click="getUserList()"></i>
                </el-input>
                <i class="suffix" @click.stop="getUserList()"></i>
                <div class="list listScroll">
                  <template v-for="(item, index) in peoples">
                    <div :key="index">
                      <span
                        :class="{ check: item.isCheck }"
                        class="checkBox"
                        @click.stop="selectPeople(item)"
                      ></span>
                      <img src="../../../assets/images/gisDispatch/user.png" />
                      <EllipsisTooltip
                        :contentText="item.employeeName + ' ' + item.deptName"
                        class="name"
                      ></EllipsisTooltip>
                    </div>
                  </template>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btns">
        <span @click.stop="cancel()">取消</span>
        <span @click.stop="submit()">确定</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { isNotNull, checkPhone, checkIdcard } from '@/utils/formRules'
import { caseApi } from '@/api/case'
import EllipsisTooltip from '../../../components/ellipsisTooltip'
import assignMixin from '../mixins/assignMixin'
import { settingApi } from '@/api/setting'
import { formatDate } from '@/utils/date'
import { stringIsNullOrEmpty } from '@/utils/validate'
export default {
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  components: {
    EllipsisTooltip
  },
  mixins: [assignMixin],
  data () {
    return {
      addCase: false,
      caseSources: [],
      isInit: false,
      formRules: {
        caseName: [{ required: true, message: '请输入案件名称' }],
        caseStartTime: [{ required: true, message: '请选择案发时间' }],
        reportTime: [{ required: true, message: '请选择报警时间' }],
        reportMan: [{ required: true, message: '请输入举报人' }],
        reportAddr: [{ required: true, message: '请输入举报地址' }],
        caseDesc: [{ required: true, message: '请输入案件描述' }],
        infoSource: [{ required: true, message: '请选择案件来源' }],
        receivingAlarmMan: [{ required: true, message: '请输入接警人' }],
        longitude: isNotNull('请点选案件经纬度位置'),
        reportTel: isNotNull('请输入举报电话').concat(checkPhone()),
        reporterIdentity: [checkIdcard()]
      },
      caseForm: {
        reporterGender: '',
        reporterIdentity: '',
        designateMan: '',
        caseDesc: '',
        caseName: '',
        caseStartTime: '',
        reportMan: '',
        reportAddr: '',
        reportTime: '',
        receivingAlarmMan: '',
        latitude: '',
        longitude: '',
        reportTel: '',
        infoSource: ''
      },
      placeholder: '请输入'
    }
  },
  watch: {
    isShow (val) {
      if (val) {
        this.caseForm.longitude = ''
        this.caseForm.latitude = ''
        this.selectList = []
        this.peoples = []
        this.caseForm.caseStartTime = formatDate(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        )
        this.caseForm.reportTime = this.caseForm.caseStartTime
        this.$nextTick(() => {
          this.$refs.form.scrollTop = 0
        })
        setTimeout(() => {
          if (!this.isInit) {
            this.isInit = true
            this.$refs.gduMap.map2D.clickEvent.addEventListener(
              this.mapClickCallback.bind(this)
            )
          }
          this.$refs.gduMap.resetSearchText()
          this.$refs.gduMap.map2D.customMarkerLayerManager.clear()
          this.$refs.gduMap.map2D._map.updateSize()
          this.$refs.gduMap.map2D.zoomToCenter(114.3208895, 30.6183919)
          this.$refs.gduMap.map2D.setZoom(15)
        }, 200)
        this.getUserList()
        this.getCaseSources()
      } else {
        this.$refs.caseForm.resetFields()
      }
    }
  },
  mounted () {},
  methods: {
    stringIsNullOrEmpty,
    getMembersDone () {
      this.peoples.forEach((c) => {
        this.selectPeople(c)
      })
    },
    /**
     * 举报地址改变
     */
    reportAddrChange () {
      this.$refs.gduMap.simpleSearchAddrs(this.caseForm.reportAddr, false)
    },
    /**
     * 地址搜索成功
     */
    searchAddrOk (lon, lat) {
      this.caseForm.longitude = lon
      this.caseForm.latitude = lat
      // this.$refs.caseForm.validateField('longitude', (valid) => {})
    },
    /**
     * 案发时间改变
     */
    startTimeChange () {
      if (!this.caseForm.reportTime || !this.caseForm.caseStartTime) return
      const time = new Date(this.caseForm.caseStartTime).getTime()
      const report = new Date(this.caseForm.reportTime).getTime()
      if (report < time) {
        this.caseForm.caseStartTime = ''
        this.$notify.closeAll()
        this.$notify.info({
          title: '提示',
          message: '当前所选时间已晚于案件报警时间，请重新选择'
        })
      }
    },
    /**
     * 报警时间改变
     */
    reportTimeChange () {
      if (!this.caseForm.reportTime || !this.caseForm.caseStartTime) return
      const time = new Date(this.caseForm.caseStartTime).getTime()
      const report = new Date(this.caseForm.reportTime).getTime()
      if (report < time) {
        this.caseForm.reportTime = ''
        this.$notify.closeAll()
        this.$notify.info({
          title: '提示',
          message: '当前所选时间已早于报警时间，请重新选择'
        })
      }
    },
    /**
     * 获取案件来源
     */
    getCaseSources () {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: 'caseSources' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.caseSources = res.data.data.filter((s) => s.status === 0)
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    },
    /**
     * 点击地图回调事件
     */
    mapClickCallback (lonlat) {
      const tmpMap = this.$refs.gduMap.map2D
      this.caseForm.longitude = lonlat[0]
      this.caseForm.latitude = lonlat[1]
      // this.$refs.caseForm.validateField('longitude', (valid) => {})
      tmpMap.customMarkerLayerManager.clear()
      tmpMap.customMarkerLayerManager.addMarker({
        name: null,
        lon: lonlat[0],
        lat: lonlat[1],
        _bWgs2Gcj: false
      })
    },
    /**
     * 取消
     */
    cancel () {
      this.$emit('update:isShow', false)
    },
    /**
     * 新增案件
     */
    submit () {
      this.caseForm.caseName = this.caseForm.caseName.trim()
      this.caseForm.caseName = this.caseForm.reportMan.trim()
      this.caseForm.reportAddr = this.caseForm.reportAddr.trim()
      this.caseForm.caseDesc = this.caseForm.caseDesc.trim()
      this.caseForm.receivingAlarmMan = this.caseForm.receivingAlarmMan.trim()
      let v = false
      this.$refs.caseForm.validate((valid) => {
        v = valid
      })
      if (!v || this.addCase) return

      if (!this.caseForm.longitude) {
        this.$notify.closeAll()
        this.$notify.info({
          title: '提示',
          message:
            '当前案件地址未在地图上找到对应位置，请在地图上选点标识或重新输入'
        })
        return
      }

      this.caseForm.designateMan = ''
      this.addCase = true
      if (this.selectList.length > 0) {
        for (let i = 0; i < this.selectList.length; i++) {
          const s =
            i === this.selectList.length - 1
              ? this.selectList[i].employeeId
              : this.selectList[i].employeeId + ','
          this.caseForm.designateMan += s
        }
      }
      this.$axios
        .post(caseApi.caseAdd, this.caseForm, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          this.addCase = false
          if (res && res.data && res.data.code === 0) {
            this.$emit('addCaseOK')
          }
        })
        .catch((err) => {
          this.addCase = false
          console.log('caseApi.caseAdd Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.caseDlg {
  pointer-events: auto;
  font-size: 13px;
  /deep/.el-dialog {
    width: 1100px;
    height: 690px;
    border: 1px solid #00a7e8;
    overflow: hidden;
    margin-top: 32px !important;
    margin-bottom: 0px;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      width: 100%;
      height: 100%;
      padding: 0px;
      box-sizing: border-box;
      position: relative;
      background-color: rgba($color: #004157, $alpha: 0.85);
    }
    .map {
      width: 100%;
      height: 617px;
    }
    .overlayer {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 103px;
      background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
      opacity: 0.7;
      pointer-events: none;
    }
    .title {
      position: absolute;
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #fefefe;
      left: 20px;
      line-height: 30px;
      top: 20px;
      padding-left: 17px;
    }
    .el-form {
      .el-form-item {
        height: 26px;
        margin-bottom: 18px;
      }
      .el-form-item__content {
        line-height: 26px;
      }
      .el-form-item__label {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #fefefe;
        width: 100px;
        padding: 0px 10px 0px 0px;
        line-height: 26px;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 160px;
      }
      .el-input--suffix .el-input__inner {
        padding-right: 20px;
      }
      .el-input__inner {
        color: #00caf6;
        width: 160px;
        height: 26px;
        line-height: 26px;
        border: 1px solid #00d2ff;
        border-radius: 0px;
        background-color: rgba($color: #09546d, $alpha: 0.85);
      }
      .el-input__icon {
        line-height: 26px;
      }
      .el-textarea .el-textarea__inner {
        color: #00caf6;
        width: 430px;
        height: 80px;
        border: 1px solid #00d2ff;
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-radius: 0px;
      }
    }
    .formBox {
      width: 540px;
      height: 462px;
      padding-top: 14px;
      position: absolute;
      top: 58px;
      right: 0px;
      background-color: rgba($color: #004157, $alpha: 0.85);
      box-sizing: border-box;
      .form {
        height: 434px;
        overflow-y: auto;
      }
    }
    .caseForm {
      .step1 {
        margin-left: 21px;
        margin-bottom: 11px;
        span:nth-child(1) {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #00d2ff;
          border-radius: 50%;
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #fefefe;
          text-align: center;
        }
        span:nth-child(2) {
          margin-left: 15px;
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #00d2ff;
          line-height: 24px;
        }
      }
      .acceptPeople {
        margin-bottom: 33px;
      }
      .time {
        margin-right: 0px;
      }
      .sex {
        .el-radio {
          color: #00caf6;
          margin-right: 28px;
          .el-radio__inner {
            width: 12px;
            height: 12px;
            background: transparent;
            border: 1px solid #00d2ff;
          }
          .el-radio__inner::after {
            width: 6px;
            height: 6px;
            background-color: #00d2ff;
          }
        }
        .el-radio__input.is-checked + .el-radio__label {
          color: #00caf6;
        }
      }
      .des {
        height: 80px;
        margin-bottom: 27px;
        margin-right: 0px;
      }
      .timeStyle {
        .el-input__prefix {
          display: none;
        }
        .el-input__inner {
          padding: 0px 10px;
        }
        .el-input__suffix {
          right: -2px;
          .el-input__icon {
            color: #00d1fe;
          }
        }
      }
      .select {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        overflow-y: auto;
        height: 80px;
        width: 326px;
        border: 1px solid #00d2ff;
        > div {
          box-sizing: border-box;
          width: 70px;
          height: 20px;
          margin-top: 3px;
          margin-bottom: 3px;
          background: #00d2ff;
          border-radius: 2px;
          position: relative;
          margin-left: 5px;
          margin-right: 5px;
          display: flex;
          align-items: center;
          padding-left: 5px;
        }
        .name {
          display: inline-block;
          font-size: 14px;
          color: #fff;
          width: 50px;
          height: 20px;
          line-height: 20px;
        }
        .close {
          display: inline-block;
          height: 8px;
          width: 8px;
          background: url(../../../assets/images/gisDispatch/x.svg) no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          position: absolute;
          right: 3px;
        }
      }
      .userBox {
        box-sizing: border-box;
        border: 1px solid #00d2ff;
        border-top: none;
        padding-left: 10px;
        width: 326px;
        position: relative;
        .suffix {
          position: absolute;
          width: 16px;
          height: 21px;
          background: url("../../../assets/images/gisDispatch/search.svg");
          background-size: 100% 100%;
          top: 15px;
          right: 14px;
          cursor: pointer;
        }
        .suffix:active {
          background: url("../../../assets/images/gisDispatch/search-press.svg");
          background-size: 100% 100%;
        }
        .search {
          margin-top: 10px;
          box-sizing: border-box;
          .el-input__suffix {
            width: 16px;
            height: 21px;
            background: url("../../../assets/images/gisDispatch/search.svg");
            background-size: 100% 100%;
            top: 4px;
            right: 14px;
          }
          .el-input__inner {
            width: 306px;
            color: #fff;
            height: 30px;
            line-height: 30px;
            border: 1px solid #00d2ff;
            border-radius: 0px;
            background: transparent;
          }
        }
        .list {
          box-sizing: border-box;
          margin-top: 6px;
          height: 168px;
          overflow-y: auto;
          > div {
            display: flex;
            box-sizing: border-box;
            margin-top: 8px;
            height: 20px;
            align-items: center;
            .name {
              font-size: 14px;
              color: #fff;
              width: 250px;
              height: 20px;
              line-height: 20px;
            }
            img {
              width: 12px;
              height: 18px;
              margin-right: 12px;
            }
            .checkBox {
              display: inline-block;
              width: 14px;
              height: 14px;
              cursor: pointer;
              background: url(../../../assets/images/gisDispatch/uncheck.svg)
                no-repeat;
              background-size: 100% 100%;
              margin-right: 14px;
            }
            .checkBox.check {
              background: url(../../../assets/images/gisDispatch/check.svg)
                no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .btns {
      position: absolute;
      bottom: 21px;
      right: 21px;
      span {
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background: transparent;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #1eb0fc;
      }
      span:active {
        opacity: 0.8;
        color: #1eb0fc;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
}
</style>
