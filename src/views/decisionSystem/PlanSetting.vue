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
              <el-input
                v-model="companyName"
                placeholder="请输入单位名称"
                class="textInputStyle baseInfoInput"
              ></el-input>
            </div>
            <div>
              <span class="subTitleStyle">单位类型</span>
              <el-select
                :popper-append-to-body="false"
                v-model="companyType"
                placeholder="请选择单位类型"
                class="textInputStyle baseInfoInput"
                popper-class="select-popper"
              >
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <span class="subTitleStyle">单位地址</span>
              <el-input
                v-model="companyAddress"
                placeholder="请输入单位地址"
                class="textInputStyle baseInfoInput"
              ></el-input>
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
              <el-input
                v-model="companyPhone"
                placeholder="请输入联系人电话"
                class="phoneInputStyle1 baseInfoInput"
              ></el-input>
              <el-input
                v-model="companySubPhone"
                placeholder="请输入备用电话"
                class="phoneInputStyle1 baseInfoInput phoneInputStyle2"
              ></el-input>
            </div>
          </div>
          <div style="margin-top: 50px;">
            <div>
              <div class="titleArrowStyle"></div>
              <div class="titleStyle">基本情况说明</div>
            </div>
            <div>
              <div class="basicSituationStyle" v-for="(item, index) in basicSituation" :key="index">
                <UploadImage v-bind:info="item" v-on:doUploadImage="basicSituationDoUploadImage"></UploadImage>
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
                <UploadImageMore
                  v-bind:info="item"
                  v-bind:index="index"
                  v-on:deleteClick="deleteBuildingImageClick"
                  v-on:doUploadImage="buildingPlanDoUploadImage"
                ></UploadImageMore>
              </div>
              <div class="basicSituationStyle addBuildingStyle">
                <img :src="addImg" @click="addBuildingImageClick" />
              </div>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="saveClick" class="saveStyle">保 存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadImage from './components/PlanSettingUploadImage.vue'
import UploadImageMore from './components/PlanSettingUploadImageMore.vue'
import { settingApi } from '@/api/setting'
import { api } from '@/api/3d.js'
import { Notification } from 'element-ui'

