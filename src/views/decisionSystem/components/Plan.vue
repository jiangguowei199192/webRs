<template>
  <div>
    <div style="width: 100%;">
      <div class="addressInfo">
        <div style="height: 98px;">
          <div style="margin-top: 24px; margin-left: 22px; font-size: 18px;">{{showInfo.name}}</div>
          <div style="margin-top: 16px; margin-left: 22px; font-size: 12px;">
            {{showInfo.type}}
            <div v-show="info.keyId !== undefined" class="keypointStyle">重</div>
          </div>
        </div>
        <div class="addressInfoDetail">
          <i class="el-icon-location"></i>
          {{showInfo.address}}
        </div>
        <div class="addressInfoDetail">
          <i class="el-icon-phone"></i>
          {{showInfo.tel}}
        </div>
      </div>

      <el-collapse v-show="info.keyId !== undefined" style="border: none;" v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <div style="margin-left: 22px;">基本情况说明</div>
          </template>
          <div class="itemContainer1">
            <el-button
              size="mini"
              class="basicFactSheetBtn"
              v-for="(item, index) in baseInfos"
              :key="index"
              @click="didClickedBaseInfo(index)"
            >{{item.title}}</el-button>
          </div>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template slot="title">
            <div style="margin-left: 22px;">建筑平面图</div>
          </template>
          <div class="itemContainer1">
            <HorCardList
              v-bind:items="buildingInfos"
              v-on:didClickedImage="didClickedBuildingImage"
            ></HorCardList>
          </div>
        </el-collapse-item>

        <el-collapse-item name="3">
          <template slot="title">
            <div style="margin-left: 22px;">作战部署图</div>
          </template>
          <div class="itemContainer2">
            <img
              class="edit_img fl"
              src="http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png"
              @click="toFightDeploy"
            />
          </div>
        </el-collapse-item>

        <el-collapse-item name="4">
          <template slot="title">
            <div style="margin-left: 22px;">三维预案</div>
          </template>
          <div class="itemContainer2">
            <img
              src="http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png"
              style="width: 100%; height: 200px;"
              @click="goto3d"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="height: 50px;">
        <button
          v-show="info.keyId === undefined"
          type="button"
          class="editPlanStyle"
          @click="editPlanClick"
        >预案编辑</button>
      </div>
    </div>

    <FloorGuide ref="floorGuide" v-bind:title="buildingTitle" v-bind:info="buildingInfos"></FloorGuide>
    <BaseInfo ref="baseInfo" v-bind:info="baseInfos"></BaseInfo>
  </div>
</template>

<script>
import HorCardList from './HorizontalCardList.vue'
import FloorGuide from './FloorGuide'
import BaseInfo from './BaseInfo'
import { settingApi } from '@/api/setting'
import globalApi from '@/utils/globalApi'

