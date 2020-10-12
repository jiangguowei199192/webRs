<template>
  <div class="container">
    <!-- 头部返回 -->
    <div class="header">
      <div class="back">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-arrow-left"
          @click="backToPlan"
          >指挥决策</el-button
        >
      </div>
    </div>
    <!-- main容器 -->
    <div class="main" :style="'height:' + workHeight + 'px;'">
      <!-- 底图 -->
      <div class="content">
        <img
          src="http://img.zcool.cn/community/0146735edf53c8a801215aa09f6def.png@2o.png"
          alt
        />
      </div>
      <!-- 左边模型列表 -->
      <div class="left">
        <div
          class="model_edit"
          :style="'height:' + (this.workHeight - 60) + 'px;'"
        >
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
            class="edit_list webFsScroll"
            :style="'height:' + (this.workHeight - 60 - 110) + 'px;'"
          >
            <ul class="fl">
              <li
                id="list"
                :style="{ backgroundColor: item.bgColor }"
                v-for="item in areaList"
                :key="item.index"
                draggable="true"
                @dragstart="drag(item)"
              >
                <span>{{ item.area }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 画布编辑区 -->
      <div class="detail">
        <div
          id="drawContent"
          ref="drawContent"
          @drop="drop($event)"
          @dragover.prevent
        >
          <drawNode
            class="drawNode"
            ref="drawNode"
            v-for="node in data.nodeList"
            :key="node.id"
            :node="node"
            :id="node.id"
            @change-node-site="changeNodeSite"
            @delete-node="deleteNode"
            @edit-node="editNode"
          ></drawNode>
        </div>
      </div>
      <!-- 右边区域/任务列表 -->
      <div class="right">
        <h3>停靠设置/任务分配</h3>
        <div
          class="task_list webFsScroll"
          :style="'height:' + (this.workHeight - 60) + 'px;'"
        >
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
import { jsPlumb } from 'jsplumb'
import drawNode from './components/drawNode'
import { EventBus } from '@/utils/eventBus.js'

export default {
  name: 'fightDeploy',

  components: {
    drawNode
  },

  data () {
    return {
      minHeight: 750,
      fullHeight: 0,
      workHeight: 0,
      jsPlumb: null,
      // 节点激活状态
      activeType: true,
      // 节点id
      index: 1,
      // 节点info
      data: {
        nodeList: [],
        newTemplate: '1'
      },
      areaList: [],
      currentItem: '',
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
            }
          ]
        }
      ],
      arrList: [1, 1, 1, 1, 1],
      filterText: '',
      options: [
        {
          value: '1',
          label: '广州'
        },
        {
          value: '2',
          label: '武汉'
        },
        {
          value: '3',
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

    const items = [
      '指挥区',
      '作业区',
      '集结区',
      '休整区',
      '入口',
      '疏散区',
      '1号停车区',
      '2号停车区'
    ]
    for (let i = 0; i < 20; i++) {
      this.areaList.push({
        area: items[Math.floor(Math.random() * items.length)],
        bgColor: '#' + Math.random().toString(16).substr(2, 6).toUpperCase()
      })
    }
  },

  mounted () {
    // 节点初始化
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      this.init()
    })

    // 点击节点以外区域
    document.onclick = function (event) {
      var e = event || window.event
      var ele = e.srcElement || e.target
      while (ele) {
        if (ele.class === 'drawNode') {
          return
        }
        ele = ele.parentNode
      }
      this.activeType = false
      EventBus.$emit('type', this.activeType)
      // console.log("点击区域以外: " + this.activeType);
    }
  },

  beforeDestroy () {
    window.onresize = null
  },

  methods: {
    init () {
      const _this = this
      this.jsPlumb.ready(() => {
        // 加载立即重绘jsPlumb
        _this.jsPlumb.setSuspendDrawing(false, true)
        _this.loadDraw()
      })
    },

    // 初始化节点
    loadDraw () {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })
      }
    },

    // 拖拽
    drag (item) {
      this.currentItem = item
      // console.log(this.currentItem)
    },

    // 拖放
    drop (event) {
      // console.log(event);
      const index = this.index++
      const temp = {
        label: this.currentItem.area,
        left: event.offsetX - 105 / 2 + 'px',
        top: event.offsetY - 105 / 2 + 'px',
        id: 'node' + index
      }

      this.addNode(temp)
      // this.editNode(temp.id)
    },

    // 添加节点
    addNode (temp) {
      // console.log('添加节点', temp)
      this.data.nodeList.push(temp)
      // this.$nextTick(() => {
      //   this.jsPlumb.draggable(temp.id, {
      //     containment: 'parent'
      //   })
      // })
    },

    // 单击节点
    editNode (tag) {
      // console.log(this.$refs.drawNode[0].$el)
      console.log('编辑节点', tag)
    },

    // 删除节点
    deleteNode (nodeId) {
      this.$confirm('确定要删除节点' + nodeId + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          this.data.nodeList = this.data.nodeList.filter((item) => {
            return item.id !== nodeId
          })
        })
        .catch(() => {})
      return true
    },

    // 改变节点位置
    changeNodeSite (data) {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        // console.log(node);
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },

    // 动态设置有效操作区高度
    setWorkAreaHeight () {
      const h = document.documentElement.clientHeight
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
      this.workHeight = this.fullHeight - 126
      // console.log(this.workHeight);
    },

    // select选择框动态设置title
    visibleChange (value) {
      setTimeout(() => {
        const tagTextList = document
          .querySelector('#app')
          .querySelectorAll('.el-input__inner')
        // console.log(tagTextList)
        tagTextList.forEach((item) => {
          item.setAttribute('title', item.value)
        })
      }, 100)
    },

    // 返回Plan页
    backToPlan () {
      this.$router.back(-1)
    },

    handleNodeClick () {
      // console.log('出来混迟早是要还的')
    }
  }
}
</script>

<style lang="less" scoped>
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
        width: 260px;
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
            margin-left: 13px;
            li {
              float: left;
              width: 105px;
              height: 105px;
              border: 1px solid rgb(145, 145, 145);
              font-size: 14px;
              line-height: 100px;
              text-align: center;
              // margin-bottom: 10px;
              margin: 0 10px 12px 0;
              cursor: pointer;
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
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.3);
      #drawContent {
        width: 100%;
        height: 100%;
        // position: relative;
      }
    }
    .right {
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
