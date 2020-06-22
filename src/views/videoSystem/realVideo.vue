<template>
  <div class="videoContainer">
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:index==0}" @click.stop="index=0">已选</div>
            <div :class="{active:index==1}" @click.stop="index=1">全部</div>
          </div>
          <template v-if="index==0">
            <div class="search">
              <el-input type="text" placeholder="请输入设备名称" suffix-icon="el-icon-search"></el-input>
            </div>
            <div class="list" v-for="(item,index) in listArray" :key="index">
              <p>
                <span class="area">{{item.area}}</span>
                <i></i>
              </p>
              <div class="btns">
                <el-button class="visible">可见光</el-button>
                <el-button class="infrared">红外光</el-button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div slot="center">中</div>
      <div slot="right"></div>
    </VideoMain>
  </div>
</template>
<script>
import VideoMain from './components/main'
export default {
  name: 'videoContainer',
  components: {
    VideoMain
  },
  data () {
    return {
      showLeft: true,
      showRight: true,
      index: 0,
      listArray: [{ area: '发展大道黄浦路1' }, { area: '发展大道黄浦路2' }, { area: '发展大道黄浦路3' }, {
        area: '发展大道黄浦路4'
      }]
    }
  },
  methods: {
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    closeRightInfo (type) {
      this.showRight = type !== 1
    }
  }
}
</script>
<style lang="less">
.videoContainer {
  .leftContainer {
    box-sizing: border-box;
    padding: 27px 25px 0 28px;
    // text-align: center;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;

    div.tab {
      display: flex;
      // justify-content: space-between;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      color: #23cefd;
      div {
        flex: 1;
      }
      div.active {
        color: #fff;
      }
    }
    div.search {
      margin-top: 20px;
    }
    div.list {
      margin-top: 20px;
      padding-left:10px;
      padding-top:10px;
      height: 62px;
      background:url(../../assets/images/list-unselected.png) no-repeat;
      p {
        margin-bottom: 8px;
        color: #1eb0fc;
        i{
          display: inline-block;
          width:17px;
          height:10px;
          background:url(../../assets/images/live.png) no-repeat;
          margin-left:12px;
        }
      }
      div.btns {
        button {
          font-size: 12px;
          font-weight: bold;
          box-sizing: border-box;
          width: 74px;
          height: 22px;
          line-height: 22px;
          border: 1px solid rgba(30, 176, 252, 1);
          padding: 0;
          background:#10243F;
          color:#1EB0FC;
          text-align:right;
          padding-right:8px;
        }
        button.visible{
          background:url(../../assets/images/visible.png) no-repeat  4px center;
        }
        button.infrared{
            background:url(../../assets/images/infrared.png) no-repeat  4px center;
        }
      }
    }
  }
}
</style>
