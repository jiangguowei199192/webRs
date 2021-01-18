<template>
  <vdr
    :active="controlled.isActive"
    :w="controlled.width"
    :h="controlled.height"
    :x="controlled.left"
    :y="controlled.top"
    :r="controlled.rotate"
    :widthRange="controlled.minW"
    :heightRange="controlled.minH"
    :draggable="true"
    @activated="activated"
    @dragging="onDragging"
    @resizing="onResizing"
    @rotating="onRotating"
    @dragStop="dragStop"
    @resizeStop="resizeStop"
    @rotateStop="rotateStop"
  >
    <div
      class="node-item"
      ref="node"
      :style="'background:' + node.background"
      @mouseenter="showDelete"
      @mouseleave="hideDelete"
      @mouseup="changeNodeSite"
    >
      <div class="model-list">
        <img
          v-if="modelType == 0"
          class="model-list_0"
          :src="node.icon"
          alt=""
        />
        <img
          v-else
          :style="
            'width:' +
              posData.width +
              'px;' +
              'height:' +
              posData.height +
              'px;'
          "
          :src="node.icon"
          alt=""
        />
        <span v-if="modelType == 0">{{ node.value }}</span>
      </div>
      <div class="node-del" v-show="mouseEnter" @click.stop="deleteNode">
        <i class="el-icon-circle-close"></i>
      </div>
      <div v-show="sizeShow">
        <div class="node-width">w: {{ posData.width }}</div>
        <div class="node-height">h: {{ posData.height }}</div>
        <div class="node-rotate">r:{{ posData.rotate }}°</div>
      </div>
    </div>
  </vdr>
</template>

<script>
import { EventBus } from '@/utils/eventBus.js'

export default {
  props: {
    node: Object
  },

  data () {
    return {
      // 操作类型
      editType: 0,
      mouseEnter: false,
      // 节点状态
      controlled: {
        width: this.node.width,
        height: this.node.height,
        left: parseInt(this.node.left.replace('px', '')),
        top: parseInt(this.node.top.replace('px', '')),
        rotate: this.node.rotate,
        minW: [10, 1000],
        minH: [10, 1000],
        lock: false,
        isActive: false
      },
      // 节点类型
      modelType: 0,
      // 节点位置信息
      posData: {},
      // 实时尺寸显隐
      sizeShow: false
    }
  },

  computed: {
    // 编辑前节点容器样式
    drawNodeContainer_one: {
      get () {
        return {
          position: 'absolute',
          top: this.node.top,
          left: this.node.left,
          boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 10px 0px' : ''
        }
      }
    },
    // 编辑中节点容器样式
    drawNodeContainer_two: {
      get () {
        return {
          position: 'absolute',
          boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 10px 0px' : ''
        }
      }
    }
  },

  watch: {
    // modelType: 'getModelType'
  },

  created () {
    // 节点位置信息初始化
    const { width, height, left, top, rotate } = this.controlled
    this.posData.width = width
    this.posData.height = height
    this.posData.left = left
    this.posData.top = top
    this.posData.rotate = rotate

    // 节点激活状态
    const _this = this
    EventBus.$on('type', data => {
      // console.log(data)
      _this.controlled.isActive = data
    })
  },

  mounted () {
    this.modelType = this.node.type
  },

  methods: {
    // 所选模型类型
    getModelType () {
      const _this = this
      EventBus.$on('optionId', data => {
        // console.log(data)
        _this.modelType = data
      })
    },

    // 点击选中元素
    activated (pos) {
      this.controlled.isActive = true
      // console.log('当前元素' + this.node.id, pos)
    },
    // 拖拽中
    onDragging (pos) {
      this.posData = pos
    },
    // 缩放中
    onResizing (pos) {
      this.posData = pos
      this.sizeShow = true
    },
    // 旋转中
    onRotating (pos) {
      this.posData = pos
      this.sizeShow = true
    },
    // 拖拽停止
    dragStop (pos) {
      this.$emit('drag-stop', this.node.id, pos)
    },
    // 缩放停止
    resizeStop (pos) {
      this.sizeShow = false
      this.$emit('resize-stop', this.node.id, pos)
    },
    // 旋转停止
    rotateStop (pos) {
      this.sizeShow = false
      this.$emit('rotate-stop', this.node.id, pos)
    },

    // 单击节点
    editNode () {
      this.editType = 1
      this.$emit('edit-node', this.node.id, this.$refs.node)
    },

    // 双击节点
    addWrap () {
      console.log('双击节点', this.$refs.node)
    },

    // 删除节点
    deleteNode () {
      this.$emit('delete-node', this.node.id)
    },

    // 鼠标进入
    showDelete () {
      this.mouseEnter = true
    },

    // 鼠标离开
    hideDelete () {
      this.mouseEnter = false
    },

    // 鼠标移动后抬起
    changeNodeSite () {
      this.$emit('change-node-site', {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      })
    }
  }
}
</script>

<style lang="scss" scope>
.node-item {
  width: 100%;
  height: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  .model-list {
    display: flex;
    justify-content: center;
    align-items: center;
    .model-list_0 {
      img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 22px;
      }
    }
  }
}
.node-del {
  position: absolute;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  top: 0;
  right: 0;
}
.node-width,
.node-height,
.node-rotate {
  width: 40px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  position: absolute;
  font-size: 10px;
  background: rgb(243, 109, 20);
  color: #fff;
  cursor: pointer;
}
.node-width {
  top: 0;
  left: 46%;
}
.node-height {
  top: 47%;
  left: 0;
}
.node-rotate {
  top: 0;
  left: 0;
}
</style>
