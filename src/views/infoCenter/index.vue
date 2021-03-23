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
      url: '/assets/infoConfig.json',
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
