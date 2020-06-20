<template>
    <div class="box">
        <div class="left" v-show="showLeft">
          <slot name="left"></slot>
        </div>
        <div class="center">
           <slot name="center"></slot>
        </div>
        <div class="right"  v-show="showRight">
           <slot name="right"></slot>
          </div>
    </div>
</template>
<script>
export default {
  name: 'box',
  props: {
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="less">
.box{
    display: flex;
    justify-content: space-between;
    .left{
        width:283px;
    }
    .right{
        width:273px;
    }
    .left,.right{
        height:899px;
        border:1px solid #ddd;
        position: relative;
    }
    .center{
        flex:1;
        margin:0 40px;
    }
}
</style>
