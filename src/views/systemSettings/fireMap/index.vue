<template>
  <div>
    <div class="container">
      <button type="button" class="back" @click="back">
        <img :src="backImg">
        火情地图
      </button>
      <div class="rightBox"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png')
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    width: 170px;
    height: 40px;
    border: solid 1px #39a4dd;
    font-size: 18px;
    color: #ffffff;
    background-color: transparent;
    outline: none;
    display: block;
  }
  .container {
    width: 1242px;
    height: 756px;
    margin: 55px auto 0 auto;
  }
  .rightBox {
    width: 796px;
    height: 682px;
    border: solid 2px #39a4dd;
    border-radius: 10px;
    margin: 30px auto 0 auto;
  }
</style>
