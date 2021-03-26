<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="add-people-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
    </div>
    <el-form
      ref="addPeopleRef"
      :model="addPeopleForm"
      :rules="addPeopleRules"
      :inline="true"
      class="add-people-form"
    >
      <el-form-item label="姓名 :" prop="name">
        <el-input v-model="addPeopleForm.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="性别 :" prop="six">
        <el-select
          v-model="addPeopleForm.six"
          :popper-append-to-body="false"
          placeholder="请选择"
        >
          <el-option
            v-for="item in sixTypes"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号 :" prop="idcard">
        <el-input
          v-model="addPeopleForm.idcard"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式 :" prop="phone">
        <el-input v-model="addPeopleForm.phone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属机构 :" prop="dept">
        <el-cascader
          v-model="addPeopleForm.dept"
          :options="deptTree"
          :props="{
            expandTrigger: 'hover',
            label: 'deptName',
            value: 'deptCode',
            checkStrictly: true,
            emitPath: false
          }"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="办公电话 :" prop="telphone">
        <el-input
          v-model="addPeopleForm.telphone"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序 :" prop="num">
        <el-input v-model="addPeopleForm.num" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注 :" prop="note">
        <el-input
          v-model="addPeopleForm.note"
          placeholder="请输入"
          type="textarea"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">确定</div>
      <div class="cancel-btn" @click="cancelClick">取消</div>
    </div>
  </el-dialog>
</template>

<script>
import { numberValidate, checkPhone, checkIdcard } from '@/utils/formRules'

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    deptTree: {
      type: Array,
      required: true
    },
    peopleInfo: {
      type: Object,
      required: false
    }
  },
  watch: {
    isShow (newS) {
      if (!newS) {
        if (this.$refs.addPeopleRef) {
          this.$refs.addPeopleRef.resetFields()
        }
      }
    },
    peopleInfo (newP) {
      if (newP) {
        this.addPeopleForm.name = newP.employeeName
        this.addPeopleForm.six = newP.employeeGender
        this.addPeopleForm.idcard = newP.employeeIdentity
        this.addPeopleForm.phone = newP.employeeTel
        this.addPeopleForm.dept = newP.deptCode
        this.addPeopleForm.telphone = newP.officePhone
        this.addPeopleForm.num = newP.employeeSort
        this.addPeopleForm.note = newP.employeeRemark
      }
    }
  },
  data () {
    return {
      addPeopleForm: {
        name: '',
        six: '',
        idcard: '',
        phone: '',
        dept: '',
        telphone: '',
        num: '',
        note: ''
      },
      addPeopleRules: {
        name: [{ required: true, message: '请输入' }],
        dept: [{ required: true, message: '请选择' }],
        idcard: [checkIdcard()],
        phone: [checkPhone()],
        telphone: numberValidate('请输入正确的办公电话'),
        num: numberValidate('请输入数字')
      },
      sixTypes: [
        {
          id: '男',
          label: '男'
        },
        {
          id: '女',
          label: '女'
        }
      ]
    }
  },
  methods: {
    confirmClick () {
      this.$refs.addPeopleRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.$emit('confirmClick', this.addPeopleForm)
      })
    },

    cancelClick () {
      this.$emit('cancelClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-people-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 520px;
    background-color: transparent;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: rgba(0, 65, 87, 0.85);
      .add-people-header {
        height: 40px;
        border-bottom: 1px solid #1eb0fc;
        .header-icon {
          display: inline-block;
          width: 19px;
          height: 16px;
          background-image: url("../../../assets/images/fire_title.png");
          background-size: 100% 100%;
          margin-top: 15px;
        }
        .header-text {
          display: inline-block;
          vertical-align: top;
          margin-top: 13px;
          margin-left: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
    .add-people-form {
      margin-top: 35px;
      .el-input__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 150px;
        height: 24px;
        color: #fff;
        font-size: 12px;
      }
      .el-form-item {
        margin-top: -20px;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
        width: 100px;
      }
      .el-form-item__error {
        margin-top: -10px;
      }
      .el-textarea__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 408px;
        height: 78px;
        color: #fff;
        font-size: 12px;
        margin-top: 8px;
      }
      .subtext1 {
        color: #fff;
        font-size: 12px;
        width: 180px;
      }
    }
    .note {
      margin-top: 20px;
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.6);
    }
    .confirm-tool {
      height: 50px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
