<template>
  <el-dialog :visible="isShow" class="caseDlg browserScroll">
    <div>
      <div class="title">新增案件</div>
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
        <el-form-item label="案件来源 :" class="time" prop="infoSource">
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
          <el-radio v-model="caseForm.reporterGender" label="男">男</el-radio>
          <el-radio v-model="caseForm.reporterGender" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="身份证号 :" prop="reporterIdentity">
          <el-input
            v-model="caseForm.reporterIdentity"
            :placeholder="placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item label="举报电话 :" class="time" prop="reportTel">
          <el-input
            v-model="caseForm.reportTel"
            :placeholder="placeholder"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="举报地址 :" prop="reportAddr">
          <el-input
            v-model="caseForm.reportAddr"
            :placeholder="placeholder"
            class="caseName"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="    " prop="longitude" class="map">
          <div class="mapBox">
            <gMap
              ref="gduMap"
              handleType="devMap"
              :bShowSimpleSearchTools="true"
              :bShowBasic="false"
              :bShowMeasure="false"
              :bShowLonLat="false"
              :bAutoLocate="false"
            ></gMap>
          </div>
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
              <i slot="suffix"></i
            ></el-input>
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
      <div class="btns">
        <span @click.stop="cancel()">取消</span>
        <span @click.stop="submit()">确定</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { isNotNull, checkPhone } from '@/utils/formRules'
import { caseApi } from '@/api/case'
import EllipsisTooltip from '../../../components/ellipsisTooltip'
import assignMixin from '../mixins/assignMixin'
import { settingApi } from '@/api/setting'
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
        reportTel: [checkPhone()]
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
        this.selectList = []
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
        }, 200)
        this.getUserList()
        this.getCaseSources()
      } else {
        this.$refs.caseForm.resetFields()
      }
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 案发时间改变
     */
    startTimeChange () {
      if (!this.caseForm.caseStartTime) return
      const time = new Date(this.caseForm.caseStartTime).getTime()
      const report = new Date(this.caseForm.reportTime).getTime()
      if (report <= time) {
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
      if (!this.caseForm.reportTime) return
      const time = new Date(this.caseForm.caseStartTime).getTime()
      const report = new Date(this.caseForm.reportTime).getTime()
      if (report <= time) {
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
            this.caseSources = res.data.data.filter(s => s.status === 0)
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
      let v = false
      this.$refs.caseForm.validate((valid) => {
        v = valid
      })
      if (!v) return
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
          if (res && res.data && res.data.code === 0) {
            this.$emit('addCaseOK')
          }
        })
        .catch((err) => {
          console.log('caseApi.caseAdd Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.caseDlg {
  pointer-events: auto;
  font-size: 14px;
  /deep/.el-dialog {
    width: 710px;
    overflow: hidden;
    margin-top: 32px !important;
    margin-bottom: 0px;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      height: 1022px;
      padding: 22px 22px 19px 22px;
      border: 1px solid #00a7e8;
      box-sizing: border-box;
      background-color: rgba($color: #004157, $alpha: 0.85);
    }
    .title {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #fefefe;
      padding-left: 17px;
      line-height: 30px;
      margin-bottom: 27px;
    }
    .el-form {
      .el-form-item {
        margin-bottom: 0.22rem;
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
        padding: 0px 15px 0px 0px;
        line-height: 26px;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 190px;
      }
      .el-input--suffix .el-input__inner {
        padding-right: 20px;
      }
      .el-input__inner {
        color: #00caf6;
        width: 190px;
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
        width: 520px;
        height: 80px;
        border: 1px solid #00d2ff;
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-radius: 0px;
      }
    }
    .caseForm {
      .step1 {
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
        }
      }
      .acceptPeople {
        margin-bottom: 33px;
        .el-input__inner {
          width: 330px;
        }
      }
      .time {
        margin-left: 30px;
      }
      .sex {
        margin-left: 30px;
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
      .map {
        height: 110px;
        .mapBox {
          width: 520px;
          height: 110px;
        }
      }
      .des {
        height: 80px;
        margin-bottom: 27px;
      }
      .select {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        overflow-y: auto;
        height: 28px;
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
      bottom: 29px;
      right: 53px;
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