export default {
  components: {
    UploadImage,
    UploadImageMore
  },
  data () {
    return {
      addImg: require('../../assets/images/Setting/setting-addImage.png'),
      planInfo: '',

      enterpriseList: [],

      companyName: '', // 单位名称
      companyType: '', // 单位类型
      companyAddress: '', // 单位地址
      companyLog: '', // 经度
      companyLat: '', // 纬度
      companyPhone: '', // 联系电话
      companySubPhone: '', // 备用电话

      basicSituation: [
        // 基本情况说明
        {
          id: 'JBQK001',
          title: '《基本情况》',
          subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
          path: ''
        },
        {
          id: 'JBQK002',
          title: '《供水系统》',
          subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
          path: ''
        },
        {
          id: 'JBQK003',
          title: '《行车路线》',
          subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
          path: ''
        },
        {
          id: 'JBQK004',
          title: '《防火设计》',
          subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
          path: ''
        },
        {
          id: 'JBQK005',
          title: '《重点部位》',
          subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
          path: ''
        }
      ],

      buildingPlan: [
        // 建筑平面图
        // {
        //   subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
        //   path: '',
        //   name: '',
        //   imageUrl: ''
        // }
      ]
    }
  },
  mounted () {
    const tmpMap = this.$refs.gduMap.map2D
    tmpMap.clickEvent.addEventListener((lonlat) => {
      const tmpName = this.companyName === '' ? null : this.companyName
      tmpMap.customMarkerLayerManager.clear()
      tmpMap.customMarkerLayerManager.addMarker({
        name: tmpName,
        lon: lonlat[0],
        lat: lonlat[1],
        _bWgs2Gcj: false
      })
    })
    this.initBasicInfo()
  },
  created () {
    this.getEnterpriseTypeList()
  },
  methods: {
    // 获取单位类型集合
    async getEnterpriseTypeList () {
      // var p = this
      this.$axios.get(settingApi.enterpriseTypeList).then((res) => {
        if (res.data.code === 0) {
          var receive = res.data.data
          var temp = []
          receive.forEach((item) => {
            var enterpriseType = {
              value: item.typeCode,
              label: item.typeName
            }
            temp.push(enterpriseType)
          })
          this.enterpriseList = temp
        }
      })
    },

    // 建筑平面图-点击增加
    addBuildingImageClick () {
      this.buildingPlan.push({
        subTitle: 'JPG、JPEG、PNG单张图片大小不超过5M',
        path: '',
        name: '',
        imageUrl: ''
      })
    },
    // 建筑平面图-点击删除
    deleteBuildingImageClick (index) {
      this.buildingPlan.splice(index, 1)
    },
    // 建筑平面图-上传图片
    async buildingPlanDoUploadImage (imageFile, item) {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const formData = new FormData()
      formData.append('picName', item.name)
      formData.append('file', imageFile)
      this.$axios.post(settingApi.jzpmtPicUpload, formData, config).then((res) => {
        if (res.data.code === 0) {
          var receive = res.data.data
          item.path = receive.picPath
          return
        }
        Notification({
          title: '提示',
          message: '头像上传失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },

    // 基本情况说明-上传图片
    async basicSituationDoUploadImage (imageFile, item) {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const formData = new FormData()
      formData.append('picTypeCode', item.id)
      formData.append('file', imageFile)
      this.$axios.post(settingApi.baseInfoPicUpload, formData, config).then((res) => {
        if (res.data.code === 0) {
          var receive = res.data.data
          item.path = receive.picPath
          return
        }
        Notification({
          title: '提示',
          message: '头像上传失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },

    // 新增三维预案
    addPlan3D (id) {
      const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
      var data = {
        enterpriseId: id,
        modelPath: '/cloud-video/prePlanFor3D/3dtiles/guobo/Production_1.json'
      }
      this.$axios.post(api.add3dPlan, data, config).then((res) => {
        if (res.data.code === 0) {

        }
      }).catch(err => {
        console.log('add3dPlan Err : ' + err)
      })
    },

    // 保存
    saveClick () {
      if (this.companyName.length <= 0) {
        this.warnAlert('请输入单位名称')
        return
      }
      if (this.companyType.length <= 0) {
        this.warnAlert('请选择单位类型')
        return
      }
      if (this.companyAddress.length <= 0) {
        this.warnAlert('请输入单位地址')
        return
      }
      if (this.companyLog.length <= 0 || this.companyLat.length <= 0) {
        this.warnAlert('请选择地理坐标')
        return
      }
      if (this.companyPhone.length <= 0) {
        this.warnAlert('请输入单位地址')
        return
      }

      var baseInfoAll = true
      for (let index = 0; index < this.basicSituation.length; index++) {
        const item = this.basicSituation[index]
        if (item.path.length <= 0) {
          baseInfoAll = false
          break
        }
      }
      if (!baseInfoAll) {
        this.warnAlert('请完整上传基本情况说明')
        return
      }

      this.handleBuildingPlan()
      if (
        this.buildingPlan.length < 1 ||
        this.buildingPlan[0].path.length <= 0
      ) {
        this.warnAlert('请上传建筑平面图')
        return
      }

      var basicPaths = []
      var buildingPaths = []
      this.basicSituation.forEach((item) => {
        basicPaths.push(item.path)
      })
      this.buildingPlan.forEach((item) => {
        buildingPaths.push(item.path)
      })
      var param = {
        enterpriseName: this.companyName,
        enterpriseTypeCode: this.companyType,
        enterpriseAddress: this.companyAddress,
        enterpriseLatitude: this.companyLat,
        enterpriseLongitude: this.companyLog,
        enterpriseTel: this.companyPhone,
        enterpriseTelBackup: this.companySubPhone,
        baseInfoPicList: basicPaths,
        jzpmtPicList: buildingPaths,
        enterpriseOtherInfo: JSON.stringify({ mapId: this.planInfo.mapId })
      }
      this.$axios
        .post(settingApi.addEnterprise, param, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res.data.code === 0) {
            localStorage.removeItem('PlanInfo')
            Notification({
              title: '提示',
              message: '保存成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$router.push({ path: '/decisionSystem' })
            this.addPlan3D(res.data.data.id)
          }
        })
    },
    warnAlert (msg) {
      Notification({
        title: '提示',
        message: msg,
        type: 'warning',
        duration: 5 * 1000
      })
    },
    // 过滤掉path为空的选项
    handleBuildingPlan () {
      for (let index = 0; index < this.buildingPlan.length; index++) {
        const item = this.buildingPlan[index]
        if (item.path.length <= 0) {
          this.buildingPlan.splice(index, 1)
        }
      }
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
      this.planInfo = JSON.parse(localStorage.getItem('PlanInfo'))
      if (this.planInfo) {
        this.companyName = this.planInfo.name
        this.companyAddress = this.planInfo.address
        this.companyPhone = this.planInfo.tel
        this.companyLog = this.planInfo.lon
        this.companyLat = this.planInfo.lat

        const tmpMap = this.$refs.gduMap
        tmpMap.mapMoveTo(this.planInfo.lon, this.planInfo.lat, false)
        tmpMap.map2D.customMarkerLayerManager.clear()
        tmpMap.map2D.customMarkerLayerManager.addMarker({
          name: this.planInfo.name,
          lon: this.planInfo.lon,
          lat: this.planInfo.lat,
          _bWgs2Gcj: false
        })
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
      margin: 8px 271px 158px 271px;
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
    font-size: 16px;
  }
}

.saveStyle {
  background-color: #1eb0fc;
  font-size: 24px;
  color: white;
  width: 150px;
  height: 50px;
  padding: 0;
  float: right;
  margin-top: 50px;
}

// /deep/.select-popper {
//   background-color: #3688b1;
//   font-size: 12px;
//   color: white;
//   border: none;
//   .el-select-dropdown__item.selected {
//     background-color: #3688b1;
//   }
//   .el-select-dropdown__item {
//     font-size: 12px;
//     color: white;
//   }
//   .el-select-dropdown__item.hover {
//     background-color: #3688b1;
//   }
//   .popper__arrow {
//     border-bottom-color: #3688b1;
//   }
//   .popper__arrow::after {
//     border-bottom-color: #3688b1;
//   }
// }
</style>
