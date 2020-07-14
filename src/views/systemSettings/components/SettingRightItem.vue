<template>
  <div class="baseBox">
    <div class="title">{{itemData.headerTitle}}</div>
    <div class="table">
      <div class="item" v-for="item in itemData.items" :key="item.id" :class="item.id ? 'otherItem' : 'firstItem' ">
        <span class="titleSpan">{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .baseBox {
    width: 686px;
    margin: auto;
  }
  .title {
    color: #ffffff;
    font-size: 18px;
    height: 44px;
  }
  .table {
    border-radius: 10px;
    border: solid 1px #39a4dd;
  }
  .item {
    height: 50px;
    .titleSpan {
      display: inline-block;
      margin: 17px 0px 0px 23px;
      color: #ffffff;
      font-size: 14px;
    }
  }
  .firstItem {
    border-top: none;
  }
  .otherItem {
    border-top: solid 1px #39a4dd;
  }
</style>
