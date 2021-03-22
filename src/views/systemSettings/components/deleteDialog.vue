<template>
  <el-dialog
    :visible="isShow"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="328px"
    class="delete-tip-dial"
  >
    <div>
      <div style="margin-top: 47px; height: 14px">
        <div class="warning-img"></div>
        <div class="title1">您确认删除这些数据吗？</div>
      </div>
      <div class="title2">
        <span style="color: #ff0000">删除后无法撤销，</span>
        <span style="color: #ffffff">您还要继续吗？</span>
      </div>
      <div style="margin-top: 21px">
        <div class="confirm-btn" @click="confirmClick">确定</div>
        <div class="cancel-btn" @click="cancelClick">取消</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    },

    cancelClick () {
      this.$emit('cancelClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.delete-tip-dial.el-dialog__wrapper {
  /deep/.el-dialog {
    background-color: transparent;
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      display: inline-block;
      padding: 0;
      width: 100%;
      height: 155px;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .warning-img {
        background-image: url("../../../assets/images/backgroundManagement/warning.png");
        width: 15px;
        height: 14px;
        display: inline-block;
        vertical-align: top;
        margin-left: 42px;
      }
      .title1 {
        color: #ffffff;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        display: inline-block;
        vertical-align: top;
        margin-left: 13px;
      }
      .title2 {
        margin-left: 70px;
        height: 14px;
        font-size: 14px;
        line-height: 14px;
        margin-top: 11px;
      }
      .confirm-btn {
        width: 70px;
        height: 24px;
        background-color: #00cff9;
        float: right;
        margin-right: 19px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
      }
      .cancel-btn {
        width: 70px;
        height: 24px;
        background-color: transparent;
        float: right;
        margin-right: 10px;
        color: #00cff9;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #00cff9;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
