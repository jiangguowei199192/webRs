<template>
<!-- 横向卡片列表 -->
  <div class="container webFsScroll">
    <div class="item" v-for="(item, index) in items" :key="index">
      <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg" style="width: 100%; height: 100%;">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 假数据
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 85px;
  overflow-x: auto;
  white-space: nowrap;
}
.item {
  display: inline-block;
  width: 90px;
  height: 53px;
  background-color: green;
  margin-right: 10px;
  margin-top: 10px;
}

</style>
