<template>
  <div>
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
          <div class="search">
            <el-input
              type="text"
              v-model.trim="input"
              placeholder="请输入设备名称"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <!-- 默认展示已选部分 -->
          <template v-if="index==0">
            <div
              class="list"
              v-for="(item,index) in listArray"
              :key="index"
              :class="{selected:selectedIndex==index}"
            >
              <p>
                <span class="area">{{item.area}}</span>
                <i></i>
              </p>
              <div class="btns">
                <el-button
                  :class="{visible:true, selected:curDevice==item.id, playing:item.playVl}"
                  @click.stop="changeSelectDevice(item.id,index)"
                  v-if="item.visibleText"
                >{{item. visibleText}}</el-button>
                <el-button
                  :class="{infrared:true, selected:curDevice==item.idIr, playing:item.playIr}"
                  @click.stop="changeSelectDevice(item.idIr,index)"
                  v-if="item.infraredText"
                >{{item.infraredText}}</el-button>
              </div>
            </div>
          </template>
          <!-- 全部部分 -->
          <template v-if="index==1">
            <Tree :treeData="treeArray" @selectedChange="getSelectedData"></Tree>
          </template>
        </div>
      </div>
      <div slot="center">
        <!-- <VideoWall :videoInfo.sync="videoInfo"></VideoWall> -->
        <div class="video">
          <div class="box">
            <div class="title">回放</div>
            <div>当前选中：解放大道高点1</div>
          </div>
          <div class="videoList">
            <div v-for="(item,index) in 9" :key="index"></div>
          </div>
          <!-- 下面按钮部分 -->
          <div class="tools">
            <div class="leftTool">
              <img :src="ninePalace" />
              <img :src="fourPalace" />
              <img :src="onePalace" />
            </div>
            <div class="rightTool">
              <img :src="stop" />
              <img :src="play" />
              <img :src="fullScreen" />
            </div>
          </div>
          <TimeBar class="time" :segments="records"></TimeBar>
        </div>
      </div>
      <div slot="right">
        <Calendar></Calendar>
      </div>
    </VideoMain>
  </div>
</template>
<script>
import VideoMain from './components/main'
import Calendar from './components/calendar'
import TimeBar from './components/timeBar'
import Tree from './components/tree'
import videoMixin from './mixins/videoMixin'
// import VideoWall from './components/videoWall'
export default {
  name: 'videoContainer',
  components: {
    VideoMain,
    Calendar,
    TimeBar,

    Tree

    // VideoWall
  },
  mixins: [videoMixin],
  data () {
    return {
      curDevice: '0', // 当前选中设备
      stop: require('../../assets/images/stop.png'),
      play: require('../../assets/images/play.png'),
      records: [{ start: 60, duration: 90 }],
      treeArray: [
        {
          id: 1,
          label: '高点设备',
          class: 'highdevice',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 12,
                  label: '三级 1-1-1'
                  // isShow: false
                },
                {
                  id: 13,
                  label: '三级 1-1-2'
                  // isShow: false
                }
              ]
            },
            {
              id: 9,
              label: '二级 2-1'
            }
          ]
        },
        {
          id: 2,
          label: '无人机',
          class: 'unmanned',
          children: [
            {
              id: 5,
              label: '二级 2-1'
              // isShow: false
            },
            {
              id: 6,
              label: '二级 2-2'
              // isShow: false
            }
          ]
        }
      ],
      listArray: [
        {
          area: '发展大道黄浦路1',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          idIr: '1',
          id: '11',
          playVl: false,
          playIr: false
        },
        {
          area: '发展大道黄浦路2',
          infraredText: '红外光',
          isSelected: false,
          idIr: '22',
          id: '2',
          playVl: false,
          playIr: false
        },
        {
          area: '发展大道黄浦路3',
          visibleText: '可见光',
          isSelected: false,
          idIr: '33',
          id: '3',
          playVl: false,
          playIr: false
        },
        {
          area: '发展大道黄浦路4',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          idIr: '44',
          id: '4',
          playVl: false,
          playIr: false
        }
      ],
      videoInfo: { srcUrl: '', isLive: true }
    }
  },
  methods: {
    // 获取子组件传递过来的数据
    getSelectedData (data) {},

    /**
     * 修改选中设备
     */
    changeSelectDevice (id, index) {
      this.curDevice = id
      this.selectedIndex = index
    }
  }
}
</script>
<style lang="less" scoped>
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
    div {
      width: 104px;
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
    background: #10203b;
    /deep/ .el-input__inner {
      background: #10203b;
      border: 1px solid #1eb0fc;
      color: #1eb0fc;
    }

    ::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: #1eb0fc;
    }
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
      button.selected {
        border: 1px solid rgba(0, 255, 17, 1);
      }
      button.playing {
       background:rgba(0,212,14,1);
      }
    }
  }
  div.selected {
    background: url(../../assets/images/list-selected.png) no-repeat;
  }
}

.video {
  box-sizing: border-box;
  padding: 21px 0px 0px 21px;
  // position: relative;
  .box {
    display: flex;
    justify-content: space-between;
    margin-right: 64px;
    .title {
      width: 202px;
      height: 45px;
      background: url(../../assets/images/device/info-title.png) no-repeat;
      line-height: 45px;
      padding-left: 30px;
    }
  }
  .videoList {
    display: flex;
    flex-wrap: wrap;
    > div {
      // width: 384px;
      width: 31%;
      box-sizing: border-box;
      height: 223px;

      margin-right: 11px;
      margin-bottom: 11px;
      background: url(../../assets/images/video.png) no-repeat center center;
      background-color: #00497c;
    }
  }
  .tools {
    position: absolute;
    bottom: 75px;
    width: 95%;
    height: 65px;
    background: url(../../assets/images/tool-bar.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    .leftTool,
    .rightTool {
      position: relative;
      top: 22px;
      left: 40px;
      img {
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .rightTool {
      margin-right: 90px;
    }
  }

  .time {
    position: absolute;
    bottom: 25px;
    width: 92%;
    left: 40px;
  }
}
</style>
