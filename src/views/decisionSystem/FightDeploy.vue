<template>
  <div class="container">
    <div class="header">
      <div class="back fl">
        <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="backToPlan()">作战部署</el-button>
      </div>
      <div class="caozuo fr">
        <i class="el-icon-share"></i>
        <i class="el-icon-printer"></i>
      </div>
    </div>
    <div class="main" :style="'height:' + workHeight + 'px;'">
      <div class="left fl">
        <img src="http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png" alt />
        <div class="model_edit" :style="'height:' + (this.workHeight - 60) + 'px;'">
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
            >
              <el-tooltip
                effect="light"
                :content="item.label"
                placement="bottom-start"
                visibleArrow="true"
              >
                <div class="tooltip_span">{{item.label}}</div>
              </el-tooltip>
            </el-option>
          </el-select>
          <div
            class="edit_list ownScrollStyle"
            :style="'height:' + (this.workHeight - 60 - 45) + 'px;'"
          >
            <ul class="fl">
              <li
                :style="{ backgroundColor:item.bgColor}"
                v-for="item in areaList"
                :key="item.index"
              >{{item.area}}</li>
            </ul>
            <ul class="fr">
              <li v-for="item in markList" :key="item.index">
                <img :src="item.imgSrc" alt />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right fr">
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
export default {
  name: 'FightDeploy',

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
    for (var i = 0; i < 10; i++) {
      this.areaList.push({
        area: items1[Math.floor(Math.random() * items1.length)],
        bgColor:
          '#' +
          Math.random()
            .toString(16)
            .substr(2, 6)
            .toUpperCase()
      })
      this.markList.push({
        imgSrc:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594636274169&di=fd85ea5d51bbe1ef98add42151180b70&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F433%2Fw564h669%2F20181027%2FoWtj-hmxrkzx6079521.jpg'
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
        tagTextList.forEach(item => {
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
    .caozuo {
      margin-right: 20px;
      display: flex;
      justify-content: space-between;
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
  }
  .main {
    display: flex;
    .left {
      flex-grow: 1;
      height: 100%;
      background-color: rgb(197, 238, 184);
      position: relative;
      margin-left: 5px;
      img {
        width: 100%;
        height: 100%;
      }
      .model_edit {
        width: 240px;
        background-color: rgba(255, 255, 255, 0.2);
        position: absolute;
        left: 0;
        top: 30px;
        .edit_list {
          overflow-y: auto;
          position: relative;
          top: 15px;
          ul {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            margin: 0 8px;
            li {
              width: 100px;
              height: 115px;
              font-size: 14px;
              line-height: 115px;
              text-align: center;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
    .right {
      width: 350px;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
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
