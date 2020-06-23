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
            <div
              class="list"
              v-for="(item,index) in listArray"
              :key="index"
              :class="{selected:item.isSelected}"
            >
              <p>
                <span class="area">{{item.area}}</span>
                <i></i>
              </p>
              <div class="btns">
                <el-button
                  class="visible"
                  :style="{backgroundColor:item.visibleIsClick?'rgba(14,90,148,1)':''}"
                  @click.stop="changeStatus(1,index)"
                  v-if="item.visibleText"
                >{{item. visibleText}}</el-button>
                <el-button
                  class="infrared"
                  :style="{backgroundColor:item.infraredIsclick?'rgba(14,90,148,1)':''}"
                  @click.stop="changeStatus(2,index)"
                  :class="{isSelected:item.infraredIsclick}"
                  v-if="item.infraredText"
                >{{item.infraredText}}</el-button>
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
      listArray: [
        {
          area: '发展大道黄浦路1',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        },
        {
          area: '发展大道黄浦路2',
          infraredText: '红外光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        },
        {
          area: '发展大道黄浦路3',
          visibleText: '可见光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        },
        {
          area: '发展大道黄浦路4',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        }
      ],
      isClick: false
    }
  },
  methods: {
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    closeRightInfo (type) {
      this.showRight = type !== 1
    },
    changeStatus (type, index) {
      if (type === 1) {
        this.listArray[index].visibleIsClick = true
        this.listArray[index].isSelected = true
      } else {
        this.listArray[index].infraredIsclick = true
        this.listArray[index].isSelected = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.videoContainer {
  .leftContainer {
    box-sizing: border-box;
    padding: 27px 25px 0 28px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;

    div.tab {
      display: flex;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      color: #23cefd;
      background: #1a3e68;
      text-align: center;
       div{
         width:104px;
       }
      div.active {
        width: 126px !important;
        color: #fff;
      }
      div:nth-child(1).active {
        background: url(../../assets/images/left.png) no-repeat;
      }
      div:nth-child(2).active {
        background: url(../../assets/images/right.png) no-repeat;
      }
    }
    div.search {
      margin-top: 20px;
    }
    div.list {
      margin-top: 20px;
      padding-left: 10px;
      padding-top: 10px;
      height: 62px;
      background: url(../../assets/images/list-unselected.png) no-repeat;
      p {
        margin-bottom: 8px;
        color: #1eb0fc;
        i {
          display: inline-block;
          width: 17px;
          height: 10px;
          background: url(../../assets/images/live.png) no-repeat;
          margin-left: 12px;
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
          background: #10243f;
          color: #1eb0fc;
          text-align: right;
          padding-right: 8px;
        }
        button.visible {
          background: url(../../assets/images/visible.png) no-repeat 4px center;
        }
        button.infrared {
          background: url(../../assets/images/infrared.png) no-repeat 4px center;
        }
      }
    }
    div.selected {
      background: url(../../assets/images/list-selected.png) no-repeat;
    }
  }
}
</style>
