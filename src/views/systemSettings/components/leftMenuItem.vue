<template>
  <div>
    <div class="header">
      <!-- <div style="width:63px"><hr class="line1"></div> -->
      <hr class="line1">
      <div class="headerText">{{itemData.headerTitle}}</div>
      <hr class="line2">
    </div>
    <div class="item" v-for="item in itemData.info" :key="item.id" @click="itemClicked(item.id)">
      <img :src="item.selected ? item.selectedImgPath : item.normalImgPath" class="itemImg">
      <span class="itemSpan" :class="item.selected ? 'itemSpanSelected' : 'itemSpanNormal' ">{{item.title}}</span>
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
  },
  data () {
    return {
    }
  },
  methods: {
    itemClicked: function (id) {
      // console.log(id);
      this.$emit('leftBoxDidSelectedItem', id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    margin-top: 26px;
    text-align: center;
    .line1 {
      width: 63px;
      height: 1px;
      color: #1EB0FC;
      background-color: #1EB0FC;
      border-width: 0;
      display: inline-block;
    }
    .headerText {
      width: 83px;
      font-size: 14px;
      font-style: italic;
      color: #ffffff;
      display: inline-block;
    }
    .line2 {
      width: 84px;
      height: 1px;
      color: #1EB0FC;
      background-color: #1EB0FC;
      border-width: 0;
      display: inline-block;
    }
  }
  .item {
    height: 24px;
    margin-top: 16px;
    cursor: pointer;
    .itemImg {
      width:20px;
      height:20px;
      margin: 8px 0px 0px 31px;
    }
    .itemSpan {
      margin-left: 20px;
      line-height: 40px;
      vertical-align: top;
      font-size: 14px;
      color: #85cfe8;
    }
    .itemSpanNormal {
      color: #85cfe8;
    }
    .itemSpanSelected {
      color: #ffffff;
    }
  }
</style>
