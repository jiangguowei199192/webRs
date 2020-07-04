<template>
  <div class="tree">
    <el-tree
      :data="treeData"
      highlight-current
      node-key="id"
      default-expand-all
      ref="tree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node,data }">
        <span >
          <!-- 控制一级菜单的图标 -->
          <span :class="data.class" v-if="data.class"></span>
          <i :id="'liveVideo'+data.id">{{ node.label }}</i>
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
    },
    isLive: {
      type: Boolean,
      default: true
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
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击树节点
    handleNodeClick (data, $event) {
      if (!data.children) {
        const curSpan = document.getElementById('liveVideo' + data.id).parentElement
        if (!curSpan.getAttribute('class')) {
          curSpan.setAttribute('class', 'liveIcon')
          curSpan.parentElement.parentElement.parentElement.classList.add(
            'is-current'
          )
          this.$emit('videoChange', 1, data)
        } else {
          curSpan.setAttribute('class', '')
          curSpan.parentElement.parentElement.parentElement.classList.remove(
            'is-current'
          )
          this.$emit('videoChange', 2, data)
        }
      }
    },
    // 获得选中的节点的key
    checkedKeys: function (data) {
      alert(JSON.stringify(this.$refs.tree.getCheckedKeys()))
    },
    // 点击子节点播放或关闭视频
    showLiveVideo (data, $event) {
      if (!data.children) {
        if (this.isLive) {
          // 若没有，则添加class，并传递当前数据
          if (!$event.currentTarget.getAttribute('class')) {
            $event.currentTarget.setAttribute('class', 'liveIcon')
            $event.currentTarget.parentElement.parentElement.parentElement.classList.add(
              'is-current'
            )

            this.$emit('videoChange', 1, data)
          } else {
            $event.currentTarget.setAttribute('class', '')
            $event.currentTarget.parentElement.parentElement.parentElement.classList.remove(
              'is-current'
            )

            this.$emit('videoChange', 2, data)
          }
        }
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
      i {
        font-style: normal;
      }
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
    span.liveIcon {
      padding-right: 25px;
      background: url(../../../assets/images/onlive.png) no-repeat right center;
    }
  }
  /deep/.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #096090 !important;
  }
  /deep/.el-tree-node__content {
    // cursor: text;
    // .custom-tree-node {
    //   cursor: pointer;
    // }
  }
  /deep/.el-tree-node__content:hover {
    background-color: #096090 !important;
  }
  /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
}
</style>
