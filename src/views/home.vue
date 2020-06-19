<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="box">
          <!-- <div class="item" :class="{active:index==0}">
            <span>智慧决策系统</span>
          </div>
          <div class="item" :class="{active:index==1}">
            <span>视频侦查</span>
          </div>
          <div class="item">
            <span>评战系统</span>
          </div>
          <div class="item title " :class="{active:index==2}">
            <span>智慧消防指挥调度系统</span>
          </div>
          <div class="item" :class="{active:index==3}">
            <span>数字化单兵</span>
          </div>
          <div class="item" :class="{active:index==4}">
            <span>数字化装备</span>
          </div>
          <div class="item" :class="{active:index==5}">
            <span>系统设置</span>
          </div>-->
          <div
            class="item"
            :class="{title:index==3,active:isActive==index}"
            v-for="(item,index) in systems"
            :key="index"
            @click.stop="jumpTo(index)"
          >
            <span>{{item.content}}</span>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      isActive: '1',
      systems: [
        {
          content: '智慧决策系统'
        },
        {
          content: '视频侦查'
        },
        {
          content: '评战系统'
        },
        {
          content: '消防救援现场指挥系统'
        },

        {
          content: '数字化单兵'
        },
        {
          content: '数字化装备'
        },
        {
          content: '系统设置'
        }
      ]
    }
  },
  methods: {
    jumpTo (index) {
      if (index !== 3) {
        this.isActive = index
      }
    }
  }
}
</script>
<style lang="less">
.home {
  .el-header {
    margin-top: 30px;
  }
  .box {
    display: flex;
    justify-content: space-between;
    font-size:24px;
    font-weight: 500;
    .item:not(:nth-child(4)) {
      cursor: pointer;
      width:182px;
      height:52px;
      background:url(../assets/images/unselected.png);
      line-height: 52px;
      text-align: center;
    }
    .item:nth-child(4){
      border-top: 1px solid #7BE4FF
    }
    .title {
      padding-top:11px;
      font-size: 36px;
      font-weight:bold;
      margin-top: -13px;
    }
    .active {
      // border-bottom: 1px solid #fff;
       background:url(../assets/images/selected.png)!important
    }
  }
}
</style>
