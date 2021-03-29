<template>
  <div class="infoCenter">
    <div>
      <InfoBox :newsInfo="news1" class="jbzc"></InfoBox>
      <InfoBox :newsInfo="news2" class="gzjz"></InfoBox>
    </div>
    <div>
      <InfoBox :newsInfo="news3" class="jbqy"></InfoBox>
      <InfoBox :newsInfo="news4" class="cgzs"></InfoBox>
    </div>
    <div class="qrcode">
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
import InfoBox from './components/infoBox'
import QrcodeBox from './components/qrcodeBox'
import $ from 'jquery'

export default {
  name: 'infoCenter',
  components: { InfoBox, QrcodeBox },
  data () {
    return {
      news1: '',
      news2: '',
      news3: '',
      news4: ''
    }
  },
  created () {
    var _this = this
    $.ajax({
      async: true,
      type: 'get',
      dataType: 'json',
      url: '/webRs/assets/infoConfig.json',
      success: function (res) {
        _this.news1 = res.infoList[0]
        _this.news2 = res.infoList[1]
        _this.news3 = res.infoList[2]
        _this.news4 = res.infoList[3]
      },
      error: function (err) {
        console.log(err)
      }
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.infoCenter {
  font-size: 12px;
  padding: 0px 16px;
  display: flex;
  flex-direction: column;
}
.jbzc {
  float: left;
}
.gzjz {
  float: right;
}
.jbqy {
  float: left;
  margin-top: 20px;
}
.cgzs {
  float: right;
  margin-top: 20px;
}

.qrcode {
  display: flex;
  box-sizing: border-box;
}
.qrcodeBase1 {
  width: 50%;
  padding: 18px 14px;
  .nyncj {
    float: right;
  }
}
.qrcodeBase2 {
  width: 50%;
  padding: 18px 14px;
}
</style>
