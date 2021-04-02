<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    class="add-role-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
    </div>

    <el-form
      ref="addRoleRef"
      :model="addRoleFrom"
      :rules="addRoleRules"
      :inline="true"
      class="add-people-form"
    >
      <el-form-item label="角色名称 :" prop="roleName">
        <el-input v-model="addRoleFrom.roleName" maxlength="20"></el-input>
      </el-form-item>

      <el-form-item label="排序 :" prop="num">
        <el-input v-model="addRoleFrom.num"></el-input>
      </el-form-item>

      <el-form-item label="备注 :" prop="note">
        <el-input
          v-model="addRoleFrom.note"
          type="textarea"
          resize="none"
          maxlength="500"
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
export default {
  props: ['isShow', 'title', 'roleInfo'],
  data () {
    return {
      addRoleFrom: {
        roleName: '',
        num: '',
        note: ''
      },
      addRoleRules: {
        roleName: [{ required: true, message: '请输入' }]
      }
    }
  },
  watch: {
    isShow (newS) {
      if (!newS) {
        if (this.$refs.addRoleRef) {
          this.$refs.addRoleRef.resetFields()
        }
      }
    },
    roleInfo (newR) {
      if (newR) {
        this.addRoleFrom.roleName = newR.roleName
        this.addRoleFrom.num = newR.roleSort
        this.addRoleFrom.note = newR.roleDescribe
      }
    }
  },
  methods: {
    confirmClick () {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.$emit('confirmClick', this.addRoleFrom, this.roleInfo)
      })
    },

    cancelClick () {
      this.$emit('cancelClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-role-dlg.el-dialog__wrapper {
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
