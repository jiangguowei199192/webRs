<template>
  <div class="infoCenter">
    <div>
      <InfoBox
        style="float: left; margin-left: 25px"
        title="禁捕政策"
      ></InfoBox>
      <InfoBox
        style="float: right; margin-right: 25px"
        title="工作进展"
      ></InfoBox>
    </div>
    <div>
      <InfoBox
        style="float: left; margin-left: 25px; margin-top: 20px"
        title="禁捕区域"
      ></InfoBox>
      <InfoBox
        style="float: right; margin-right: 25px; margin-top: 20px"
        title="成果展示"
      ></InfoBox>
    </div>
    <div>
      <div class="qrcodeBase">
        <QrcodeBox
          style="float: right; margin-top: 18px; margin-bottom: 18px"
          :src="require('../../assets/images/infoCenter/qrcode-nyj.png')"
          name="武汉市农业农村局"
        ></QrcodeBox>
      </div>
      <div class="qrcodeBase2">
        <QrcodeBox
          style="float: left; margin-top: 18px; margin-bottom: 18px"
          :src="require('../../assets/images/infoCenter/qrcode-nyzf.png')"
          name="武汉市农业执法"
        ></QrcodeBox>
      </div>
    </div>
  </div>
</template>
<script>
import InfoBox from './components/infoBox'
import QrcodeBox from './components/qrcodeBox'

export default {
  name: 'infoCenter',
  components: { InfoBox, QrcodeBox },
  data () {
    return {}
  },
  methods: {},
  created () {}
}
</script>

<style lang="scss" scoped>
.infoCenter {
  font-size: 12px;
}
.qrcodeBase {
  width: 916px;
  float: left;
  margin-left: 25px;
}
.qrcodeBase2 {
  width: 916px;
  float: right;
  margin-right: 25px;
}
</style>
