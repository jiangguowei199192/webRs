<template>
  <div>
    <div class="header">
      <div class="headerText">{{itemData.headerTitle}}</div>
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
    height: 22px;
    margin-top: 26px;
    text-align: center;
    background: url('../../../assets/images/Setting/setting-header.png') no-repeat center;
    .headerText {
      width: 57px;
      font-size: 14px;
      font-style: italic;
      color: #ffffff;
      margin-left: 131px;
    }
  }
  .item {
    height: 24px;
    margin-top: 16px;
    cursor: pointer;
    .itemImg {
      width:24px;
      height:24px;
      margin: 8px 0px 0px 31px;
    }
    .itemSpan {
      margin-left: 20px;
      line-height: 40px;
      vertical-align: top;
      font-size: 18px;
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
