<template>
  <div>
    <div class="header">
      <!-- <div style="width:63px"><hr class="line1"></div> -->
      <div class="line1"></div>
      <div class="headerText">{{ itemData.headerTitle }}</div>
      <div class="line2"></div>
    </div>
    <div
      class="item"
      v-for="item in itemData.info"
      :key="item.id"
      @click="itemClicked(item.id)"
    >
      <img
        :src="item.selected ? item.selectedImgPath : item.normalImgPath"
        class="itemImg"
      />
      <span
        class="itemSpan"
        :class="item.selected ? 'itemSpanSelected' : 'itemSpanNormal'"
        >{{ item.title }}</span
      >
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
    return {}
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
  height: 35px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .line1 {
    width: 63px;
    height: 1px;
    color: #1eb0fc;
    background-color: #1eb0fc;
  }
  .headerText {
    width: 83px;
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    color: #fff;
    margin-left: 15px;
  }
  .line2 {
    width: 84px;
    height: 1px;
    color: #1eb0fc;
    background-color: #1eb0fc;
  }
}
.item {
  height: 35px;
  cursor: pointer;
  .itemImg {
    width: 20px;
    height: 20px;
    margin: 8px 0px 0px 31px;
    vertical-align: top;
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
    color: #fff;
  }
}
</style>
