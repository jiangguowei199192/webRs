<template>
  <div class="baseBox">
    <div class="base">
      <div class="title">
        <span>{{ newsInfo.title }}</span>
      </div>
      <div class="list listScroll">
        <div
          class="list-item"
          v-for="(item, index) in newsInfo.list"
          :key="index"
        >
          <span
            class="item-title"
            :title="item.subTitle"
            @click="goOut(item.url)"
            >{{ item.subTitle }}</span
          >
          <span class="item-time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['newsInfo'],
  data () {
    return {}
  },
  methods: {
    goOut (url) {
      var out = window.open('_blank')
      out.location = url
    }
  }
}
</script>

<style lang="scss" scoped>
.baseBox {
  box-sizing: border-box;
  width: 50%;
  padding: 0px 14px;
}
.base {
  box-sizing: border-box;
  height: 385px;
  background: url(../../../assets/images/infoCenter/policy-bg.png) no-repeat;
  background-size: 100% 100%;
  padding-top: 20px;
}
.title {
  width: 218px;
  height: 30px;
  line-height: 30px;
  background: linear-gradient(
    to right,
    #00d2ff,
    rgba($color: #00d2ff, $alpha: 0)
  );
  margin-left: 20px;
  font-size: 18px;
  font-weight: bold;
  span {
    margin-left: 17px;
  }
}
.list {
  height: 300px;
  margin: 20px 10px 0 32px;
  overflow: auto;
  .list-item {
    display: flex;
    justify-content: space-between;
    height: 37px;
    line-height: 37px;
    font-size: 18px;
    color: #00cff9;
    cursor: pointer;
    .item-title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    .item-time {
      min-width: 120px;
      margin-right: 28px;
      text-align: right;
    }
  }
}
</style>
