<template>
  <!-- container容器 -->
  <div class="container" :style="'height:' + workHeight + 'px;'">
    <!-- 头部返回 -->
    <div class="header">
      <div class="back">
        <button type="button" class="backStyle" @click.stop="backToPlan">
          <img :src="backImg" alt="" />
          指挥决策
        </button>
      </div>
    </div>
    <!-- 底图 -->
    <div class="content">
      <img :src="buildImgUrl" alt="" />
    </div>
    <!-- 左边模型列表 -->
    <div class="left">
      <div
        class="model_edit"
        :style="'height:' + (this.workHeight - 250) + 'px;'"
      >
        <div class="edit_menu">
          <el-tooltip
            v-for="(item, index) in curIcons"
            :key="index"
            popper-class="gTooltip plotTooltip"
            :content="item.title"
            placement="top"
            :open-delay="500"
          >
            <span v-if="index == 0" @click.stop="entryTabShow"
              ><img :src="item.img" alt="" />{{ item.title }}</span
            >
            <span v-else-if="index == 2" @click.stop="saveData"
              ><img :src="item.img" alt="" />{{ item.title }}</span
            >
            <span v-else><img :src="item.img" alt="" />{{ item.title }}</span>
          </el-tooltip>
        </div>
        <el-select
          style="margin: 5px 0 0 0"
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
          :style="'height:' + (this.workHeight - 250 - 170) + 'px;'"
        >
          <ul class="fl">
            <el-tooltip
              v-for="(item, index) in curModels"
              :key="index"
              popper-class="gTooltip plotTooltip"
              :content="item.name"
              placement="top"
              :open-delay="500"
            >
              <li
                id="list"
                :class="{ active: curModelIndex === index }"
                draggable="true"
                @click.stop="listSelected(index)"
                @dragstart="drag(item)"
              >
                <img :src="item.image" alt="模型加载失败" />
              </li>
            </el-tooltip>
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
    <!-- 底图选择入口 -->
    <EntryTab ref="entryTab" :info="deployInfos"></EntryTab>
  </div>
</template>

<script>
import drawNode from './components/drawNode'
import EntryTab from './components/entryTab'
import { jsPlumb } from 'jsplumb'
import { EventBus } from '@/utils/eventBus.js'
import axios from 'axios'
import { api } from '@/api/2d.js'
import globalApi from '@/utils/globalApi'
const serverUrl = globalApi.headImg + '/cloud-video/prePlanFor3D/gltf'

