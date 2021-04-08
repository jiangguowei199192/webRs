<!--
 * @Descripttion: 天下风云出我辈, 一入江湖岁月催; 皇图霸业谈笑中, 不胜人生一场醉.
 * @version: v_1.0
 * @Author: liangkaiLee
 * @Date: 2021-04-05 15:35:59
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-04-08 11:54:33
-->
<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      class="monitor-dlg dialog-wrap"
    >
      <div class="monitor-header">{{ title }}</div>
      <div class="monitor-content">
        <div class="people-test">
          <span class="fl test-title">人员检测：</span>
          <el-switch class="fl" v-model="peopleStatus"> </el-switch>
        </div>
        <div class="car-test">
          <span class="fl test-title">车辆检测：</span>
          <el-switch class="fl" v-model="carStatus"> </el-switch>
        </div>
        <div class="boat-test">
          <span class="fl test-title">船只检测：</span>
          <el-switch class="fl" v-model="boatStatus"> </el-switch>
        </div>
      </div>
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
      placeholder: '请输入',
      peopleStatus: true,
      carStatus: true,
      boatStatus: true
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
.monitor-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    width: 970px;
    background-color: transparent;
    .el-dialog__body {
      height: 530px;
      position: relative;
    }
    .monitor-header {
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
    .monitor-content {
      margin-top: 20px;
      padding: 0 20px;
      .people-test,
      .car-test,
      .boat-test {
        display: flex;
        align-items: center;
        height: 50px;
        margin-bottom: 10px;
        .test-title {
          width: 100px;
          font-size: 16px;
          color: #00d1ff;
        }
        .el-switch {
          display: block;
          margin-left: 15px;
        }
      }
    }
    .handelBtns {
      position: absolute;
      right: 0;
      bottom: 0;
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