export default {
  props: {
  },
  data () {
    return {
      info: '',
      activeNames: ['1', '2'],
      showInfo: {
        name: '',
        type: '',
        address: '',
        tel: '',
        subTel: '',
        lon: '',
        lat: '',
        mapId: ''
      },
      buildingTitle: '黄鹤楼',
      buildingInfos: [
        // 测试数据
        // {
        //   title: '1层',
        //   image:
        //     'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1021768252,432753213&fm=26&gp=0.jpg'
        // },
        // {
        //   title: '2层',
        //   image:
        //     'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2915512436,1541993188&fm=26&gp=0.jpg'
        // },
        // {
        //   title: '3层',
        //   image:
        //     'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598501231760&di=b46ffef3711bfd0beb0e5528f5f02b5f&imgtype=0&src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2F201503%2F19%2F211608ztcq7higicydxhsy.jpg'
        // },
        // {
        //   title: '4层',
        //   image:
        //     'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598501231760&di=53d424fa23d284b221d6f262e8ed821e&imgtype=0&src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201111%2F21%2F205700txzuacubbcy91u99.jpg'
        // },
        // {
        //   title: '5层',
        //   image:
        //     'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598501231760&di=c720648eb47f6d0cb35a13196da77dad&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F587c7e395b9a0.jpg'
        // }
      ],
      baseInfos: []
    }
  },
  components: {
    HorCardList,
    FloorGuide,
    BaseInfo
  },
  methods: {
    show (info) {
      this.info = info
      this.getData()
    },
    async getData () {
      console.log('6666666')
      console.log(this.info)
      if (this.info.keyId) {
        var param = {
          id: this.info.keyId
        }
        this.$axios
          .get(settingApi.getFullInfoById, { params: param })
          .then((res) => {
            if (res.data.code === 0) {
              var resData = res.data.data
              this.showInfo.name = resData.enterpriseName
              this.showInfo.type = resData.enterpriseTypeName
              this.showInfo.address = resData.enterpriseAddress
              this.showInfo.tel = resData.enterpriseTel
              this.showInfo.subTel = resData.enterpriseTelBackup
              this.showInfo.lat = resData.enterpriseLatitude
              this.showInfo.lon = resData.enterpriseLongitude

              var baseInfosTemp = []
              resData.planEnterpriseBaseInfoPic.forEach(item => {
                var temp = {
                  title: item.picName,
                  image: globalApi.headImg + item.picPath
                }
                baseInfosTemp.push(temp)
              })
              this.baseInfos = baseInfosTemp

              var buildingInfosTemp = []
              resData.planEnterpriseJzpmtPic.forEach(item => {
                var temp = {
                  title: item.picName,
                  image: globalApi.headImg + item.picPath
                }
                buildingInfosTemp.push(temp)
              })
              this.buildingInfos = buildingInfosTemp
            }
          })
      } else {
        this.showInfo.name = this.info.name
        this.showInfo.type = this.info.type
        this.showInfo.address =
          this.info.cityname + this.info.adname + this.info.address
        this.showInfo.tel = this.info.tel
        this.showInfo.subTel = ''

        const location = this.info.location.split(',')
        this.showInfo.lon = location[0]
        this.showInfo.lat = location[1]
      }
      this.showInfo.mapId = this.info.id
      localStorage.setItem('PlanInfo', JSON.stringify(this.showInfo))
    },
    toFightDeploy () {
      this.$router.push({ path: '/fightDeploy' })
    },
    editPlanClick () {
      this.$router.push({
        path: '/PlanSetting'
      })
    },
    goto3d () {
      this.$router.push({ path: '/deploy3D' })
    },
    // 点击建筑平面图
    didClickedBuildingImage (index) {
      this.$refs.floorGuide.show(this.buildingInfos, index)
    },
    // 点击基本情况说明
    didClickedBaseInfo (index) {
      this.$refs.baseInfo.show(index)
    }
  },

  // 设置下一个路由的meta,让列表缓存不刷新
  beforeRouteLeave (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style lang="scss" scoped>
.addressInfo {
  .addressInfoDetail {
    margin-left: 22px;
    margin-right: 22px;
    height: 30px;
    line-height: 30px;
    border-top: 1px solid rgba(237, 237, 237, 0.5);
    font-size: 12px;
  }
  .keypointStyle {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: red;
    border-radius: 50%;
    color: white;
    font-size: 14px;
    text-align: center;
    line-height: 24px;
  }
}

.basicFactSheetBtn {
  width: 105px;
  margin: 10px 10px 10px 0px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.itemContainer1 {
  margin: 0 22px 0 22px;
  border-top: 1px solid rgba(237, 237, 237, 0.5);
}
.itemContainer2 {
  margin: 0 22px 0 22px;
  .edit_img {
    width: 94%;
    height: 160px;
    margin: 0 0 10px 10px;
    cursor: pointer;
  }
  // .edit_icon {
  //   display: block;
  //   width: 25px;
  //   height: 25px;
  //   background-color: #fff;
  //   border-radius: 50%;
  //   font-size: 18px;
  //   text-align: center;
  //   line-height: 25px;
  //   cursor: pointer;
  //   margin: 112px 0 0 10px;
  // }
}

/* 折叠列表样式 */
/deep/.el-collapse-item__header {
  border-top: 1px solid rgba(237, 237, 237, 0.5);
  border-bottom: none;
  background-color: transparent;
  color: white;
}
/deep/.el-collapse-item__header.focusing:focus:not(:hover) {
  color: white;
}
/deep/.el-collapse-item__content {
  padding: 0;
}
/deep/.el-collapse-item__wrap {
  border: none;
  background-color: transparent;
}
/deep/.el-icon-arrow-right {
  margin-right: 22px;
}

/* --- 改变滚动条样式 --- */
// /deep/ ::-webkit-scrollbar {
//   width: 5px;
//   height: 5px;
// }
// /deep/ ::-webkit-scrollbar-track {
//   border-radius: 5px;
//   box-shadow: inset 0 0 6px rgba(245, 238, 238, 0); //滑道背阴影颜色
//   background-color: rgba($color: rgb(245, 238, 238), $alpha: 0); //滑道背景色
// }
// /deep/ ::-webkit-scrollbar-thumb {
//   border-radius: 5px;
//   box-shadow: inset 0 0 6px rgb(86, 87, 61); //滑块阴影颜色
//   background-color: rgba($color: rgb(86, 87, 61), $alpha: 0.2); //滑块背景色
// }

.editPlanStyle {
  float: right;
  width: 80px;
  height: 22px;
  background-color: transparent;
  border: solid 1px #1daffb;
  font-size: 12px;
  color: #fefefe;
  line-height: 22px;
  margin-right: 10px;
  margin-top: 15px;
  outline: none;
}
</style>
