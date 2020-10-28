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
        <img :src="buildImgUrl" alt="" />
      </div>
      <!-- 左边模型列表 -->
      <div class="left">
        <div
          class="model_edit"
          :style="'height:' + (this.workHeight - 60) + 'px;'"
        >
          <div class="edit_menu">
            <p><i class="el-icon-delete" title="删除"></i>删除</p>
            <p><i class="el-icon-printer" title="打印"></i>打印</p>
            <p><i class="el-icon-share" title="分享"></i>分享</p>
            <p>
              <i
                class="el-icon-folder-opened"
                title="保存"
                @click.stop="saveData"
              ></i
              >保存
            </p>
          </div>
          <el-select
            style="margin: 8px 0 0 4px"
            size="mini"
            placeholder="请选择"
            v-model="modelType"
            :popper-append-to-body="false"
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
                v-for="(item, index) in curModels"
                :key="index"
                :class="{ active: curModelIndex === index }"
                :title="item.name"
                draggable="true"
                @click.stop="listSelected(index)"
                @dragstart="drag(item)"
              >
                <img :src="item.image" alt="模型加载失败" />
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
            @drag-stop="dragStop"
            @resize-stop="resizeStop"
            @rotate-stop="rotateStop"
          ></drawNode>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawNode from './components/drawNode'
import { jsPlumb } from 'jsplumb'
import { EventBus } from '@/utils/eventBus.js'
import { Notification } from 'element-ui'
import axios from 'axios'
import { api } from '@/api/2d.js'
import globalApi from '@/utils/globalApi'
const serverUrl = globalApi.headImg + '/cloud-video/prePlanFor3D/gltf'

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
      // 当前选择节点
      currentItem: '',
      // 节点激活状态
      activeType: true,
      // 节点id
      index: 1,
      // 节点info
      data: {
        nodeList: [],
        newTemplate: '1'
      },
      // 模型索引
      modelType: '',
      // 模型列表选项
      options: [],
      // 模型列表
      curModels: [],
      // 选中模型索引
      curModelIndex: 0,
      // 建筑平面图底图
      buildImgUrl: '',
      enterpriseId: '',
      loadJsonPath: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  watch: {
    $route: 'getBaseImg',

    modelType (val) {
      if (this.options.length > 0 && val >= 0 && val < this.options.length) {
        this.curModels = this.options[val].list
      }
    }
  },

  created () {
    this.setWorkAreaHeight()
    window.onresize = () => {
      this.setWorkAreaHeight()
    }
  },

  mounted () {
    // 获取模型列表
    this.getModelData()
    // 获取底图
    this.getBaseImg()
    // 获取保存的数据
    this.getSavedData()

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
    // 动态设置有效操作区高度
    setWorkAreaHeight () {
      const h = document.documentElement.clientHeight
      if (h < this.minHeight) this.fullHeight = this.minHeight
      else this.fullHeight = h
      this.workHeight = this.fullHeight - 126
      // console.log(this.workHeight);
    },

    // 返回Plan页
    backToPlan () {
      this.$router.back(-1)
    },

    // 加载立即重绘jsPlumb
    init () {
      const _this = this
      this.jsPlumb.ready(() => {
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

    // 选中当前模型
    listSelected (id) {
      this.curModelIndex = id
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
        label: this.currentItem.image,
        left: event.offsetX - 105 / 2 + 'px',
        top: event.offsetY - 105 / 2 + 'px',
        id: index,
        width: 105,
        height: 105,
        rotate: 0
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
      // console.log("编辑节点", tag);
    },

    // 删除节点
    deleteNode (nodeId) {
      this.$confirm('确定要删除节点node' + nodeId + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          this.data.nodeList = this.data.nodeList.filter(item => {
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

    // 拖拽结束
    dragStop (id, data) {
      this.updateNodeList(id, data)
    },

    // 缩放结束
    resizeStop (id, data) {
      this.updateNodeList(id, data)
    },

    // 旋转结束
    rotateStop (id, data) {
      this.updateNodeList(id, data)
    },

    // 更新nodeList
    updateNodeList (index, info) {
      info.left = info.left + 'px'
      info.top = info.top + 'px'
      const node = this.data.nodeList.find(n => n.id === index)
      if (node !== undefined) {
        for (var b in info) {
          // 拷贝属性
          if (Object.prototype.hasOwnProperty.call(node, b)) {
            node[b] = info[b]
          }
        }
      }
    },

    // 保存json数据
    saveData () {
      alert(JSON.stringify(this.data.nodeList))

      const blob = new Blob([JSON.stringify(this.data.nodeList)], {
        type: 'application/json'
      })
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const formData = new FormData()
      // console.log('enterpriseId:', this.enterpriseId)
      formData.append('enterpriseId', this.enterpriseId)
      formData.append('configFile', blob, '2dConfigData.json')
      this.$axios
        .post(api.upload2dConfig, formData, config)
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.configPath = globalApi.headImg + res.data.data.configPath
          }
          Notification({
            title: '提示',
            message: '保存数据失败',
            type: 'warning',
            duration: 5 * 1000
          })
        })
        .catch(err => {
          console.log('保存接口错误: ' + err)
        })
    },

    // 加载json数据
    getSavedData () {
      if (this.loadJsonPath) {
        axios
          .get(globalApi.headImg + this.loadJsonPath)
          .then(res => {
            const nodeData = res.data
            if (nodeData || nodeData.length !== 0) {
              // console.log(nodeData)
              nodeData.forEach(item => {
                this.addNode(item)
              })
            } else {
              Notification({
                title: '提示',
                message: '当前未保存任何数据!',
                type: 'warning',
                duration: 5 * 1000
              })
            }
          })
          .catch(err => {
            console.log('加载json数据失败: ' + err)
          })
      }
    },

    // 获取模型列表
    getModelData () {
      this.options = []
      axios
        .get('config/plotlist.json')
        .then(res => {
          // console.log('模型列表:', res)
          const data = res.data
          let i = 0
          for (var p in data) {
            const array = data[p]
            array.forEach(a => {
              if (a.image.startsWith('$serverURL_gltf$')) {
                a.image = a.image.replace('$serverURL_gltf$', serverUrl)
              }
              if (a.style.modelUrl.startsWith('$serverURL_gltf$')) {
                a.style.modelUrl = a.style.modelUrl.replace(
                  '$serverURL_gltf$',
                  serverUrl
                )
              }
            })

            const item = { value: i, label: p, list: array }
            this.options.push(item)
            // console.log(this.options)
            if (i === 0) this.modelType = i
            i += 1
          }
        })
        .catch(err => {
          console.log('获取模型列表失败: ' + err)
        })
    },

    // 获取建筑平面图
    getBaseImg () {
      const routerId = this.$route.query.enterpriseId
      const routerParams = this.$route.query.selectBuildImg
      const routerPath = this.$route.query.configPath
      if (routerParams && routerParams !== undefined) {
        this.enterpriseId = routerId
        this.buildImgUrl = routerParams.image
        this.loadJsonPath = routerPath
      }
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
      left: 10px;
      top: 30px;
      .model_edit {
        width: 270px;
        background-color: rgba(0, 0, 0, 0.5);
        .edit_menu {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          text-align: center;
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
              border: 2px solid transparent;
              font-size: 14px;
              line-height: 100px;
              text-align: center;
              // margin-bottom: 10px;
              margin: 0 13px 13px 0;
              cursor: pointer;
            }
            .active {
              border: 2px solid rgba(255, 244, 100, 1);
              background: none;
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
</style>
