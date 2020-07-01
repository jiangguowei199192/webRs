<template>
  <div class="tree">
    <el-tree
      :data="treeData"
      highlight-current
      node-key="id"
      default-expand-all
      ref="tree"
      :props="defaultProps"
    >
      <span class="custom-tree-node" slot-scope="{ node,data }">
        <span @click="showLiveVideo(data,$event)">
          <!-- 控制一级菜单的图标 -->
          <span :class="data.class" v-if="data.class"></span>
          <!-- <img src="../../../assets/images/onlive.png" v-if="data.isShow" /> -->
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
      console.log(data.id)
      if (!data.children) {
        // data.isShow = true
        // this.$emit('selectedChange', this.treeData)
      }
    },
    // 获得选中的节点的key
    checkedKeys: function (data) {
      alert(JSON.stringify(this.$refs.tree.getCheckedKeys()))
    },
    // 点击子节点播放或关闭视频
    showLiveVideo (data, $event) {
      if (!data.children) {
        // 若没有，则添加class，并传递当前数据
        if (!$event.currentTarget.getAttribute('class')) {
          $event.currentTarget.setAttribute('class', 'liveIcon')
          this.$emit('videoChange', 1, data)
        } else {
          $event.currentTarget.setAttribute('class', '')
          this.$emit('videoChange', 2, data)
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
    // .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    //    background: #096090 !important;
    // }
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
    cursor: text;
    .custom-tree-node {
      cursor: pointer;
    }
  }
  /deep/.el-tree-node__content:hover {
    background-color: #096090;
  }
}
</style>
