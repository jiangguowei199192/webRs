<template>
  <div class="tree">
    <el-tree
      :data="treeData"
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
          <img src="../../../assets/images/onlive.png" v-if="data.isShow" />
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 点击树节点
    handleNodeClick (data) {
      if (!data.children) {
        data.isShow = true
        this.$emit('dataUpdate', this.treeData)
      }
    }
  }
}
</script>
<style lang="less" scoped>
// 修改树形控件样式
.tree {
  font-size: 18px;

  font-family: Source Han Sans CN;
  font-weight: bold;
  margin-top: 24px;
  /deep/.el-tree {
    color: #23cefd;
    background-color: transparent;
    .el-tree-node {
      .el-tree-node__content {
        line-height: 28px;
      }
      .el-tree-node__expand-icon {
        color: #23cefd;
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
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
        background: url(../../../assets/images/noman.png) no-repeat center
          center;
      }
      span.highdevice {
        background: url(../../../assets/images/high.png) no-repeat center center;
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
</style>