export default {
  name: 'fightDeploy',

  components: {
    drawNode,
    EntryTab
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
      // 底图(缩略图)
      buildImgUrl: '',
      // 二维预案查询id
      enterpriseId: '',
      // 二维预案保存返回路径
      loadJsonPath: '',
      backImg: require('../../assets/images/2d/back.png'),
      // 模型列表标题选项
      curIcons: [
        {
          title: '背景',
          img: require('../../assets/images/2d/background.png')
        },
        { title: '删除', img: require('../../assets/images/2d/delete.png') },
        { title: '保存', img: require('../../assets/images/2d/save.png') },
        { title: '分享', img: require('../../assets/images/2d/share.png') },
        { title: '打印', img: require('../../assets/images/2d/print.png') }
      ],
      deployInfos: [
        {
          title: '地图',
          children: []
        },
        {
          title: '建筑平面图',
          children: []
        },
        {
          title: '实时二维',
          children: []
        }
      ],

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

  mounted () {
    // 初始化操作区域高度
    this.setWorkAreaHeight()
    window.onresize = () => {
      this.setWorkAreaHeight()
    }
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
      this.workHeight = this.fullHeight - 126 + 65
      // console.log(this.workHeight);
    },

    // 返回Plan页
    backToPlan () {
      this.$router.push({ path: '/decisionSystem' })
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
        left: event.offsetX - 130 / 2 + 'px',
        top: event.offsetY - 64 / 2 + 'px',
        id: index + '-node',
        width: 130,
        height: 64,
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
      const node = this.data.nodeList.find((n) => n.id === index)
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
      // alert(JSON.stringify(this.data.nodeList))
      if (!this.data.nodeList || this.data.nodeList.length === 0) {
        this.$notify.warning({
          title: '提示',
          message: '请先创建数据!',
          duration: 5 * 1000
        })
      } else {
        const blob1 = new Blob([JSON.stringify(this.data.nodeList)], {
          type: 'application/json'
        })
        const blob2 = new Blob([JSON.stringify(this.buildImgUrl)], {
          type: 'application/json'
        })
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const formData = new FormData()
        formData.append('enterpriseId', this.enterpriseId)
        formData.append('configFile', blob1, '2dConfigData.json')
        formData.append('picThumbFile', blob2, 'thumbPicUrl')
        this.$axios
          .post(api.upload2dRecord, formData, config)
          .then((res) => {
            console.log('保存/更新接口返回: ', res)
            if (res.data.code === 0) {
              this.configPath = globalApi.headImg + res.data.data.configPath
              this.$notify.success({
                title: '提示',
                message: '保存成功',
                duration: 5 * 1000
              })
            } else {
              this.$notify.error({
                title: '提示',
                message: '保存失败',
                duration: 5 * 1000
              })
            }
          })
          .catch((err) => {
            console.log('接口错误: ' + err)
          })
      }
    },

    // 加载json数据
    getSavedData () {
      if (this.loadJsonPath || this.loadJsonPath !== '') {
        axios
          .get(globalApi.headImg + this.loadJsonPath)
          .then((res) => {
            // console.log('解析后json: ', res)
            const nodeData = res.data
            if (nodeData || nodeData.length !== 0) {
              nodeData.forEach((item) => {
                this.addNode(item)
              })
            }
          })
          .catch((err) => {
            console.log('加载json数据失败: ' + err)
          })
      } else {
        this.$notify.warning({
          title: '提示',
          message: '当前未保存任何数据!',
          duration: 5 * 1000
        })
      }
    },

    // 获取模型列表
    getModelData () {
      this.options = []
      axios
        .get('config/plotlist.json')
        .then((res) => {
          // console.log('模型列表:', res)
          const data = res.data
          let i = 0
          for (var p in data) {
            const array = data[p]
            array.forEach((a) => {
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
        .catch((err) => {
          console.log('获取模型列表失败: ' + err)
        })
    },

    // 获取底图
    getBaseImg () {
      const routerId = this.$route.query.enterpriseId
      const routerParams = this.$route.query.selectBuildImg
      const routerPath = this.$route.query.configPath
      const routerInfo = this.$route.query.buildingInfo

      if (routerParams || routerParams !== undefined) {
        this.enterpriseId = routerId
        this.buildImgUrl = routerParams.image || routerParams
        this.loadJsonPath = routerPath
        this.deployInfos[1].children = routerInfo
      }
    },

    // 点击背景按钮
    entryTabShow () {
      this.$refs.entryTab.show(
        this.deployInfos,
        this.enterpriseId,
        this.loadJsonPath
      )
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  .header {
    width: 98%;
    height: 50px;
    line-height: 50px;
    position: absolute;
    top: 20px;
    z-index: 999;
    .back {
      margin-left: 30px;
      .backStyle {
        width: 134px;
        height: 40px;
        border: none;
        font-size: 18px;
        color: #fff;
        outline: none;
        display: block;
        cursor: pointer;
        background: url("../../assets/images/plan/plan-back-background.png")
          no-repeat;
        background-size: 100% 100%;
        img {
          width: 20px;
          height: 16px;
        }
      }
    }
  }
  .content {
    height: 100%;
  }
  .left {
    z-index: 999;
    height: 100%;
    position: absolute;
    left: 30px;
    top: 90px;
    .model_edit {
      width: 328px;
      background: url("../../assets/images/2d/model_wrap.png") no-repeat;
      background-size: 100% 100%;
      padding: 10px 20px;
      .edit_menu {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        text-align: center;
        padding: 8px 0;
        span {
          display: block;
          outline: none;
          color: #fff;
          margin: 8px;
          cursor: pointer;
          img {
            width: 46px;
            height: 46px;
            margin-bottom: 3px;
          }
        }
      }
      /deep/.el-input {
        width: 308px;
      }
      /deep/.el-input__inner {
        height: 38px;
        line-height: 38px;
        background: transparent;
        border: 1px solid #35b3ed;
        color: #fff;
      }
      .edit_list {
        overflow-y: auto;
        margin-top: 20px;
        ul {
          margin-left: 13px;
          li {
            float: left;
            width: 130px;
            height: 64px;
            line-height: 64px;
            border: 2px solid transparent;
            outline: none;
            font-size: 14px;
            text-align: center;
            margin: 0 36px 13px 0;
            cursor: pointer;
          }
          .active {
            border: 2px solid rgba(255, 244, 100, 1);
            background: none;
          }
          li:nth-child(2n) {
            margin: 0 0 13px 0;
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

/deep/.el-input {
  width: 218px;
  margin-left: 10px;
  .el-input__inner {
    height: 28px;
  }
}
</style>
