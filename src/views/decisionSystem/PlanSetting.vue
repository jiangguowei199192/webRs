<template>
  <div>
    <div class="rightBox">
      <div class="rightBoxBase webFsScroll">
        <div class="container">
          <div>
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">单位基础信息</div>
            </div>
            <div>
              <span class="subTitleStyle">单位名称</span>
              <el-input v-model="companyName" placeholder="请输入单位名称" class="textInputStyle"></el-input>
            </div>
            <div>
              <span class="subTitleStyle">单位类型</span>
              <el-input v-model="companyType" placeholder="请输入单位类型" class="textInputStyle"></el-input>
            </div>
            <div>
              <span class="subTitleStyle">单位地址</span>
              <el-input v-model="companyAddress" placeholder="请输入单位地址" class="textInputStyle"></el-input>
            </div>
            <div style="height: 200px; margin-top: 20px;">
              <div class="coordinatesTitle">地理坐标</div>
              <div style="width: 300px; height: 200px; background: white; float: left;"></div>
            </div>
            <div>
              <span class="subTitleStyle">联系电话</span>
              <el-input v-model="companyPhone" placeholder="请输入联系人电话" class="textInputStyle"></el-input>
              <el-input v-model="companySubPhone" placeholder="请输入备用电话" class="phoneInput"></el-input>
            </div>
          </div>
          <div style="margin-top: 20px; height: 525px;">
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">基本情况说明</div>
            </div>
            <div style="margin-top: 20px;">
              <div class="basicSituation" v-for="(item, index) in basicSituation" :key="index">
                <UploadImage v-bind:title="item.title" v-bind:subTitle="item.subTitle"></UploadImage>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px; height: 285px;">
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">建筑平面图</div>
            </div>
            <div style="margin-top: 20px;">
              <div class="basicSituation" v-for="(item, index) in buildingPlan" :key="index">
                <UploadImage v-bind:title="item.title" v-bind:subTitle="item.subTitle"></UploadImage>
              </div>
            </div>
          </div>
          <!-- <div style="margin-top: 20px; height: 280px; background: red">
            <span style="font-weight: bold;">作战部署图</span>
            <div style="margin-top: 20px; margin-left: 50px;">
              <UploadImage v-bind:title="operationalDeployment.title" v-bind:subTitle="operationalDeployment.subTitle"></UploadImage>
            </div>
          </div>
          <div style="margin-top: 20px; height: 280px; background: red">
            <span style="font-weight: bold;">三维预案</span>
            <div style="margin-top: 20px; margin-left: 50px;">
              <UploadImage v-bind:title="threeDPlan.title" v-bind:subTitle="threeDPlan.subTitle"></UploadImage>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadImage from './components/PlanSettingUploadImage.vue'

export default {
  data () {
    return {
      companyName: '', // 单位名称
      companyType: '', // 单位类型
      companyAddress: '', // 单位地址
      companyCoordinates: '', // 地理坐标
      companyPhone: '', // 联系电话
      companySubPhone: '', // 备用电话
      basicSituation: [ // 基本情况说明
        { title: '《单位基本情况》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' },
        { title: '《主要消防设施》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' },
        { title: '《重点部位情况》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' },
        { title: '《力量调度情况》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' },
        { title: '《重点提示》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' }
      ],
      buildingPlan: [
        { title: '《单位基本情况》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' },
        { title: '《重点提示》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' }
      ],
      operationalDeployment: { title: '《作战部署图》', subTitle: 'JPG、JPEG、PNG单张图片大小不超过20M' }, // 作战部署
      threeDPlan: { title: '《三维预案》', subTitle: 'tif单个文件大小不超过1G' }// 三维预案
    }
  },
  components: {
    UploadImage
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
      margin: 58px 271px 58px 271px;
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
.coordinatesTitle {
  width: 100px;
  float: left;
  margin-top: 10px;
  margin-left: 63px;
}
.textInputStyle {
  width: 300px;
  margin-top: 20px;
}
.phoneInput {
  width: 300px;
  margin-top: 20px;
  margin-left: 20px;
}
.basicSituation {
  float: left;
  margin-left: 50px;
}
/deep/.el-input__inner {
  background-color: transparent;
  color: white;
  border-color: #1daffb;
  border-radius: 0;
}
</style>
