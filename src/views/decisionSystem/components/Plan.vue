<template>
  <div>
    <div style="width: 100%;">
      <div class="addressInfo">
        <div style="height: 98px;">
          <!-- <el-button
            style="float: right; width: 40px; margin-right: 20px;"
            type="primary"
            icon="el-icon-top-right"
            circle
          ></el-button>-->
          <div style="margin-top: 24px; margin-left: 22px; font-size: 18px;">{{address}}</div>
          <div style="margin-top: 16px; margin-left: 22px; font-size: 12px;">
            {{subAddress}}
            <i class="el-icon-warning"></i>
          </div>
        </div>
        <div class="addressInfoDetail">
          <i class="el-icon-warning"></i>
          {{detailAddress}}
        </div>
        <div class="addressInfoDetail">
          <i class="el-icon-warning"></i>
          {{phoneNumber}}
        </div>
      </div>

      <el-collapse style="border: none;" v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <div style="margin-left: 22px;">基本情况说明</div>
          </template>
          <div class="itemContainer1">
            <el-button size="mini" class="basicFactSheetBtn">基本情况</el-button>
            <el-button size="mini" class="basicFactSheetBtn">供水系统</el-button>
            <el-button size="mini" class="basicFactSheetBtn">行车路线</el-button>
            <el-button size="mini" class="basicFactSheetBtn">防火设计</el-button>
            <el-button size="mini" class="basicFactSheetBtn">重点部位</el-button>
          </div>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template slot="title">
            <div style="margin-left: 22px;">建筑平面图</div>
          </template>
          <div class="itemContainer1">
            <HorCardList v-bind:items="buildingInfos" v-on:didClickedImage="didClickedBuildingImage"></HorCardList>
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
            <!-- <i class="el-icon-edit-outline edit_icon fl" @click="toFightDeploy"></i> -->
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
        <button type="button" class="editPlanStyle" @click="editPlanClick">预案编辑</button>
      </div>
    </div>

    <FloorGuide v-bind:isShow="showFloorGuide"></FloorGuide>
  </div>
</template>

<script>
import HorCardList from './HorizontalCardList.vue'
import FloorGuide from './FloorGuide'
export default {
  data () {
    return {
      address: '武汉华夏理工学院',
      subAddress: 'XXXX-高校',
      detailAddress: '武汉市江夏区新技术开发区关山大道XXX',
      phoneNumber: '027-XXXXXXXX',

      activeNames: ['1', '2', '3', '4'],
      buildingInfos: [{}, {}, {}, {}, {}],
      showFloorGuide: false
    }
  },
  components: {
    HorCardList,
    FloorGuide
  },
  methods: {
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
      this.showFloorGuide = true
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
