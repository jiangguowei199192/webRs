<template>
  <div>
    <div>
      <span style="font-weight: bold;">单位基础信息</span>
      <div>
        <span class="subTitle">单位名称</span>
        <el-input v-model="companyName" placeholder="请输入单位名称" class="textInput"></el-input>
      </div>
      <div>
        <span class="subTitle">单位类型</span>
        <el-input v-model="companyType" placeholder="请输入单位类型" class="textInput"></el-input>
      </div>
      <div>
        <span class="subTitle">单位地址</span>
        <el-input v-model="companyAddress" placeholder="请输入单位地址" class="textInput"></el-input>
      </div>
      <div style="height: 200px; margin-top: 20px;">
        <div class="coordinatesTitle">地理坐标</div>
        <div style="width: 300px; height: 200px; background: white; float: left;"></div>
      </div>
      <div>
        <span class="subTitle">联系电话</span>
        <el-input v-model="companyPhone" placeholder="请输入联系人电话" class="textInput"></el-input>
        <el-input v-model="companySubPhone" placeholder="请输入备用电话" class="phoneInput"></el-input>
      </div>
    </div>
    <div style="margin-top: 20px; height: 280px;">
      <span style="font-weight: bold;">基本情况说明</span>
      <div style="margin-top: 20px;">
        <div class="basicSituation" v-for="(item, index) in basicSituation" :key="index">
          <UploadImage v-bind:title="item.title" v-bind:subTitle="item.subTitle"></UploadImage>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px; height: 280px;">
      <span style="font-weight: bold;">建筑平面图</span>
      <div style="margin-top: 20px;">
        <div class="basicSituation" v-for="(item, index) in buildingPlan" :key="index">
          <UploadImage v-bind:title="item.title" v-bind:subTitle="item.subTitle"></UploadImage>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px; height: 280px;">
      <span style="font-weight: bold;">作战部署图</span>
      <div style="margin-top: 20px; margin-left: 50px;">
        <UploadImage v-bind:title="operationalDeployment.title" v-bind:subTitle="operationalDeployment.subTitle"></UploadImage>
      </div>
    </div>
    <div style="margin-top: 20px; height: 280px;">
      <span style="font-weight: bold;">三维预案</span>
      <div style="margin-top: 20px; margin-left: 50px;">
        <UploadImage v-bind:title="threeDPlan.title" v-bind:subTitle="threeDPlan.subTitle"></UploadImage>
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
      threeDPlan: { title: '《三维预案》', subTitle: 'tif单个文件大小不超过1G' }, // 三维预案
    }
  },
  components: {
    UploadImage
  }
}
</script>

<style lang="scss" scoped>
.subTitle {
  color: rgb(203, 203, 204);
  display: inline-block;
  width: 100px;
  margin-left: 50px;
}
.coordinatesTitle {
  width: 100px;
  color: rgb(203, 203, 204);
  float: left;
  margin-top: 10px;
  margin-left: 50px;
}
.textInput {
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
</style>
