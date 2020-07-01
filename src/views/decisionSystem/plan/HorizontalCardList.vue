<template>
<!-- 横向卡片列表 -->
  <div>
    <div class="item" v-for="(item, index) in items">
      <img src="http://img4.imgtn.bdimg.com/it/u=3773584324,1413178473&fm=214&gp=0.jpg">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 假数据
    }
  }
}
</script>

<style>
  .item {
    position: relative;
    width: 50px;
    height: 50px;
    background-color: green;
  }
</style>
