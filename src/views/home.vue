<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="box">
          <div
            v-for="(item,index) in systems"
            :key="index"
            class="list"
            @click.stop="jumpTo(index)"
            @mouseover="showCur(index)"
          >
            <div class="item" :class="{title:index==3,active:isActive==index}">
              <span>{{item.content}}</span>
            </div>
            <template >
            <div class="status" v-if="index==1">
              <el-button
                type="primary"
                :class="{activeStatus:curActive==1}"
                @click.stop="curActive=1"
              >实时视频</el-button>
              <el-button
                type="primary"
                :class="{activeStatus:curActive==2}"
                @click.stop="curActive=2"
              >回放</el-button>
            </div>
            </template>
          </div>
        </div>
        <div class="cur">
          <div class="realTime">显示当前日期和所在城市</div>
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
      ],
      isHowever: 0,
      curActive: 1
    }
  },
  methods: {
    jumpTo (index) {
      if (index !== 3) {
        this.isActive = index
      }
    },
    showCur (index) {
      this.isHowever = index
    }
    // hideCur () {
    //   this.isHowever = ''
    // }
  }
}
</script>
<style lang="less" scoped>
.home {
   background: url(../assets/images/bakcground.png) no-repeat;
  .el-header {
    margin-top: 36px;
    height: auto !important;
    padding: 0 62px 0 46px;
  }
  .box {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    font-weight: 500;
    .list {
      position: relative;
      z-index: 1;
      .item {
        position: relative;
      }
      .status {
        position: absolute;
        z-index: 999;
        width: 300px;
        left: -30px;
        padding-top: 30px;
        display: none;
        .el-button {
          width: 140px;
          background: #082d56;
        }
        .activeStatus {
          border: 2px solid rgba(233, 226, 101, 1);
          color: #e9e265;
        }
      }
    }
    // :list:not(:nth-child(4)) .status{
    //   display: none;
    // }
    .list:not(:nth-child(4)):hover .status{
      display: block!important;
    }
    div.list:not(:nth-child(4)) .item {
      cursor: pointer;
      width: 182px;
      height: 52px;
      background: url(../assets/images/unselected.png) no-repeat;
      line-height: 52px;
      text-align: center;
    }
    .list:nth-child(4) .item  {
      border-top: 3px solid #7be4ff;
    }
    .title {
      width: 559px;
      text-align: center;
      padding-top: 11px;
      font-size: 36px;
      font-weight: bold;
      margin-top: -13px;
      font-family: Source Han Sans CN;
      background: linear-gradient(
        90deg,
        rgba(0, 168, 217, 0.01) 0%,
        rgba(0, 168, 217, 0) 100%
      );
      span {
        text-shadow: #000 3px 4px 5px;
      }
    }
    .active {
      background: url(../assets/images/selected.png) no-repeat !important;
    }
  }
  .cur {
    position: relative;
    margin-top: 8px;
    margin-bottom: 25px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    height: 40px;
    line-height: 40px;
    text-align: center;
    .realTime {
      width: 936px;
      background:url(../assets/images/logo.png) no-repeat;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
