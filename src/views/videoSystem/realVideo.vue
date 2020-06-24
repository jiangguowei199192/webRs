<template>
  <div class="videoContainer">
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <!-- 左侧部分 -->
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
          <template v-if="index==0">
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
          <template v-if="index==1">
            <div class="tree">
              <el-tree
                :data="data5"
                highlight-current
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node,data }">
                  <span>
                    <!-- 控制一级菜单的图标 -->
                    <span :class="data.class" v-if="data.class"></span>
                    <img src="../../assets/images/onlive.png" v-if="data.isShow">
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </template>
        </div>
      </div>
      <!-- 中间部分 -->
      <div slot="center">中</div>
      <!-- 右侧部分 -->
      <div slot="right">
        <div class="rightContent">
          <div class="baseInfo">
            <div class="info">基本信息</div>
            <div class="detail">
              <ul>
                <li>
                  <span>设备名称：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>设备编号：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>设备品牌：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>设备状态：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>所在地点：</span>
                  <span>xxx</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="deviceInfo">
            <div class="info">云台</div>
            <div class="operate">
              <div class="icons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div class="btns">
                <div>
                  <span>+</span>
                  <b>变倍</b>
                  <span>-</span>
                </div>
                <div>
                  <span>+</span>
                  <b>变焦</b>
                  <span>-</span>
                </div>
                <div>
                  <span>+</span>
                  <b>光圈</b>
                  <span>-</span>
                </div>
              </div>
              <div class="slider">
                <span class="demonstration">步速</span>
                <el-slider
                  v-model="value2"
                  :min="1"
                  :max="8"
                  style="width:91px;margin-left:16px;margin-right:8px;"
                ></el-slider>
                <span>{{value2}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      data5: [
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
                  id: 9,
                  label: '三级 1-1-1',
                  isShow: false
                },
                {
                  id: 10,
                  label: '三级 1-1-2',
                  isShow: false
                }
              ]
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
              label: '二级 2-1',
              isShow: false
            },
            {
              id: 6,
              label: '二级 2-2',
              isShow: false
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showLeft: true, // 是否展开左侧部分
      showRight: true, // 是否展开右侧部分
      index: 0, // 默认展示已选 0已选 1全部
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
      input: '', // 设备名称
      value2: 4 // 步速值
    }
  },
  methods: {
    // 左侧菜单显示与隐藏
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    // 右侧信息显示与隐藏
    closeRightInfo (type) {
      this.showRight = type !== 1
    },
    // 点击按钮
    changeStatus (type, index) {
      if (type === 1) {
        this.listArray[index].visibleIsClick = true
      } else {
        this.listArray[index].infraredIsclick = true
      }
      this.listArray[index].isSelected = true
    },
    // 点击数节点
    handleNodeClick (data) {
      console.log(data)
      if (!data.children) {
        data.isShow = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.videoContainer {
  box-sizing: border-box;
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
      }
    }
    div.selected {
      background: url(../../assets/images/list-selected.png) no-repeat;
    }
  }
  .rightContent {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 14px;
    padding: 15px 10px;
    .baseInfo,
    .deviceInfo {
      .info {
        box-sizing: border-box;
        width: 202px;
        height: 45px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 45px;
        padding-left: 35px;
      }
    }
    .baseInfo {
      .detail {
        margin-top: 22px;
        ul {
          padding-left: 24px;
          li {
            line-height: 20px;
            text-align: justify;
          }
          li:not(:nth-child(1)) {
            margin-top: 14px;
          }
          li:nth-child(2) {
            margin-top: 17px;
          }
        }
      }
    }
    .deviceInfo {
      margin-top: 130px;
      .info {
        padding-left: 50px;
      }
      .operate {
        margin-top: 20px;
        .icons {
          display: flex;
          flex-wrap: wrap;
          padding-left: 48px;
          div {
            width: 48px;
            height: 48px;
            margin-right: 19px;
            margin-bottom: 19px;
            cursor: pointer;
          }
          div:nth-child(1) {
            background: url(../../assets/images/device/1.png) no-repeat;
          }
          div:nth-child(2) {
            background: url(../../assets/images/device/2.png) no-repeat;
          }
          div:nth-child(3) {
            background: url(../../assets/images/device/3.png) no-repeat;
          }
          div:nth-child(4) {
            margin-right: 10px;
            background: url(../../assets/images/device/4.png) no-repeat;
          }
          div:nth-child(5) {
            width: 64px;
            height: 64px;
            position: relative;
            top: -7px;
            // left: -5px;
            margin-right: 10px;
            background: url(../../assets/images/device/5.png) no-repeat;
          }
          div:nth-child(6) {
            background: url(../../assets/images/device/6.png) no-repeat;
          }
          div:nth-child(7) {
            background: url(../../assets/images/device/7.png) no-repeat;
          }
          div:nth-child(8) {
            background: url(../../assets/images/device/8.png) no-repeat;
          }
          div:nth-child(9) {
            background: url(../../assets/images/device/9.png) no-repeat;
          }
        }
        .btns {
          box-sizing: border-box;
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 18px;
          // color:rgb(24, 93, 121);
          > div {
            width: 201px;
            height: 37px;
            line-height: 37px;
            text-align: center;
            margin-left: 39px;
            background: rgba(46, 108, 147, 1);
            border: 1px solid rgba(28, 161, 220, 1);
            color: #84ddff;
            display: flex;
            justify-content: space-between;
            margin-bottom: 13px;
            span {
              display: inline-block;
              width: 48px;
              font-size: 24px;
              cursor: pointer;
            }
            span:nth-child(1):after {
              content: "|";
              position: relative;
              left: 15px;
              color: #1ca1dc;
            }
            span:nth-child(3):before {
              content: "|";
              position: relative;
              left: -15px;
              color: #1ca1dc;
            }
          }
        }
        .slider {
          display: flex;
          padding-left: 39px;
          span {
            line-height: 38px;
          }
          span:nth-child(3) {
            display: inline-block;
            width: 38px;
            height: 24px;
            background: rgba(46, 108, 147, 1);
            border: 1px solid rgba(28, 161, 220, 1);
            border-radius: 10px;
            text-align: center;
            position: relative;
            top: 5px;
            line-height: 24px;
          }
          /deep/.el-slider__bar {
            background-color: #84ddff;
          }
          /deep/.el-slider__button {
            background-color: #84ddff;
          }
        }
      }
    }
  }
  // 修改树形控件样式
  /deep/.tree {
    font-size: 18px;

    font-family: Source Han Sans CN;
    font-weight: bold;
    margin-top: 24px;
    .el-tree {
      color: #23cefd;
      background-color: transparent;
      .el-tree-node {
        .el-tree-node__content {
          line-height: 28px;
        }
        .el-icon-caret-right {
          color: #23cefd;
        }
      }
    }
    .custom-tree-node {
      > span {
        span {
          display: inline-block;
          width: 30px;
          height: 30px;
          vertical-align: middle;
        }
        span.unmanned {
          background: url(../../assets/images/noman.png) no-repeat center center;
        }
        span.highdevice {
          background: url(../../assets/images/high.png) no-repeat center center;
          position: relative;
          top: -2px;
        }
      }
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background: #096090;
    }
    .el-tree-node__content:hover {
      background-color: #096090;
    }
  }
}
</style>
