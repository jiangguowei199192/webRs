<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="540px"
    class="role-info-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">查看角色</div>
    </div>
    <el-form
      :model="roleInfoForm"
      :inline="true"
      label-width="80px"
      class="add-people-form"
    >
      <el-form-item label="角色名称:" prop="roleName">
        <div class="subtext1">{{ roleInfoForm.roleName }}</div>
      </el-form-item>
      <el-form-item label="排序:" prop="num">
        <div class="subtext1">{{ roleInfoForm.num }}</div>
      </el-form-item>
      <el-form-item label="备注:" prop="beizhu">
        <div class="subtext1">{{ roleInfoForm.beizhu }}</div>
      </el-form-item>
    </el-form>
    <div class="note">
      <div>
        <span>创建时间：{{roleInfoForm.createTime}}</span>
        <span style="display: inline-block; margin-left: 20px"
          >创建人：{{roleInfoForm.createUserName}}</span
        >
      </div>
      <div style="margin-top: 10px">
        <span>最后修改时间：{{roleInfoForm.updateTime}}</span>
        <span style="display: inline-block; margin-left: 20px"
          >最后修改人：{{roleInfoForm.updateUserName}}</span
        >
      </div>
    </div>
    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">关闭</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: [
    'isShow',
    'roleInfo'
  ],
  data () {
    return {
      roleInfoForm: {
        roleName: '角色1',
        num: '1',
        beizhu: '备注备注备注备注备注',
        createTime: '',
        createUserName: '',
        updateTime: '',
        updateUserName: ''
      }
    }
  },
  watch: {
    roleInfo (newRI) {
      if (newRI) {
        this.roleInfoForm.roleName = newRI.roleName
        this.roleInfoForm.num = newRI.roleSort
        this.roleInfoForm.beizhu = newRI.roleDescribe
        this.roleInfoForm.createTime = newRI.createTime
        this.roleInfoForm.createUserName = newRI.createUserName
        this.roleInfoForm.updateTime = newRI.updateTime
        this.roleInfoForm.updateUserName = newRI.updateUserName
      }
    }
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.role-info-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .add-people-header {
        height: 40px;
        border-bottom: 1px solid #1eb0fc;
        .header-icon {
          display: inline-block;
          width: 22px;
          height: 16px;
          background-image: url("../../../assets/images/fire_title.png");
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
      border-bottom: 1px solid rgba($color: #1eb0fc, $alpha: 0.6);
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
      }
      .el-form-item__error {
        margin-top: -10px;
      }
      .el-textarea__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
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
      margin-top: 20px;
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
    }
  }
}
</style>
