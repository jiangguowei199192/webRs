<template>
  <div class="base">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="list webFsScroll">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <span class="item-title" :title="item.title">{{item.title}}</span>
        <span class="item-time">{{item.time}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
      list: [
        {
          title:
            '1.样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例样例',
          time: '2021-03-18'
        },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' },
        { title: '1.样例', time: '2021-03-18' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.base {
  width: 916px;
  height: 385px;
  background: url(../../../assets/images/infoCenter/policy-bg.png) no-repeat;
  background-size: 100% 100%;
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
  margin-top: 20px;
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
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    color: #00cff9;
    cursor: pointer;
    .item-title {
      width: 700px;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-time {
      float: right;
      margin-right: 28px;
    }
  }
}
</style>
