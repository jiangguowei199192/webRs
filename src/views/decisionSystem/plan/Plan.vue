<template>
  <div>
    <div style="width: 380px; margin-left: 10px;">
      <div class="addressInfo">
        <span>{{address}}</span>
        <span>{{subAddress}}</span>
        <span>{{detailAddress}}</span>
        <span>{{phoneNumber}}</span>
      </div>
      <el-collapse v-model="coll_actives">
        <el-collapse-item title="基本情况说明" name="1">
          <el-button size="mini" class="basicFactSheetBtn">单位基本情况</el-button>
          <el-button size="mini" class="basicFactSheetBtn">主要消防设施</el-button>
          <el-button size="mini" class="basicFactSheetBtn">重点部位情况</el-button>
          <el-button size="mini" class="basicFactSheetBtn">力量调集情况</el-button>
          <el-button size="mini" class="basicFactSheetBtn">重点提示</el-button>
        </el-collapse-item>
        <el-collapse-item title="建筑平面图" name="2">
          <HorCardList></HorCardList>
        </el-collapse-item>
        <el-collapse-item title="作战部署图" name="3">
          <div>
            <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 100%;">
          </div>
        </el-collapse-item>
        <el-collapse-item title="三维预案" name="4">
          <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 100%;">
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import HorCardList from './HorizontalCardList.vue'

export default {
  data () {
    return {
      address: '武汉华夏理工学院',
      subAddress: 'XXXX-高校',
      detailAddress: '武汉市江夏区新技术开发区关山大道XXX',
      phoneNumber: '027-XXXXXXXX',

      coll_actives: [1]
    }
  },
  components: {
    HorCardList
  }
}
</script>

<style lang="scss" scoped>
.addressInfo {
  position: relative;
  height: 120px;
  span {
    display: block;
    color: black;
    font-size: 14px;
    margin-top: 10px;
  }
}

.basicFactSheetBtn {
  width: 100px;
  margin-bottom: 10px;
  margin-left: 0px;
  margin-right: 10px;
}

/deep/.el-collapse-item__content {
  padding-bottom: 0;
}
// /deep/.el-collapse-item__header {
//   background-color: rgba(0, 0, 0, 0.1);
// }
// /deep/.el-collapse-item__wrap {
//   background-color: white;
// }
</style>
