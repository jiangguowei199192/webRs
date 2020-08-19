<template>
  <div>
    <div class="rightBox">
      <div class="rightBoxBase webFsScroll">
        <div class="container">
          <div style="margin-top: 50px;">
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">单位基础信息</div>
            </div>
            <div>
              <span class="subTitleStyle">单位名称</span>
              <el-input v-model="companyName" placeholder="请输入单位名称" class="textInputStyle baseInfoInput"></el-input>
            </div>
            <div>
              <span class="subTitleStyle">单位类型</span>
              <el-input v-model="companyType" placeholder="请输入单位类型" class="textInputStyle baseInfoInput"></el-input>
            </div>
            <div>
              <span class="subTitleStyle">单位地址</span>
              <el-input v-model="companyAddress" placeholder="请输入单位地址" class="textInputStyle baseInfoInput"></el-input>
            </div>
            <div style="height: 200px; margin-top: 20px;">
              <div class="coordinatesTitleStyle">地理坐标</div>
              <div style="width: 376px; height: 198px; background: white; display: inline-block;">
                <gMap
                  ref="gduMap"
                  handleType="devMap"
                  :bShowSimpleSearchTools="true"
                  :bMiniSearchStyle="true"
                  :bShowBasic="false"
                  :bShowMeasure="false"
                  :bAutoLocate="false"
                  :bShowLonLat="false"
                ></gMap>
              </div>
            </div>
            <div>
              <span class="subTitleStyle">联系电话</span>
              <el-input v-model="companyPhone" placeholder="请输入联系人电话" class="phoneInputStyle1 baseInfoInput"></el-input>
              <el-input v-model="companySubPhone" placeholder="请输入备用电话" class="phoneInputStyle1 baseInfoInput phoneInputStyle2"></el-input>
            </div>
          </div>
          <div style="margin-top: 50px;">
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">基本情况说明</div>
            </div>
            <div>
              <div class="basicSituationStyle" v-for="(item, index) in basicSituation" :key="index">
                <UploadImage v-bind:title="item.title" v-bind:subTitle="item.subTitle"></UploadImage>
              </div>
            </div>
          </div>
          <div style="margin-top: 50px;">
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">建筑平面图</div>
            </div>
            <div>
              <div class="basicSituationStyle" v-for="(item, index) in buildingPlan" :key="index">
                <UploadImageMore v-bind:title="item.title" v-bind:subTitle="item.subTitle"></UploadImageMore>
              </div>
              <div class="basicSituationStyle addBuildingStyle">
                <img :src="addImg" @click="addBuildingImageClick">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadImage from './components/PlanSettingUploadImage.vue'
import UploadImageMore from './components/PlanSettingUploadImageMore.vue'
export default {
  components: {
    UploadImage,
    UploadImageMore
  },
  data () {
    return {
      addImg: require('../../assets/images/Setting/setting-addImage.png'),

      companyName: '', // 单位名称
      companyType: '', // 单位类型
      companyAddress: '', // 单位地址
      companyCoordinates: '', // 地理坐标
      companyPhone: '', // 联系电话
      companySubPhone: '', // 备用电话
      basicSituation: [ // 基本情况说明
        { title: '《基本情况》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' },
        { title: '《供水系统》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' },
        { title: '《行车路线》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' },
        { title: '《防火设计》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' },
        { title: '《重点部位》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' }
      ],
      buildingPlan: [
        { title: '', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' }
      ]
    }
  },
  mounted () {
    const tmpMap = this.$refs.gduMap.map2D
    tmpMap.clickEvent.addEventListener((lonlat) => {
      const tmpName = this.companyName === '' ? null : this.companyName
      tmpMap.customMarkerLayerManager.clear()
      tmpMap.customMarkerLayerManager.addMarker({ name: tmpName, lon: lonlat[0], lat: lonlat[1], _bWgs2Gcj: false })
    })
    this.initBasicInfo()
  },
  methods: {
    // 增加建筑平面图
    addBuildingImageClick () {
      this.buildingPlan.push({ title: '', subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M' })
    },
    getSelectedLocation () {
      const tmpMap = this.$refs.gduMap
      const tmpFs = tmpMap.map2D.customMarkerLayerManager._source.getFeatures()
      if (tmpFs.length > 0) {
        return tmpFs[0].getGeometry().getCoordinates()
      } else {
        return [tmpMap.lon, tmpMap.lat]
      }
    },
    initBasicInfo () {
      if (localStorage.selectedAddress !== undefined && localStorage.selectedAddress !== '') {
        const tP = JSON.parse(localStorage.selectedAddress)
        localStorage.selectedAddress = ''
        this.companyName = tP.name
        this.companyType = tP.type
        this.companyAddress = tP.address
        this.companyPhone = tP.tel
        const tmpMap = this.$refs.gduMap
        tmpMap.mapMoveTo(tP.lon, tP.lat, false)
        tmpMap.map2D.customMarkerLayerManager.clear()
        tmpMap.map2D.customMarkerLayerManager.addMarker({ name: tP.name, lon: tP.lon, lat: tP.lat, _bWgs2Gcj: false })
        tmpMap.map2D.setZoom(16)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rightBox {
  width: 1490px;
  height: 888px;
  background: url("../../assets/images/Setting/setting-rightBox.png") no-repeat;
  background-size: 100% 100%;
  margin: 0 auto 0 auto;
  .rightBoxBase {
    height: 868px;
    border: solid 10px transparent;
    overflow: auto;
    .container {
      margin: 8px 271px 58px 271px;
    }
  }
}
.titleArrowStyle {
  width: 4px;
  height: 20px;
  background-color: #1daffb;
  display: inline-block;
}
.titleStyle {
  font-weight: bold;
  display: inline-block;
  vertical-align: top;
  height: 20px;
  line-height: 20px;
  margin-left: 16px;
  font-size: 18px;
}
.subTitleStyle {
  display: inline-block;
  width: 100px;
  margin-left: 63px;
  font-size: 16px;
}
.coordinatesTitleStyle {
  width: 100px;
  float: left;
  margin-top: 10px;
  margin-left: 63px;
  font-size: 16px;
}
.textInputStyle {
  width: 376px;
  height: 38px;
  margin-top: 20px;
  font-size: 16px;
}
.phoneInputStyle1 {
  width: 176px;
  height: 38px;
  margin-top: 20px;
  font-size: 16px;
}
.phoneInputStyle2 {
  margin-left: 20px;
}
.basicSituationStyle {
  display: inline-block;
  margin-top: 30px;
  margin-left: 50px;
  // background: olive;
  vertical-align: middle;
}
.addBuildingStyle {
  width: 250px;
  height: 118px;
  text-align: center;
}
/* 输入框样式 */
.baseInfoInput {
  /deep/.el-input__inner {
    background-color: transparent;
    color: white;
    border-color: #1daffb;
    border-radius: 0;
  }
}
</style>
