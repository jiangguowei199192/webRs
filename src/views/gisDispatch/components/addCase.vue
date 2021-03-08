<template>
  <el-dialog :visible="isShow" class="caseDlg">
    <div>
      <div class="title">新增案件</div>
      <el-form :model="caseForm" :inline="true" class="caseForm">
        <div class="step1">
          <span>1</span>
          <span>报案信息</span>
        </div>
        <el-form-item label="案件名称 :" prop="name">
          <el-input
            v-model="caseForm.name"
            :placeholder="placeholder"
            class="caseName"
          ></el-input>
        </el-form-item>
        <el-form-item label="案发时间 :" prop="time">
          <el-date-picker
            v-model="caseForm.time1"
            type="datetime"
            :placeholder="placeholder"
            class="timeStyle"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报警时间 :" prop="time" class="time">
          <el-date-picker
            v-model="caseForm.time2"
            type="datetime"
            :placeholder="placeholder"
            class="timeStyle"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="举报人 :" prop="people">
          <el-input
            v-model="caseForm.people"
            :placeholder="placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别 :" prop="sex" class="sex">
          <el-radio v-model="caseForm.sex" label="1">男</el-radio>
          <el-radio v-model="caseForm.sex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="身份证号 :" prop="id">
          <el-input v-model="caseForm.id" :placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item label="举报电话 :" prop="phone" class="time">
          <el-input
            v-model="caseForm.phone"
            :placeholder="placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item label="举报地址 :" prop="addr">
          <el-input
            v-model="caseForm.addr"
            :placeholder="placeholder"
            class="caseName"
          ></el-input>
        </el-form-item>
        <el-form-item label="    " prop="lon" class="map">
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
        <el-form-item label="案件描述 :" prop="des" class="des">
          <el-input
            v-model="caseForm.des"
            :placeholder="placeholder"
            type="textarea"
            resize="none"
          ></el-input>
        </el-form-item>
        <div class="step1">
          <span>2</span>
          <span>接案信息</span>
        </div>
        <el-form-item label="接警人 :" prop="addr" class="acceptPeople">
          <el-input
            v-model="caseForm.addr"
            :placeholder="placeholder"
          ></el-input>
        </el-form-item>
        <div class="step1">
          <span>3</span>
          <span>指派信息</span>
        </div>
        <el-form-item label="指派人 :">
          <el-select
            v-model="caseForm.peoples"
            multiple
            class="select"
            popper-class="people-selec-Popper"
          >
            <el-input
              v-model="search"
              class="search"
              :popper-append-to-body="false"
            >
              <i slot="suffix"></i
            ></el-input>
            <el-option
              v-for="(item, index) in peoples"
              :key="index"
              :value="item.id"
              :label="item.name"
            >
              <span class="check"></span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btns">
        <span @click.stop="cancel()">取消</span>
        <span>确定</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      search: '',
      caseForm: { sex: '', peoples: [] },
      placeholder: '请输入',
      peoples: [
        {
          name: '张三',
          id: 1
        },
        {
          name: '李四',
          id: 2
        }
      ]
    }
  },
  mounted () {},
  methods: {
    /**
     * 取消
     */
    cancel () {
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.caseDlg {
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
        margin-bottom: 14px;
      }
      .el-form-item__content {
        line-height: 26px;
      }
      .el-form-item__label {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #fefefe;
        width: 80px;
        padding: 0px 15px 0px 0px;
        line-height: 26px;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 190px;
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
      .caseName {
        .el-input__inner {
          width: 520px;
        }
      }
      .acceptPeople {
        margin-bottom: 33px;
        .el-input__inner {
          width: 330px;
        }
      }
      .time {
        margin-left: 50px;
      }
      .sex {
        margin-left: 50px;
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
        .el-input__inner {
          width: 330px;
        }
        .el-tag {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          background: #00d2ff;
          border-radius: 2px;
          border: none;
        }
        .el-tag .el-icon-close::before {
          display: none;
        }
        .el-tag__close.el-icon-close {
          height: 12px;
          width: 12px;
          background: url(../../../assets/images/gisDispatch/x.svg) no-repeat;
          background-size: 100% 100%;
          right: -0.07rem;
          top: 0;
          color: #fff;
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
