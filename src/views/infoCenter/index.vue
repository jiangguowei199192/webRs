<template>
  <div class="infoCenter">
    <div>
      <InfoBox
        title="禁捕政策"
        class="jbzc"
      ></InfoBox>
      <InfoBox
        title="工作进展"
        class="gzjz"
      ></InfoBox>
    </div>
    <div>
      <InfoBox
        title="禁捕区域"
        class="jbqy"
      ></InfoBox>
      <InfoBox
        title="成果展示"
        class="cgzs"
      ></InfoBox>
    </div>
    <div>
      <div class="qrcodeBase1">
        <QrcodeBox
          :src="require('../../assets/images/infoCenter/qrcode-nyj.png')"
          name="武汉市农业农村局"
          class="nyncj"
        ></QrcodeBox>
      </div>
      <div class="qrcodeBase2">
        <QrcodeBox
          :src="require('../../assets/images/infoCenter/qrcode-nyzf.png')"
          name="武汉市农业执法"
          class="nyzf"
        ></QrcodeBox>
      </div>
    </div>
  </div>
</template>
<script>
import InfoBox from "./components/infoBox";
import QrcodeBox from "./components/qrcodeBox";

export default {
  name: "infoCenter",
  components: { InfoBox, QrcodeBox },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped>
.infoCenter {
  font-size: 12px;
}
.jbzc {
  float: left;
  margin-left: 25px;
}
.gzjz {
  float: right;
  margin-right: 25px;
}
.jbqy {
  float: left;
  margin-left: 25px;
  margin-top: 20px;
}
.cgzs {
  float: right;
  margin-right: 25px;
  margin-top: 20px;
}
.qrcodeBase1 {
  width: 916px;
  float: left;
  margin-left: 25px;
  .nyncj {
    float: right;
    margin-top: 18px;
    margin-bottom: 18px;
  }
}
.qrcodeBase2 {
  width: 916px;
  float: right;
  margin-right: 25px;
  .nyzf {
    float: left;
    margin-top: 18px;
    margin-bottom: 18px;
  }
}
</style>