<template>
  <div
    id="node-item"
    class="node-item"
    ref="node"
    :style="drawNodeContainer"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
    @click.stop="editNode"
  >
    <span id="node-span">{{ node.label }}</span>
    <div class="node-del" v-show="mouseEnter" @click.stop="deleteNode">
      <i class="el-icon-circle-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object
  },

  data () {
    return {
      editType: 0,
      mouseEnter: false
    }
  },

  computed: {
    // 节点容器样式
    drawNodeContainer: {
      get () {
        return {
          position: 'absolute',
          minWidth: '105px',
          top: this.node.top,
          left: this.node.left,
          boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 10px 0px' : ''
        }
      }
    }
  },

  methods: {
    // 删除节点
    deleteNode () {
      this.$emit('delete-node', this.node.id)
    },

    // 单击节点
    editNode () {
      this.$emit('edit-node', [this.node.id, this.$refs.node])
      // this.editType = 'node'
      // this.edit = true
      // console.log('编辑节点', this.edit)

      // console.log(
      //   this.$refs.dragDiv.$el.style.display,
      //   this.$refs.nodeDiv.style.display
      // );
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

<style lang="less" scope>
.node-item {
  width: 105px;
  height: 105px;
  // width: 100%;
  // height: 100%;
  background: rgb(30, 66, 68);
  border: 1px solid rgb(145, 145, 145);
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: move;
}

.node-del {
  position: absolute;
  color: red;
  font-size: 16px;
  cursor: pointer;
  top: 0;
  right: 0;
}
</style>
