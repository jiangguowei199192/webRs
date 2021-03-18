<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="21.25%"
    class="detail-info"
  >
    <div class="title">{{ title }}</div>
    <div class="img-box">
      <img src="../../../../public/assets/images/camera_type.png" />
      <img
        style="float: right"
        src="../../../../public/assets/images/camera_type.png"
      />
    </div>
    <el-form :model="deviceInfo" class="device-info-form">
      <el-form-item label="监控设备:" prop="deviceName">
        <span>{{ deviceInfo.deviceName }}</span>
      </el-form-item>
      <el-form-item label="地址:" prop="address">
        <span>{{ deviceInfo.address }}</span>
      </el-form-item>
      <el-form-item label="时间:" prop="time">
        <span>{{ deviceInfo.time }}</span>
      </el-form-item>
    </el-form>

    <el-form :model="detailInfo" :inline="true" class="device-info-form">
      <el-form-item
        v-for="(item, index) in detailInfoItems"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <span>{{ detailInfo[item.prop] }}</span>
      </el-form-item>
    </el-form>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">关闭</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["isShow", "type"],
  data() {
    return {
      title: "",
      deviceInfo: {
        deviceName: "样例",
        address: "样例",
        time: "样例",
      },
      detailInfo: {
        six: "男",
        age: "20-30",
        coat: "蓝色",
        dowm: "黑色",
        hairColor: "黑色",
      },
      detailInfoItems: [
        { label: "性别:", prop: "six" },
        { label: "年龄组:", prop: "age" },
        { label: "上衣:", prop: "coat" },
        { label: "下衣:", prop: "dowm" },
        { label: "发色:", prop: "hairColor" },
      ],
    };
  },
  watch: {
    isShow(newS) {
      if (newS) {
        switch (this.type) {
          case "人": {
            this.title = "人员信息";
            this.detailInfoItems = [
              { label: "性别:", prop: "six" },
              { label: "年龄组:", prop: "age" },
              { label: "上衣:", prop: "coat" },
              { label: "下衣:", prop: "dowm" },
              { label: "发色:", prop: "hairColor" },
            ];
            break;
          }
          case "车": {
            this.title = "车信息";
            this.detailInfoItems = [
              { label: "类型:", prop: "six" },
              { label: "品牌:", prop: "age" },
              { label: "款式:", prop: "coat" },
              { label: "颜色:", prop: "dowm" },
              { label: "车牌号:", prop: "hairColor" },
            ];
            break;
          }
          case "船": {
            this.title = "船信息";
            this.detailInfoItems = [
              { label: "类型:", prop: "six" },
              { label: "方向:", prop: "age" },
            ];
            break;
          }
          default:
            break;
        }
      }
    },
  },
  methods: {
    confirmClick() {
      this.$emit("confirmClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-info.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px;
      width: 100%;
      border: 1px solid #00a7e8;
      background-color: #004157;
      min-width: 400px;
      .title {
        width: 218px;
        height: 30px;
        line-height: 35px;
        background: linear-gradient(
          to right,
          #00d2ff,
          rgba($color: #00d2ff, $alpha: 0)
        );
        margin-top: 20px;
        margin-left: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #fefefe;
        text-indent: 17px;
      }
      .img-box {
        margin-top: 13px;
        margin-left: 20px;
        margin-right: 20px;
        img {
          width: 174px;
          height: 174px;
        }
      }
      .device-info-form {
        margin-top: 20px;
        .el-form-item__label {
          color: #00d1ff;
          margin-left: 20px;
        }
        .el-form-item {
          margin-top: -20px;
          font-size: 16px;
          span {
            color: white;
          }
        }
      }
      .confirm-tool {
        height: 32px;
        margin: 0 20px 20px 0;
        .confirm-btn {
          float: right;
          width: 87px;
          height: 32px;
          line-height: 32px;
          background-color: #00a7e8;
          border-radius: 2px;
          color: #fff;
          font-size: 18px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>