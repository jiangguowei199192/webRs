<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-04-05 15:35:59
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-04-05 15:47:35
-->
<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      class="add-case-dlg dialog-wrap"
    >
      <div class="add-case-header">{{ title }}</div>
      <div class="handelBtns">
        <span @click.stop="updateIsShow()">取消</span>
        <span>确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, required: true }
  },

  data () {
    return {
      placeholder: '请输入'
    }
  },

  watch: {
    isShow (val) {}
  },

  mounted () {},

  methods: {
    // 更新isShow状态
    updateIsShow () {
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-case-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 750px;
    // background-color: rgba(0, 65, 87, 0.85);
    background-color: transparent;
    .add-case-header {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      line-height: 30px;
      padding: 0 20px;
      margin-top: 18px;
    }
    .add-case-form {
      margin: 25px 0 0 5px;
      .el-input__inner {
        background-color: rgba(9, 84, 109, 0.85);
        border-color: #00d2ff;
        border-radius: 0;
        width: 240px;
        height: 28px;
        color: #00caf6;
        font-size: 12px;
      }
      .el-form-item {
        display: block;
        margin: 5px 0 25px 0;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
        width: 100px;
      }
      .el-textarea__inner {
        background-color: rgba(9, 84, 109, 0.85);
        border-color: #00d2ff;
        border-radius: 0;
        width: 635px;
        height: 85px;
        color: #00caf6;
        font-size: 12px;
        margin-top: 8px;
      }
      .el-input .el-input__count .el-input__count-inner,
      .el-textarea .el-input__count {
        background: transparent;
        bottom: -5px;
      }
      .upload-box {
        width: 404px;
        height: 208px;
        background-color: rgba(9, 84, 109, 0.85);
        border-radius: 4px;
        cursor: pointer;
        .el-upload-dragger {
          background-color: transparent;
          border: 1px dashed #00d2ff;
          box-sizing: border-box;
          width: 404px;
          height: 208px;
        }
        .el-icon-upload {
          font-size: 80px;
          color: #00caf6;
          margin: 30px 0 0 5px;
        }
        .el-upload__text {
          color: #00caf6;
          font-size: 13px;
        }
        .el-upload-list {
          height: 50px;
          overflow-y: auto;
        }
        .el-upload-list__item {
          font-size: 12px;
          margin-top: 0;
        }
        .el-upload-list__item-name,
        .el-icon-document {
          color: #00caf6;
        }
      }
    }
    .handelBtns {
      margin-right: 0;
      display: flex;
      justify-content: flex-end;
      span {
        display: inline-block;
        box-sizing: border-box;
        width: 87px;
        height: 32px;
        border: 1px solid #1eb0fc;
        border-radius: 2px;
        line-height: 32px;
        text-align: center;
        background: transparent;
        font-size: 16px;
        color: #1eb0fc;
        cursor: pointer;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #00b7ff;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
