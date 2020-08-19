<template>
  <div class="container">
    <div class="header">
      <div class="back">
        <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="backToPlan">指挥决策</el-button>
      </div>
    </div>
    <div class="main" :style="'height:' + workHeight + 'px;'">
      <div class="content">
        <img src="http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png" alt />
      </div>
      <div class="left">
        <div class="model_edit" :style="'height:' + (this.workHeight - 60) + 'px;'">
          <div class="edit_menu">
            <i class="el-icon-delete" title="删除"></i>
            <i class="el-icon-folder-opened" title="保存"></i>
            <i class="el-icon-share" title="分享"></i>
            <i class="el-icon-printer" title="打印"></i>
          </div>
          <el-select
            placeholder="常用"
            size="mini"
            v-model="filterText"
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div
            class="edit_list ownScrollStyle"
            :style="'height:' + (this.workHeight - 60 - 110) + 'px;'"
          >
            <ul class="fl">
              <li
                :style="{ backgroundColor:item.bgColor}"
                v-for="item in areaList"
                :key="item.index"
                draggable="true"
                @dragstart="drag(item)"
              >{{item.area}}</li>
            </ul>
            <ul class="fr">
              <li
                :style="{ backgroundColor:item.bgColor}"
                v-for="item in markList"
                :key="item.index"
                draggable="true"
                @dragstart="drag(item)"
              >
                <!-- <img :src="item.imgSrc" alt /> -->
                <i :class="item.icon"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail"></div>
      <div class="right">
        <h3>停靠设置/任务分配</h3>
        <div class="task_list ownScrollStyle" :style="'height:' + (this.workHeight - 60) + 'px;'">
          <div class="list_wrap" v-for="item in arrList" :key="item.index">
            <div class="list_left">
              <el-tree
                v-for="item in taskList"
                :key="item.index"
                :data="taskList"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                @node-click="handleNodeClick"
              ></el-tree>
              <!-- <p>任务: 人员疏散</p> -->
            </div>
            <div class="list_right">
              <el-tree
                v-for="item in selectList"
                :key="item.index"
                :data="selectList"
                :props="defaultProps"
                node-key="id"
                :default-expanded-keys="[1]"
                @node-click="handleNodeClick"
              ></el-tree>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'fightDeploy',

  data () {
    return {
      minHeight: 700,
      fullHeight: 0,
      workHeight: 0,

      areaList: [],
      markList: [],
      taskList: [
        {
          id: 1,
          label: '汉口北中队: 5辆车',
          children: [
            {
              label: '水罐消防车'
            },
            {
              label: '云梯消防车'
            },
            {
              label: '泡沫消防车'
            },
            {
              label: '登高平台消防车'
            },
            {
              label: '抢险救援消防车'
            }
          ]
        }
      ],
      selectList: [
        {
          id: 1,
          label: '1号作业区',
          children: [
            {
              id: 111,
              label: '1区-1',
              children: [
                {
                  label: '1区-1-1'
                }
              ]
            },
            {
              id: 121,
              label: '1区-2',
              children: [
                {
                  label: '1区-2-1'
                }
              ]
            },
            {
              id: 131,
              label: '1区-3',
              children: [
                {
                  label: '1区-3-1'
                }
              ]
            },
            {
              id: 141,
              label: '1区-4',
              children: [
                {
                  label: '1区-4-1'
                }
              ]
            },
            {
              id: 151,
              label: '1区-5',
              children: [
                {
                  label: '1区-5-1'
                }
              ]
            }
          ]
        }
      ],
      arrList: [1, 1, 1, 1, 1],
      filterText: '',
      options: [
        {
          value: '1',
          label: '北京'
        },
        {
          value: '2',
          label: '上海'
        },
        {
          value: '3',
          label: '广州'
        },
        {
          value: '4',
          label: '武汉'
        },
        {
          value: '5',
          label: '杭州'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  created () {
    this.setWorkAreaHeight()
    window.onresize = () => {
      this.setWorkAreaHeight()
    }

    var items1 = ['指挥区', '作业区', '集结区', '休整区', '入口']
    var items2 = [
      'el-icon-headset',
      'el-icon-school',
      'el-icon-sell',
      'el-icon-trophy',
      'el-icon-watch'
    ]
    for (var i = 0; i < 10; i++) {
      this.areaList.push({
        area: items1[Math.floor(Math.random() * items1.length)],
        bgColor: '#' + Math.random().toString(16).substr(2, 6).toUpperCase()
      })
      this.markList.push({
        icon: items2[Math.floor(Math.random() * items1.length)],
        bgColor: '#' + Math.random().toString(16).substr(2, 6).toUpperCase()
      })
    }
  },

  destroyed () {
    window.onresize = null
  },

  methods: {
    setWorkAreaHeight () {
      var h = document.documentElement.clientHeight
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
      this.workHeight = this.fullHeight - 126 - 20
      // console.log(this.workHeight)
    },

    backToPlan () {
      //   console.log(545)
      this.$router.back(-1)
    },

    handleNodeClick () {
      // console.log('出来混迟早是要还的')
    },

    visibleChange (value) {
      // if (!value) this.filterText = ''
      setTimeout(function () {
        var tagTextList = document
          .querySelector('#app')
          .querySelectorAll('.el-input__inner')
        // console.log(tagTextList)
        tagTextList.forEach((item) => {
          item.setAttribute('title', item.value)
        })
      }, 100)
    },

    renderContent () {
      console.log('出来混迟早是要还的')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  .header {
    width: 98%;
    height: 50px;
    line-height: 50px;
    position: absolute;
    top: 110px;
    .back {
      margin-left: 20px;
      /deep/.el-button {
        width: 120px;
        font-size: 14px;
      }
    }
  }
  .main {
    position: relative;
    overflow-y: hidden;
    .content {
      height: 100%;
    }
    .left {
      z-index: 999;
      height: 100%;
      position: absolute;
      left: 0;
      top: 30px;
      .model_edit {
        width: 255px;
        background-color: rgba(0, 0, 0, 0.5);
        .edit_menu {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          i {
            display: block;
            width: 35px;
            height: 35px;
            background-color: rgba(255, 255, 255, 0.8);
            color: rgb(108, 140, 243);
            border-radius: 50%;
            line-height: 35px;
            font-size: 22px;
            text-align: center;
            margin: 8px;
            cursor: pointer;
          }
        }
        /deep/.el-input {
          width: 232px;
        }
        .edit_list {
          overflow-y: auto;
          margin-top: 15px;
          ul {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            margin: 0 10px;
            li {
              width: 105px;
              height: 105px;
              font-size: 14px;
              line-height: 100px;
              text-align: center;
              margin-bottom: 10px;
              i {
                display: inline-block;
                vertical-align: middle;
                font-size: 34px;
              }
            }
          }
        }
      }
    }
    .detail {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.3);
    }
    .right {
      // display: none;
      // opacity: (0, 1);
      // transition: all 2s linear;
      z-index: 999;
      width: 350px;
      height: 100%;
      background-color: rgba(10, 25, 57, 0.9);
      position: absolute;
      right: 0;
      top: 0;
      text-align: center;
      padding-left: 15px;
      h3 {
        height: 50px;
        line-height: 50px;
      }
      .task_list {
        overflow-y: auto;
        .list_wrap {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          .list_left {
            width: 200px;
            p {
              font-size: 12px;
              color: #23cefd;
              position: absolute;
              top: 20px;
              left: 30px;
            }
          }
          .list_right {
            width: 130px;
            margin-left: 10px;
            /deep/.el-select {
              line-height: 35px;
              .el-input {
                width: 80%;
                .el-input__inner {
                  height: 25px;
                }
              }
            }
          }
        }
      }
    }
  }
}

/deep/.el-input {
  width: 218px;
  margin-left: 10px;
  .el-input__inner {
    height: 28px;
  }
}
/deep/.el-tree {
  color: #23cefd;
  background-color: transparent;
  .el-tree-node {
    .el-tree-node__content {
      height: 35px;
      line-height: 35px;
      border: 1px solid transparent;
    }
    .el-tree-node__content:hover,
    .el-tree-node:focus > .el-tree-node__content {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .el-tree-node:focus > .el-tree-node__content {
      border: 1px solid #23cefd;
    }
    .el-tree-node__expand-icon {
      color: #23cefd;
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
}
</style>
