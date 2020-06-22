<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="box">
          <div
            class="item"
            :class="{title:index==3,active:isActive==index}"
            v-for="(item,index) in systems"
            :key="index"
            @click.stop="jumpTo(index)"
            @mouseover="showCur(index)"
            @mouseleave="hideCur(index)"
          >
            <span>{{item.content}}</span>
            <template >
              <div class="status" v-if="index==1&&isHowever==index">
                <el-button type="primary" :class="{activeStatus:curActive==1}" @click.stop="curActive=1">实时视频</el-button>
                <el-button type="primary" :class="{activeStatus:curActive==2}" @click.stop="curActive=2">回放</el-button>
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
    },
    hideCur () {
      this.isHowever = ''
    }
  }
}
</script>
<style lang="less" scoped>
.home {
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
    .item {
      position: relative;
      .status {
        position: relative;
        z-index:999;
        width: 300px;
        left: -30px;
        //  top: 54px;
        .el-button {
          width: 140px;
        }
        .activeStatus{
          border:2px solid rgba(233,226,101,1);
        }
      }
    }
    .item:not(:nth-child(4)) {
      cursor: pointer;
      width: 182px;
      height: 52px;
      background: url(../assets/images/unselected.png) no-repeat;
      line-height: 52px;
      text-align: center;
    }
    .item:nth-child(4) {
      border-top: 3px solid #7be4ff;
    }
    // .item:nth-child(n+5){

    // }
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
      // background:url()
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
