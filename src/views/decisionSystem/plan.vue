<template>
  <div>
    <div class="addressInfo">
      <div>{{address}}</div>
      <div>{{subAddress}}</div>
      <div>{{detailAddress}}</div>
      <div>{{phoneNumber}}</div>
    </div>
    <el-collapse v-model="coll_actives">
      <el-collapse-item title="基本情况说明" name="1">
        <div>基本情况说明</div>
        <div>基本情况说明</div>
        <div>基本情况说明</div>
      </el-collapse-item>
      <el-collapse-item title="建筑平面图" name="2">
        <el-row gutter="50">
          <el-col span="6">
            <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 75px; height: 68px;">
          </el-col>
          <el-col span="6">
            <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 75px; height: 60px;">
          </el-col>
          <el-col span="6">
            <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 75px; height: 60px;">
          </el-col>
          <el-col span="6">
            <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 75px; height: 60px;">
          </el-col>
        </el-row>
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
</template>

<script>
export default {
  data() {
    return {
      address: '地址',
      subAddress: '描述',
      detailAddress: '具体地址',
      phoneNumber: '电话',

      coll_actives: [1],
    };
  },
};
</script>

<style>
.addressInfo {
  position: relative;
  height: 100px;
}
.el-col {
  background-color: red;
  
}
</style>