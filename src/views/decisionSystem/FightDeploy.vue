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
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594360313848&di=2fe9b1c2486eff6ec18ca8a115b0225e&imgtype=0&src=http%3A%2F%2Ftech.cnr.cn%2Flist%2F201206%2FW020120615244096806710.jpg"
          alt
        />
        <div class="model_edit" :style="'height:' + (this.workHeight - 60) + 'px;'">
          <el-select v-model="value" filterable placeholder="常用" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
          <ul>
            <li class="fl" v-for="item in taskList" :key="item.index">
              <el-tree
                :data="taskList"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                @node-click="handleNodeClick"
              ></el-tree>
              <!-- <p>任务: 人员疏散</p> -->
            </li>
            <li class="fr" v-for="item in areaList" :key="item.index">
              <el-select v-model="value" filterable :placeholder="item.area" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
          </ul>
          <!-- <ul class="fr">
            <li v-for="item in areaList" :key="item.index">
              <el-select v-model="value" filterable :placeholder="item.area" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
          </ul>-->
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
      taskList: [],

      options: [
        {
          value: '选项1',
          label: '北京'
        },
        {
          value: '选项2',
          label: '上海'
        },
        {
          value: '选项3',
          label: '广州'
        },
        {
          value: '选项4',
          label: '武汉'
        },
        {
          value: '选项5',
          label: '杭州'
        }
      ],
      value: '',

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

    var items = ['指挥区', '作业区', '集结区', '休整区', '入口']
    for (var i = 0; i < 10; i++) {
      this.areaList.push({
        area: items[Math.floor(Math.random() * items.length)],
        bgColor:
          '#' +
          Math.random()
            .toString(16)
            .substr(2, 6)
            .toUpperCase()
      })
      this.markList.push({
        imgSrc:
          'https://p0.meituan.net/moviemachine/9312e90f25f5ad40f2ceb4561f6fa08830409.jpg@128w_170h_1e_1c'
      })
    }

    this.taskList.push({
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
    })
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
      console.log(this.workHeight)
    },

    backToPlan () {
      //   console.log(545)
      this.$router.back(-1)
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
      padding: 0 15px;
      h3 {
        height: 50px;
        line-height: 50px;
      }
      .task_list {
        overflow-y: auto;
        ul {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          li:nth-child(1) {
            width: 220px;
            position: relative;
            margin-bottom: 10px;
            p {
              font-size: 12px;
              color: #23cefd;
              position: absolute;
              top: 20px;
              left: 30px;
            }
          }
          li:nth-child(2) {
            width: 110px;
            margin-bottom: 15px;
            /deep/.el-input {
              width: 80%;
            }
          }
        }
      }
    }
  }
}
/deep/.el-input {
  width: 97%;
  margin-left: 16px;
}
/deep/.el-input__inner {
  height: 28px;
}
/deep/.el-tree {
  color: #23cefd;
  background-color: transparent;
  .el-tree-node {
    .el-tree-node__content {
      height: 30px;
      line-height: 30px;
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
