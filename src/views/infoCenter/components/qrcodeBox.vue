<template>
  <div class="qrcodeBox">
    <img :src="src">
    <div class="text">
      <span>{{name}}</span>
      <span>扫码关注我们</span>
      <span>更多精彩等待你的发现</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['src', 'name']
}
</script>

<style lang="scss" scoped>
.qrcodeBox {
  border: 1px solid #0188C0;
  width: 288px;
  height: 100px;
  img {
    width: 80px;
    height: 80px;
    margin: 10px 0 0 10px;
  }
  .text {
    float: right;
    width: 170px;
    margin: 14px 18px 0 0;
    font-size: 16px;
    color: #FEFEFE;
    text-align: center;
    span {
      display: block;
    }
  }
}
</style>